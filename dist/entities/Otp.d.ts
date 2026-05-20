import { User } from "./User";
import { OtpPurpose } from "../enums";
export declare class Otp {
    id: number;
    code: string;
    expiresAt: Date;
    is_used: boolean;
    userEmail: string;
    purpose: OtpPurpose;
    user: User | null;
}
//# sourceMappingURL=Otp.d.ts.map