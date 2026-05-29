import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import type { Cooperative } from "@/types/cooperative";

export function ProductCooperativeIdentity({ cooperative }: { cooperative: Cooperative }) {
  return (
    <Link
      href={`/cooperatives/${cooperative.id}`}
      className="flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-sand/30 p-4 transition-colors hover:border-sage/40 hover:bg-sand/50"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-charcoal/10 bg-white">
        <ProductImage
          src={cooperative.logoUrl}
          alt={cooperative.nomCooperative}
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-sage">Coopérative</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-sage/30 bg-sage/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sage">
            <BadgeCheck className="h-3 w-3" />
            Partenaire vérifié
          </span>
        </div>
        <p className="mt-1 font-serif text-lg font-semibold text-charcoal">
          {cooperative.nomCooperative}
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm text-charcoal/60">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {cooperative.region.nom}
        </p>
      </div>
    </Link>
  );
}
