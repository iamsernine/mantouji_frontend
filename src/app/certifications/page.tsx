export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { images } from "@/lib/images";
import { getCertifications } from "@/lib/api";
import { onssaFilieres } from "@/data/onssa-filieres";
import type { Certification } from "@/types/product";

export default async function CertificationsPage() {
  const certifications: Certification[] = (await getCertifications()).data;
  const onssa = certifications.find((c) => c.nom.toUpperCase().includes("ONSSA"));

  return (
    <div className="space-y-16">
      <PageHeader
        title="Agrément ONSSA par filière"
        description="Sur Mantouji, la conformité sanitaire repose sur l'ONSSA : les coopératives demandent un agrément par filière d'activité (miel, dattes, huile d'olive…), et non produit par produit."
        centered
      />

      <div className="mx-auto max-w-2xl border border-sage/30 bg-sage-light/30 p-8 text-center">
        <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-sage" />
        <h3 className="font-serif text-xl text-charcoal">{onssa?.nom ?? "ONSSA"}</h3>
        <p className="mt-3 font-light text-sm leading-relaxed text-charcoal/65">
          {onssa?.description ??
            "Office National de Sécurité Sanitaire des produits Alimentaires — référence pour la mise sur le marché des produits du terroir."}
        </p>
      </div>

      <section>
        <h2 className="text-center font-serif text-2xl text-charcoal">
          Filières couvertes
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {onssaFilieres.map((f) => (
            <div
              key={f.id}
              className="border border-charcoal/10 bg-white p-5 text-center"
            >
              <p className="font-medium text-charcoal">{f.nom}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-burgundy">Autres labels de confiance</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {certifications
            .filter((c) => c.id !== onssa?.id)
            .map((c) => (
              <div key={c.id} className="border border-charcoal/10 p-6">
                <h3 className="font-serif text-lg text-charcoal">{c.nom}</h3>
                <p className="mt-2 text-sm text-charcoal/65">{c.description}</p>
              </div>
            ))}
        </div>
      </section>

      <div className="relative mx-auto aspect-[21/9] max-w-4xl overflow-hidden">
        <Image
          src={images.hero.terroir}
          alt="Terroir marocain"
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      <div className="text-center">
        <Button asChild>
          <Link href="/produits">Explorer le catalogue</Link>
        </Button>
      </div>
    </div>
  );
}
