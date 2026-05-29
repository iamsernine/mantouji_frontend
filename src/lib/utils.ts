import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(prix: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(prix);
}

export function averageRating(
  avis: { note: number }[]
): number {
  if (!avis.length) return 0;
  return (
    Math.round(
      (avis.reduce((sum, a) => sum + a.note, 0) / avis.length) * 10
    ) / 10
  );
}

/** Prefer API aggregate; fall back to loaded review rows */
export function productRatingStats(product: {
  avis: { note: number }[];
  ratingSummary?: { averageRating: number; reviewsCount: number };
}) {
  const count =
    product.ratingSummary?.reviewsCount ?? product.avis.length;
  const avg =
    product.ratingSummary && product.ratingSummary.reviewsCount > 0
      ? product.ratingSummary.averageRating
      : averageRating(product.avis);
  return { average: avg, count };
}
