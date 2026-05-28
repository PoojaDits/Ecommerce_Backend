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