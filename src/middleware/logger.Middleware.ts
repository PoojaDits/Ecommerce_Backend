import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  res.on("finish", () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime}ms`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};

export default requestLogger;