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

const USER_STORAGE_KEY = "mamacare.auth.user";
const PROFILE_STORAGE_KEY = "mamacare.profile";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const persistSession = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      // Generate a simple token for compatibility
      localStorage.setItem("mamacare.auth.token", `local-${Date.now()}`);
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem("mamacare.auth.token");
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    // Store user in localStorage - no backend needed
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email.toLowerCase().trim(),
    };
    persistSession(newUser);
    // No need to await or throw errors - instant local storage
  };

  const login = async (payload: LoginPayload) => {
    // Check if user exists in localStorage or create new one
    const existingUser = localStorage.getItem(USER_STORAGE_KEY);
    if (existingUser) {
      const user = JSON.parse(existingUser) as AuthUser;
      if (user.email.toLowerCase().trim() === payload.email.toLowerCase().trim()) {
        persistSession(user);
        return;
      }
    }
    
    // If no existing user, create one (simple login without backend)
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      firstName: payload.email.split("@")[0], // Use email prefix as first name
      lastName: "",
      email: payload.email.toLowerCase().trim(),
    };
    persistSession(newUser);
  };

  const logout = () => {
    persistSession(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token: user ? localStorage.getItem("mamacare.auth.token") : null,
      isAuthenticated: Boolean(user),
      loading,
      signUp,
      login,
      logout,
    }),
    [user, loading]
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

