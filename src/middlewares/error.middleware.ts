import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/response";
import { HttpError } from "../utils/httpError";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.status(err.code).json({
      code: err.code,
      data: null,
      message: err.message,
    });
  }

  return res.status(500).json({
    code: 500,
    data: null,
    message: err.message || "Internal Server Error",
  });
};
