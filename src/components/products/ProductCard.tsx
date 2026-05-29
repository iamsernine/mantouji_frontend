import Link from "next/link";
import { MapPin, MessageCircle, Star } from "lucide-react";
import { ProductThumbnail } from "@/components/ui/product-thumbnail";
import { Badge } from "@/components/ui/badge";
import { CertificationBadge } from "./CertificationBadge";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice, productRatingStats } from "@/lib/utils";
import type { Produit } from "@/types/product";

export function ProductCard({ produit }: { produit: Produit }) {
  const { average: rating } = productRatingStats(produit);
  const whatsappHref = generateWhatsAppLink("212600000000", produit.nom);

  return (
    <article className="group border-b border-charcoal/10 py-8">
      <Link href={`/produits/${produit.id}`} className="flex flex-col gap-6 sm:flex-row">
        <div className="shrink-0 sm:w-24">
          <ProductThumbnail produit={produit} size="lg" className="group-hover:ring-2 group-hover:ring-burgundy/20" />
          {produit.certifications[0] && (
            <div className="absolute left-0 top-0">
              <CertificationBadge cert={produit.certifications[0]} />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-2xl text-charcoal transition-colors group-hover:text-burgundy">
              {produit.nom}
            </h3>
            {rating > 0 && (
              <span className="flex shrink-0 items-center gap-1 text-sm text-charcoal/60">
                <Star className="h-4 w-4 fill-gold text-gold" />
                {rating}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-sm text-charcoal/50">
            <MapPin className="h-3.5 w-3.5" />
            {produit.cooperative.region.nom}
          </p>
          <p className="line-clamp-2 font-light text-charcoal/70">{produit.description}</p>
          <div className="mt-auto flex flex-wrap items-center gap-4">
            <span className="font-medium text-burgundy">{formatPrice(produit.prix)}</span>
            <Badge
              variant={
                produit.disponibilite === "EN_STOCK"
                  ? "olive"
                  : produit.disponibilite === "LIMITE"
                    ? "gold"
                    : "outline"
              }
            >
              {produit.disponibilite === "EN_STOCK"
                ? "Disponible"
                : produit.disponibilite === "LIMITE"
                  ? "Stock limité"
                  : "Rupture"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <Link
              href={`/produits/${produit.id}`}
              className="text-sm uppercase tracking-widest text-burgundy"
            >
              Voir la fiche
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#25D366]"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Link>
          </div>
        </div>
      </Link>
    </article>
  );
}
