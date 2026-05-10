import bcrypt from "bcryptjs";
import { sendEmail, EmailType } from "../utils/sendEmail.js";
import { hashPassword } from "../utils/hashPassword.js";
import {
  generateOtp,
  deleteVerificationOtps,
} from "../utils/otp.utils.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils.js";

import Otp, { OtpPurpose } from "../model/OTP.js";
import User from "../model/User.js";

// OTP EXPIRY CONFIGURATION
const OTP_EXPIRY = 5 * 60 * 1000;

/* ===============================
   REGISTER SERVICE
================================ */

export const registerService = async (
  fullName: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("USER_EXISTS");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    isVerified: false,
    role: "user",
  });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY);

  await Otp.create({
    email,
    otp,
    purpose: OtpPurpose.OTP_VERIFICATION,
    expiresAt,
  });

  await sendEmail({
    to: email,
    type: EmailType.OTP_VERIFICATION,
    otp,
    expiresAt,
  });

  return user;
};

/* ===============================
   VERIFY OTP SERVICE
================================ */

export const verifyOtpService = async (
  email: string,
  otp: string
) => {
  const validOtp = await Otp.findOne({
    email,
    otp,
    purpose: OtpPurpose.OTP_VERIFICATION,
    expiresAt: { $gt: new Date() },
  });

  if (!validOtp) {
    throw new Error("INVALID_OR_EXPIRED_OTP");
  }

  await User.updateOne({ email }, { isVerified: true });

  await deleteVerificationOtps(email);

  return true;
};

/* ===============================
   RESEND OTP SERVICE
================================ */

export const resendOtpService = async (
  email: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.isVerified) {
    throw new Error("ALREADY_VERIFIED");
  }

  await deleteVerificationOtps(email);

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY);

  await Otp.create({
    email,
    otp,
    purpose: OtpPurpose.OTP_VERIFICATION,
    expiresAt,
  });

  await sendEmail({
    to: email,
    type: EmailType.OTP_VERIFICATION,
    otp,
    expiresAt,
  });

  return true;
};

/* ===============================
   LOGIN SERVICE (UPDATED)
================================ */

export const loginService = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!user.isVerified && user.role === "user") {
    throw new Error("NOT_VERIFIED");
  }

  //   TOKEN LOGIC
  const accessToken = generateAccessToken(
    user._id.toString(),
    user.role
  );

  const refreshToken = generateRefreshToken(
    user._id.toString()
  );

  return {
    user: user.toObject(),
    accessToken,
    refreshToken,
  };
};