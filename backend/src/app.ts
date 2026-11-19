import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import { AuthService } from "./services/authService";
import { QuizService } from "./services/quizService";
import { AttemptService } from "./services/attemptService";
import { DashboardService } from "./services/dashboardService";
import { ChallengeService } from "./services/challengeService";
import { LeaderboardService } from "./services/leaderboardService";
import { ProfileService } from "./services/profileService";
import { requireAuth, requireAdmin } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { ApiError } from "./utils/ApiError";

export const app = express();
const auth = new AuthService();
const quizzes = new QuizService();
const attempts = new AttemptService();
const dashboard = new DashboardService();
const challenges = new ChallengeService();
const leaderboard = new LeaderboardService();
const profiles = new ProfileService();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false }));

const parse = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) throw new ApiError(400, result.error.issues[0]?.message ?? "Invalid request.");
  return result.data;
};
const cookie = (token: string, res: Response) => {
  res.cookie("quizmaster_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" });
};

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const input = parse(z.object({ username: z.string().trim().min(3).max(24), email: z.email(), password: z.string().min(8).max(72), confirmPassword: z.string().optional() }), req.body);
    if (input.confirmPassword && input.confirmPassword !== input.password) throw new ApiError(400, "Passwords do not match.");
    const result = await auth.register(input);
    cookie(result.token, res);
    res.status(201).json({ user: result.user });
  } catch (error) { next(error); }
});
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const input = parse(z.object({ email: z.email(), password: z.string().min(1) }), req.body);
    const result = await auth.login(input);
    cookie(result.token, res);
    res.json({ user: result.user });
  } catch (error) { next(error); }
});
app.post("/api/auth/logout", (_req, res) => res.clearCookie("quizmaster_token", { path: "/" }).json({ message: "Signed out." }));
app.get("/api/auth/me", requireAuth, async (req, res, next) => { try { res.json({ user: await auth.currentUser(req.userId!) }); } catch (error) { next(error); } });

app.get("/api/quizzes", async (req, res, next) => {
  try {
    res.json(await quizzes.list({ search: String(req.query.search ?? ""), category: req.query.category ? String(req.query.category) : undefined, difficulty: req.query.difficulty ? String(req.query.difficulty) : undefined, sort: String(req.query.sort ?? "popular") as any }));
  } catch (error) { next(error); }
});
app.get("/api/quizzes/:id", async (req, res, next) => { try { res.json(await quizzes.getById(String(req.params.id))); } catch (error) { next(error); } });
app.post("/api/quizzes", requireAuth, requireAdmin, async (req, res, next) => { try { res.status(201).json(await quizzes.create(req.body)); } catch (error) { next(error); } });
app.put("/api/quizzes/:id", requireAuth, requireAdmin, async (req, res, next) => { try { res.json(await quizzes.update(String(req.params.id), req.body)); } catch (error) { next(error); } });
app.delete("/api/quizzes/:id", requireAuth, requireAdmin, async (req, res, next) => { try { res.json(await quizzes.remove(String(req.params.id))); } catch (error) { next(error); } });

app.post("/api/attempts/start", requireAuth, async (req, res, next) => { try { const input = parse(z.object({ quizId: z.string().min(1) }), req.body); res.status(201).json(await attempts.start(req.userId!, input.quizId)); } catch (error) { next(error); } });
app.post("/api/attempts/submit", requireAuth, async (req, res, next) => {
  try {
    const input = parse(z.object({ attemptId: z.string(), answers: z.array(z.object({ questionId: z.string(), selectedOption: z.number().int().min(0).optional() })), timeTaken: z.number().int().min(0) }), req.body);
    res.json(await attempts.submit(req.userId!, input.attemptId, input.answers, input.timeTaken));
  } catch (error) { next(error); }
});
app.get("/api/attempts/history", requireAuth, async (req, res, next) => { try { res.json(await attempts.history(req.userId!, false, Number(req.query.page ?? 1), Number(req.query.limit ?? 20))); } catch (error) { next(error); } });
app.get("/api/attempts/completed", requireAuth, async (req, res, next) => { try { res.json(await attempts.history(req.userId!, true, Number(req.query.page ?? 1), Number(req.query.limit ?? 20))); } catch (error) { next(error); } });
app.get("/api/attempts/:id", requireAuth, async (req, res, next) => { try { res.json(await attempts.getById(req.userId!, String(req.params.id))); } catch (error) { next(error); } });

app.get("/api/dashboard/stats", requireAuth, async (req, res, next) => { try { res.json(await dashboard.stats(req.userId!)); } catch (error) { next(error); } });
app.get("/api/dashboard/activity", requireAuth, async (req, res, next) => { try { res.json(await dashboard.activity(req.userId!, Number(req.query.limit ?? 6))); } catch (error) { next(error); } });
app.get("/api/dashboard/progress", requireAuth, async (req, res, next) => { try { res.json(await dashboard.progress(req.userId!)); } catch (error) { next(error); } });

app.get("/api/challenges/today", requireAuth, async (req, res, next) => { try { res.json(await challenges.today(req.userId!)); } catch (error) { next(error); } });
app.post("/api/challenges/:id/start", requireAuth, async (req, res, next) => { try { res.json(await challenges.start(req.userId!, String(req.params.id))); } catch (error) { next(error); } });
app.post("/api/challenges/:id/submit", requireAuth, async (req, res, next) => { try { const input = parse(z.object({ attemptId: z.string(), answers: z.array(z.object({ questionId: z.string(), selectedOption: z.number().int().min(0).optional() })), timeTaken: z.number().int().min(0) }), req.body); res.json(await challenges.submit(req.userId!, input.attemptId, input.answers, input.timeTaken)); } catch (error) { next(error); } });
app.get("/api/challenges/history", requireAuth, async (req, res, next) => { try { res.json(await challenges.history(req.userId!)); } catch (error) { next(error); } });
app.get("/api/challenges/streak", requireAuth, async (req, res, next) => { try { res.json(await challenges.streak(req.userId!)); } catch (error) { next(error); } });

app.get("/api/leaderboard/:period", async (req, res, next) => {
  try {
    const period = req.params.period === "weekly" || req.params.period === "monthly" ? req.params.period : "all-time";
    res.json(await leaderboard.list(period));
  } catch (error) { next(error); }
});
app.get("/api/users/profile", requireAuth, async (req, res, next) => { try { res.json(await profiles.get(req.userId!)); } catch (error) { next(error); } });
app.put("/api/users/profile", requireAuth, async (req, res, next) => { try { const input = parse(z.object({ username: z.string().trim().min(3).max(24) }), req.body); res.json(await profiles.update(req.userId!, input.username)); } catch (error) { next(error); } });
app.put("/api/users/change-password", requireAuth, async (req, res, next) => { try { const input = parse(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).max(72) }), req.body); res.json(await profiles.changePassword(req.userId!, input.currentPassword, input.newPassword)); } catch (error) { next(error); } });

app.use((_req: Request, _res: Response, next: NextFunction) => next(new ApiError(404, "Route not found.")));
app.use(errorHandler);
