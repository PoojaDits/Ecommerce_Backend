
export interface ICategory {
  id: number;
  name: string;
  description: string | null;
  products?: number[];
}



export interface ICreateCategory {
  name: string;
  description?: string;
}

export interface IUpdateCategory {
  name?: string;
  description?: string;
}



export interface ICategoryCheck {
  exists: boolean;
  category: ICategory | null;
}



export interface ICategoryExistsResponse {
  success: boolean;
  message: string;
  exists: boolean;
  category: ICategory | null;
}