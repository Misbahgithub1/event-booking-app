
import bcrypt from "bcryptjs";
import User from "../model/user.js";
import Otp, { OtpPurpose } from "../model/otp.js";
import { sendEmail, EmailType } from "../utils/sendEmail.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateOtp, deleteVerificationOtps, generateToken } from "../utils/otp.utils.js";


// ======================================================
// OTP EXPIRY CONFIGURATION
// ======================================================

const OTP_EXPIRY = 5 * 60 * 1000;


// ======================================================
// REGISTER SERVICE
// ======================================================

export const registerService = async (email: string, password: string) => {

  
  // CHECK IF USER ALREADY EXISTS
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("USER_EXISTS");
  }

 
  // HASH USER PASSWORD
  const hashedPassword = await hashPassword(password);


  // CREATE NEW USER (UNVERIFIED)
  const user = await User.create({
    email,
    password: hashedPassword,
    isVerified: false,
    role: "user",
  });


  // GENERATE OTP AND SET EXPIRY
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY);


  // SAVE OTP IN DATABASE
  await Otp.create({
    email,
    otp,
    purpose: OtpPurpose.OTP_VERIFICATION,
    expiresAt,
  });

  // SEND OTP EMAIL TO USER
  await sendEmail({
    to: email,
    type: EmailType.OTP_VERIFICATION,
    otp,
    expiresAt,
  });


  // RETURN CREATED USER
  return user;
};

// ======================================================
// END OF REGISTER SERVICE
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

  await deleteVerificationOtps(email)

  return true
}


// ======================================================
// END OF OTP SERVICE
// ======================================================


// ======================================================
// LOGIN SERVICE
// ======================================================

export const loginService = async (email: string, password: string) => {


  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }


  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }


  if (!user.isVerified && user.role === "user") {

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

    throw new Error("NOT_VERIFIED");
  }


  //  VERIFIED USER FLOW
  const token = generateToken(
    user._id.toString(),
    user.role
  );

  const userObj = user.toObject();

  return {
    user: userObj,
    token,
  };
};

// ======================================================
// END OF LOGIN SERVICE
// ======================================================