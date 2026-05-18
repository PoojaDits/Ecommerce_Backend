import Joi from 'joi';
import { MESSAGES } from '../constants/messages';

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': MESSAGES.VALIDATION.EMAIL_INVALID,
    'any.required': MESSAGES.VALIDATION.EMAIL_REQUIRED
  }),
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    'string.length': MESSAGES.VALIDATION.OTP_LENGTH,
    'string.pattern.base': MESSAGES.VALIDATION.OTP_NUMERIC,
    'any.required': MESSAGES.VALIDATION.OTP_REQUIRED
  })
});
