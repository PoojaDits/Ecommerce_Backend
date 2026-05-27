import Joi from "joi";
import { MESSAGES } from "../constants/messages";
import { UserRole, OtpPurpose } from "../enums";
const validRoles = Object.values(UserRole);

const emailSchema = Joi.string().trim().email().required().messages({
  "string.empty": MESSAGES.VALIDATION.EMAIL_REQUIRED,
  "string.email": MESSAGES.VALIDATION.EMAIL_INVALID,
  "any.required": MESSAGES.VALIDATION.EMAIL_REQUIRED,
});

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": MESSAGES.VALIDATION.FIRST_NAME_REQUIRED,
    "string.min": MESSAGES.VALIDATION.FIRST_NAME_MIN,
    "string.max": MESSAGES.VALIDATION.FIRST_NAME_MAX,
    "any.required": MESSAGES.VALIDATION.FIRST_NAME_REQUIRED,
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": MESSAGES.VALIDATION.LAST_NAME_REQUIRED,
    "string.min": MESSAGES.VALIDATION.LAST_NAME_MIN,
    "string.max": MESSAGES.VALIDATION.LAST_NAME_MAX,
    "any.required": MESSAGES.VALIDATION.LAST_NAME_REQUIRED,
  }),
  email: emailSchema,
  password: Joi.string().min(6).max(30).required().messages({
    "string.empty": MESSAGES.VALIDATION.PASSWORD_REQUIRED,
    "string.min": MESSAGES.VALIDATION.PASSWORD_MIN,
    "string.max": MESSAGES.VALIDATION.PASSWORD_MAX,
    "any.required": MESSAGES.VALIDATION.PASSWORD_REQUIRED,
  }),
  role: Joi.string().valid(...validRoles).optional().messages({
    "any.only": MESSAGES.VALIDATION.INVALID_ROLE(validRoles.join(", ")),
  }),
});

export const verifyOtpSchema = Joi.object({
  email: emailSchema,
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    "string.empty": MESSAGES.VALIDATION.OTP_REQUIRED,
    "string.length": MESSAGES.VALIDATION.OTP_LENGTH,
    "string.pattern.base": MESSAGES.VALIDATION.OTP_NUMERIC,
    "any.required": MESSAGES.VALIDATION.OTP_REQUIRED,
  }),
});

export const resendOtpSchema = Joi.object({
  email: emailSchema,
});

export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    "string.empty": MESSAGES.VALIDATION.PASSWORD_REQUIRED,
    "any.required": MESSAGES.VALIDATION.PASSWORD_REQUIRED,
  }),
});