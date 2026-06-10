import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn(`AppError ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.message?.startsWith("Only image files")) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err.message === "File too large") {
    res.status(400).json({
      success: false,
      message: "File size exceeds the 5 MB limit.",
    });
    return;
  }

  logger.error(`Unhandled error: ${err.message || err}`);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};

export default globalErrorHandler;