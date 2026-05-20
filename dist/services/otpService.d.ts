import { OtpPurpose } from "../enums";
export declare const createAndSendOtp: (userEmail: string, purpose: OtpPurpose) => Promise<void>;
export declare const verifyOtp: (userEmail: string, purpose: OtpPurpose, code: string) => Promise<boolean>;
export declare const consumeOtp: (userEmail: string, purpose: OtpPurpose, code: string) => Promise<void>;
//# sourceMappingURL=otpService.d.ts.map