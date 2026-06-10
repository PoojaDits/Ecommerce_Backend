import rateLimit from "express-rate-limit";
import logger from "../config/logger";

/**
 * General API rate limiter.
 * Limits each IP to 100 requests per 15-minute window.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  handler: (req, res, _next, options) => {
    logger.warn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Strict limiter for auth endpoints (login, register, etc.).
 * Limits each IP to 10 requests per 15-minute window.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
  handler: (req, res, _next, options) => {
    logger.warn(`Auth rate limit exceeded for IP ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});

export default apiLimiter;