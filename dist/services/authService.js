"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeRegistration = exports.initiateRegistration = void 0;
const dataSource_1 = require("../config/dataSource");
const User_1 = require("../entities/User");
const RegistrationSession_1 = require("../entities/RegistrationSession");
const otpSerice_1 = require("./otpSerice");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepo = dataSource_1.AppDataSource.getRepository(User_1.User);
const sessionRepo = dataSource_1.AppDataSource.getRepository(RegistrationSession_1.RegistrationSession);
const initiateRegistration = async (firstName, lastName, email, password) => {
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
        throw new Error("Email is already registered.");
    }
    const hashPassword = await bcrypt_1.default.hash(password, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    // remove any previous session for this email
    await sessionRepo.delete({ email });
    const session = sessionRepo.create({ firstName, lastName, email, hashPassword, expiresAt });
    await sessionRepo.save(session);
    await (0, otpSerice_1.createAndSendOtp)(email, "registration");
    return { message: "OTP sent to email. Please verify to complete registration." };
};
exports.initiateRegistration = initiateRegistration;
const completeRegistration = async (email, otp) => {
    await (0, otpSerice_1.verifyOtp)(email, "registration", otp);
    const session = await sessionRepo.findOne({ where: { email } });
    if (!session) {
        throw new Error("Registration session expired. Please start again.");
    }
    if (new Date() > new Date(session.expiresAt)) {
        // cleanup expired session
        await sessionRepo.delete({ email });
        throw new Error("Registration session expired. Please start again.");
    }
    const user = userRepo.create({
        firstName: session.firstName,
        lastName: session.lastName,
        email: session.email,
        password: session.hashPassword,
        role: User_1.UserRole.CUSTOMER,
        isActive: true,
    });
    await userRepo.save(user);
    await (0, otpSerice_1.consumeOtp)(email, "registration", otp);
    await sessionRepo.delete({ email });
    return { message: "Registration successful. You can now log in." };
};
exports.completeRegistration = completeRegistration;
//# sourceMappingURL=authService.js.map