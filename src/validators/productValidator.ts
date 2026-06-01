import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Product name is required.",
    "string.min": "Product name must be at least 2 characters.",
    "string.max": "Product name must not exceed 200 characters.",
    "any.required": "Product name is required.",
  }),
  description: Joi.string().trim().max(1000).optional().allow("").messages({
    "string.max": "Product description must not exceed 1000 characters.",
  }),
  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "Price is required.",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a number.",
    "number.integer": "Stock must be an integer.",
    "number.min": "Stock cannot be negative.",
    "any.required": "Stock is required.",
  }),
  storeId: Joi.number().integer().positive().required().messages({
    "number.base": "Store ID must be a number.",
    "number.integer": "Store ID must be an integer.",
    "number.positive": "Store ID must be a positive number.",
    "any.required": "Store ID is required.",
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    "number.base": "Category ID must be a number.",
    "number.integer": "Category ID must be an integer.",
    "number.positive": "Category ID must be a positive number.",
    "any.required": "Category ID is required.",
  }),
  isActive: Joi.boolean().optional().default(true).messages({
    "boolean.base": "isActive must be a boolean value.",
  }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).optional().messages({
    "string.empty": "Product name cannot be empty.",
    "string.min": "Product name must be at least 2 characters.",
    "string.max": "Product name must not exceed 200 characters.",
  }),
  description: Joi.string().trim().allow("").max(1000).optional().messages({
    "string.max": "Product description must not exceed 1000 characters.",
  }),
  price: Joi.number().positive().precision(2).optional().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
  }),
  stock: Joi.number().integer().min(0).optional().messages({
    "number.base": "Stock must be a number.",
    "number.integer": "Stock must be an integer.",
    "number.min": "Stock cannot be negative.",
  }),
  categoryId: Joi.number().integer().positive().optional().messages({
    "number.base": "Category ID must be a number.",
    "number.integer": "Category ID must be an integer.",
    "number.positive": "Category ID must be a positive number.",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean value.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update product.",
  });
