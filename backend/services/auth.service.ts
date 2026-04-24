
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Otp, { OtpPurpose } from "../model/otp.js";
import { sendEmail, EmailType } from "../utils/sendEmail.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateOtp } from "../utils/generateOtp.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/index.js";

// ======================================================
// OTP EXPIRY CONFIGURATION
// Ye constant OTP ki expiry time define karta hai (5 minutes)
// ======================================================

const OTP_EXPIRY = 5 * 60 * 1000;

// ======================================================
// REGISTER SERVICE
// Ye service naya user register karti hai,
// password hash karti hai,
// OTP generate karti hai,
// aur verification email send karti hai
// ======================================================

export const registerService = async (email: string, password: string) => {

  // -------------------------------
  // CHECK IF USER ALREADY EXISTS
  // -------------------------------
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("USER_EXISTS");
  }

  // -------------------------------
  // HASH USER PASSWORD
  // -------------------------------
  const hashedPassword = await hashPassword(password);

  // -------------------------------
  // CREATE NEW USER (UNVERIFIED)
  // -------------------------------
  const user = await User.create({
    email,
    password: hashedPassword,
    isVerified: false,
    role: "user",
  });

  // -------------------------------
  // GENERATE OTP AND SET EXPIRY
  // -------------------------------
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY);

  // -------------------------------
  // SAVE OTP IN DATABASE
  // -------------------------------
  await Otp.create({
    email,
    otp,
    purpose: OtpPurpose.OTP_VERIFICATION,
    expiresAt,
  });

  // -------------------------------
  // SEND OTP EMAIL TO USER
  // -------------------------------
  await sendEmail({
    to: email,
    type: EmailType.OTP_VERIFICATION,
    otp,
    expiresAt,
  });

  // -------------------------------
  // RETURN CREATED USER
  // -------------------------------
  return user;
};

// ======================================================
// END OF REGISTER SERVICE
// ======================================================



// ======================================================
// LOGIN SERVICE
// Ye service user login handle karti hai,
// credentials verify karti hai,
// aur verified hone par JWT token generate karti hai
// ======================================================




// ------------------------
// VERIFY OTP SERVICE
// ------------------------
export const verifyOtpService = async (email: string, otp: string) => {

  // Check valid active non expired otp
  const validOtp = await Otp.findOne({
    email,
    otp,
    purpose: OtpPurpose.OTP_VERIFICATION,
    expiresAt: { $gt: new Date() }
  })

  if (!validOtp) {
    throw new Error("INVALID_OR_EXPIRED_OTP")
  }

  // Mark user as verified
  await User.updateOne({ email }, { isVerified: true })

  // Delete all old otps for this user
  await Otp.deleteMany({ email, purpose: OtpPurpose.OTP_VERIFICATION })

  return true
}



export const loginService = async (email: string, password: string) => {

  // -------------------------------
  // FIND USER BY EMAIL
  // -------------------------------
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // -------------------------------
  // COMPARE PASSWORD WITH HASHED PASSWORD
  // -------------------------------
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // ==================================================
  // NOT VERIFIED FLOW
  // Agar user verify nahi hai to:
  // - Purane OTP delete karo
  // - Naya OTP generate karo
  // - Email send karo
  // - Error throw karo
  // ==================================================

  if (!user.isVerified && user.role === "user") {

    // DELETE OLD OTPs
    await Otp.deleteMany({
      email,
      purpose: OtpPurpose.OTP_VERIFICATION,
    });

    // GENERATE NEW OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY);

    // SAVE NEW OTP
    await Otp.create({
      email,
      otp,
      purpose: OtpPurpose.OTP_VERIFICATION,
      expiresAt,
    });

    // SEND OTP EMAIL
    await sendEmail({
      to: email,
      type: EmailType.OTP_VERIFICATION,
      otp,
      expiresAt,
    });

    throw new Error("NOT_VERIFIED");
  }

  // ==================================================
  // VERIFIED USER FLOW
  // Agar user verified hai to JWT token generate karo
  // ==================================================

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  // RETURN USER AND TOKEN
  return { user, token };
};

// ======================================================
// END OF LOGIN SERVICE
// ======================================================