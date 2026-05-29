import type { Role } from "./api";

export type Utilisateur = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: Role;
  avatarUrl?: string;
};
