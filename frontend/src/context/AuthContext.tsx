"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";

export type PublicUser = { id: string; username: string; email: string; role: "user" | "admin"; totalPoints: number; currentStreak: number; longestStreak: number };
type AuthContextValue = { user: PublicUser | null; loading: boolean; refresh: () => Promise<void>; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    try { const { data } = await api.get("/api/auth/me"); setUser(data.user); }
    catch { setUser(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const logout = async () => { await api.post("/api/auth/logout"); setUser(null); window.location.href = "/"; };
  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
