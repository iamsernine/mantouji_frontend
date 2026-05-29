import { Star } from "lucide-react";
import { averageRating } from "@/lib/utils";
import type { Avis } from "@/types/product";

export function ProductReviews({ avis }: { avis: Avis[] }) {
  const avg = averageRating(avis);

  return (
    <section className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold text-charcoal">Avis clients</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1" aria-label="Note moyenne">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(avg) ? "fill-gold text-gold" : "text-charcoal/20"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-charcoal">{avg}/5</span>
          <span className="text-sm text-charcoal/55">({avis.length})</span>
          <a
            href="#avis-composer"
            className="rounded-xl border border-charcoal/20 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-cream"
          >
            Noter ce produit
          </a>
        </div>
      </div>

      {!avis.length ? (
        <div className="mt-4 rounded-xl border border-charcoal/10 bg-sand/40 p-4">
          <p className="text-base text-charcoal/60">
            Aucun avis pour le moment. Soyez le premier à partager votre expérience.
          </p>
          <div className="mt-3">
            <a
              href="#avis-composer"
              className="inline-flex rounded-xl bg-burgundy px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy/90"
            >
              Laisser un avis
            </a>
          </div>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-charcoal/10">
          {avis.map((a) => (
            <li key={a.id} className="py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal">{a.auteur}</p>
                  <div className="mt-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < a.note ? "fill-gold text-gold" : "text-charcoal/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-sm text-charcoal/50">
                  {new Date(a.date).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {a.commentaire ? (
                <p className="mt-3 text-base leading-relaxed text-charcoal/75">{a.commentaire}</p>
              ) : (
                <p className="mt-3 text-sm text-charcoal/50">Aucun commentaire.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
