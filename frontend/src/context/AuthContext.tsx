import {
  createContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { clearToken, setToken } from "../utils/token";
import { loginUser, registerUser, verifyOtp } from "../api/auth.api";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  verify: (email: string, otp: string) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * ✅ Login
   */
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const data = await loginUser({ email, password });

        setToken(data.token);
        setUser(data.user);

        return data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * ✅ Register
   */
  const register = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const data = await registerUser({ email, password });
        return data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * ✅ Verify OTP
   */
  const verify = useCallback(
    async (email: string, otp: string) => {
      setLoading(true);
      try {
        const data = await verifyOtp({ email, otp });
        return data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * ✅ Logout
   */
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