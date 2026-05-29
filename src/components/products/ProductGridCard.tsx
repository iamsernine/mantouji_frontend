import Link from "next/link";
import { MapPin } from "lucide-react";
import { ProductThumbnail } from "@/components/ui/product-thumbnail";
import { CertificationBadge } from "./CertificationBadge";
import { formatPrice } from "@/lib/utils";
import type { Produit } from "@/types/product";

export function ProductGridCard({ produit }: { produit: Produit }) {
  return (
    <Link href={`/produits/${produit.id}`} className="group flex flex-col items-center text-center">
      <div className="relative mb-4">
        <ProductThumbnail
          produit={produit}
          size="lg"
          className="h-28 w-28 transition-transform duration-500 group-hover:scale-105"
        />
        {produit.certifications[0] && (
          <div className="absolute -left-1 -top-1">
            <CertificationBadge cert={produit.certifications[0]} />
          </div>
        )}
      </div>
      <span className="text-xs font-medium uppercase tracking-widest text-sage">
        {produit.cooperative.nomCooperative}
      </span>
      <h3 className="mt-2 font-serif text-xl text-charcoal transition-colors group-hover:text-burgundy md:text-2xl">
        {produit.nom}
      </h3>
      <p className="mt-1 text-sm font-medium text-burgundy">{formatPrice(produit.prix)}</p>
      <p className="mt-2 flex items-center justify-center gap-1 text-xs text-charcoal/50">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate">{produit.cooperative.region.nom}</span>
      </p>
    </Link>
  );
}
