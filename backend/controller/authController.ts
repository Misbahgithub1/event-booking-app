import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import {
  registerService,
  loginService,
  verifyOtpService,
} from "../services/auth.service.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(
        400,
        result.error.issues.map((e) => e.message).join(", ")
      );
    }

    const { email, password } = result.data;

    try {
      await registerService(email, password);
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

    let data: any;

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

    sendResponse({
      res,
      statusCode: 200,
      message: "Login successful",
      data: {
        token: data.token,
        user: {
          id: data.user._id,
          email: data.user.email,
          role: data.user.role,
        },
      },
    });
  }
);