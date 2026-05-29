export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { CooperativeHero } from "@/components/cooperatives/CooperativeHero";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
import { CertificationBadge } from "@/components/products/CertificationBadge";
import { WhatsAppCTA } from "@/components/products/WhatsAppCTA";
import { getCooperativeById, getProductsByCooperative } from "@/lib/api";

export default async function CooperativePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coopResult = await getCooperativeById(id);
  if (!coopResult) notFound();
  const cooperative = coopResult.data;

  const products = await getProductsByCooperative(id);
  const coopCerts = [
    ...new Map(
      products.flatMap((p) => p.certifications.map((c) => [c.id, c] as const))
    ).values(),
  ];

  return (
    <div className="space-y-8">
      <CooperativeHero cooperative={cooperative} />

      <section className="rounded-2xl bg-gradient-to-br from-terracotta/15 via-gold-light/30 to-sand p-6">
        <h2 className="font-serif text-2xl font-bold text-burgundy">Our Story</h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {cooperative.histoire || cooperative.description}
        </p>
        <blockquote className="mt-4 border-l-2 border-burgundy/40 pl-4 font-serif italic text-charcoal/80">
          « Chaque récolte porte la mémoire de notre terroir et le savoir-faire
          de nos membres. »
        </blockquote>
      </section>

      {coopCerts.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-xl font-bold text-charcoal">
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2">
            {coopCerts.map((c) => (
              <CertificationBadge key={c.id} cert={c} />
            ))}
          </div>
        </section>
      )}

      <WhatsAppCTA
        productName={`produits — ${cooperative.nomCooperative}`}
        phone={cooperative.whatsapp || cooperative.telephone || "212600000000"}
      />

      <section>
        <h2 className="mb-6 font-serif text-2xl font-bold text-charcoal">
          Produits de {cooperative.nomCooperative}
        </h2>
        {products.length === 0 ? (
          <p className="text-charcoal/60">Aucun produit publié pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <ProductCatalogCard key={p.id} produit={p} />
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-sm text-charcoal/60">
        <Link href="/cooperatives" className="text-burgundy hover:underline">
          ← Toutes les coopératives
        </Link>
      </p>
    </div>
  );
}
