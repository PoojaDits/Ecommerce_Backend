export declare const createAndSendOtp: (userEmail: string, purpose: string) => Promise<void>;
export declare const verifyOtp: (userEmail: string, purpose: string, code: string) => Promise<boolean>;
export declare const consumeOtp: (userEmail: string, purpose: string, code: string) => Promise<void>;
//# sourceMappingURL=otpSerice.d.ts.map