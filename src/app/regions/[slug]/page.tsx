export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CooperativeCard } from "@/components/cooperatives/CooperativeCard";
import { RegionDetailHero } from "@/components/regions/RegionDetailHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { findRegionByCatalogName } from "@/data/catalog-regions";
import { getRegionProfile } from "@/data/region-profiles";
import {
  getAdminRegionBySlug,
  getRegionSlug,
  isMoroccoRegionSlug,
  MOROCCO_ADMIN_REGIONS,
} from "@/data/morocco-admin-regions";
import { getCooperativesByRegionSlug, getRegions } from "@/lib/api";

export const dynamicParams = true;

export function generateStaticParams() {
  return MOROCCO_ADMIN_REGIONS.map((r) => ({ slug: getRegionSlug(r) }));
}

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isMoroccoRegionSlug(slug)) notFound();

  const adminRegion = getAdminRegionBySlug(slug)!;
  const profile = getRegionProfile(adminRegion.mapCode);
  const [{ data: regions }, cooperatives] = await Promise.all([
    getRegions(),
    getCooperativesByRegionSlug(slug),
  ]);

  const catalogRegion = findRegionByCatalogName(regions, adminRegion.nom);
  const title = catalogRegion?.nom ?? adminRegion.nom;

  return (
    <div className="space-y-12">
      <Link
        href="/regions"
        className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-burgundy"
      >
        <ArrowLeft className="h-4 w-4" />
        Carte des régions
      </Link>

      <RegionDetailHero title={title} profile={profile} />

      <section className="space-y-6" aria-labelledby="region-coops-heading">
        <h2 id="region-coops-heading" className="font-serif text-2xl text-charcoal">
          Coopératives
        </h2>

        {cooperatives.length === 0 ? (
          <EmptyState
            title="Pas encore de coopérative ici"
            description="On ajoute les coopératives au fur et à mesure qu'elles rejoignent Mantouji."
            actionLabel="Voir le catalogue"
            actionHref="/produits"
          />
        ) : (
          <ul className="divide-y divide-charcoal/10">
            {cooperatives.map((c) => (
              <li key={c.id}>
                <CooperativeCard cooperative={c} variant="directory" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex justify-center border-t border-charcoal/10 pt-8">
        <Link
          href="/cooperatives"
          className="inline-flex items-center gap-2 text-sm font-medium text-burgundy"
        >
          Toutes les coopératives
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
