import Joi from "joi";

export const checkoutSchema = Joi.object({
  addressId: Joi.number().integer().positive().required().messages({
    "number.base": "Address ID must be a number.",
    "number.integer": "Address ID must be an integer.",
    "number.positive": "Address ID must be a positive number.",
    "any.required": "Address ID is required.",
  }),
});