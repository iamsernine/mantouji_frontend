"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getStoredUser, type StoredAuthUser } from "@/lib/auth-storage";
import { bootstrapAuthSession, subscribeSessionExpired } from "@/lib/auth-session";
import { login as apiLogin, logout as apiLogout, roleFromStored } from "@/lib/auth";
import type { Role } from "@/types/api";

type AuthContextValue = {
  user: StoredAuthUser | null;
  role: Role | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<Role>;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredAuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refreshUser = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const ok = await bootstrapAuthSession();
      if (cancelled) return;
      setUser(ok ? getStoredUser() : null);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => subscribeSessionExpired(() => setUser(null)), []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    const stored = getStoredUser();
    setUser(stored);
    return roleFromStored(data.user.role);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user ? roleFromStored(user.role) : null,
      ready,
      login,
      logout,
      refreshUser,
    }),
    [user, ready, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
