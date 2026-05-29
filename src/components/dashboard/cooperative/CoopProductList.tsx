"use client";

import Link from "next/link";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ProductFormSheet } from "@/components/dashboard/cooperative/ProductFormSheet";
import { Button } from "@/components/ui/button";
import { ProductThumbnail } from "@/components/ui/product-thumbnail";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { ApiRequestError } from "@/lib/api-client";
import { formatPrice, productRatingStats } from "@/lib/utils";
import type { CoopProductInput, CoopProductRecord } from "@/types/coop-dashboard";

function moderationToBadge(
  status: CoopProductRecord["moderationStatus"]
): "approved" | "pending" | "rejected" {
  return status;
}

function RatingLine({ product }: { product: CoopProductRecord }) {
  const { average, count } = productRatingStats(product);
  if (count === 0) {
    return <span className="text-charcoal/50">Aucun avis</span>;
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden />
      <span className="font-semibold text-charcoal">{average}</span>
      <span className="text-charcoal/55">
        · {count} avis
      </span>
    </span>
  );
}

export function CoopProductList() {
  const { products, ready, createProduct, updateProduct, deleteProduct } =
    useCoopDashboard();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CoopProductRecord | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setListError(null);
    setFormOpen(true);
  };

  const openEdit = (product: CoopProductRecord) => {
    setEditing(product);
    setListError(null);
    setFormOpen(true);
  };

  const handleSubmit = async (input: CoopProductInput) => {
    setListError(null);
    try {
      if (editing) {
        await updateProduct(editing.id, input);
      } else {
        await createProduct(input);
      }
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Erreur lors de l'enregistrement.";
      setListError(message);
      throw err;
    }
  };

  const handleDelete = async (product: CoopProductRecord) => {
    const ok = window.confirm(
      `Supprimer « ${product.nom} » ? Cette action est définitive.`
    );
    if (!ok) return;
    setListError(null);
    try {
      await deleteProduct(product.id);
    } catch (err) {
      setListError(
        err instanceof ApiRequestError ? err.message : "Suppression impossible."
      );
    }
  };

  if (!ready) {
    return (
      <p className="py-12 text-center text-charcoal/50">Chargement des produits…</p>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-burgundy sm:text-3xl">Mes produits</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {products.length} fiche{products.length !== 1 ? "s" : ""} publiée
            {products.length !== 1 ? "s" : ""} — notes et avis synchronisés avec le site public
          </p>
        </div>
        <Button type="button" onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      {listError && (
        <p className="mb-4 rounded-lg border border-burgundy/30 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
          {listError}
        </p>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-charcoal/20 bg-sand/30 px-6 py-12 text-center">
          <p className="text-charcoal/70">Aucun produit pour le moment.</p>
          <Button type="button" className="mt-4" onClick={openCreate}>
            Créer votre premier produit
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => {
            return (
              <li
                key={p.id}
                className="flex flex-col gap-4 border border-charcoal/10 bg-white p-4 sm:flex-row sm:items-center"
              >
                <ProductThumbnail produit={p} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-lg text-charcoal">{p.nom}</h2>
                    <StatusBadge status={moderationToBadge(p.moderationStatus)} />
                  </div>
                  <p className="text-sm text-charcoal/60 line-clamp-2">{p.description}</p>
                  <p className="mt-2 text-sm font-medium text-burgundy">
                    {formatPrice(p.prix)}
                    <span className="mx-2 text-charcoal/30">|</span>
                    <RatingLine product={p} />
                  </p>
                  {p.viewsCount > 0 ? (
                    <p className="mt-1 text-xs text-charcoal/45">
                      {p.viewsCount} vue{p.viewsCount > 1 ? "s" : ""} sur la fiche produit
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-row gap-2 sm:flex-col lg:flex-row">
                  <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                    <Link href={`/produits/${p.id}`}>Voir</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-burgundy sm:flex-none"
                    onClick={() => handleDelete(p)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={openCreate}
        className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-cream shadow-lg lg:hidden"
        aria-label="Ajouter un produit"
      >
        <Plus className="h-6 w-6" />
      </button>

      <ProductFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSubmit={handleSubmit}
      />
    </>
  );
}
