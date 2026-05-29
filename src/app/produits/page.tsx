export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { ProductsCatalog } from "@/components/products/ProductsCatalog";
import { getCategories, getCertifications, getRegions } from "@/lib/api";

export default async function ProduitsPage() {
  const [categoriesRes, regionsRes, certsRes] = await Promise.all([
    getCategories(),
    getRegions(),
    getCertifications(),
  ]);

  return (
    <Suspense>
      <ProductsCatalog
        initialCategories={categoriesRes.data}
        initialRegions={regionsRes.data}
        initialCertifications={certsRes.data}
      />
    </Suspense>
  );
}
