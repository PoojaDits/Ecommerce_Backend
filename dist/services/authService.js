"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.resendRegistrationOtp = exports.completeRegistration = exports.initiateRegistration = void 0;
const dataSource_1 = require("../config/dataSource");
const User_1 = require("../entities/User");
const enums_1 = require("../enums");
const otpService_1 = require("./otpService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const messages_1 = require("../constants/messages");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../config/logger"));
const userRepo = dataSource_1.AppDataSource.getRepository(User_1.User);
const initiateRegistration = async (firstName, lastName, email, password, role) => {
    const checkUser = await userRepo.findOne({
        where: { email }
    });
    if (checkUser?.isActive) {
        logger_1.default.warn(`Registration blocked because email already exists: ${email}`);
        throw new Error(messages_1.MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED);
    }
    if (checkUser && !checkUser.isActive) {
        logger_1.default.info(`Deleting old inactive user before new registration: ${email}`);
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
    logger_1.default.info(`User created successfully: ${email}`);
    try {
        await (0, otpService_1.createAndSendOtp)(email, enums_1.OtpPurpose.REGISTRATION);
        logger_1.default.info(`Registration OTP sent for ${email}`);
    }
    catch (error) {
        await userRepo.delete({ id: user.id });
        logger_1.default.error(`Registration failed while sending OTP for ${email}`);
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
        logger_1.default.warn(`Registration session not found for ${email}`);
        throw new Error(messages_1.MESSAGES.AUTH.REGISTRATION_SESSION_NOT_FOUND);
    }
    user.isActive = true;
    await userRepo.save(user);
    logger_1.default.info(`User activated successfully: ${email}`);
    try {
        await (0, otpService_1.consumeOtp)(email, enums_1.OtpPurpose.REGISTRATION, otp);
    }
    catch (error) {
        user.isActive = false;
        await userRepo.save(user);
        logger_1.default.error(`Failed to consume OTP for ${email}`);
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
        logger_1.default.warn(`No pending registration found for ${email}`);
        throw new Error(messages_1.MESSAGES.AUTH.NO_PENDING_REGISTRATION);
    }
    await (0, otpService_1.createAndSendOtp)(email, enums_1.OtpPurpose.REGISTRATION);
    logger_1.default.info(`OTP resent for ${email}`);
    return { message: messages_1.MESSAGES.AUTH.OTP_RESENT };
};
exports.resendRegistrationOtp = resendRegistrationOtp;
const loginUser = async (email, password) => {
    const user = await userRepo.findOne({
        where: { email }
    });
    if (!user) {
        logger_1.default.warn(`Login failed for ${email}: user not found`);
        throw new Error(messages_1.MESSAGES.AUTH.INVALID_CREDENTIALS);
    }
    if (!user.isActive) {
        logger_1.default.warn(`Login failed for ${email}: account not verified`);
        throw new Error(messages_1.MESSAGES.AUTH.ACCOUNT_NOT_VERIFIED);
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        logger_1.default.warn(`Login failed for ${email}: invalid password`);
        throw new Error(messages_1.MESSAGES.AUTH.INVALID_CREDENTIALS);
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    logger_1.default.info(`JWT token generated for ${email}`);
    const authUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
    };
    return {
        message: messages_1.MESSAGES.AUTH.LOGIN_SUCCESS,
        user: authUser,
        token,
    };
};
exports.loginUser = loginUser;
//# sourceMappingURL=authService.js.map