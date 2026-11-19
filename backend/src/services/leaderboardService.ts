import { QuizAttempt } from "../models/QuizAttempt";
import { User } from "../models/User";

export class LeaderboardService {
  async list(period: "weekly" | "monthly" | "all-time") {
    const match: Record<string, unknown> = { status: "completed" };
    if (period !== "all-time") {
      const start = new Date();
      start.setUTCHours(0, 0, 0, 0);
      start.setUTCDate(start.getUTCDate() - (period === "weekly" ? 6 : 29));
      match.completedAt = { $gte: start };
    }
    const totals = await QuizAttempt.aggregate([
      { $match: match },
      { $group: { _id: "$userId", points: { $sum: "$pointsEarned" }, completedQuizzes: { $sum: 1 } } },
      { $sort: { points: -1 } },
      { $limit: 100 },
    ]);
    const userIds = totals.map((item) => item._id);
    const users = await User.find({ _id: { $in: userIds } }).select("username currentStreak totalPoints").lean();
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));
    return totals.flatMap((item, index) => {
      const user = userMap.get(item._id.toString());
      return user ? [{
        rank: index + 1,
        username: user.username,
        totalPoints: period === "all-time" ? user.totalPoints : item.points,
        completedQuizzes: item.completedQuizzes,
        currentStreak: user.currentStreak,
      }] : [];
    });
  }
}