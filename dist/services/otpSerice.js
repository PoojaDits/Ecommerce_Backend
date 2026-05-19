"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeOtp = exports.verifyOtp = exports.createAndSendOtp = void 0;
const dataSource_1 = require("../config/dataSource");
const Otp_1 = require("../entities/Otp");
const mailService_1 = require("./mailService");
const crypto_1 = __importDefault(require("crypto"));
const messages_1 = require("../constants/messages");
const otpRepo = dataSource_1.AppDataSource.getRepository(Otp_1.Otp);
const generateOtpCode = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
const createAndSendOtp = async (userEmail, purpose) => {
    await otpRepo.update({
        userEmail: userEmail, purpose, is_used: false
    }, {
        is_used: true
    });
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const otp = otpRepo.create({
        code,
        expiresAt,
        is_used: false,
        userEmail: userEmail,
        purpose,
        user: null,
    });
    await otpRepo.save(otp);
    try {
        await (0, mailService_1.sendOtpEmail)(userEmail, code);
    }
    catch (error) {
        await otpRepo.delete({ id: otp.id });
        throw error;
    }
};
exports.createAndSendOtp = createAndSendOtp;
const verifyOtp = async (userEmail, purpose, code) => {
    const otp = await otpRepo.findOne({
        where: { userEmail: userEmail, purpose, code, is_used: false },
    });
    if (!otp) {
        throw new Error(messages_1.MESSAGES.OTP.INVALID);
    }
    if (new Date() > new Date(otp.expiresAt)) {
        throw new Error(messages_1.MESSAGES.OTP.EXPIRED);
    }
    return true;
};
exports.verifyOtp = verifyOtp;
const consumeOtp = async (userEmail, purpose, code) => {
    const otp = await otpRepo.update({ userEmail: userEmail, purpose, code, is_used: false }, { is_used: true });
};
exports.consumeOtp = consumeOtp;
//# sourceMappingURL=otpSerice.js.map