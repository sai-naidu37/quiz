import { Schema, model, Types, type Document } from "mongoose";

export interface IAttemptAnswer {
  questionId: Types.ObjectId;
  selectedOption?: number;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  dailyChallengeId?: Types.ObjectId;
  answers: IAttemptAnswer[];
  status: "in-progress" | "completed";
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  percentage: number;
  timeTaken: number;
  pointsEarned: number;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAttemptAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOption: { type: Number, min: 0 },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false },
);

const attemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    dailyChallengeId: { type: Schema.Types.ObjectId, ref: "DailyChallenge" },
    answers: { type: [answerSchema], default: [] },
    status: { type: String, enum: ["in-progress", "completed"], default: "in-progress", index: true },
    score: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    unansweredQuestions: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

attemptSchema.index({ userId: 1, completedAt: -1 });
export const QuizAttempt = model<IQuizAttempt>("QuizAttempt", attemptSchema);