import Product from "../entities/Product";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  image: string | null;
  created_at: Date;
  updated_at: Date;
  store: {
    id: number;
    storeName: string;
  };
  category: {
    id: number;
    name: string;
  };
}

export interface ICreateProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  storeId: number;
  categoryId: number;
  isActive?: boolean;
  image?: string | null;
}

export interface IUpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  isActive?: boolean;
  image?: string | null;
}
