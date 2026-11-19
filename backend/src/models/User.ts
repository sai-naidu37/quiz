import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastChallengeDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 24, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    totalPoints: { type: Number, default: 0, min: 0 },
    currentStreak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 },
    lastChallengeDate: { type: String },
  },
  { timestamps: true },
);

userSchema.index({ totalPoints: -1 });
export const User = model<IUser>("User", userSchema);