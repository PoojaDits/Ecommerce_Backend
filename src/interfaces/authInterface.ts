import { UserRole } from "../entities/User";

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
}
