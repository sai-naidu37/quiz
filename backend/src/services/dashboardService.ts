import { QuizAttempt } from "../models/QuizAttempt";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export class DashboardService {
  async stats(userId: string) {
    const user = await User.findById(userId).select("username totalPoints currentStreak longestStreak");
    if (!user) throw new ApiError(404, "User not found.");
    const completed = await QuizAttempt.find({ userId, status: "completed" }).select("percentage pointsEarned").lean();
    const scores = completed.map((attempt) => attempt.percentage);
    return {
      username: user.username,
      quizzesAttempted: await QuizAttempt.countDocuments({ userId }),
      quizzesCompleted: completed.length,
      averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
      highestScore: scores.length ? Math.max(...scores) : 0,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalPoints: user.totalPoints,
    };
  }

  async activity(userId: string, limit = 6) {
    const attempts = await QuizAttempt.find({ userId, status: "completed" })
      .populate("quizId", "title category")
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean();
    return attempts.map((attempt) => ({
      id: attempt._id.toString(),
      quiz: attempt.quizId,
      score: attempt.percentage,
      pointsEarned: attempt.pointsEarned,
      completedAt: attempt.completedAt,
    }));
  }

  async progress(userId: string) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - 6);
    const attempts = await QuizAttempt.find({ userId, status: "completed", completedAt: { $gte: start } })
      .select("percentage completedAt")
      .lean();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + index);
      const key = date.toISOString().slice(0, 10);
      const daily = attempts.filter((attempt) => attempt.completedAt?.toISOString().slice(0, 10) === key);
      return {
        date: key,
        label: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        quizzes: daily.length,
        score: daily.length ? Math.round(daily.reduce((sum, item) => sum + item.percentage, 0) / daily.length) : 0,
      };
    });
  }
}