import { createContext } from "react";
import { User } from "../types/auth.types";

export interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{
    accessToken: string;
    user: User;
  }>;

  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;

  verify: (
    email: string,
    otp: string
  ) => Promise<void>;

  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);