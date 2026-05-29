import { UserRole } from "../enums";


export interface IUser {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}



export interface IRegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}



export interface IUserResponse {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}