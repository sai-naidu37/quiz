import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error?.code === 11000) {
    response.status(409).json({ message: "That username or email is already in use." });
    return;
  }

  const status = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError ? error.message : "Something went wrong.";
  const details = error instanceof ApiError ? error.details : undefined;
  if (status >= 500) console.error(error);
  response.status(status).json({ message, ...(details ? { details } : {}) });
};