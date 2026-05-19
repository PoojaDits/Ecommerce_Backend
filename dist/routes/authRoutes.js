"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
router.post("/register", authController_1.registerInitiate);
router.post("/verify-otp", authController_1.registerVerifyOtp);
router.post("/resend-otp", authController_1.resendOtp);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map