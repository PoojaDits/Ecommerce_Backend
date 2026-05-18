import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

export const sendOtpEmail = async (
    toEmail: string,
    otp: string,

): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: toEmail,
            subject: "Your OTP Code",
            html:`
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
    } catch (error: any) {
        console.error("Failed to send OTP email via SMTP:", error);
        throw new Error("We encountered an issue sending the verification email. Please check your email configuration.");
    }
};