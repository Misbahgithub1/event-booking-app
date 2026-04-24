import { SignOptions } from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];