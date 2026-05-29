import { resolveMediaUrl } from "@/lib/media-url";
import type { Disponibilite, Role } from "@/types/api";
import type { Cooperative } from "@/types/cooperative";
import type {
  Avis,
  Categorie,
  Certification,
  Media,
  Produit,
  Region,
} from "@/types/product";

const CATEGORY_ICONS: Record<string, string> = {
  Dattes: "🌴",
  Couscous: "🌾",
  Cumin: "🧂",
  Miel: "🍯",
  "Huile d'olive": "🫒",
  Argan: "🌿",
  Epices: "✨",
};

function slugify(nom: string) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function toRole(role: string): Role {
  return role.toUpperCase() as Role;
}

export function mapDisponibilite(disponible: boolean): Disponibilite {
  return disponible ? "EN_STOCK" : "RUPTURE";
}

export { resolveMediaUrl };

export function mapRegion(r: { id: string; nom: string; description?: string | null }): Region {
  return {
    id: String(r.id),
    nom: r.nom,
    description: r.description ?? "",
  };
}

export function mapCategorie(c: { id: string; nom: string; description?: string | null }): Categorie {
  return {
    id: String(c.id),
    nom: c.nom,
    slug: slugify(c.nom),
    icone: CATEGORY_ICONS[c.nom] ?? "🌿",
  };
}

export function mapCertification(c: {
  id: string;
  nom: string;
  description?: string | null;
  logoUrl?: string | null;
}): Certification {
  return {
    id: String(c.id),
    nom: c.nom,
    description: c.description ?? "",
    logoUrl: c.logoUrl ? resolveMediaUrl(c.logoUrl) : undefined,
  };
}

type CooperativeApi = {
  id: string;
  nomCooperative: string;
  description?: string | null;
  histoire?: string | null;
  telephone?: string | null;
  whatsapp?: string | null;
  siteWeb?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  region?: { id: string; nom: string; description?: string | null } | null;
};

export function mapCooperative(c: CooperativeApi): Cooperative {
  const region = c.region
    ? mapRegion(c.region)
    : { id: "", nom: "Maroc", description: "" };
  return {
    id: String(c.id),
    nomCooperative: c.nomCooperative,
    description: c.description ?? "",
    histoire: c.histoire ?? "",
    telephone: c.telephone ?? "",
    whatsapp: c.whatsapp ?? c.telephone ?? "",
    siteWeb: c.siteWeb ?? undefined,
    logoUrl: c.logoUrl ? resolveMediaUrl(c.logoUrl) : "",
    bannerUrl: c.bannerUrl ? resolveMediaUrl(c.bannerUrl) : "",
    region,
  };
}

type ProductListApi = {
  id: string;
  nom: string;
  description?: string | null;
  origine?: string | null;
  composition?: string | null;
  prix: number | string;
  disponibilite: boolean;
  categorie?: { id: string; nom: string } | null;
  cooperative?: {
    id: string;
    nomCooperative: string;
    whatsapp?: string | null;
    region?: { id: string; nom: string } | null;
  } | null;
  coverImageUrl?: string | null;
  averageRating?: number;
  reviewsCount?: number;
  viewsCount?: number;
  certifications?: Array<{
    id?: string;
    certificationId?: string;
    nom?: string | null;
  }>;
  regionId?: string;
};

export function mapProductListItem(p: ProductListApi, regionId = ""): Produit {
  const categorie = p.categorie ? mapCategorie(p.categorie) : mapCategorie({ id: "0", nom: "Autre" });
  const coop = p.cooperative;
  const coopRegion = coop?.region ? mapRegion(coop.region) : { id: regionId, nom: "", description: "" };
  const cooperative = coop
    ? {
        id: String(coop.id),
        nomCooperative: coop.nomCooperative,
        logoUrl: "",
        bannerUrl: "",
        region: coopRegion,
        description: "",
      }
    : {
        id: "",
        nomCooperative: "Coopérative",
        logoUrl: "",
        bannerUrl: "",
        region: { id: regionId, nom: "", description: "" },
        description: "",
      };

  const certifications: Certification[] = (p.certifications ?? [])
    .filter((c) => c.nom)
    .map((c, i) => ({
      id: String(c.certificationId ?? c.id ?? i),
      nom: c.nom ?? "",
      description: "",
    }));

  const medias: Media[] = [];
  if (p.coverImageUrl) {
    medias.push({
      id: `cover-${p.id}`,
      url: resolveMediaUrl(p.coverImageUrl),
      alt: p.nom,
      type: "image",
    });
  }

  const reviewsCount = p.reviewsCount ?? 0;
  const averageRating = p.averageRating ?? 0;

  return {
    id: String(p.id),
    nom: p.nom,
    description: p.description ?? "",
    origine: p.origine ?? "",
    composition: p.composition ?? "",
    prix: Number(p.prix),
    disponibilite: mapDisponibilite(p.disponibilite),
    categorie,
    cooperative,
    medias,
    certifications,
    avis: [],
    ratingSummary: { averageRating, reviewsCount },
    viewsCount: p.viewsCount ?? 0,
    regionId: regionId || cooperative.region.id,
  };
}

type ProductDetailApi = ProductListApi & {
  medias?: Array<{ id: string; url: string; altText?: string | null; type?: string }>;
  avisSummary?: { averageRating: number; reviewsCount: number };
};

export function mapProductDetail(p: ProductDetailApi, regionId = ""): Produit {
  const base = mapProductListItem(p, regionId);
  if (p.avisSummary) {
    base.ratingSummary = {
      averageRating: p.avisSummary.averageRating,
      reviewsCount: p.avisSummary.reviewsCount,
    };
  }
  if (p.medias?.length) {
    base.medias = p.medias
      .filter((m) => m.type !== "video")
      .slice(0, 3)
      .map((m) => ({
        id: String(m.id),
        url: resolveMediaUrl(m.url),
        alt: m.altText ?? base.nom,
        type: "image" as const,
      }));
  }
  return base;
}

export function mapAvis(
  items: Array<{
    id: string;
    note: number;
    commentaire?: string | null;
    date: string;
    user?: { nom: string };
  }>
): Avis[] {
  return items.map((a) => ({
    id: String(a.id),
    auteur: a.user?.nom ?? "Client",
    note: a.note,
    commentaire: a.commentaire ?? "",
    date: a.date,
  }));
}

export type Paginated<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
};
