"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { productRatingStats } from "@/lib/utils";

export function CoopReviews() {
  const { products, reviews, ready } = useCoopDashboard();

  const totalReviews = products.reduce(
    (s, p) => s + productRatingStats(p).count,
    0
  );
  const ratedProducts = products.filter((p) => productRatingStats(p).count > 0);
  const globalAvg =
    totalReviews > 0
      ? (
          products.reduce(
            (s, p) => s + productRatingStats(p).average * productRatingStats(p).count,
            0
          ) / totalReviews
        ).toFixed(1)
      : "—";

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/50">Chargement…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-burgundy sm:text-3xl">Avis clients</h1>
        <p className="mt-1 text-sm text-charcoal/60">
          Avis approuvés publiés sur vos fiches produit — données en direct depuis l&apos;API.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-charcoal/10 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/50">
            Total avis
          </p>
          <p className="mt-1 font-serif text-2xl text-charcoal">{totalReviews}</p>
        </div>
        <div className="rounded-xl border border-charcoal/10 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/50">
            Note moyenne catalogue
          </p>
          <p className="mt-1 flex items-center gap-1 font-serif text-2xl text-charcoal">
            {globalAvg !== "—" ? (
              <>
                <Star className="h-5 w-5 fill-gold text-gold" />
                {globalAvg}
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
        <div className="rounded-xl border border-charcoal/10 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/50">
            Produits notés
          </p>
          <p className="mt-1 font-serif text-2xl text-charcoal">
            {ratedProducts.length}/{products.length}
          </p>
        </div>
      </div>

      <DashboardSection title={`${reviews.length} commentaires récents`}>
        {reviews.length === 0 ? (
          <p className="text-charcoal/60">
            Aucun avis pour vos produits. Les clients peuvent noter après vérification de leur
            email sur la fiche publique.
          </p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((a) => (
              <li
                key={a.id}
                className="border border-charcoal/10 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sage">
                    <Link
                      href={`/produits/${a.produitId}`}
                      className="hover:text-burgundy"
                    >
                      {a.produitNom}
                    </Link>
                  </p>
                  <span className="text-xs text-charcoal/45">
                    {new Date(a.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 font-medium text-charcoal">
                  {a.auteur}
                  <span className="inline-flex items-center gap-0.5 text-sm text-charcoal/70">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < a.note ? "fill-gold text-gold" : "text-charcoal/20"
                        }`}
                      />
                    ))}
                    <span className="ml-1">{a.note}/5</span>
                  </span>
                </p>
                {a.commentaire ? (
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{a.commentaire}</p>
                ) : (
                  <p className="mt-2 text-sm text-charcoal/45">Note sans commentaire</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}
