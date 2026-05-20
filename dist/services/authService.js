"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendRegistrationOtp = exports.completeRegistration = exports.initiateRegistration = void 0;
const dataSource_1 = require("../config/dataSource");
const User_1 = require("../entities/User");
const enums_1 = require("../enums");
const otpService_1 = require("./otpService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const messages_1 = require("../constants/messages");
const userRepo = dataSource_1.AppDataSource.getRepository(User_1.User);
const initiateRegistration = async (firstName, lastName, email, password, role) => {
    const checkUser = await userRepo.findOne({
        where: { email }
    });
    if (checkUser?.isActive) {
        throw new Error(messages_1.MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED);
    }
    if (checkUser && !checkUser.isActive) {
        await userRepo.delete({ email });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = userRepo.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || enums_1.UserRole.CUSTOMER,
        isActive: false,
    });
    await userRepo.save(user);
    try {
        await (0, otpService_1.createAndSendOtp)(email, enums_1.OtpPurpose.REGISTRATION);
    }
    catch (error) {
        await userRepo.delete({ id: user.id });
        throw error;
    }
    const authUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
    return { message: messages_1.MESSAGES.AUTH.OTP_SENT, user: authUser };
};
exports.initiateRegistration = initiateRegistration;
const completeRegistration = async (email, otp) => {
    await (0, otpService_1.verifyOtp)(email, enums_1.OtpPurpose.REGISTRATION, otp);
    const user = await userRepo.findOne({
        where: { email, isActive: false }
    });
    if (!user) {
        throw new Error(messages_1.MESSAGES.AUTH.REGISTRATION_SESSION_NOT_FOUND);
    }
    user.isActive = true;
    await userRepo.save(user);
    try {
        await (0, otpService_1.consumeOtp)(email, enums_1.OtpPurpose.REGISTRATION, otp);
    }
    catch (error) {
        user.isActive = false;
        await userRepo.save(user);
        throw error;
    }
    const authUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
    return { message: messages_1.MESSAGES.AUTH.REGISTRATION_SUCCESS, user: authUser };
};
exports.completeRegistration = completeRegistration;
const resendRegistrationOtp = async (email) => {
    const user = await userRepo.findOne({
        where: { email, isActive: false }
    });
    if (!user) {
        throw new Error(messages_1.MESSAGES.AUTH.NO_PENDING_REGISTRATION);
    }
    await (0, otpService_1.createAndSendOtp)(email, enums_1.OtpPurpose.REGISTRATION);
    return { message: messages_1.MESSAGES.AUTH.OTP_RESENT };
};
exports.resendRegistrationOtp = resendRegistrationOtp;
//# sourceMappingURL=authService.js.map