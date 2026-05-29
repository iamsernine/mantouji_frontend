import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/utils";
import type { Cooperative } from "@/types/cooperative";

type CooperativeCardProps = {
  cooperative: Cooperative;
  variant?: "default" | "directory";
};

export function CooperativeCard({
  cooperative,
  variant = "default",
}: CooperativeCardProps) {
  if (variant === "directory") {
    return (
      <Link
        href={`/cooperatives/${cooperative.id}`}
        className="group flex items-center gap-5 border-b border-charcoal/10 py-6"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
          <ProductImage
            src={cooperative.logoUrl}
            alt={cooperative.nomCooperative}
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg text-charcoal group-hover:text-burgundy">
            {cooperative.nomCooperative}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-charcoal/50">
            <MapPin className="h-3.5 w-3.5" />
            {cooperative.region.nom}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-charcoal/30 transition-transform group-hover:translate-x-1 group-hover:text-burgundy" />
      </Link>
    );
  }

  return (
    <Link
      href={`/cooperatives/${cooperative.id}`}
      className={cn("group flex flex-col border-b border-charcoal/10 py-8")}
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-charcoal/10 bg-sand">
          <ProductImage
            src={cooperative.logoUrl}
            alt={cooperative.nomCooperative}
            sizes="56px"
            className="object-cover"
          />
        </div>
      </div>
      <h3 className="font-serif text-xl text-charcoal transition-colors group-hover:text-burgundy md:text-2xl">
        {cooperative.nomCooperative}
      </h3>
      <p className="mt-2 line-clamp-2 font-light text-charcoal/60">{cooperative.description}</p>
      <p className="mt-3 flex items-center gap-1 text-xs uppercase tracking-widest text-charcoal/50">
        <MapPin className="h-3.5 w-3.5" />
        {cooperative.region.nom}
      </p>
    </Link>
  );
}
