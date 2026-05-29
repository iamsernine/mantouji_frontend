"use client";

import Link from "next/link";
import { BarChart3, Eye, MessageSquare, Package, Star } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { formatPrice, productRatingStats } from "@/lib/utils";

export function CoopAnalyticsPanel() {
  const { products, reviews, ready } = useCoopDashboard();

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/50">Chargement des statistiques…</p>;
  }

  const totalViews = products.reduce((s, p) => s + (p.viewsCount ?? 0), 0);
  const totalReviews = products.reduce((s, p) => s + productRatingStats(p).count, 0);
  const globalAvg =
    totalReviews > 0
      ? (
          products.reduce(
            (s, p) => s + productRatingStats(p).average * productRatingStats(p).count,
            0
          ) / totalReviews
        ).toFixed(1)
      : "—";

  const byProduct = [...products]
    .map((p) => ({
      id: p.id,
      nom: p.nom,
      prix: p.prix,
      views: p.viewsCount ?? 0,
      ...productRatingStats(p),
    }))
    .sort((a, b) => b.count - a.count || b.views - a.views);

  const topRated = byProduct.filter((p) => p.count > 0).slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytique"
        description="Indicateurs réels issus de votre catalogue et des avis clients approuvés."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard title="Produits" value={products.length} icon={Package} />
        <StatCard
          title="Vues fiches"
          value={totalViews}
          icon={Eye}
          accent="gold"
        />
        <StatCard
          title="Avis clients"
          value={totalReviews}
          subtitle={globalAvg !== "—" ? `Moy. ${globalAvg} ★` : undefined}
          icon={MessageSquare}
          accent="sage"
        />
        <StatCard
          title="Commentaires"
          value={reviews.filter((r) => r.commentaire?.trim()).length}
          subtitle="Avec texte"
          icon={BarChart3}
          accent="burgundy"
        />
      </div>

      <DashboardSection
        title="Performance par produit"
        description="Notes, avis et vues — synchronisé avec le site public"
      >
        {byProduct.length === 0 ? (
          <p className="text-charcoal/60">Aucun produit publié.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-charcoal/10 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  <th className="py-3 pr-4">Produit</th>
                  <th className="py-3 pr-4">Prix</th>
                  <th className="py-3 pr-4">Note</th>
                  <th className="py-3 pr-4">Avis</th>
                  <th className="py-3">Vues</th>
                </tr>
              </thead>
              <tbody>
                {byProduct.map((row) => (
                  <tr key={row.id} className="border-b border-charcoal/5">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/produits/${row.id}`}
                        className="font-medium text-charcoal hover:text-burgundy"
                      >
                        {row.nom}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-burgundy">{formatPrice(row.prix)}</td>
                    <td className="py-3 pr-4">
                      {row.count > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                          {row.average}
                        </span>
                      ) : (
                        <span className="text-charcoal/40">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{row.count}</td>
                    <td className="py-3">{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardSection>

      {topRated.length > 0 ? (
        <DashboardSection title="Produits les mieux notés">
          <ul className="space-y-2">
            {topRated.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 border-b border-charcoal/10 py-2 last:border-0"
              >
                <Link
                  href={`/produits/${p.id}`}
                  className="truncate font-medium text-charcoal hover:text-burgundy"
                >
                  {p.nom}
                </Link>
                <span className="shrink-0 text-sm text-charcoal/70">
                  ★ {p.average} · {p.count} avis
                </span>
              </li>
            ))}
          </ul>
        </DashboardSection>
      ) : null}
    </div>
  );
}
