import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveAuthSession,
} from "@/lib/auth-storage";
import { getApiBaseUrl } from "@/lib/api-client";
import { isProtectedPath } from "@/lib/routes";

const SESSION_EXPIRED_EVENT = "mantouji:session-expired";

let refreshInFlight: Promise<boolean> | null = null;

function decodeTokenExpiry(token: string): number | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const payload = JSON.parse(atob(segment.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number;
    };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token: string, skewSeconds = 60): boolean {
  const exp = decodeTokenExpiry(token);
  if (!exp) return true;
  return Date.now() / 1000 >= exp - skewSeconds;
}

export function handleSessionExpired(fromPath?: string): void {
  if (typeof window === "undefined") return;

  clearAuthSession();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));

  const path = fromPath ?? window.location.pathname;
  if (!isProtectedPath(path)) return;

  const login = new URL("/login", window.location.origin);
  login.searchParams.set("next", path);
  login.searchParams.set("session", "expired");
  window.location.replace(login.toString());
}

async function refreshSessionInternal(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const raw = await res.text();
  if (!raw || !res.ok) return false;

  let json: {
    success?: boolean;
    data?: { accessToken?: string; refreshToken?: string };
  };
  try {
    json = JSON.parse(raw) as typeof json;
  } catch {
    return false;
  }

  const accessToken = json.data?.accessToken;
  const newRefresh = json.data?.refreshToken;
  if (!json.success || !accessToken || !newRefresh) return false;

  const user = getStoredUser();
  if (!user) return false;

  saveAuthSession(accessToken, newRefresh, user);
  return true;
}

/** Silently renew the access token using the refresh token. */
export async function ensureValidAccessToken(): Promise<boolean> {
  const access = getAccessToken();
  if (access && !isAccessTokenExpired(access)) return true;

  return forceRefreshAccessToken();
}

/** Force a refresh (e.g. after API 401 with a locally valid token). */
export async function forceRefreshAccessToken(): Promise<boolean> {
  if (!getRefreshToken()) return false;

  if (!refreshInFlight) {
    refreshInFlight = refreshSessionInternal().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

/** Bootstrap or recover session on app load / after idle tab. */
export async function bootstrapAuthSession(): Promise<boolean> {
  const user = getStoredUser();
  const refresh = getRefreshToken();

  if (!user && !refresh) {
    clearAuthSession();
    return false;
  }

  if (!refresh) {
    clearAuthSession();
    return false;
  }

  const ok = await ensureValidAccessToken();
  if (!ok) clearAuthSession();
  return ok;
}

export function subscribeSessionExpired(onExpired: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
}
