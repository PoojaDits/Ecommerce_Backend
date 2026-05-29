import Joi from "joi";

export const createStoreSchema = Joi.object({
  storeName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Store name is required.",
    "string.min": "Store name must be at least 2 characters.",
    "string.max": "Store name must not exceed 100 characters.",
    "any.required": "Store name is required.",
  }),
  storeDescription: Joi.string().trim().max(500).optional().messages({
    "string.max": "Store description must not exceed 500 characters.",
  }),
  storeLocation: Joi.string().trim().min(2).max(255).required().messages({
    "string.empty": "Store location is required.",
    "string.min": "Store location must be at least 2 characters.",
    "string.max": "Store location must not exceed 255 characters.",
    "any.required": "Store location is required.",
  }),
  storeContact: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Store contact must be a valid phone number (7–20 digits).",
    }),
  storeEmail: Joi.string().trim().email().required().messages({
    "string.empty": "Store email is required.",
    "string.email": "Please provide a valid store email address.",
    "any.required": "Store email is required.",
  }),
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number.",
    "number.integer": "User ID must be an integer.",
    "number.positive": "User ID must be a positive number.",
    "any.required": "User ID is required.",
  }),
});

export const updateStoreSchema = Joi.object({
  storeName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Store name cannot be empty.",
    "string.min": "Store name must be at least 2 characters.",
    "string.max": "Store name must not exceed 100 characters.",
  }),
  storeDescription: Joi.string().trim().allow("").max(500).optional().messages({
    "string.max": "Store description must not exceed 500 characters.",
  }),
  storeLocation: Joi.string().trim().min(2).max(255).optional().messages({
    "string.empty": "Store location cannot be empty.",
    "string.min": "Store location must be at least 2 characters.",
    "string.max": "Store location must not exceed 255 characters.",
  }),
  storeContact: Joi.string()
    .trim()
    .allow("")
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Store contact must be a valid phone number (7–20 digits).",
    }),
  storeEmail: Joi.string().trim().email().optional().messages({
    "string.empty": "Store email cannot be empty.",
    "string.email": "Please provide a valid store email address.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update store.",
  });
