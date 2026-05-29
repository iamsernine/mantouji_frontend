import Link from "next/link";
import { ProductThumbnail } from "@/components/ui/product-thumbnail";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import type { Produit } from "@/types/product";

type ProductCatalogCardProps = {
  produit: Produit;
  variant?: "default" | "favorite";
};

export function ProductCatalogCard({
  produit,
  variant = "default",
}: ProductCatalogCardProps) {
  const whatsappHref = generateWhatsAppLink(
    produit.cooperative.nomCooperative ? "212600000000" : "212600000000",
    produit.nom
  );

  if (variant === "favorite") {
    return (
      <article className="flex flex-col gap-6 border-b border-charcoal/10 py-8 sm:flex-row">
        <Link href={`/produits/${produit.id}`} className="shrink-0">
          <ProductThumbnail produit={produit} size="lg" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link href={`/produits/${produit.id}`}>
                <h3 className="font-serif text-xl text-charcoal transition-colors hover:text-burgundy">
                  {produit.nom}
                </h3>
              </Link>
              <Heart className="h-5 w-5 shrink-0 fill-terracotta text-terracotta" />
            </div>
            <p className="mt-1 font-medium text-burgundy">{formatPrice(produit.prix)}</p>
            <p className="mt-2 flex items-center gap-1 text-sm text-charcoal/60">
              <MapPin className="h-3.5 w-3.5" />
              {produit.cooperative.region.nom}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 pt-6">
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#25D366]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
            <Link
              href={`/produits/${produit.id}`}
              className="text-sm uppercase tracking-widest text-burgundy"
            >
              Détails →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border-b border-charcoal/10 py-8">
      <div className="group flex flex-col gap-6 sm:flex-row">
        <Link href={`/produits/${produit.id}`} className="shrink-0">
          <ProductThumbnail produit={produit} size="lg" />
        </Link>
        <div className="flex flex-1 flex-col justify-center gap-2">
          <span className="text-xs uppercase tracking-widest text-sage">
            {produit.cooperative.nomCooperative}
          </span>
          <Link href={`/produits/${produit.id}`}>
            <h3 className="font-serif text-2xl text-charcoal transition-colors hover:text-burgundy">
              {produit.nom}
            </h3>
          </Link>
          <p className="text-sm text-charcoal/60">
            {formatPrice(produit.prix)} · {produit.categorie.nom}
          </p>
          <p className="flex items-center gap-1 text-sm text-charcoal/50">
            <MapPin className="h-3.5 w-3.5" />
            {produit.cooperative.region.nom}
          </p>
          <div className="mt-2 flex flex-wrap gap-6">
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
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
