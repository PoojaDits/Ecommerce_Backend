import { Request, Response } from "express";
import {
  initiateRegistration,
  completeRegistration,
  resendRegistrationOtp,
  loginUser
} from "../services/authService";
import {
  loginSchema,
  registerSchema,
  resendOtpSchema,
  verifyOtpSchema,
} from "../validators/authValidator";
import { MESSAGES } from "../constants/messages";
import { IAuthResponse } from "../interfaces/authInterface";
import logger from "../config/logger";

export const registerInitiate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = registerSchema.validate(req.body);

    if (error) {
      logger.warn(`Register validation failed: ${error.details?.[0]?.message}`);
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { firstName, lastName, email, password, role } = req.body;
    logger.info(`Register request received for ${email}`);

    const result: IAuthResponse = await initiateRegistration(
      firstName,
      lastName,
      email,
      password,
      role
    );

    logger.info(`Register initiated successfully for ${email}`);
    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    logger.warn(`Register failed: ${message}`);
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
      logger.warn(`OTP verification validation failed: ${error.details?.[0]?.message}`);
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email, otp } = req.body;
    logger.info(`OTP verification request received for ${email}`);

    const result: IAuthResponse = await completeRegistration(email, otp);

    logger.info(`OTP verified successfully for ${email}`);
    res.status(201).json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "OTP verification failed";
    logger.warn(`OTP verification failed: ${message}`);
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
      logger.warn(`Resend OTP validation failed: ${error.details?.[0]?.message}`);
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email } = req.body;
    logger.info(`Resend OTP request received for ${email}`);

    const result: IAuthResponse = await resendRegistrationOtp(email);
    logger.info(`OTP resent successfully for ${email}`);

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to resend OTP";
    logger.warn(`Failed to resend OTP: ${message}`);
    res.status(400).json({ success: false, message });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      logger.warn(`Login validation failed: ${error.details?.[0]?.message}`);
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { email, password } = req.body;
    logger.info(`Login request received for ${email}`);

    const result: IAuthResponse = await loginUser(email, password);
    logger.info(`Login successful for ${email}`);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    logger.warn(`Login failed: ${message}`);
    res.status(400).json({
      success: false,
      message,
    });
  }
};