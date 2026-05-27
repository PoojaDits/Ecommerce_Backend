import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../config/logger";
import { OtpPurpose } from "../enums";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const getEmailContent = (
  otp: string,
  purpose: OtpPurpose
): { subject: string; html: string } => {
  switch (purpose) {
    case OtpPurpose.REGISTRATION:
      return {
        subject: "Verify Your Email - Complete Registration",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #333;">Welcome! 🎉</h2>
            <p style="color: #555; font-size: 15px;">
              Thank you for registering. Use the OTP below to verify your email and complete your registration.
            </p>
            <div style="background: #f4f4f4; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #222;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 13px;">
              This OTP expires in <strong>10 minutes</strong>.<br>
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `,
      };

    case OtpPurpose.FORGOT_PASSWORD:
      return {
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #333;">Forgot Your Password? 🔐</h2>
            <p style="color: #555; font-size: 15px;">
              We received a request to reset your password. Use the OTP below to proceed.
            </p>
            <div style="background: #f4f4f4; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #222;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 13px;">
              This OTP expires in <strong>10 minutes</strong>.<br>
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        `,
      };

    default:
      return {
        subject: "Your OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <div style="background: #f4f4f4; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #222;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 13px;">
              This OTP expires in <strong>10 minutes</strong>.
            </p>
          </div>
        `,
      };
  }
};

export const sendOtpEmail = async (
  toEmail: string,
  otp: string,
  purpose: OtpPurpose = OtpPurpose.REGISTRATION
): Promise<void> => {
  try {
    const { subject, html } = getEmailContent(otp, purpose);

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: toEmail,
      subject,
      html,
    });

    logger.info(`OTP email sent to ${toEmail} for purpose: ${purpose}`);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "unknown error";
    logger.error(`Failed to send OTP email to ${toEmail}: ${reason}`);
    throw new Error(
      "We encountered an issue sending the verification email. Please check your email configuration."
    );
  }
};
