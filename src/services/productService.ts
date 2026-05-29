import { AppDataSource } from "../config/dataSource";
import Product from "../entities/Product";
import { Store } from "../entities/Store";
import Category from "../entities/Category";
import { MESSAGES } from "../constants/messages";
import { IProduct, ICreateProduct} from "../interfaces/IProduct";

const productRepo = AppDataSource.getRepository(Product);
const storeRepo = AppDataSource.getRepository(Store);
const categoryRepo = AppDataSource.getRepository(Category);

export const createProduct = async (
  data: ICreateProduct
): Promise<IProduct> => {
  const { name, description, price, stock, storeId, categoryId, isActive } = data;

  const normalizedName = name.trim();

  const store = await storeRepo.findOne({ where: { id: storeId } });
  if (!store) {
    throw new Error(MESSAGES.STORE.NOT_FOUND);
  }

  const category = await categoryRepo.findOne({ where: { id: categoryId } });
  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  const existingProduct = await productRepo.findOne({
    where: { name: normalizedName, store: { id: storeId } },
    relations: ["store"],
  });

  if (existingProduct) {
    throw new Error(MESSAGES.PRODUCT.ALREADY_EXISTS);
  }

  
  const product = new Product();
  product.name = normalizedName;
  product.description = description?.trim() || "";
  product.price = price;
  product.stock = stock;
  product.isActive = isActive ?? true;
  product.store = store;
  product.category = category;

  const savedProduct = await productRepo.save(product);

  const result = await productRepo.findOne({
    where: { id: savedProduct.id },
    relations: ["store", "category"],
  });

  return result as IProduct;
};
export const getAllProducts = async (): Promise<IProduct[]> => {
  const products = await productRepo.find({
    relations: ["store", "category"],
  });
  return products as IProduct[];
};