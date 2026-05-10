import jwt, { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (
  userId: string,
  role: string
) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const JWT_EXPIRES_IN =
    process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"];

  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = (userId: string) => {
  const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET as string;

  const JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"];

  return jwt.sign(
    { id: userId },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};