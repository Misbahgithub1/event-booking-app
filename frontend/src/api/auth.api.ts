import axiosInstance from "./axiosInstance";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};