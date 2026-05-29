"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTopNotification } from "@/components/ui/top-notification";
import { useAuth } from "@/contexts/auth-context";
import { refreshSession, resendVerificationEmail, roleFromStored } from "@/lib/auth";
import { ApiRequestError } from "@/lib/api-client";
import type { SettingsSectionId } from "@/components/account/settings-nav";
import {
  changeCurrentUserPassword,
  deleteCurrentUserAccount,
  fetchCurrentUserAccount,
  removeUserAvatar,
  updateCurrentUserAccount,
  uploadUserAvatar,
  type UserAccount,
} from "@/lib/user-account";

export function useSettingsAccount() {
  const router = useRouter();
  const top = useTopNotification();
  const { user: stored, refreshUser, logout } = useAuth();

  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("avatar");

  const [nom, setNom] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = stored ? roleFromStored(stored.role) : null;

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentUserAccount();
      setAccount(data);
      setNom(data.nom);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        try {
          await refreshSession();
          const data = await fetchCurrentUserAccount();
          setAccount(data);
          setNom(data.nom);
          refreshUser();
          return;
        } catch {
          setError("Session expirée. Reconnectez-vous.");
          return;
        }
      }
      setError(err instanceof ApiRequestError ? err.message : "Impossible de charger les paramètres.");
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  const displayNom = account?.nom ?? stored?.nom ?? "";
  const displayEmail = account?.email ?? stored?.email ?? "";
  const avatarUrl = account?.avatarUrl ?? stored?.avatarUrl ?? null;

  const notify = (title: string, description?: string, variant: "success" | "error" = "success") => {
    top.show({ variant, title, description });
  };

  const handleAvatarUpload = async (file: File | undefined) => {
    if (!file) return;
    const accept = "image/jpeg,image/png,image/webp";
    if (!accept.split(",").includes(file.type)) {
      setError("Format accepté : JPEG, PNG ou WebP.");
      return;
    }
    setUploadingAvatar(true);
    setError(null);
    try {
      const updated = await uploadUserAvatar(file);
      setAccount(updated);
      refreshUser();
      notify("Photo mise à jour");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Téléversement impossible.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      const updated = await removeUserAvatar();
      setAccount(updated);
      refreshUser();
      notify("Photo supprimée");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Suppression impossible.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const updated = await updateCurrentUserAccount({ nom: nom.trim() });
      setAccount(updated);
      refreshUser();
      notify("Nom enregistré");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await changeCurrentUserPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      notify("Mot de passe modifié");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Modification impossible.");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Cette action désactive définitivement votre compte. Continuer ?")) return;
    setBusy(true);
    setError(null);
    try {
      await deleteCurrentUserAccount(deletePassword);
      logout();
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Suppression impossible.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const resendVerification = async () => {
    if (!stored?.email) return;
    try {
      await resendVerificationEmail(stored.email);
      notify("Email envoyé", "Vérifiez votre boîte de réception.");
    } catch {
      notify("Échec", "Impossible de renvoyer l’email.", "error");
    }
  };

  return {
    account,
    stored,
    role,
    loading,
    error,
    setError,
    activeSection,
    setActiveSection,
    displayNom,
    displayEmail,
    avatarUrl,
    nom,
    setNom,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    deletePassword,
    setDeletePassword,
    uploadingAvatar,
    busy,
    handleAvatarUpload,
    handleRemoveAvatar,
    handleSaveName,
    handleChangePassword,
    handleDeleteAccount,
    handleLogout,
    resendVerification,
    loadAccount,
  };
}

export type SettingsAccountState = ReturnType<typeof useSettingsAccount>;
