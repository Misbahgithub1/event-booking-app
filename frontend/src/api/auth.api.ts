import axiosInstance from "./axiosInstance";

/**
 * ✅ Register User
 */
export const registerUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

/**
 * ✅ Verify OTP
 */
export const verifyOtp = async (data: {
  email: string;
  otp: string;
}) => {
  const response = await axiosInstance.post("/auth/verify-otp", data);
  return response.data;
};

/**
 * ✅ Login User
 */
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};