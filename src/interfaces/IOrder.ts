export interface ICheckoutRequest {
  addressId: number;
}

export interface IOrderItem {
  id: number;
  productId: number | null;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder {
  id: number;
  totalAmount: number;
  address: {
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: IOrderItem[];
  created_at: Date;
  updated_at: Date;
}
