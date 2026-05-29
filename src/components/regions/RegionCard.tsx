import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { ArrowRight } from "lucide-react";
import type { RegionCatalogMeta } from "@/types/region-catalog";

type RegionCardProps = {
  region: RegionCatalogMeta;
  coopCount?: number;
};

export function RegionCard({ region, coopCount }: RegionCardProps) {
  return (
    <Link
      href={`/regions?region=${region.mapCode}`}
      className="group flex flex-col border-b border-charcoal/10 py-8"
    >
      <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden">
        {region.imageUrl ? (
          <ProductImage
            src={region.imageUrl}
            alt={region.nom}
            className="transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sage/30 via-cream to-burgundy/20" />
        )}
      </div>
      <h3 className="font-serif text-2xl text-charcoal transition-colors group-hover:text-burgundy">
        {region.nom}
      </h3>
      <p className="mt-2 font-light leading-relaxed text-charcoal/60">{region.description}</p>
      {(coopCount !== undefined || region.productCount !== undefined) && (
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal/40">
          {coopCount !== undefined && (
            <>
              {coopCount} coopérative{coopCount !== 1 ? "s" : ""}
              {region.productCount !== undefined && " · "}
            </>
          )}
          {region.productCount !== undefined && (
            <>
              {region.productCount} produit{region.productCount !== 1 ? "s" : ""}
            </>
          )}
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-burgundy">
        Voir les coopératives
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
