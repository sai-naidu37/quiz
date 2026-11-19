import { Schema, model, type Document } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMinutes: number;
  questionCount: number;
  totalAttempts: number;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 500 },
    category: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    durationMinutes: { type: Number, required: true, min: 1, max: 180 },
    questionCount: { type: Number, required: true, min: 1 },
    totalAttempts: { type: Number, default: 0, min: 0 },
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

quizSchema.index({ published: 1, createdAt: -1 });
export const Quiz = model<IQuiz>("Quiz", quizSchema);