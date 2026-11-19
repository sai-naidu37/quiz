import { Schema, model, Types, type Document } from "mongoose";

export interface IDailyChallengeAttempt extends Document {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
  attemptId: Types.ObjectId;
  date: string;
  completed: boolean;
  pointsEarned: number;
  completedAt?: Date;
}

const dailyChallengeAttemptSchema = new Schema<IDailyChallengeAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: Schema.Types.ObjectId, ref: "DailyChallenge", required: true },
    attemptId: { type: Schema.Types.ObjectId, ref: "QuizAttempt", required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, default: false },
    pointsEarned: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

dailyChallengeAttemptSchema.index({ userId: 1, date: 1 }, { unique: true });
export const DailyChallengeAttempt = model<IDailyChallengeAttempt>("DailyChallengeAttempt", dailyChallengeAttemptSchema);