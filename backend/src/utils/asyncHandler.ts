import type { Request, Response, NextFunction } from "express";

type AsyncController = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncHandler = (controller: AsyncController) =>
  (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(controller(request, response, next)).catch(next);
  };