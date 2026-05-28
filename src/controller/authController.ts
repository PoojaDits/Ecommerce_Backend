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
import { IAuthResponse, AuthRequest } from "../interfaces/authInterface";
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
    const message = error instanceof Error ? error.message : MESSAGES.AUTH.REGISTRATION_FAILED;
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
      error instanceof Error ? error.message : MESSAGES.AUTH.OTP_VERIFICATION_FAILED;
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
      error instanceof Error ? error.message : MESSAGES.AUTH.RESEND_OTP_FAILED;
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
    const message = error instanceof Error ? error.message : MESSAGES.AUTH.LOGIN_FAILED;
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
      error instanceof Error ? error.message : MESSAGES.AUTH.FORGOT_PASSWORD_FAILED;
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
      error instanceof Error ? error.message : MESSAGES.AUTH.RESET_PASSWORD_FAILED;
    res.status(400).json({ success: false, message });
  }
};

export const handleChangePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: MESSAGES.AUTH.ACCESS_DENIED_NO_USER });
      return;
    }

    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    const result: IAuthResponse = await changePassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({ success: true, ...result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.AUTH.CHANGE_PASSWORD_FAILED;
    res.status(400).json({ success: false, message });
  }
};

// export const handleLogout=(req,res)=>{
//   try{
//     res.clearCookie("token" );
//     res.status(200).json({ success: true, message: MESSAGES.AUTH.LOGOUT_SUCCESS });
//   }catch{
//     res.status(400).json({ success: false, message: MESSAGES.AUTH.LOGOUT_FAILED });
//   }
// }



