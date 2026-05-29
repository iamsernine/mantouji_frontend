import Link from "next/link";
import { Star } from "lucide-react";
import type { Avis } from "@/types/product";

export function ProductReviewsPreview({ avis, limit = 3 }: { avis: Avis[]; limit?: number }) {
  const preview = avis.slice(0, limit);

  if (!preview.length) {
    return (
      <section className="rounded-2xl border border-dashed border-charcoal/15 bg-sand/20 p-5">
        <h2 className="font-serif text-lg font-semibold text-charcoal">Avis clients</h2>
        <p className="mt-2 text-sm text-charcoal/60">
          Aucun commentaire pour le moment. Votre retour aide la communauté à choisir en confiance.
        </p>
        <Link
          href="#avis-composer"
          className="mt-3 inline-block text-sm font-semibold text-burgundy hover:underline"
        >
          Laisser le premier avis
        </Link>
      </section>
    );
  }

  return (
    <section id="avis-clients" className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-semibold text-charcoal">Ce que disent les clients</h2>
        {avis.length > limit ? (
          <Link
            href="#avis-complet"
            className="text-xs font-semibold uppercase tracking-wider text-burgundy hover:underline"
          >
            Tous les avis ({avis.length})
          </Link>
        ) : null}
      </div>
      <ul className="mt-4 space-y-4">
        {preview.map((a) => (
          <li key={a.id} className="rounded-xl bg-cream/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-charcoal">{a.auteur}</p>
              <span className="text-xs text-charcoal/50">
                {new Date(a.date).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < a.note ? "fill-gold text-gold" : "text-charcoal/20"
                  }`}
                />
              ))}
            </div>
            {a.commentaire ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-charcoal/75">
                {a.commentaire}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
