"use client";

import { useEffect, useState } from "react";
import { ProductCatalogCard } from "@/components/products/ProductCatalogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProductById } from "@/lib/api";
import { getFavoriteIds } from "@/lib/favorites";
import type { Produit } from "@/types/product";

export default function FavorisPage() {
  const [favorites, setFavorites] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getFavoriteIds();
    if (!ids.length) {
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => getProductById(id)))
      .then((results) => setFavorites(results.filter(Boolean).map((r) => r!.data)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mes favoris"
        description="Une sélection de vos trésors du terroir marocain, sauvegardés pour leur authenticité."
      />

      {loading ? (
        <p className="text-center text-charcoal/60">Chargement…</p>
      ) : favorites.length === 0 ? (
        <EmptyState
          title="Aucun produit enregistré"
          description="Parcourez le catalogue et ajoutez vos coups de cœur du terroir."
        />
      ) : (
        <div className="space-y-5">
          {favorites.map((p) => (
            <ProductCatalogCard key={p.id} produit={p} variant="favorite" />
          ))}
        </div>
      )}
    </div>
  );
}
