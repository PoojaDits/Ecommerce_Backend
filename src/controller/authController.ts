import { Request, Response } from "express";
import {
  initiateRegistration,
  completeRegistration,
  resendRegistrationOtp,
  loginUser
} from "../services/authService";
import { verifyOtpSchema } from "../validators/authValidator";
import { MESSAGES } from "../constants/messages";
import { IAuthResponse } from "../interfaces/authInterface";
import logger from "../config/logger";

export const registerInitiate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
     logger.info(`Register request received for ${email}`);
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ success: false, message: MESSAGES.VALIDATION.ALL_FIELDS_REQUIRED });
      return;
    }
    const validRoles = ["admin", "customer", "vendor"];
    if (role && !validRoles.includes(role)) {
      res.status(400).json({

        success: false,
        message: MESSAGES.VALIDATION.INVALID_ROLE(validRoles.join(", "))
      });
      return; 
    }
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
    const { email } = req.body;

    logger.info(`Resend OTP request received for ${email}`);

    if (!email) {
      logger.warn("Resend OTP failed: email is required");
      res
        .status(400)
        .json({ success: false, message: MESSAGES.VALIDATION.EMAIL_REQUIRED });
      return;
    }

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
    const { email, password } = req.body;

    logger.info(`Login request received for ${email}`);

    if (!email || !password) {
      logger.warn(`Login failed for ${email}: missing email or password`);
      res.status(400).json({
        success: false,
        message: MESSAGES.VALIDATION.ALL_FIELDS_REQUIRED,
      });
      return;
    }

   
    const result: IAuthResponse = await loginUser(email,password);
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
      message: message,
    });

  }

};
