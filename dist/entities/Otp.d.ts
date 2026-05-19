import { User } from "./User";
export declare class Otp {
    id: number;
    code: string;
    expiresAt: Date;
    is_used: boolean;
    userEmail: string;
    purpose: string;
    user: User | null;
}
//# sourceMappingURL=Otp.d.ts.map