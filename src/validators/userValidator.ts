import Joi from "joi";
import { MESSAGES } from "../constants/messages";

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": MESSAGES.VALIDATION.FIRST_NAME_MIN,
    "string.max": MESSAGES.VALIDATION.FIRST_NAME_MAX,
  }),
  lastName: Joi.string().trim().min(2).max(50).optional().messages({
    "string.min": MESSAGES.VALIDATION.LAST_NAME_MIN,
    "string.max": MESSAGES.VALIDATION.LAST_NAME_MAX,
  }),
  email: Joi.string().email().optional().messages({
    "string.email": MESSAGES.VALIDATION.EMAIL_INVALID,
  }),
  password: Joi.string().min(6).max(30).optional().messages({
    "string.min": MESSAGES.VALIDATION.PASSWORD_MIN,
    "string.max": MESSAGES.VALIDATION.PASSWORD_MAX,
  }),
  role: Joi.string().optional(),
}).min(1).messages({
  "object.min": MESSAGES.VALIDATION.ALL_FIELDS_REQUIRED,
});
