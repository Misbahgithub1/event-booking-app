import express, { Router } from "express";
import { registerUser, loginUser, verifyOtp } from "../controller/authController.js";

const router: Router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);
// verifyOtp
router.post("/verify-otp", verifyOtp)

export default router;