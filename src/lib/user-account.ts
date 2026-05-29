import { apiRequest, ApiRequestError, getApiBaseUrl } from "@/lib/api-client";
import { getStoredUser, saveAuthSession, getAccessToken, getRefreshToken } from "@/lib/auth-storage";
import type { PreferredLanguage } from "@/lib/locale-preference";
import { resolveMediaUrl } from "@/lib/media-url";

export type UserAccount = {
  id: string;
  nom: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  avatarUrl: string | null;
  preferredLanguage: PreferredLanguage;
};

type UserAccountApi = {
  id: string;
  nom: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  avatarUrl?: string | null;
  preferredLanguage?: string;
};

function mapUserAccount(data: UserAccountApi): UserAccount {
  return {
    id: String(data.id),
    nom: data.nom,
    email: data.email,
    role: data.role,
    isActive: data.isActive,
    isVerified: data.isVerified,
    avatarUrl: data.avatarUrl ? resolveMediaUrl(data.avatarUrl) : null,
    preferredLanguage: data.preferredLanguage === "ar" ? "ar" : "fr",
  };
}

function syncStoredUser(patch: Partial<UserAccount>) {
  const access = getAccessToken();
  const refresh = getRefreshToken();
  const stored = getStoredUser();
  if (!access || !refresh || !stored) return;
  saveAuthSession(access, refresh, {
    ...stored,
    nom: patch.nom ?? stored.nom,
    avatarUrl: patch.avatarUrl !== undefined ? patch.avatarUrl ?? undefined : stored.avatarUrl,
    preferredLanguage:
      patch.preferredLanguage !== undefined ? patch.preferredLanguage : stored.preferredLanguage,
  });
}

export async function fetchCurrentUserAccount(): Promise<UserAccount> {
  const res = await apiRequest<UserAccountApi>("/utilisateurs/me", { auth: true, cache: "no-store" });
  return mapUserAccount(res.data);
}

export async function updateCurrentUserAccount(payload: {
  nom?: string;
  preferredLanguage?: PreferredLanguage;
}): Promise<UserAccount> {
  const res = await apiRequest<UserAccountApi>("/utilisateurs/me", {
    method: "PUT",
    auth: true,
    body: payload,
  });
  const account = mapUserAccount(res.data);
  syncStoredUser({
    nom: account.nom,
    preferredLanguage: account.preferredLanguage,
  });
  return account;
}

export async function changeCurrentUserPassword(currentPassword: string, newPassword: string) {
  return apiRequest("/utilisateurs/me/change-password", {
    method: "POST",
    auth: true,
    body: { currentPassword, newPassword },
  });
}

export async function deleteCurrentUserAccount(password: string) {
  return apiRequest("/utilisateurs/me/delete-account", {
    method: "POST",
    auth: true,
    body: { password },
  });
}

export async function uploadUserAvatar(file: File): Promise<UserAccount> {
  const formData = new FormData();
  formData.append("file", file);
  const token = getAccessToken();
  if (!token) throw new ApiRequestError("Session expirée. Veuillez vous reconnecter.", 401);

  const res = await fetch(`${getApiBaseUrl()}/utilisateurs/me/avatar`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  const raw = await res.text();
  const json = raw ? JSON.parse(raw) : { success: false, message: "Invalid response" };
  if (!res.ok || !json.success) {
    throw new ApiRequestError(json.message ?? "Upload failed", res.status, json.errors ?? {});
  }
  const account = mapUserAccount(json.data as UserAccountApi);
  syncStoredUser({ avatarUrl: account.avatarUrl });
  return account;
}

export async function removeUserAvatar(): Promise<UserAccount> {
  const res = await apiRequest<UserAccountApi>("/utilisateurs/me/avatar", {
    method: "DELETE",
    auth: true,
  });
  const account = mapUserAccount(res.data);
  syncStoredUser({ avatarUrl: null });
  return account;
}

export function userDisplayInitials(nom: string): string {
  const parts = nom.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}
