import { Request, Response } from "express";
import {
  initiateRegistration,
  completeRegistration,
  resendRegistrationOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../services/authService";


import {
  loginSchema,
  registerSchema,
  resendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validators/authValidator";
import { MESSAGES } from "../constants/messages";
import { IAuthResponse } from "../interfaces/authInterface";
import jwt from "jsonwebtoken";

export const registerInitiate = async (
  req: Request,
  res: Response
): Promise<void> => { 
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { firstName, lastName, email, password, role } = req.body;

    const result: IAuthResponse = await initiateRegistration(
      firstName,
      lastName,
      email,
      password,
      role
    );

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message =error instanceof Error ? error.message : "Registration failed";
    res.status(400).json({ success: false, message });
  }
};

export const registerVerifyOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email, otp } = req.body;
    const result: IAuthResponse = await completeRegistration(email, otp);

    res.status(201).json({ success: true, ...result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "OTP verification failed";
    res.status(400).json({ success: false, message });
  }
};

export const resendOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = resendOtpSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email } = req.body;
    const result: IAuthResponse = await resendRegistrationOtp(email);

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to resend OTP";
    res.status(400).json({ success: false, message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email, password } = req.body;
    const result: IAuthResponse = await loginUser(email, password);

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(400).json({ success: false, message });
  }
};

export const handleForgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email } = req.body;
    const result: IAuthResponse = await forgotPassword(email);

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Forgot password request failed";
    res.status(400).json({ success: false, message });
  }
};

export const handleResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email, otp, newPassword } = req.body;
    const result: IAuthResponse = await resetPassword(email, otp, newPassword);

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Password reset failed";
    res.status(400).json({ success: false, message });
  }
};

export const handleChangePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Access denied. No token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "Access denied. No token provided." });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    
    const { currentPassword, newPassword } = req.body;
    const result: IAuthResponse = await changePassword(payload.id, currentPassword, newPassword);

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: "Token expired. Please login again." });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: "Invalid token." });
      return;
    }
    const message =
      error instanceof Error ? error.message : "Change password failed";
    res.status(400).json({ success: false, message });
  }
};