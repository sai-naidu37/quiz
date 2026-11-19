import { Schema, model, Types, type Document } from "mongoose";

export interface IAchievement extends Document {
  userId: Types.ObjectId;
  achievementType: string;
  title: string;
  description: string;
  unlockedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    achievementType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

achievementSchema.index({ userId: 1, achievementType: 1 }, { unique: true });
export const Achievement = model<IAchievement>("Achievement", achievementSchema);