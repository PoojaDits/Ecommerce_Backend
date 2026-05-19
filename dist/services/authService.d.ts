import { UserRole } from "../entities/User";
import { IAuthResponse } from "../interfaces/authInterface";
export declare const initiateRegistration: (firstName: string, lastName: string, email: string, password: string, role: UserRole) => Promise<IAuthResponse>;
export declare const completeRegistration: (email: string, otp: string) => Promise<IAuthResponse>;
export declare const resendRegistrationOtp: (email: string) => Promise<IAuthResponse>;
//# sourceMappingURL=authService.d.ts.map