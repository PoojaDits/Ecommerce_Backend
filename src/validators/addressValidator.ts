import Joi from "joi";

export const createAddressSchema = Joi.object({
  street: Joi.string().trim().min(2).max(255).required().messages({
    "string.empty": "Street is required.",
    "string.min": "Street must be at least 2 characters.",
    "string.max": "Street must not exceed 255 characters.",
    "any.required": "Street is required.",
  }),
  city: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "City is required.",
    "string.min": "City must be at least 2 characters.",
    "string.max": "City must not exceed 100 characters.",
    "any.required": "City is required.",
  }),
  state: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "State is required.",
    "string.min": "State must be at least 2 characters.",
    "string.max": "State must not exceed 100 characters.",
    "any.required": "State is required.",
  }),
  postalCode: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9\s\-]{3,12}$/)
    .required()
    .messages({
      "string.empty": "Postal code is required.",
      "string.pattern.base":
        "Postal code must be a valid code (3–12 characters).",
      "any.required": "Postal code is required.",
    }),
  country: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Country is required.",
    "string.min": "Country must be at least 2 characters.",
    "string.max": "Country must not exceed 100 characters.",
    "any.required": "Country is required.",
  }),
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number.",
    "number.integer": "User ID must be an integer.",
    "number.positive": "User ID must be a positive number.",
    "any.required": "User ID is required.",
  }),
});

export const updateAddressSchema = Joi.object({
  street: Joi.string().trim().min(2).max(255).optional().messages({
    "string.empty": "Street cannot be empty.",
    "string.min": "Street must be at least 2 characters.",
    "string.max": "Street must not exceed 255 characters.",
  }),
  city: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "City cannot be empty.",
    "string.min": "City must be at least 2 characters.",
    "string.max": "City must not exceed 100 characters.",
  }),
  state: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "State cannot be empty.",
    "string.min": "State must be at least 2 characters.",
    "string.max": "State must not exceed 100 characters.",
  }),
  postalCode: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9\s\-]{3,12}$/)
    .optional()
    .messages({
      "string.empty": "Postal code cannot be empty.",
      "string.pattern.base":
        "Postal code must be a valid code (3–12 characters).",
    }),
  country: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Country cannot be empty.",
    "string.min": "Country must be at least 2 characters.",
    "string.max": "Country must not exceed 100 characters.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update address.",
  });
