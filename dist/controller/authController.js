"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.resendOtp = exports.registerVerifyOtp = exports.registerInitiate = void 0;
const authService_1 = require("../services/authService");
const authValidator_1 = require("../validators/authValidator");
const messages_1 = require("../constants/messages");
const registerInitiate = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ success: false, message: messages_1.MESSAGES.VALIDATION.ALL_FIELDS_REQUIRED });
            return;
        }
        const validRoles = ["admin", "customer", "vendor"];
        if (role && !validRoles.includes(role)) {
            res.status(400).json({
                success: false,
                message: messages_1.MESSAGES.VALIDATION.INVALID_ROLE(validRoles.join(", "))
            });
            return;
        }
        const result = await (0, authService_1.initiateRegistration)(firstName, lastName, email, password, role);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.registerInitiate = registerInitiate;
const registerVerifyOtp = async (req, res) => {
    try {
        const { error } = authValidator_1.verifyOtpSchema.validate(req.body);
        if (error) {
            res.status(400).json({ success: false, message: error.details?.[0]?.message || messages_1.MESSAGES.VALIDATION.FAILED });
            return;
        }
        const { email, otp } = req.body;
        const result = await (0, authService_1.completeRegistration)(email, otp);
        res.status(201).json({ success: true, ...result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.registerVerifyOtp = registerVerifyOtp;
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: messages_1.MESSAGES.VALIDATION.EMAIL_REQUIRED });
            return;
        }
        const result = await (0, authService_1.resendRegistrationOtp)(email);
        res.status(200).json({ success: true, ...result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.resendOtp = resendOtp;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: messages_1.MESSAGES.VALIDATION.ALL_FIELDS_REQUIRED,
            });
            return;
        }
        const result = await (0, authService_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map