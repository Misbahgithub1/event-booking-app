import express, { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  refreshAccessToken,
  getMe, 
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";


const router: Router = express.Router();

// ===============================
//  POST /api/auth/register
// ===============================
router.post("/register", registerUser);

// ===============================
//  POST /api/auth/login
// ===============================
router.post("/login", loginUser);

// ===============================
//  POST /api/auth/verify-otp
// ===============================
router.post("/verify-otp", verifyOtp);

// ===============================
//  POST /api/auth/resend-otp
// ===============================
router.post("/resend-otp", resendOtp);

// ===============================
//   POST /api/auth/refresh
// ===============================
router.get("/refresh", refreshAccessToken);

router.get("/me", protect, getMe);

export default router;