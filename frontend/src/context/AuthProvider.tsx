import {
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

import {
  loginUser,
  registerUser,
  verifyOtp,
  refreshAccessToken,
} from "../api/auth.api";

import { clearToken, setToken } from "../utils/token";
import { AuthContext } from "./AuthContext";
import { User } from "../types/auth.types";
import axiosInstance from "../api/axiosInstance";

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await refreshAccessToken();
        setToken(token);

        // Optional: Fetch user profile endpoint
        const response = await axiosInstance.get(
          "/auth/me"
        );

        setUser(response.data.data);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken, user } = await loginUser({
        email,
        password,
      });

      setToken(accessToken);
      setUser(user);

      return { accessToken, user };
    },
    []
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string
    ) => {
      return await registerUser({
        fullName,
        email,
        password,
      });
    },
    []
  );

  const verify = useCallback(
    async (email: string, otp: string) => {
      return await verifyOtp({ email, otp });
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    window.location.href = "/login";
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