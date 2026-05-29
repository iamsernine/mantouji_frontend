"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
import { CategoryPills } from "@/components/products/CategoryPills";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { getCategories, getProducts } from "@/lib/api";
import type { Categorie, Produit } from "@/types/product";

export default function RecherchePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [categorieId, setCategorieId] = useState("");
  const [products, setProducts] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setLoading(true);
    Promise.all([
      getProducts({ search: q || undefined }),
      getCategories(),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categorieId && p.categorie.id !== categorieId) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        p.nom.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, query, categorieId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
        <Input
          type="search"
          placeholder="Rechercher un produit, une région..."
          className="h-12 pl-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <PageHeader
        title={query ? `Résultats pour : ${query}` : "Recherche"}
        description={`${filtered.length} produit${filtered.length !== 1 ? "s" : ""} trouvé${filtered.length !== 1 ? "s" : ""}`}
      />

      <CategoryPills
        categories={categories}
        selectedId={categorieId}
        onSelect={setCategorieId}
        totalCount={products.length}
      />

      {loading ? (
        <p className="text-center text-charcoal/60">Recherche en cours…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Aucun résultat"
          description="Essayez un autre mot-clé ou explorez le catalogue complet."
          actionLabel="Voir tout le catalogue"
          actionHref="/produits"
        />
      ) : (
        <div className="space-y-5">
          {filtered.map((p) => (
            <ProductCatalogCard key={p.id} produit={p} />
          ))}
        </div>
      )}
    </div>
  );
}
