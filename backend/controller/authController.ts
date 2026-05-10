import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import {
  registerService,
  loginService,
  verifyOtpService,
  resendOtpService,
} from "../services/auth.service.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { generateAccessToken } from "../utils/token.utils.js";

/* ===============================
   ✅ REGISTER
================================ */

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        result.error.issues.map((e) => e.message).join(", ")
      );
    }

    const { fullName, email, password } = result.data;

    try {
      await registerService(fullName, email, password);
    } catch (err: any) {
      if (err?.message === "USER_EXISTS") {
        throw new ApiError(400, "User already exists");
      }
      throw err;
    }

    sendResponse({
      res,
      statusCode: 201,
      message: "User registered. OTP sent to email.",
      data: { email },
    });
  }
);

/* ===============================
   ✅ VERIFY OTP
================================ */

export const verifyOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    try {
      await verifyOtpService(email, otp);
    } catch (err: any) {
      if (err?.message === "INVALID_OR_EXPIRED_OTP") {
        throw new ApiError(400, "Invalid or expired OTP");
      }
      throw err;
    }

    sendResponse({
      res,
      statusCode: 200,
      message: "Account verified successfully. Now you can login.",
    });
  }
);

/* ===============================
   ✅ RESEND OTP
================================ */

export const resendOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    try {
      await resendOtpService(email);
    } catch (err: any) {
      if (err?.message === "USER_NOT_FOUND") {
        throw new ApiError(404, "User not found");
      }

      if (err?.message === "ALREADY_VERIFIED") {
        throw new ApiError(
          400,
          "Account already verified. Please login."
        );
      }

      throw err;
    }

    sendResponse({
      res,
      statusCode: 200,
      message: "OTP resent successfully",
    });
  }
);

/* ===============================
   ✅ REFRESH ACCESS TOKEN
================================ */

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "No refresh token provided");
    }

    let decoded: { id: string };

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { id: string };
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const newAccessToken = generateAccessToken(
      user._id.toString(),
      user.role
    );

    sendResponse({
      res,
      statusCode: 200,
      message: "Access token refreshed",
      data: {
        accessToken: newAccessToken,
      },
    });
  }
);

/* ===============================
   ✅ LOGIN (WITH REFRESH FLOW)
================================ */

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        result.error.issues.map((e) => e.message).join(", ")
      );
    }

    const { email, password } = result.data;

    let data;

    try {
      data = await loginService(email, password);
    } catch (err: any) {
      if (err?.message === "INVALID_CREDENTIALS") {
        throw new ApiError(400, "Invalid credentials");
      }

      if (err?.message === "NOT_VERIFIED") {
        throw new ApiError(
          403,
          "Account not verified. OTP sent to email."
        );
      }

      throw err;
    }

    // ✅ Set Refresh Token Cookie
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendResponse({
      res,
      statusCode: 200,
      message: "Login successful",
      data: {
        accessToken: data.accessToken,
        user: {
          id: data.user._id,
          email: data.user.email,
          role: data.user.role,
        },
      },
    });
  }
);


export const getMe = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    sendResponse({
      res,
      statusCode: 200,
      data: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
      },
    });
  }
);