
import Joi from "joi";


export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Category name is required.",
    "string.min": "Category name must be at least 2 characters.",
    "string.max": "Category name must not exceed 100 characters.",
    "any.required": "Category name is required.",
  }),
  description: Joi.string().trim().max(255).optional().messages({
    "string.max": "Category description must not exceed 255 characters.",
  }),
});
export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional().messages({
    "string.empty": "Category name cannot be empty.",
    "string.min": "Category name must be at least 2 characters.",
    "string.max": "Category name must not exceed 50 characters.",
  }),
  description: Joi.string().trim().allow("").max(255).optional().messages({
    "string.max": "Category description must not exceed 255 characters.",
  }),
}).min(1).messages({
  "object.min": "At least one field is required to update category.",
});
