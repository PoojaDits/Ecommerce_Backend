"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const messages_1 = require("../constants/messages");
exports.verifyOtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': messages_1.MESSAGES.VALIDATION.EMAIL_INVALID,
        'any.required': messages_1.MESSAGES.VALIDATION.EMAIL_REQUIRED
    }),
    otp: joi_1.default.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.length': messages_1.MESSAGES.VALIDATION.OTP_LENGTH,
        'string.pattern.base': messages_1.MESSAGES.VALIDATION.OTP_NUMERIC,
        'any.required': messages_1.MESSAGES.VALIDATION.OTP_REQUIRED
    })
});
//# sourceMappingURL=authValidator.js.map