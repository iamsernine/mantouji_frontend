import type { LucideIcon } from "lucide-react";
import { KeyRound, Mail, Trash2, User, UserCircle } from "lucide-react";

export type SettingsSectionId =
  | "avatar"
  | "name"
  | "email"
  | "password"
  | "delete-account";

export type SettingsNavItem = {
  id: SettingsSectionId;
  label: string;
  icon: LucideIcon;
};

/** Client personal account (photo, name, etc.) */
export const settingsNavItems: SettingsNavItem[] = [
  { id: "avatar", label: "Photo de profil", icon: UserCircle },
  { id: "name", label: "Nom complet", icon: User },
  { id: "email", label: "Email", icon: Mail },
  { id: "password", label: "Mot de passe", icon: KeyRound },
  { id: "delete-account", label: "Supprimer le compte", icon: Trash2 },
];

/** Coop manager login — not shown on the public vitrine */
export const coopLoginSettingsNavItems: SettingsNavItem[] = [
  { id: "name", label: "Nom du contact", icon: User },
  { id: "email", label: "Email de connexion", icon: Mail },
  { id: "password", label: "Mot de passe", icon: KeyRound },
  { id: "delete-account", label: "Supprimer le compte", icon: Trash2 },
];

export function getSettingsNavItems(mode: "client" | "cooperative") {
  return mode === "cooperative" ? coopLoginSettingsNavItems : settingsNavItems;
}

export function settingsSectionTitle(id: SettingsSectionId, mode: "client" | "cooperative" = "client"): string {
  const items = getSettingsNavItems(mode);
  return items.find((i) => i.id === id)?.label ?? "Paramètres";
}
