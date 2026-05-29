export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CooperativeCard } from "@/components/cooperatives/CooperativeCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
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
  const { data: regions } = await getRegions();
  const catalogRegion = regions.find((r) =>
    adminRegion.nom.toLowerCase().includes(r.nom.toLowerCase().split("-")[0] ?? "")
  );
  const cooperatives = await getCooperativesByRegionSlug(slug);
  const title = catalogRegion?.nom ?? adminRegion.nom;
  const description =
    catalogRegion?.description ??
    "Ce terroir n'a pas encore de coopérative partenaire référencée sur Mantouji.";

  return (
    <div className="space-y-8">
      <Link
        href="/regions"
        className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-burgundy"
      >
        <ArrowLeft className="h-4 w-4" />
        Toutes les régions
      </Link>

      <PageHeader title={title} description={description} />

      {cooperatives.length === 0 ? (
        <EmptyState
          title="Aucune coopérative référencée"
          description="Revenez bientôt — de nouvelles coopératives rejoignent Mantouji régulièrement."
        />
      ) : (
        <div className="space-y-6">
          {cooperatives.map((c) => (
            <CooperativeCard key={c.id} cooperative={c} variant="directory" />
          ))}
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Link
          href="/cooperatives"
          className="inline-flex items-center gap-2 text-sm font-medium text-burgundy"
        >
          Voir toutes les coopératives
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
