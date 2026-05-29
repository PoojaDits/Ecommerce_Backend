import { UserRole } from "../enums";
import { Request } from "express";

export interface IAuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export interface IAuthResponse {
  message: string;
  user?: IAuthUser;
  token?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
export interface IAuthServiceResponse {
  success: boolean;
  message: string;
  timestamp: string;
}


