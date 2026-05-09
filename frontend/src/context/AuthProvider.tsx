import {
  useState,
  ReactNode,
  useCallback,
} from "react";

import { clearToken, setToken } from "../utils/token";
import {
  loginUser,
  registerUser,
  verifyOtp,
} from "../api/auth.api";
import { AuthContext } from "./AuthContext";
import { User } from "../types/auth.types";

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


const login = useCallback(
  async (email: string, password: string) => {
    setLoading(true);

    try {
      const { token, user } = await loginUser({ email, password });

      setToken(token);
      setUser(user);

      return { token, user };
    } finally {
      setLoading(false);
    }
  },
  []
);





  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);

    try {
      return await registerUser({ email, password });
    } finally {
      setLoading(false);
    }
  }, []);

  const verify = useCallback(async (email: string, otp: string) => {
    setLoading(true);

    try {
      return await verifyOtp({ email, otp });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verify,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};