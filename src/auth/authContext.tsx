import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { AuthUser, LoginRequest, RegisterRequest } from "../types/auth";
import {
  clearToken,
  getToken,
  loginRequest,
  meRequest,
  registerRequest,
  saveToken,
} from "./authApi";

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  loadingSession: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const nextToken = await loginRequest(payload);
    saveToken(nextToken);
    setToken(nextToken);
    const me = await meRequest(nextToken);
    setUser(me);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const nextToken = await registerRequest(payload);
    saveToken(nextToken);
    setToken(nextToken);
    const me = await meRequest(nextToken);
    setUser(me);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoadingSession(false);
      return;
    }

    meRequest(token)
      .then((me) => setUser(me))
      .catch(() => logout())
      .finally(() => setLoadingSession(false));
  }, [logout, token]);

  return (
    <AuthContext.Provider
      value={{ token, user, loadingSession, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}