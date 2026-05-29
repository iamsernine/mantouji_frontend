export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ProductReviewComposer } from "@/components/products/ProductReviewComposer";
import { ProductReviews } from "@/components/products/ProductReviews";
import { ProductShowcase } from "@/components/products/ProductShowcase";
import { getCooperativeById, getProductById, getProductReviews } from "@/lib/api";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProductById(id);
  if (!result) notFound();
  const produit = result.data;

  const coopResult = produit.cooperative.id
    ? await getCooperativeById(produit.cooperative.id)
    : null;
  const cooperative = coopResult?.data ?? null;

  const reviewsRes = await getProductReviews(id);
  const avis = reviewsRes.data;

  const phone =
    cooperative?.whatsapp ?? cooperative?.telephone ?? "212600000000";

  return (
    <>
      <ProductShowcase
        produit={produit}
        cooperative={cooperative}
        avis={avis}
        phone={phone}
      />

      <div
        id="avis-complet"
        className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-28 sm:px-6 md:pb-12 lg:px-8"
      >
        <ProductReviews avis={avis} />
        <div id="avis-composer">
          <ProductReviewComposer produitId={id} />
        </div>
      </div>
    </>
  );
}
