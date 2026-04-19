import express, { Router } from "express";
import { registerUser, loginUser } from "../controller/authController.js";

const router: Router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

export default router;