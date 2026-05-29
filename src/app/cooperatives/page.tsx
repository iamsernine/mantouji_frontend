export const dynamic = "force-dynamic";

import { CooperativeCard } from "@/components/cooperatives/CooperativeCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCooperatives } from "@/lib/api";

export default async function CooperativesPage() {
  const { data: cooperatives } = await getCooperatives();

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <PageHeader
        title="Nos Coopératives"
        description="Découvrez les artisans passionnés qui façonnent le terroir marocain. Chaque coopérative raconte une histoire unique, celle de femmes et d'hommes engagés pour une production authentique et durable."
        centered
      />
      <div className="space-y-8">
        {cooperatives.map((c) => (
          <CooperativeCard key={c.id} cooperative={c} variant="directory" />
        ))}
      </div>
    </div>
  );
}
