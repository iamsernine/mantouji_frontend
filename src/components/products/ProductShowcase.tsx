import { Check } from "lucide-react";
import { CertificationBadge } from "@/components/products/CertificationBadge";
import { ProductCooperativeIdentity } from "@/components/products/ProductCooperativeIdentity";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductRatingInline } from "@/components/products/ProductRatingInline";
import { ProductReviewsPreview } from "@/components/products/ProductReviewsPreview";
import { WhatsAppCTA } from "@/components/products/WhatsAppCTA";
import { Badge } from "@/components/ui/badge";
import type { Cooperative } from "@/types/cooperative";
import type { Avis, Produit } from "@/types/product";
import { formatPrice } from "@/lib/utils";

function disponibiliteLabel(d: Produit["disponibilite"]) {
  switch (d) {
    case "EN_STOCK":
      return "En stock";
    case "LIMITE":
      return "Stock limité";
    default:
      return "Rupture";
  }
}

export function ProductShowcase({
  produit,
  cooperative,
  avis,
  phone,
}: {
  produit: Produit;
  cooperative: Cooperative | null;
  avis: Avis[];
  phone: string;
}) {
  const regionLabel = cooperative?.region.nom ?? produit.cooperative.region.nom;
  const terroirSubtitle = [produit.origine, regionLabel].filter(Boolean).join(" · ");

  const trustTeaser =
    produit.description?.trim() ||
    "Produit du terroir marocain, sélectionné auprès d’une coopérative partenaire pour garantir authenticité et traçabilité.";

  return (
    <div className="mx-auto w-full max-w-7xl pb-8 pt-2 sm:pt-4 md:pt-8">
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] xl:gap-14">
        {/* 1. Carousel — full-bleed on mobile, dominant left column on desktop */}
        <div className="-mx-4 px-2 sm:mx-0 sm:px-0 lg:sticky lg:top-20 lg:self-start xl:top-24">
          <ProductGallery medias={produit.medias ?? []} alt={produit.nom} variant="showcase" />
        </div>

        {/* 2–10. Trust-first content column */}
        <div className="flex min-w-0 flex-col gap-4 px-4 sm:gap-5 sm:px-0 md:gap-6 lg:px-2">
          {/* Name & origin */}
          <header className="space-y-2">
            {terroirSubtitle ? (
              <p className="text-sm font-semibold uppercase tracking-widest text-sage">
                {terroirSubtitle}
              </p>
            ) : null}
            <h1 className="font-serif text-3xl font-bold leading-tight text-charcoal md:text-4xl">
              {produit.nom}
            </h1>
            <p className="text-2xl font-semibold text-burgundy">{formatPrice(produit.prix)}</p>
          </header>

          {/* Cooperative identity */}
          {cooperative ? <ProductCooperativeIdentity cooperative={cooperative} /> : null}

          {/* Rating & social proof */}
          <ProductRatingInline avis={avis} />

          {/* Short trust description */}
          <section className="rounded-2xl border border-charcoal/10 bg-white p-5">
            <p className="text-base leading-relaxed text-charcoal/80 line-clamp-4">{trustTeaser}</p>
            <ul className="mt-4 space-y-2 border-t border-charcoal/10 pt-4 text-sm text-charcoal/70">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                Origine terroir et production artisanale
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                Contact direct avec la coopérative productrice
              </li>
              {produit.certifications.length > 0 ? (
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  Certifications et labels de qualité affichés
                </li>
              ) : null}
            </ul>
          </section>

          {/* Certifications */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal/60">
              Certifications & labels
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="olive" className="rounded-full px-3 py-1 text-xs uppercase">
                Terroir marocain
              </Badge>
              {produit.certifications.map((c) => (
                <CertificationBadge key={c.id} cert={c} />
              ))}
              {produit.certifications.length === 0 ? (
                <span className="text-sm text-charcoal/50">Labels en cours de publication</span>
              ) : null}
            </div>
          </section>

          {/* General product information */}
          <section className="rounded-2xl border border-charcoal/10 bg-sand/40 p-5">
            <h2 className="font-serif text-lg font-semibold text-charcoal">
              Informations produit
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-burgundy">
                  Catégorie
                </dt>
                <dd className="mt-1 text-charcoal/85">
                  {produit.categorie.icone} {produit.categorie.nom}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-burgundy">
                  Origine
                </dt>
                <dd className="mt-1 text-charcoal/85">{produit.origine || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-burgundy">
                  Composition
                </dt>
                <dd className="mt-1 text-charcoal/85">{produit.composition || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest text-burgundy">
                  Disponibilité
                </dt>
                <dd className="mt-1 text-charcoal/85">{disponibiliteLabel(produit.disponibilite)}</dd>
              </div>
              {cooperative ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-burgundy">
                    Producteur
                  </dt>
                  <dd className="mt-1 text-charcoal/85">{cooperative.nomCooperative}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          {/* Reviews preview — before CTA */}
          <ProductReviewsPreview avis={avis} limit={3} />

          {/* WhatsApp — primary action, sticky on mobile */}
          <div className="pt-1">
            <WhatsAppCTA
              productName={produit.nom}
              phone={phone}
              sticky
              size="lg"
              label="Contacter la coopérative sur WhatsApp"
            />
            <p className="mt-2 text-center text-xs text-charcoal/50 md:text-left">
              Réponse directe du producteur — sans intermédiaire
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
