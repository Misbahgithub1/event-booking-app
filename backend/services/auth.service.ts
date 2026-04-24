import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Otp, { OtpPurpose } from "../model/otp.js";
import { sendEmail, EmailType } from "../utils/sendEmail.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateOtp } from "../utils/generateOtp.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/index.js";

const OTP_EXPIRY = 5 * 60 * 1000;

// ------------------------
// REGISTER SERVICE
// ------------------------

export const registerService = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("USER_EXISTS");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
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

// ------------------------
// LOGIN SERVICE
// ------------------------

export const loginService = async (email: string, password: string) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  //  NOT VERIFIED FLOW
  if (!user.isVerified && user.role === "user") {

    await Otp.deleteMany({
      email,
      purpose: OtpPurpose.OTP_VERIFICATION,
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

    throw new Error("NOT_VERIFIED");
  }

  //  VERIFIED → generate token
 const token = jwt.sign(
  { userId: user._id, role: user.role },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN as any }
);

  return { user, token };
};