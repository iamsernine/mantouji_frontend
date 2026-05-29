import type { Disponibilite } from "./api";
import type { Avis, Produit } from "./product";

export type ModerationStatus = "approved" | "pending" | "rejected";

export type CoopProductRecord = Produit & {
  moderationStatus: ModerationStatus;
};

export type CoopReviewRecord = Avis & {
  produitId: string;
  produitNom: string;
};

export type CoopProductInput = {
  nom: string;
  description: string;
  origine: string;
  composition: string;
  prix: number;
  disponibilite: Disponibilite;
  categorieId: string;
  histoire?: string;
  /** Nouvelles photos (max 3 au total, envoyées via /medias/upload) */
  imageFiles?: File[];
  /** IDs des médias existants à supprimer */
  removeMediaIds?: string[];
};
