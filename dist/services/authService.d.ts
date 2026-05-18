export declare const initiateRegistration: (firstName: string, lastName: string, email: string, password: string) => Promise<{
    message: string;
}>;
export declare const completeRegistration: (email: string, otp: string) => Promise<{
    message: string;
}>;
//# sourceMappingURL=authService.d.ts.map