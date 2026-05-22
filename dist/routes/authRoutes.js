"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Initiate new user and send OTP
 *     tags:
 *     - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *            $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", authController_1.registerInitiate);
/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify email otp to complete registration
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       201:
 *         description: Registration completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/verify-otp", authController_1.registerVerifyOtp);
/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtpRequest'
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: No pending registration found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/resend-otp", authController_1.resendOtp);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Account not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", authController_1.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map