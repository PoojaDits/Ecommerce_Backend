import { AppDataSource } from "../config/dataSource";
import Category from "../entities/Category";

const categoryRepo = AppDataSource.getRepository(Category);

export const createCategory = async (
  name: string,
  description?: string
): Promise<Category> => {
  const normalizedName = name.trim();
  const normalizedDescription = description?.trim();

  const existingCategory = await categoryRepo.findOne({
    where: { name: normalizedName },
  });

  if (existingCategory) {
    throw new Error("Category already exists.");
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
    throw new Error("Category not found.");
  }

  if (name !== undefined) {
    const normalizedName = name.trim();

    const existingCategory = await categoryRepo.findOne({
      where: { name: normalizedName },
    });

    if (existingCategory && existingCategory.id !== id) {
      throw new Error("Category already exists.");
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
    where: { name: normalizedCurrentName },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  if (newName !== undefined) {
    const normalizedNewName = newName.trim();

    const existingCategory = await categoryRepo.findOne({
      where: { name: normalizedNewName },
    });

    if (existingCategory && existingCategory.id !== category.id) {
      throw new Error("Category already exists.");
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
    where: { name: normalizedName },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  await categoryRepo.remove(category);

  return category;
};