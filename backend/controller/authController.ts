import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import { sendEmail, EmailType } from "../model/utils/sendEmail.js"; 
import Otp, { OtpPurpose } from "../model/otp.js";


// ------------------------
// REGISTER USER + OTP FLOW
// ------------------------


export const registerUser = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((e) => e.message),
      });
    }

    const { email, password } = result.data;

    // 2. Check user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user (not verified)
    const user = await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
      role: "user",
    });

    // 5. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 6. Save OTP
    await Otp.create({
      email,
      otp,
      purpose: OtpPurpose.OTP_VERIFICATION,
      expiresAt,
    });

    // 7. Send Email
    await sendEmail({
      to: email,
      type: EmailType.OTP_VERIFICATION,
      otp,
      expiresAt,
    });

    // 8. Response
    return res.status(201).json({
      message: "User registered. OTP sent to email.",
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

// ------------------------
// LOGIN USER
// ------------------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map(e => e.message),
      });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};