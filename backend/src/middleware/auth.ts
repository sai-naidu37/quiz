import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: "user" | "admin";
    }
  }
}

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    const token = request.cookies?.quizmaster_token as string | undefined;
    if (!token) throw new ApiError(401, "Please sign in to continue.");
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new ApiError(500, "Authentication is not configured.");
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    const user = await User.findById(payload.sub).select("_id role");
    if (!user) throw new ApiError(401, "Your session has expired. Please sign in again.");
    request.userId = user.id;
    request.userRole = user.role;
    next();
  } catch (error) {
    next(error instanceof jwt.JsonWebTokenError ? new ApiError(401, "Your session is invalid.") : error);
  }
};

export const requireAdmin: RequestHandler = (request, _response, next) => {
  if (request.userRole !== "admin") return next(new ApiError(403, "Administrator access is required."));
  next();
};