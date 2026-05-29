"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryPills } from "@/components/products/CategoryPills";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
import {
  ProductFilters,
  defaultFilters,
  type ProductFiltersState,
} from "@/components/products/ProductFilters";
import { getProducts } from "@/lib/api";
import type { Categorie, Certification, Produit, Region } from "@/types/product";

type ProductsCatalogProps = {
  initialCategories: Categorie[];
  initialRegions: Region[];
  initialCertifications: Certification[];
};

export function ProductsCatalog({
  initialCategories,
  initialRegions,
  initialCertifications,
}: ProductsCatalogProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFiltersState>(defaultFilters);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const categorie = searchParams.get("categorie") ?? "";
    const region = searchParams.get("region") ?? "";
    setFilters((prev) => ({
      ...prev,
      search: q || prev.search,
      categorieId: categorie || prev.categorieId,
      regionId: region || prev.regionId,
    }));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts({
      search: filters.search || undefined,
      categorieId: filters.categorieId || undefined,
      regionId: filters.regionId || undefined,
      maxPrix: filters.prixMax < 200 ? filters.prixMax : undefined,
      disponibilite:
        filters.disponibilite === "EN_STOCK"
          ? true
          : filters.disponibilite === "RUPTURE"
            ? false
            : undefined,
    })
      .then(({ data }) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.categorieId, filters.regionId, filters.prixMax, filters.disponibilite]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (
        filters.certificationId &&
        !p.certifications.some((c) => c.id === filters.certificationId)
      ) {
        return false;
      }
      return true;
    });
  }, [products, filters.certificationId]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Nos Produits
        </p>
        <h1 className="font-serif text-3xl font-bold text-charcoal md:text-4xl">
          Catalogue du terroir
        </h1>
      </header>

      <CategoryPills
        categories={initialCategories}
        selectedId={filters.categorieId}
        onSelect={(id) => setFilters((f) => ({ ...f, categorieId: id }))}
      />

      <ProductFilters
        filters={filters}
        onChange={setFilters}
        categories={initialCategories}
        regions={initialRegions}
        certifications={initialCertifications}
      />

      {loading ? (
        <p className="py-12 text-center text-charcoal/60">Chargement du catalogue…</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-charcoal/60">Aucun produit trouvé.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => (
            <ProductCatalogCard key={p.id} produit={p} />
          ))}
        </div>
      )}
    </div>
  );
}
