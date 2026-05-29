"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CooperativeCard } from "@/components/cooperatives/CooperativeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { MoroccoAdminRegion } from "@/data/morocco-admin-regions";
import type { RegionCatalogMeta } from "@/types/region-catalog";
import type { Cooperative } from "@/types/cooperative";

type RegionCooperativesPanelProps = {
  adminRegion: MoroccoAdminRegion;
  catalogRegion?: RegionCatalogMeta;
  cooperatives: Cooperative[];
  onClose: () => void;
};

export function RegionCooperativesPanel({
  adminRegion,
  catalogRegion,
  cooperatives,
  onClose,
}: RegionCooperativesPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const title = catalogRegion?.nom ?? adminRegion.nom;
  const description =
    catalogRegion?.description ??
    "Ce terroir n’a pas encore de coopérative partenaire référencée sur Mantouji.";

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [adminRegion.mapCode]);

  return (
    <section
      ref={panelRef}
      id={`region-${adminRegion.mapCode}`}
      className="scroll-mt-24 border-t border-charcoal/10 pt-8"
      aria-labelledby={`region-heading-${adminRegion.mapCode}`}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-sage">
              Terroir
            </p>
            <h2
              id={`region-heading-${adminRegion.mapCode}`}
              className="mt-1 font-serif text-3xl text-burgundy lg:text-4xl"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-charcoal/50 underline-offset-4 hover:text-burgundy hover:underline"
          >
            Fermer
          </button>
        </div>

        <p className="max-w-2xl font-light leading-relaxed text-charcoal/70">
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 pb-4">
          <p className="text-xs uppercase tracking-widest text-charcoal/50">
            {cooperatives.length} coopérative
            {cooperatives.length !== 1 ? "s" : ""}
            {catalogRegion?.productCount !== undefined && (
              <>
                {" "}
                · {catalogRegion.productCount} produit
                {catalogRegion.productCount !== 1 ? "s" : ""}
              </>
            )}
          </p>
          {catalogRegion && (
            <Link
              href={`/produits?region=${catalogRegion.id}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-burgundy"
            >
              Voir les produits
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {cooperatives.length === 0 ? (
          <EmptyState
            title="Aucune coopérative pour l'instant"
            description="Revenez bientôt — de nouveaux artisans rejoignent ce terroir."
            actionLabel="Explorer le catalogue"
            actionHref="/produits"
          />
        ) : (
          <ul className="divide-y divide-charcoal/10">
            {cooperatives.map((coop) => (
              <li key={coop.id}>
                <CooperativeCard cooperative={coop} variant="directory" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
