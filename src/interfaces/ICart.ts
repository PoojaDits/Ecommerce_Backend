export interface ICartItem {
  id: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    stock: number;
  };
  subtotal?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICart {
  id: number;
  items: ICartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface IAddCartItem {
  productId: number;
  quantity: number;
}

export interface IUpdateCartItem {
  quantity: number;
}
