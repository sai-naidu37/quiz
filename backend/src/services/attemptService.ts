import mongoose, { Types } from "mongoose";
import { Achievement } from "../models/Achievement";
import { DailyChallengeAttempt } from "../models/DailyChallengeAttempt";
import { Question } from "../models/Question";
import { Quiz } from "../models/Quiz";
import { QuizAttempt } from "../models/QuizAttempt";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export interface SubmittedAnswer {
  questionId: string;
  selectedOption?: number;
}

export class AttemptService {
  async start(userId: string, quizId: string, dailyChallengeId?: string) {
    const quiz = await Quiz.findOne({ _id: quizId, published: true });
    if (!quiz) throw new ApiError(404, "Quiz not found.");
    const attempt = await QuizAttempt.create({ userId, quizId, dailyChallengeId });
    const questions = await Question.find({ quizId }).sort({ order: 1 }).select("questionText options points order").lean();
    return {
      attemptId: attempt.id,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty,
        durationMinutes: quiz.durationMinutes,
      },
      questions: questions.map((question) => ({
        id: question._id.toString(),
        questionText: question.questionText,
        options: question.options,
        order: question.order,
        points: question.points,
      })),
    };
  }

  async submit(userId: string, attemptId: string, submittedAnswers: SubmittedAnswer[], reportedTime: number) {
    if (!Types.ObjectId.isValid(attemptId)) throw new ApiError(400, "Invalid attempt ID.");
    const session = await mongoose.startSession();
    try {
      const result = await session.withTransaction(async () => {
        const attempt = await QuizAttempt.findOne({ _id: attemptId, userId }).session(session);
        if (!attempt) throw new ApiError(404, "Attempt not found.");
        if (attempt.status === "completed") throw new ApiError(409, "This attempt has already been submitted.");
        const quiz = await Quiz.findById(attempt.quizId).session(session);
        const questions = await Question.find({ quizId: attempt.quizId }).sort({ order: 1 }).session(session);
        if (!quiz || questions.length === 0) throw new ApiError(404, "Quiz questions are unavailable.");
        const answerMap = new Map<string, number | undefined>();
        for (const answer of submittedAnswers) {
          if (answerMap.has(answer.questionId)) throw new ApiError(400, "An answer was supplied more than once.");
          answerMap.set(answer.questionId, answer.selectedOption);
        }
        const questionIds = new Set(questions.map((question) => question.id));
        if ([...answerMap.keys()].some((id) => !questionIds.has(id))) throw new ApiError(400, "An answer belongs to a different quiz.");
        let correctAnswers = 0;
        let score = 0;
        const evaluated = questions.map((question) => {
          const selectedOption = answerMap.get(question.id);
          if (selectedOption !== undefined && (!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption >= question.options.length)) {
            throw new ApiError(400, "A selected answer is invalid.");
          }
          const isCorrect = selectedOption === question.correctAnswer;
          if (isCorrect) {
            correctAnswers += 1;
            score += question.points;
          }
          return { questionId: question._id, selectedOption, isCorrect };
        });
        const unansweredQuestions = evaluated.filter((answer) => answer.selectedOption === undefined).length;
        const incorrectAnswers = questions.length - correctAnswers - unansweredQuestions;
        const percentage = Math.round((correctAnswers / questions.length) * 100);
        const elapsed = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000);
        const timeTaken = Math.min(Math.max(0, reportedTime), Math.max(0, elapsed));
        let pointsEarned = score;
        const completedAt = new Date();
        attempt.answers = evaluated;
        attempt.status = "completed";
        attempt.score = score;
        attempt.correctAnswers = correctAnswers;
        attempt.incorrectAnswers = incorrectAnswers;
        attempt.unansweredQuestions = unansweredQuestions;
        attempt.percentage = percentage;
        attempt.timeTaken = timeTaken;
        attempt.completedAt = completedAt;
        await attempt.save({ session });
        await Quiz.updateOne({ _id: quiz._id }, { $inc: { totalAttempts: 1 } }, { session });

        if (attempt.dailyChallengeId) {
          const daily = await DailyChallengeAttempt.findOne({ attemptId: attempt._id, userId }).session(session);
          const challenge = await mongoose.model("DailyChallenge").findById(attempt.dailyChallengeId).session(session);
          const user = await User.findById(userId).session(session);
          if (!daily || daily.completed || !challenge || !user) throw new ApiError(409, "The daily challenge reward has already been claimed.");
          pointsEarned += challenge.pointsReward;
          attempt.pointsEarned = pointsEarned;
          await attempt.save({ session });
          daily.completed = true;
          daily.pointsEarned = challenge.pointsReward;
          daily.completedAt = completedAt;
          await daily.save({ session });
          const previousDate = user.lastChallengeDate;
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          user.currentStreak = previousDate === yesterday ? user.currentStreak + 1 : previousDate === daily.date ? user.currentStreak : 1;
          user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
          user.lastChallengeDate = daily.date;
          user.totalPoints += pointsEarned;
          await user.save({ session });
        } else {
          attempt.pointsEarned = pointsEarned;
          await attempt.save({ session });
          await User.updateOne({ _id: userId }, { $inc: { totalPoints: pointsEarned } }, { session });
        }

        const totalCompleted = await QuizAttempt.countDocuments({ userId, status: "completed" }).session(session);
        const badges = [];
        if (totalCompleted === 1) badges.push({ userId, achievementType: "first-quiz", title: "First steps", description: "Completed your first quiz." });
        if (percentage === 100) badges.push({ userId, achievementType: "perfect-score", title: "Perfect score", description: "Earned 100% on a quiz." });
        if (badges.length) await Achievement.insertMany(badges, { session, ordered: false }).catch(() => undefined);

        return {
          id: attempt.id,
          quiz: { id: quiz.id, title: quiz.title, category: quiz.category },
          score,
          correctAnswers,
          incorrectAnswers,
          unansweredQuestions,
          totalQuestions: questions.length,
          percentage,
          passed: percentage >= 60,
          timeTaken,
          pointsEarned,
          completedAt,
          review: questions.map((question) => {
            const answer = evaluated.find((item) => item.questionId.toString() === question.id);
            return {
              questionId: question.id,
              questionText: question.questionText,
              options: question.options,
              correctAnswer: question.correctAnswer,
              selectedOption: answer?.selectedOption ?? null,
              isCorrect: answer?.isCorrect ?? false,
              explanation: question.explanation,
            };
          }),
        };
      });
      if (!result) throw new ApiError(500, "Unable to save quiz results.");
      return result;
    } finally {
      await session.endSession();
    }
  }

  async history(userId: string, completedOnly: boolean, page = 1, limit = 20) {
    const filter = { userId, ...(completedOnly ? { status: "completed" } : {}) };
    const [attempts, total] = await Promise.all([
      QuizAttempt.find(filter).populate("quizId", "title category difficulty").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      QuizAttempt.countDocuments(filter),
    ]);
    return {
      items: attempts.map((attempt) => ({
        id: attempt._id.toString(),
        quiz: attempt.quizId,
        score: attempt.score,
        percentage: attempt.percentage,
        correctAnswers: attempt.correctAnswers,
        totalQuestions: attempt.answers.length || (attempt.quizId as unknown as { questionCount?: number }).questionCount || 0,
        timeTaken: attempt.timeTaken,
        pointsEarned: attempt.pointsEarned,
        status: attempt.status,
        completedAt: attempt.completedAt,
        createdAt: attempt.createdAt,
      })),
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getById(userId: string, attemptId: string) {
    const attempt = await QuizAttempt.findOne({ _id: attemptId, userId }).populate("quizId", "title category difficulty").lean();
    if (!attempt) throw new ApiError(404, "Attempt not found.");
    const questionIds = attempt.answers.map((answer) => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } }).lean();
    const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));
    return {
      id: attempt._id.toString(),
      quiz: attempt.quizId,
      status: attempt.status,
      score: attempt.score,
      percentage: attempt.percentage,
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.incorrectAnswers,
      unansweredQuestions: attempt.unansweredQuestions,
      timeTaken: attempt.timeTaken,
      pointsEarned: attempt.pointsEarned,
      completedAt: attempt.completedAt,
      review: attempt.answers.map((answer) => {
        const question = questionMap.get(answer.questionId.toString());
        return question ? {
          questionId: question.id,
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          selectedOption: answer.selectedOption ?? null,
          isCorrect: answer.isCorrect,
          explanation: question.explanation,
        } : null;
      }).filter(Boolean),
    };
  }
}