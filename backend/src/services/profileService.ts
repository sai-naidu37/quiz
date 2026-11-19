import bcrypt from "bcryptjs";
import { Achievement } from "../models/Achievement";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export class ProfileService {
  async get(userId: string) {
    const [user, achievements] = await Promise.all([
      User.findById(userId).select("username email totalPoints currentStreak longestStreak createdAt"),
      Achievement.find({ userId }).sort({ unlockedAt: -1 }).lean(),
    ]);
    if (!user) throw new ApiError(404, "User not found.");
    return { ...user.toObject(), id: user.id, achievements };
  }

  async update(userId: string, username: string) {
    const user = await User.findByIdAndUpdate(userId, { username: username.trim() }, { new: true, runValidators: true })
      .select("username email totalPoints currentStreak longestStreak createdAt");
    if (!user) throw new ApiError(404, "User not found.");
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId).select("+passwordHash");
    if (!user) throw new ApiError(404, "User not found.");
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) throw new ApiError(400, "Current password is incorrect.");
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    return { message: "Password updated successfully." };
  }
}