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

import { API_BASE_URL } from "@/lib/api-config";

const USER_STORAGE_KEY = "mamcare.auth.user";
const TOKEN_STORAGE_KEY = "mamcare.auth.token";

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
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = `Authentication failed: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          const text = await response.text().catch(() => "");
          if (text) {
            errorMessage = text;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.token || !data.user) {
        throw new Error("Invalid response from server: missing token or user data");
      }
      return data as { token: string; user: AuthUser };
    } catch (error) {
      // Handle network errors or other fetch failures
      if (error instanceof TypeError && (error.message.includes("fetch") || error.message.includes("Failed to fetch"))) {
        throw new Error(`Unable to connect to server. Please check if the backend is running at ${API_BASE_URL}`);
      }
      // Re-throw other errors (including our custom Error)
      throw error;
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    const { token: nextToken, user: nextUser } = await performAuthRequest("/api/auth/signup", payload);
    persistSession(nextUser, nextToken);
  };

  const login = async (payload: LoginPayload) => {
    try {
      const { token: nextToken, user: nextUser } = await performAuthRequest("/api/auth/login", payload);
      if (!nextToken || !nextUser) {
        throw new Error("Invalid response from server");
      }
      persistSession(nextUser, nextToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
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

