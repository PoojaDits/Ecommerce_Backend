import { Request, Response } from "express";
import {createProduct} from "../services/productService";
import { createProductSchema,} from "../validators/productValidator";
import { MESSAGES } from "../constants/messages";

export const createProductHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = createProductSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const product = await createProduct(value);

    res.status(201).json({
      success: true,
      message: MESSAGES.PRODUCT.CREATE_SUCCESS,
      product,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.PRODUCT.CREATE_FAILED;

    res.status(400).json({
      success: false,
      message,
    });
  }
};