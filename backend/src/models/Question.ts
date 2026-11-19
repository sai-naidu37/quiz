import { Schema, model, Types, type Document } from "mongoose";

export interface IQuestion extends Document {
  quizId: Types.ObjectId;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  order: number;
}

const questionSchema = new Schema<IQuestion>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    questionText: { type: String, required: true, maxlength: 600 },
    options: { type: [String], required: true, validate: (values: string[]) => values.length >= 2 && values.length <= 6 },
    correctAnswer: { type: Number, required: true, min: 0 },
    explanation: { type: String, required: true, maxlength: 1000 },
    points: { type: Number, default: 10, min: 1 },
    order: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

questionSchema.index({ quizId: 1, order: 1 }, { unique: true });
export const Question = model<IQuestion>("Question", questionSchema);