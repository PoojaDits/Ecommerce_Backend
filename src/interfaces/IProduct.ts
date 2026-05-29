export interface IProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
  store?: { id: number };
  category?: { id: number };
}

export interface ICreateProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  storeId: number;
  categoryId: number;
  isActive?: boolean;
}

export interface IUpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  isActive?: boolean;
}