import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../config/logger";

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

export const sendOtpEmail = async (
  toEmail: string,
  otp: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: toEmail,
      subject: "Your OTP Code",
      html: `
        <h2>Verify your email</h2>
        <p>Use the OTP below to complete your registration. It expires in <b>10 minutes</b>.</p>
        <h1>${otp}</h1>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "unknown error";
    logger.error(`Failed to send OTP email to ${toEmail}: ${reason}`);
    throw new Error(
      "We encountered an issue sending the verification email. Please check your email configuration."
    );
  }
};
