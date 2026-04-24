import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import { registerService, loginService } from "../services/auth.service.js";
import { Request, Response, NextFunction } from "express";

// ------------------------
// REGISTER CONTROLLER
// ------------------------

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map(e => e.message),
      });
    }

    const { email, password } = result.data;

    try {
      await registerService(email, password);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "USER_EXISTS") {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      throw err;
    }

    return res.status(201).json({
      message: "User registered. OTP sent to email.",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ------------------------
// LOGIN CONTROLLER
// ------------------------

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map(e => e.message),
      });
    }

    const { email, password } = result.data;

    let data;

    try {
      data = await loginService(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "INVALID_CREDENTIALS") {
          return res.status(400).json({
            message: "Invalid credentials",
          });
        }

        if (err.message === "NOT_VERIFIED") {
          return res.status(403).json({
            message: "Account not verified. OTP sent to email.",
          });
        }
      }

      throw err;
    }

    return res.status(200).json({
      message: "Login successful",
      token: data.token,
      user: {
        id: data.user._id,
       
        email: data.user.email,
        role: data.user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};