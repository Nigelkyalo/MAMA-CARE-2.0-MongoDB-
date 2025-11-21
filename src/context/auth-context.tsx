import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (payload: SignUpPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = "mamcare.auth.user";
const TOKEN_STORAGE_KEY = "mamcare.auth.token";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const persistSession = (nextUser: AuthUser | null, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);

    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  const performAuthRequest = async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || "Authentication failed. Please try again.");
    }

    return response.json() as Promise<{ token: string; user: AuthUser }>;
  };

  const signUp = async (payload: SignUpPayload) => {
    const { token: nextToken, user: nextUser } = await performAuthRequest("/api/auth/signup", payload);
    persistSession(nextUser, nextToken);
  };

  const login = async (payload: LoginPayload) => {
    const { token: nextToken, user: nextUser } = await performAuthRequest("/api/auth/login", payload);
    persistSession(nextUser, nextToken);
  };

  const logout = () => {
    persistSession(null, null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loading,
      signUp,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

