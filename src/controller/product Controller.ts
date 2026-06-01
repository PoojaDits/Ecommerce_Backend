import { Request, Response } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../services/productService";
import { createProductSchema } from "../validators/productValidator";
import { MESSAGES } from "../constants/messages";

export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    if (req.file) {
      value.image = "/uploads/products/" + req.file.filename;
    }

    const product = await createProduct(value);

    res.status(201).json({
      success: true,
      message: MESSAGES.PRODUCT.CREATE_SUCCESS,
      product,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : MESSAGES.PRODUCT.CREATE_FAILED;
    res.status(400).json({ success: false, message });
  }
};

export const getAllProductsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.status(200).json({
      success: true,
      message: MESSAGES.PRODUCT.GET_SUCCESS,
      products,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : MESSAGES.PRODUCT.GET_FAILED;
    res.status(500).json({ success: false, message });
  }
};

export const getProductByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ success: false, message: MESSAGES.VALIDATION.FAILED });
      return;
    }

    const product = await getProductById(id);
    res.status(200).json({
      success: true,
      message: MESSAGES.PRODUCT.GET_SUCCESS,
      product,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : MESSAGES.PRODUCT.NOT_FOUND;
    res.status(404).json({ success: false, message });
  }
};

export const updateProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ success: false, message: MESSAGES.VALIDATION.FAILED });
      return;
    }

    
    const updateData = { ...req.body };

    
    if (req.file) {
      updateData.image = "/uploads/products/" + req.file.filename;
    }

    const updatedProduct = await updateProduct(id, updateData);
    res.status(200).json({
      success: true,
      message: MESSAGES.PRODUCT.UPDATE_SUCCESS,
      product: updatedProduct,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : MESSAGES.PRODUCT.UPDATE_FAILED;
    res.status(400).json({ success: false, message });
  }
};

export const deleteProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ success: false, message: MESSAGES.VALIDATION.FAILED });
      return;
    }

    await deleteProduct(id);
    res.status(200).json({ success: true, message: MESSAGES.PRODUCT.DELETE_SUCCESS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : MESSAGES.PRODUCT.DELETE_FAILED;
    res.status(400).json({ success: false, message });
  }
};
