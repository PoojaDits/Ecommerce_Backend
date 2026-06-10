import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import { MESSAGES } from "../constants/messages";

/**
 * Middleware that checks whether the authenticated user has one of the
 * allowed roles. Must be used AFTER `authenticateUser` so that `req.user`
 * is populated.
 *
 * Usage:
 *   router.delete("/:id", authenticateUser, authorizeRoles("admin"), handler);
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: MESSAGES.AUTH.ACCESS_DENIED_NO_USER,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
      return;
    }

    next();
  };
};

export default authorizeRoles;