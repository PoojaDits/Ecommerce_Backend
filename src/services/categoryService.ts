import { AppDataSource } from "../config/dataSource";
import Category from "../entities/Category";
import { MESSAGES } from "../constants/messages";
import { ILike } from "typeorm";

const categoryRepo = AppDataSource.getRepository(Category);

export const createCategory = async (
  name: string,
  description?: string
): Promise<Category> => {
  const normalizedName = name.trim();
  const normalizedDescription = description?.trim();

  const existingCategory = await categoryRepo.findOne({
    where: { name: ILike(normalizedName) },
  });

  if (existingCategory) {
    throw new Error(MESSAGES.CATEGORY.ALREADY_EXISTS);
  }

  const category = categoryRepo.create({
    name: normalizedName,
    description: normalizedDescription || null,
  });

  return await categoryRepo.save(category);
};

export const updateCategory = async (
  id: number,
  name?: string,
  description?: string
): Promise<Category> => {
  const category = await categoryRepo.findOne({
    where: { id },
  });

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  if (name !== undefined) {
    const normalizedName = name.trim();

    const existingCategory = await categoryRepo.findOne({
      where: { name: ILike(normalizedName) },
    });

    if (existingCategory && existingCategory.id !== id) {
      throw new Error(MESSAGES.CATEGORY.ALREADY_EXISTS);
    }

    category.name = normalizedName;
  }

  if (description !== undefined) {
    const normalizedDescription = description.trim();
    category.description = normalizedDescription || null;
  }

  return await categoryRepo.save(category);
};

export const updateCategoryByName = async (
  currentName: string,
  newName?: string,
  description?: string
): Promise<Category> => {
  const normalizedCurrentName = currentName.trim();

  const category = await categoryRepo.findOne({
    where: { name: ILike(normalizedCurrentName) },
  });

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  if (newName !== undefined) {
    const normalizedNewName = newName.trim();

    const existingCategory = await categoryRepo.findOne({
      where: { name: ILike(normalizedNewName) },
    });

    if (existingCategory && existingCategory.id !== category.id) {
      throw new Error(MESSAGES.CATEGORY.ALREADY_EXISTS);
    }

    category.name = normalizedNewName;
  }

  if (description !== undefined) {
    const normalizedDescription = description.trim();
    category.description = normalizedDescription || null;
  }

  return await categoryRepo.save(category);
};

export const deleteCategoryByName = async (name: string): Promise<Category> => {
  const normalizedName = name.trim();

  const category = await categoryRepo.findOne({
    where: { name: ILike(normalizedName) },
  });

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  await categoryRepo.remove(category);

  return category;
};

export const deleteCategoryById = async (id: number): Promise<Category> => {
  const category = await categoryRepo.findOne({
    where: { id },
  });

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  await categoryRepo.remove(category);

  return category;
};

// ============ GET APIs ============

export const getAllCategories = async (): Promise<Category[]> => {
  return await categoryRepo.find();
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const category = await categoryRepo.findOne({
    where: { id },
  });

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  return category;
};

export const getCategoryByName = async (name: string): Promise<Category> => {
  const normalizedName = name.trim();

  const category = await categoryRepo.findOne({
    where: { name: ILike(normalizedName) },
  });

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  return category;
};

export const checkCategoryExists = async (
  name: string
): Promise<{ exists: boolean; category: Category | null }> => {
  const normalizedName = name.trim();

  const category = await categoryRepo.findOne({
    where: { name: ILike(normalizedName) },
  });

  return {
    exists: !!category,
    category: category || null,
  };
};