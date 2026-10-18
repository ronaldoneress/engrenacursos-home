"use client";

import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string;
  login: (user: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_CREDENTIALS = [
  { user: "admin", password: "engrena2026" },
  { user: "instrutor", password: "engrena2026" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("engrena_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsAuthenticated(true);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem("engrena_auth");
      }
    }
    setHydrated(true);
  }, []);

  const login = useCallback((loginUser: string, password: string): boolean => {
    const valid = VALID_CREDENTIALS.find(
      (c) =>
        c.user === loginUser.toLowerCase().trim() && c.password === password
    );
    if (valid) {
      const userName =
        valid.user === "admin" ? "Administração" : "Instrutor";
      setIsAuthenticated(true);
      setUser(userName);
      localStorage.setItem(
        "engrena_auth",
        JSON.stringify({ user: userName })
      );
      localStorage.setItem("engrena_token", "engrena-admin-token-2026");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser("");
    localStorage.removeItem("engrena_auth");
    localStorage.removeItem("engrena_token");
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
