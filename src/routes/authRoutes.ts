import { Router } from "express";
import {
  registerInitiate,
  registerVerifyOtp,
  resendOtp
} from "../controller/authController";

const router = Router();


router.post("/register", registerInitiate);
router.post("/verify-otp", registerVerifyOtp);
router.post("/resend-otp", resendOtp);



export default router;