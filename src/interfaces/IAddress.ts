export interface IAddress {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  user?: { id: number };
}

export interface ICreateAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: number;
}
