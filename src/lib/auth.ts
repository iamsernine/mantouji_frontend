import { apiRequest } from "@/lib/api-client";
import {
  clearAuthSession,
  getRefreshToken,
  saveAuthSession,
  type StoredAuthUser,
} from "@/lib/auth-storage";
import { toRole } from "@/lib/mappers";
import type { Role } from "@/types/api";

type LoginData = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: {
    id: string;
    nom: string;
    email: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    cooperativeProfileId?: string | null;
    avatarUrl?: string | null;
    preferredLanguage?: string;
  };
};

function mapStoredUser(user: LoginData["user"]): StoredAuthUser {
  return {
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    cooperativeProfileId: user.cooperativeProfileId ?? null,
    avatarUrl: user.avatarUrl ?? null,
    preferredLanguage: user.preferredLanguage === "ar" ? "ar" : "fr",
  };
}

export async function login(email: string, motDePasse: string) {
  const res = await apiRequest<LoginData>("/auth/login", {
    method: "POST",
    body: { email, motDePasse },
  });
  saveAuthSession(res.data.accessToken, res.data.refreshToken, mapStoredUser(res.data.user));
  return res.data;
}

export async function registerClient(nom: string, email: string, motDePasse: string) {
  return apiRequest("/auth/register/client", {
    method: "POST",
    body: { nom, email, motDePasse },
  });
}

export async function registerCooperative(payload: {
  nom: string;
  email: string;
  motDePasse: string;
  nomCooperative: string;
  regionId: string;
  telephone?: string;
  whatsapp?: string;
  description?: string;
  histoire?: string;
}) {
  return apiRequest("/auth/register/cooperative", {
    method: "POST",
    body: payload,
  });
}

export async function verifyEmail(token: string) {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: { token },
  });
}

export async function resendVerificationEmail(email: string) {
  return apiRequest("/auth/resend-verification", {
    method: "POST",
    body: { email },
  });
}

export async function refreshSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");
  const res = await apiRequest<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
  const user = (await import("@/lib/auth-storage")).getStoredUser();
  if (user) {
    saveAuthSession(res.data.accessToken, res.data.refreshToken, user);
  }
  return res.data;
}

export function logout() {
  clearAuthSession();
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "COOPERATIVE":
      return "/dashboard/cooperative";
    default:
      return "/compte";
  }
}

export function roleFromStored(role: string): Role {
  return toRole(role);
}
