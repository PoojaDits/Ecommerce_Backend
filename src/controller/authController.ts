import { Request, Response } from "express";
import {
  initiateRegistration,
  completeRegistration,
  resendRegistrationOtp,
  loginUser,
} from "../services/authService";
import {
  loginSchema,
  registerSchema,
  resendOtpSchema,
  verifyOtpSchema,
} from "../validators/authValidator";
import { MESSAGES } from "../constants/messages";
import { IAuthResponse } from "../interfaces/authInterface";

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
    const message =
      error instanceof Error ? error.message : "Registration failed";
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