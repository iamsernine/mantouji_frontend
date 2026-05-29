const ACCESS_KEY = "mantouji_access_token";
const REFRESH_KEY = "mantouji_refresh_token";
const USER_KEY = "mantouji_auth_user";

import type { PreferredLanguage } from "@/lib/locale-preference";

export type StoredAuthUser = {
  id: string;
  nom: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  cooperativeProfileId?: string | null;
  avatarUrl?: string | null;
  preferredLanguage?: PreferredLanguage;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): StoredAuthUser | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    return null;
  }
}

function setAuthCookie(active: boolean) {
  if (!canUseStorage()) return;
  if (active) {
    document.cookie = "mantouji_auth=1; path=/; max-age=2592000; SameSite=Lax";
  } else {
    document.cookie = "mantouji_auth=; path=/; max-age=0; SameSite=Lax";
  }
}

export function saveAuthSession(
  accessToken: string,
  refreshToken: string,
  user: StoredAuthUser
) {
  if (!canUseStorage()) return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAuthCookie(true);
}

export function clearAuthSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  setAuthCookie(false);
}
