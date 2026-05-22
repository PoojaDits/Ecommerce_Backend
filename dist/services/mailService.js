"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../config/logger"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const sendOtpEmail = async (toEmail, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: toEmail,
            subject: "Your OTP Code",
            html: `
             <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
            <h2>Verify your email</h2>
            <p>Use the OTP below to complete your registration. It expires in <strong>10 minutes</strong>.</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; padding: 16px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 13px;">If you didn't request this, you can ignore this email.</p>
          </div>
          `,
        });
        logger_1.default.info(`OTP email sent to ${toEmail}`);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(`Failed to send OTP email to ${toEmail}: ${error.message}`);
        }
        else {
            logger_1.default.error(`Failed to send OTP email to ${toEmail}`);
        }
        throw new Error("We encountered an issue sending the verification email. Please check your email configuration.");
    }
};
exports.sendOtpEmail = sendOtpEmail;
//# sourceMappingURL=mailService.js.map