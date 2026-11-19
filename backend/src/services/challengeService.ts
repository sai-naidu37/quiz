import mongoose from "mongoose";
import { DailyChallenge } from "../models/DailyChallenge";
import { DailyChallengeAttempt } from "../models/DailyChallengeAttempt";
import { Question } from "../models/Question";
import { Quiz } from "../models/Quiz";
import { QuizAttempt } from "../models/QuizAttempt";
import { User } from "../models/User";
import { AttemptService } from "./attemptService";
import { QuizService } from "./quizService";
import { ApiError } from "../utils/ApiError";

const attemptService = new AttemptService();
const quizService = new QuizService();
const todayUtc = () => new Date().toISOString().slice(0, 10);

export class ChallengeService {
  async today(userId: string) {
    const date = todayUtc();
    let challenge = await DailyChallenge.findOne({ date });
    if (!challenge) {
      const quizzes = await Quiz.find({ published: true }).sort({ _id: 1 }).select("_id").lean();
      if (!quizzes.length) throw new ApiError(503, "Daily challenges are not available yet.");
      const dayNumber = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
      challenge = await DailyChallenge.findOneAndUpdate(
        { date },
        { $setOnInsert: { quizId: quizzes[dayNumber % quizzes.length]._id, pointsReward: 50 } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    if (!challenge) throw new ApiError(503, "Daily challenge could not be assigned.");
    const [quiz, userAttempt] = await Promise.all([
      Quiz.findById(challenge.quizId).select("title description category difficulty durationMinutes questionCount totalAttempts"),
      DailyChallengeAttempt.findOne({ userId, date }),
    ]);
    if (!quiz) throw new ApiError(404, "The daily challenge quiz is unavailable.");
    return {
      id: challenge.id,
      date,
      pointsReward: challenge.pointsReward,
      status: userAttempt?.completed ? "completed" : userAttempt ? "in-progress" : "pending",
      attemptId: userAttempt?.attemptId.toString(),
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        durationMinutes: quiz.durationMinutes,
        questionCount: quiz.questionCount,
        totalAttempts: quiz.totalAttempts,
      },
    };
  }

  async start(userId: string, challengeId: string) {
    const today = await this.today(userId);
    if (challengeId !== today.id) throw new ApiError(400, "Only today's challenge can be started.");
    const session = await mongoose.startSession();
    let attemptId = "";
    try {
      await session.withTransaction(async () => {
        const existing = await DailyChallengeAttempt.findOne({ userId, date: today.date }).session(session);
        if (existing) {
          if (existing.completed) throw new ApiError(409, "Today's challenge is already complete.");
          attemptId = existing.attemptId.toString();
          return;
        }
        const [attempt] = await QuizAttempt.create([{
          userId,
          quizId: today.quiz.id,
          dailyChallengeId: challengeId,
        }], { session });
        await DailyChallengeAttempt.create([{
          userId,
          challengeId,
          attemptId: attempt._id,
          date: today.date,
          completed: false,
        }], { session });
        attemptId = attempt.id;
      });
    } catch (error) {
      if ((error as { code?: number }).code !== 11000) throw error;
      const existing = await DailyChallengeAttempt.findOne({ userId, date: today.date });
      if (!existing || existing.completed) throw new ApiError(409, "Today's challenge is already complete.");
      attemptId = existing.attemptId.toString();
    } finally {
      await session.endSession();
    }
    const detail = await quizService.getById(today.quiz.id);
    return {
      attemptId,
      quiz: { id: detail.id, title: detail.title, category: detail.category, difficulty: detail.difficulty, durationMinutes: detail.durationMinutes },
      questions: detail.questions,
    };
  }

  async submit(userId: string, attemptId: string, answers: { questionId: string; selectedOption?: number }[], timeTaken: number) {
    const daily = await DailyChallengeAttempt.findOne({ userId, attemptId });
    if (!daily) throw new ApiError(404, "Daily challenge attempt not found.");
    return attemptService.submit(userId, attemptId, answers, timeTaken);
  }

  async history(userId: string, limit = 30) {
    return DailyChallengeAttempt.find({ userId }).populate({ path: "challengeId", populate: { path: "quizId", select: "title category difficulty" } })
      .sort({ date: -1 }).limit(limit).lean();
  }

  async streak(userId: string) {
    const user = await User.findById(userId).select("currentStreak longestStreak");
    if (!user) throw new ApiError(404, "User not found.");
    const dates = await DailyChallengeAttempt.find({ userId, completed: true }).sort({ date: -1 }).limit(90).select("date").lean();
    return { current: user.currentStreak, longest: user.longestStreak, completedDates: dates.map((item) => item.date) };
  }
}