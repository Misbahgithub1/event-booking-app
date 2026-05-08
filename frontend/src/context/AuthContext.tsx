import {
  createContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { clearToken, setToken } from "../utils/token";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Async login with loading
  const login = useCallback(
    async (token: string, userData: any) => {
      setLoading(true);
      try {
        setToken(token);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};