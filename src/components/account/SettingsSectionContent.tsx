"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import type { SettingsSectionId } from "@/components/account/settings-nav";
import type { SettingsAccountState } from "@/components/account/use-settings-account";
import { UserAvatarDisplay } from "@/components/account/UserAvatarDisplay";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ACCEPT = "image/jpeg,image/png,image/webp";

export function SettingsSectionContent({
  section,
  s,
  bare,
  mode = "client",
}: {
  section: SettingsSectionId;
  s: SettingsAccountState;
  bare?: boolean;
  mode?: "client" | "cooperative";
}) {
  if (section === "avatar" && mode === "cooperative") return null;

  const wrap = (title: string, description: string | undefined, children: React.ReactNode) =>
    bare ? (
      children
    ) : (
      <DashboardSection title={title} description={description}>
        {children}
      </DashboardSection>
    );

  switch (section) {
    case "avatar":
      return wrap(
        "Photo de profil",
        "JPEG, PNG ou WebP. Sans photo, vos initiales s’affichent.",
        <div className="flex flex-wrap items-center gap-6">
          <UserAvatarDisplay nom={s.displayNom} avatarUrl={s.avatarUrl} size="lg" />
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" disabled={s.uploadingAvatar} asChild>
                <span>
                  <ImagePlus className="mr-2 inline h-4 w-4" />
                  {s.uploadingAvatar ? "Envoi…" : "Modifier"}
                </span>
              </Button>
              <input
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => {
                  void s.handleAvatarUpload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {s.avatarUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={s.uploadingAvatar}
                onClick={() => void s.handleRemoveAvatar()}
              >
                <Trash2 className="mr-2 inline h-4 w-4" />
                Supprimer
              </Button>
            ) : null}
          </div>
        </div>
      );

    case "name":
      return wrap(
        mode === "cooperative" ? "Nom du contact" : "Nom complet",
        mode === "cooperative"
          ? "Personne responsable du compte — non affiché sur la vitrine."
          : undefined,
        <form onSubmit={(e) => void s.handleSaveName(e)} className="max-w-md space-y-4">
          <Input value={s.nom} onChange={(e) => s.setNom(e.target.value)} required maxLength={100} />
          <Button type="submit" disabled={s.busy}>
            {s.busy ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </form>
      );

    case "email":
      return wrap(
        mode === "cooperative" ? "Email de connexion" : "Email",
        "Votre adresse ne peut pas être modifiée ici.",
        <>
          <p className="font-mono text-sm text-charcoal">{s.displayEmail}</p>
          {s.stored && !s.stored.isVerified ? (
            <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4">
              <p className="text-sm font-medium text-charcoal">Email non vérifié</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => void s.resendVerification()}>
                Renvoyer l’email de confirmation
              </Button>
            </div>
          ) : null}
        </>
      );

    case "password":
      return wrap(
        "Mot de passe",
        undefined,
        <form onSubmit={(e) => void s.handleChangePassword(e)} className="max-w-md space-y-4">
          <Input
            type="password"
            placeholder="Mot de passe actuel"
            autoComplete="current-password"
            value={s.currentPassword}
            onChange={(e) => s.setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Nouveau mot de passe"
            autoComplete="new-password"
            value={s.newPassword}
            onChange={(e) => s.setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <Input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            autoComplete="new-password"
            value={s.confirmPassword}
            onChange={(e) => s.setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
          <Button type="submit" variant="outline" disabled={s.busy}>
            {s.busy ? "Modification…" : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      );

    case "delete-account":
      return wrap(
        "Supprimer le compte",
        "Votre compte sera désactivé. Cette action est irréversible.",
        <form onSubmit={(e) => void s.handleDeleteAccount(e)} className="max-w-md space-y-4">
          <Input
            type="password"
            value={s.deletePassword}
            onChange={(e) => s.setDeletePassword(e.target.value)}
            required
            placeholder="Confirmez avec votre mot de passe"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="outline"
            className="border-burgundy/40 text-burgundy hover:bg-burgundy/5"
            disabled={s.busy || s.role === "ADMIN"}
          >
            {s.role === "ADMIN" ? "Non disponible pour les administrateurs" : "Supprimer mon compte"}
          </Button>
        </form>
      );

    default:
      return null;
  }
}
