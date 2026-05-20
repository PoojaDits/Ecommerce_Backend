import { UserRole } from "../enums";
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
//# sourceMappingURL=authInterface.d.ts.map