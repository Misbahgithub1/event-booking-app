import Otp, { OtpPurpose } from "../model/OTP.js";

//  Generate OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//  Delete verification OTPs
export const deleteVerificationOtps = async (email: string) => {
  await Otp.deleteMany({
    email,
    purpose: OtpPurpose.OTP_VERIFICATION,
  });
};