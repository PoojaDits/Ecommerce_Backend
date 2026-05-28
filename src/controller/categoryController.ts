import { Request, Response } from "express";
import { createCategory ,updateCategory,updateCategoryByName,deleteCategoryByName} from "../services/categoryService";
import { createCategorySchema ,updateCategorySchema} from "../validators/categoryValidator";
import { MESSAGES } from "../constants/messages";

export const createCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error, value } = createCategorySchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { name, description } = value;

    const category = await createCategory(name, description);

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";

    res.status(400).json({
      success: false,
      message,
    });
  }
};


export const updateCategoryHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: "Valid category id is required.",
      });
      return;
    }

    const { error, value } = updateCategorySchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { name, description } = value;
    const category = await updateCategory(categoryId, name, description);

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update category";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const updateCategoryByNameHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawName = req.params.name;
    const currentName = Array.isArray(rawName) ? rawName[0]?.trim() : rawName?.trim();

    if (!currentName) {
      res.status(400).json({
        success: false,
        message: "Category name is required in URL.",
      });
      return;
    }

    const { error, value } = updateCategorySchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const { name, description } = value;
    const category = await updateCategoryByName(currentName, name, description);

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update category";

    res.status(400).json({
      success: false,
      message,
    });
  }
};



export const deleteCategoryByNameHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const rawName = req.params.name;
    const categoryName = Array.isArray(rawName)
      ? rawName[0]?.trim()
      : rawName?.trim();

    if (!categoryName) {
      res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
      return;
    }

    const category = await deleteCategoryByName(categoryName);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category";

    res.status(400).json({
      success: false,
      message,
    });
  }
};