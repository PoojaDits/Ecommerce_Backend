import { Request, Response } from "express";
import { createCategory, updateCategory, updateCategoryByName, deleteCategoryByName, deleteCategoryById , getAllCategories,getCategoryById,getCategoryByName,checkCategoryExists } from "../services/categoryService";
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
      message: MESSAGES.CATEGORY.CREATE_SUCCESS,
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.CATEGORY.CREATE_FAILED;

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
        message: MESSAGES.CATEGORY.ID_REQUIRED,
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
      message: MESSAGES.CATEGORY.UPDATE_SUCCESS,
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.CATEGORY.UPDATE_FAILED;

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
        message: MESSAGES.CATEGORY.NAME_REQUIRED_URL,
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
      message: MESSAGES.CATEGORY.UPDATE_SUCCESS,
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.CATEGORY.UPDATE_FAILED;

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
        message: MESSAGES.CATEGORY.NAME_REQUIRED,
      });
      return;
    }

    const category = await deleteCategoryByName(categoryName);

    res.status(200).json({
      success: true,
      message: MESSAGES.CATEGORY.DELETE_SUCCESS,
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.CATEGORY.DELETE_FAILED;

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const deleteCategoryByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.CATEGORY.ID_REQUIRED,
      });
      return;
    }

    const category = await deleteCategoryById(categoryId);

    res.status(200).json({
      success: true,
      message: MESSAGES.CATEGORY.DELETE_SUCCESS,
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : MESSAGES.CATEGORY.DELETE_FAILED;

    res.status(400).json({
      success: false,
      message,
    });
  }
};


export const getAllCategoriesHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      categories,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve categories";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getCategoryByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.CATEGORY.ID_REQUIRED,
      });
      return;
    }

    const category = await getCategoryById(categoryId);

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully.",
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve category";

    if (message === MESSAGES.CATEGORY.NOT_FOUND) {
      res.status(404).json({
        success: false,
        message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getCategoryByNameHandler = async (
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
        message: MESSAGES.CATEGORY.NAME_REQUIRED,
      });
      return;
    }

    const category = await getCategoryByName(categoryName);

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully.",
      category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve category";

    if (message === MESSAGES.CATEGORY.NOT_FOUND) {
      res.status(404).json({
        success: false,
        message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const checkCategoryExistsHandler = async (
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
        message: MESSAGES.CATEGORY.NAME_REQUIRED,
      });
      return;
    }

    const result = await checkCategoryExists(categoryName);

    res.status(200).json({
      success: true,
      message: result.exists
        ? "Category exists."
        : "Category does not exist.",
      exists: result.exists,
      category: result.category,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to check category existence";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

