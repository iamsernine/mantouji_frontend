import Link from "next/link";
import { Star } from "lucide-react";
import { averageRating } from "@/lib/utils";
import type { Avis } from "@/types/product";

export function ProductRatingInline({ avis }: { avis: Avis[] }) {
  const avg = averageRating(avis);
  const rounded = Math.round(avg);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1" aria-label={`Note moyenne ${avg} sur 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rounded ? "fill-gold text-gold" : "text-charcoal/20"}`}
          />
        ))}
      </div>
      <span className="text-lg font-semibold text-charcoal">{avg > 0 ? avg : "—"}</span>
      <span className="text-sm text-charcoal/55">
        {avis.length === 0
          ? "Pas encore d’avis"
          : `${avis.length} avis client${avis.length > 1 ? "s" : ""}`}
      </span>
      {avis.length > 0 ? (
        <Link
          href="#avis-clients"
          className="text-sm font-semibold text-burgundy hover:underline"
        >
          Lire les avis
        </Link>
      ) : (
        <Link
          href="#avis-composer"
          className="text-sm font-semibold text-burgundy hover:underline"
        >
          Soyez le premier à noter
        </Link>
      )}
    </div>
  );
}
