import type { Media, Produit } from "@/types/product";

/** Primary product image for cards and lists (safe when medias is empty). */
export function getProductImage(produit: Pick<Produit, "nom" | "medias">): {
  src: string;
  alt: string;
} {
  const primary = produit.medias?.[0];
  return {
    src: primary?.url ?? "",
    alt: primary?.alt ?? produit.nom,
  };
}

export function getMediaAt(medias: Media[], index: number): Media | undefined {
  return medias[index];
}
