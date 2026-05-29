export interface IStore {
  id: number;
  storeName: string;
  storeDescription: string | null;
  storeLocation: string;
  storeContact: string | null;
  storeEmail: string;
  created_at: Date;
  updated_at: Date;
  user?: { id: number };
}

export interface ICreateStore {
  storeName: string;
  storeDescription?: string;
  storeLocation: string;
  storeContact?: string;
  storeEmail: string;
  userId: number;
}

export interface IUpdateStore {
  storeName?: string;
  storeDescription?: string;
  storeLocation?: string;
  storeContact?: string;
  storeEmail?: string;
}
