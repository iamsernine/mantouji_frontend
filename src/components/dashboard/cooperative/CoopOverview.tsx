"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Bell, MessageSquare, Package, Plus, Shield, Star } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { getApprovedFilieresForCoop } from "@/lib/onssa-accreditation-storage";
import { fetchCoopUnreadNotificationsCount } from "@/lib/coop-notifications-api";
import { getOnssaFiliereFromDb } from "@/lib/onssa-db-storage";
import { formatPrice, productRatingStats } from "@/lib/utils";

export function CoopOverview() {
  const { coopId, cooperative, products, reviews, ready } = useCoopDashboard();
  const [unread, setUnread] = useState(0);
  const [approvedFilieres, setApprovedFilieres] = useState<string[]>([]);

  useEffect(() => {
    if (!ready || !coopId) return;
    let cancelled = false;
    void fetchCoopUnreadNotificationsCount().then((count) => {
      if (!cancelled) setUnread(count);
    });
    setApprovedFilieres(getApprovedFilieresForCoop(coopId));
    return () => {
      cancelled = true;
    };
  }, [coopId, ready]);

  const totalReviews = products.reduce(
    (s, p) => s + productRatingStats(p).count,
    0
  );
  const globalAvg =
    totalReviews > 0
      ? (
          products.reduce(
            (s, p) => s + productRatingStats(p).average * productRatingStats(p).count,
            0
          ) / totalReviews
        ).toFixed(1)
      : "—";
  const totalViews = products.reduce((s, p) => s + (p.viewsCount ?? 0), 0);

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/50">Chargement…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-sage">
          Espace coopérative
        </p>
        <h1 className="font-serif text-2xl text-burgundy sm:text-3xl">
          {cooperative?.nomCooperative ?? "Tableau de bord"}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-charcoal/65">
          Gérez vos produits, consultez les avis clients et vos statistiques.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard title="Produits" value={products.length} icon={Package} />
        <StatCard
          title="Avis"
          value={totalReviews}
          subtitle={globalAvg !== "—" ? `Note moy. ${globalAvg}` : "Aucun avis"}
          icon={MessageSquare}
          accent="sage"
        />
        <StatCard
          title="Vues"
          value={totalViews}
          subtitle="Fiches produit"
          icon={BarChart3}
          accent="gold"
        />
        <StatCard
          title="Notifications"
          value={unread}
          subtitle="Non lues"
          icon={Bell}
          accent="burgundy"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/dashboard/cooperative/profil">Ma coopérative</Link>
        </Button>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/dashboard/cooperative/produits">
            <Plus className="h-4 w-4" />
            Gérer mes produits
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/cooperative/avis">
            <MessageSquare className="h-4 w-4" />
            Avis clients
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/cooperative/analytique">
            <BarChart3 className="h-4 w-4" />
            Analytique
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/cooperative/notifications">
            <Bell className="h-4 w-4" />
            Notifications{unread > 0 ? ` (${unread})` : ""}
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/cooperative/onssa">
            <Shield className="h-4 w-4" />
            ONSSA — Filières
          </Link>
        </Button>
      </div>

      {approvedFilieres.length > 0 && (
        <DashboardSection
          title="Filières agréées ONSSA"
          description="Agrément par filière d'activité"
        >
          <ul className="flex flex-wrap gap-2">
            {approvedFilieres.map((id) => (
              <li
                key={id}
                className="border border-sage/40 bg-sage-light/40 px-3 py-1.5 text-sm text-charcoal"
              >
                {getOnssaFiliereFromDb(id)?.nom ?? id}
              </li>
            ))}
          </ul>
        </DashboardSection>
      )}

      {reviews.length > 0 ? (
        <DashboardSection
          title="Derniers avis clients"
          description="Données API — lecture seule"
        >
          <ul className="space-y-3">
            {reviews.slice(0, 3).map((a) => (
              <li
                key={a.id}
                className="border-b border-charcoal/10 py-3 last:border-0"
              >
                <p className="text-xs uppercase tracking-widest text-sage">{a.produitNom}</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-charcoal">
                  {a.auteur}
                  <span className="inline-flex items-center gap-0.5 text-charcoal/60">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    {a.note}/5
                  </span>
                </p>
                {a.commentaire ? (
                  <p className="mt-1 line-clamp-2 text-sm text-charcoal/65">{a.commentaire}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/cooperative/avis"
            className="mt-3 inline-block text-sm font-semibold text-burgundy hover:underline"
          >
            Voir tous les avis
          </Link>
        </DashboardSection>
      ) : null}

      <DashboardSection
        title="Derniers produits"
        description="Notes synchronisées avec le site public"
      >
        <ul className="space-y-3">
          {products.slice(0, 4).map((p) => {
            const { average, count } = productRatingStats(p);
            return (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 border-b border-charcoal/10 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal">{p.nom}</p>
                  <p className="text-sm text-burgundy">{formatPrice(p.prix)}</p>
                </div>
                <p className="shrink-0 text-sm text-charcoal/60">
                  {count > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      {average} ({count})
                    </span>
                  ) : (
                    "Sans avis"
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      </DashboardSection>
    </div>
  );
}
