import { Schema, model, Types, type Document } from "mongoose";

export interface IDailyChallenge extends Document {
  date: string;
  quizId: Types.ObjectId;
  pointsReward: number;
}

const dailyChallengeSchema = new Schema<IDailyChallenge>(
  {
    date: { type: String, required: true, unique: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    pointsReward: { type: Number, default: 50, min: 1 },
  },
  { timestamps: true },
);

export const DailyChallenge = model<IDailyChallenge>("DailyChallenge", dailyChallengeSchema);