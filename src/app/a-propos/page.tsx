export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { images } from "@/lib/images";
import { getCooperatives, getProducts, getRegions } from "@/lib/api";

export default async function AProposPage() {
  const [coops, regions, products] = await Promise.all([
    getCooperatives(),
    getRegions(),
    getProducts(),
  ]);

  const stats = [
    { icon: Building2, value: coops.data.length, label: "Coopératives" },
    { icon: MapPin, value: regions.data.length, label: "Régions" },
    { icon: Package, value: products.data.length, label: "Produits" },
  ];

  return (
    <div className="space-y-16">
      <PageHeader title="Notre histoire" />

      <div className="grid gap-12 md:grid-cols-12 md:items-start">
        <div className="space-y-6 md:col-span-7">
          <p className="text-lg font-light leading-relaxed text-charcoal/70">
            Chez Mantouji, nous croyons en la puissance du terroir marocain. Notre
            mission est de connecter les coopératives locales aux amoureux du
            terroir — sans intermédiaires, avec transparence et confiance.
          </p>
          <blockquote className="border-l border-burgundy/40 py-2 pl-6 font-serif text-xl italic text-charcoal/85">
            « Le véritable trésor du Maroc réside dans les mains de ceux qui
            façonnent ses merveilles avec amour et dévouement. »
          </blockquote>
          <p className="font-light leading-relaxed text-charcoal/70">
            Chaque produit raconte une histoire de tradition et de savoir-faire
            ancestral. Nous promouvons un commerce équitable qui valorise nos
            partenaires et préserve notre patrimoine culturel.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden md:col-span-5">
          <Image
            src={images.hero.story}
            alt="Artisans marocains"
            fill
            className="object-cover grayscale-[15%]"
            sizes="40vw"
          />
        </div>
      </div>

      <section className="grid grid-cols-3 gap-8 border-t border-charcoal/10 py-10">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center">
            <Icon className="mx-auto mb-3 h-7 w-7 text-sage" />
            <p className="font-serif text-3xl text-burgundy">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-charcoal/50">
              {label}
            </p>
          </div>
        ))}
      </section>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/cooperatives">Découvrir nos coopératives</Link>
        </Button>
      </div>
    </div>
  );
}
