import type { Disponibilite } from "./api";
import type { CooperativeSummary } from "./cooperative";

export type Region = {
  id: string;
  nom: string;
  description: string;
};

export type Categorie = {
  id: string;
  nom: string;
  slug: string;
  icone: string;
};

export type Certification = {
  id: string;
  nom: string;
  description: string;
  logoUrl?: string;
};

export type Media = {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
};

export type Avis = {
  id: string;
  auteur: string;
  note: number;
  commentaire: string;
  date: string;
};

/** From API list/detail (approved reviews aggregate) */
export type ProductRatingSummary = {
  averageRating: number;
  reviewsCount: number;
};

export type Produit = {
  id: string;
  nom: string;
  description: string;
  origine: string;
  composition: string;
  prix: number;
  disponibilite: Disponibilite;
  categorie: Categorie;
  cooperative: CooperativeSummary;
  medias: Media[];
  certifications: Certification[];
  avis: Avis[];
  ratingSummary: ProductRatingSummary;
  viewsCount: number;
  histoire?: string;
  regionId: string;
};
