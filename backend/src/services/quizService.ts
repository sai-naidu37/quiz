import mongoose from "mongoose";
import { Question } from "../models/Question";
import { Quiz } from "../models/Quiz";
import { QuizRepository, type QuizFilters } from "../repositories/quizRepository";
import { ApiError } from "../utils/ApiError";

const repository = new QuizRepository();

export class QuizService {
  async list(filters: QuizFilters) {
    const quizzes = await repository.list(filters);
    return quizzes.map((quiz) => ({ ...quiz, id: quiz._id.toString(), _id: undefined }));
  }

  async getById(id: string) {
    const quiz = await repository.findPublishedById(id);
    if (!quiz) throw new ApiError(404, "Quiz not found.");
    const questions = await Question.find({ quizId: quiz._id }).sort({ order: 1 }).select("questionText options points order").lean();
    return {
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      questionCount: quiz.questionCount,
      totalAttempts: quiz.totalAttempts,
      questions: questions.map((question) => ({
        id: question._id.toString(),
        questionText: question.questionText,
        options: question.options,
        order: question.order,
        points: question.points,
      })),
    };
  }

  async create(input: {
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    durationMinutes: number;
    featured?: boolean;
    questions: { questionText: string; options: string[]; correctAnswer: number; explanation: string; points: number }[];
  }) {
    const session = await mongoose.startSession();
    try {
      let createdId = "";
      await session.withTransaction(async () => {
        const [quiz] = await Quiz.create([{
          ...input,
          questionCount: input.questions.length,
          published: true,
        }], { session });
        await Question.insertMany(input.questions.map((question, order) => ({ ...question, quizId: quiz._id, order })), { session });
        createdId = quiz.id;
      });
      return this.getById(createdId);
    } finally {
      await session.endSession();
    }
  }

  async update(id: string, input: Partial<Omit<Parameters<QuizService["create"]>[0], "questions">>) {
    const quiz = await Quiz.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    if (!quiz) throw new ApiError(404, "Quiz not found.");
    return quiz;
  }

  async remove(id: string) {
    const quiz = await Quiz.findByIdAndUpdate(id, { published: false }, { new: true });
    if (!quiz) throw new ApiError(404, "Quiz not found.");
    return { id: quiz.id, archived: true };
  }
}