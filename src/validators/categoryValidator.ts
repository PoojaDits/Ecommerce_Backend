
import Joi from "joi";
import { MESSAGES } from "../constants/messages";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": MESSAGES.VALIDATION.CATEGORY_NAME_REQUIRED,
    "string.min": MESSAGES.VALIDATION.CATEGORY_NAME_MIN,
    "string.max": MESSAGES.VALIDATION.CATEGORY_NAME_MAX,
    "any.required": MESSAGES.VALIDATION.CATEGORY_NAME_REQUIRED,
  }),
  description: Joi.string().trim().max(255).optional().messages({
    "string.max": MESSAGES.VALIDATION.CATEGORY_DESCRIPTION_MAX,
  }),
});
export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional().messages({
    "string.empty": MESSAGES.VALIDATION.CATEGORY_NAME_EMPTY,
    "string.min": MESSAGES.VALIDATION.CATEGORY_NAME_MIN,
    "string.max": MESSAGES.VALIDATION.CATEGORY_NAME_MAX,
  }),
  description: Joi.string().trim().allow("").max(255).optional().messages({
    "string.max": MESSAGES.VALIDATION.CATEGORY_DESCRIPTION_MAX,
  }),
}).min(1).messages({
  "object.min": MESSAGES.VALIDATION.CATEGORY_UPDATE_REQUIRED,
});
