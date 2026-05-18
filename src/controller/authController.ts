import { Request, Response } from "express";
import {
  initiateRegistration,
  completeRegistration,
  resendRegistrationOtp
} from "../services/authService";
import { verifyOtpSchema } from "../validators/authValidator";
import { MESSAGES } from "../constants/messages";
import { IAuthResponse } from "../interfaces/authInterface";

export const registerInitiate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

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
    const result: IAuthResponse = await initiateRegistration(firstName, lastName, email, password, role);
    res.status(200).json({ success: true, ...result });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const registerVerifyOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      res.status(400).json({ success: false, message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED });
      return;
    }

    const { email, otp } = req.body;

    const result: IAuthResponse = await completeRegistration(email, otp);
    res.status(201).json({ success: true, ...result });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resendOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: MESSAGES.VALIDATION.EMAIL_REQUIRED });
      return;
    }

    const result: IAuthResponse = await resendRegistrationOtp(email);
    res.status(200).json({ success: true, ...result });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

