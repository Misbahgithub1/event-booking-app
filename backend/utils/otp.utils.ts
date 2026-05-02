import Otp, { OtpPurpose } from "../model/OTP.js";
import jwt, { SignOptions } from "jsonwebtoken";

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const deleteVerificationOtps = async (email: string) => {
  await Otp.deleteMany({
    email,
    purpose: OtpPurpose.OTP_VERIFICATION,
  });
};


export const generateToken = (userId: string, role: string) => {

//  Generate JWT Token

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}


  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"], 
  };

  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    options
  );
};