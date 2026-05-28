import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/authInterface";
import { MESSAGES } from "../constants/messages";

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: MESSAGES.AUTH.ACCESS_DENIED_NO_TOKEN });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: MESSAGES.AUTH.ACCESS_DENIED_NO_TOKEN });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: MESSAGES.AUTH.TOKEN_EXPIRED });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: MESSAGES.AUTH.INVALID_TOKEN });
      return;
    }
    res.status(400).json({ success: false, message: MESSAGES.AUTH.AUTHENTICATION_FAILED });
  }
};

export default authenticateUser;
