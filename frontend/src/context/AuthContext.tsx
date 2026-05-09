import { createContext } from "react";
import { User } from "../types/auth.types";
export interface AuthContextType {
  user: User | null;
  loading: boolean;



 login: (
  email: string,
  password: string
) => Promise<{
  token: string;
  user: User;
}>;

  register: (
    fullName: string,
email: string,
 password: string
) => Promise<User>;
  verify: (email: string, otp: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);