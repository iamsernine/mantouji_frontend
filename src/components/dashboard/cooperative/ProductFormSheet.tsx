"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { shouldBypassImageOptimizer } from "@/lib/media-url";
import { MAX_PRODUCT_IMAGES, getCategories } from "@/lib/api";
import type { CoopProductInput, CoopProductRecord } from "@/types/coop-dashboard";
import type { Categorie } from "@/types/product";
import type { Disponibilite } from "@/types/api";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
const MAX_IMAGE_MB = 10;

const selectClass =
  "flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-base text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30";

const textareaClass =
  "min-h-[88px] w-full resize-y rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-base text-charcoal placeholder:text-charcoal/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30";

type ExistingMedia = { id: string; url: string };
type PendingFile = { file: File; preview: string };

function emptyForm(categorieId = ""): CoopProductInput {
  return {
    nom: "",
    description: "",
    origine: "",
    composition: "",
    prix: 0,
    disponibilite: "EN_STOCK",
    categorieId,
    histoire: "",
    imageFiles: [],
    removeMediaIds: [],
  };
}

function fromProduct(product: CoopProductRecord): CoopProductInput {
  return {
    nom: product.nom,
    description: product.description,
    origine: product.origine,
    composition: product.composition,
    prix: product.prix,
    disponibilite: product.disponibilite,
    categorieId: product.categorie.id,
    histoire: product.histoire ?? "",
    imageFiles: [],
    removeMediaIds: [],
  };
}

type ProductFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: CoopProductRecord | null;
  onSubmit: (input: CoopProductInput) => Promise<void>;
};

export function ProductFormSheet({
  open,
  onOpenChange,
  product,
  onSubmit,
}: ProductFormSheetProps) {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [form, setForm] = useState<CoopProductInput>(emptyForm());
  const [existingMedias, setExistingMedias] = useState<ExistingMedia[]>([]);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(product);

  const totalImages = useMemo(
    () =>
      existingMedias.filter((m) => !removedIds.includes(m.id)).length + pendingFiles.length,
    [existingMedias, removedIds, pendingFiles]
  );

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!open) return;
    const defaultCat = categories[0]?.id ?? "";
    setForm(product ? fromProduct(product) : emptyForm(defaultCat));
    setExistingMedias(
      product?.medias.filter((m) => m.type === "image").slice(0, MAX_PRODUCT_IMAGES).map((m) => ({
        id: m.id,
        url: m.url,
      })) ?? []
    );
    setRemovedIds([]);
    setPendingFiles([]);
    setError(null);
    setSubmitting(false);
  }, [open, product, categories]);

  useEffect(() => {
    return () => {
      pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, [pendingFiles]);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: PendingFile[] = [];
    for (const file of Array.from(files)) {
      if (totalImages + next.length >= MAX_PRODUCT_IMAGES) break;
      if (!ACCEPTED_IMAGE_TYPES.split(",").includes(file.type)) {
        setError("Format accepté : JPEG, PNG ou WebP.");
        return;
      }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        setError(`Image trop lourde (max. ${MAX_IMAGE_MB} Mo).`);
        return;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    if (next.length) {
      setPendingFiles((prev) => [...prev, ...next]);
      setError(null);
    }
  };

  const removePending = (index: number) => {
    setPendingFiles((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const removeExisting = (id: string) => {
    setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.description.trim()) {
      setError("Le nom et la description sont obligatoires.");
      return;
    }
    if (form.prix <= 0) {
      setError("Indiquez un prix supérieur à 0.");
      return;
    }
    if (!isEdit && totalImages < 1) {
      setError("Ajoutez au moins une photo du produit.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        imageFiles: pendingFiles.map((p) => p.file),
        removeMediaIds: removedIds,
      });
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Enregistrement impossible. Réessayez."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const visibleExisting = existingMedias.filter((m) => !removedIds.includes(m.id));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="responsive" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Modifier le produit" : "Nouveau produit"}</SheetTitle>
          <SheetDescription className="sr-only">
            {isEdit
              ? "Modifiez les informations et les photos de votre produit."
              : "Renseignez les informations et ajoutez jusqu'à 3 photos."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 pb-8">
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal">
              Photos du produit ({totalImages}/{MAX_PRODUCT_IMAGES}) {!isEdit && "*"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {visibleExisting.map((m) => (
                <div
                  key={m.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-charcoal/15 bg-sand/40"
                >
                  <Image
                    src={m.url}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={shouldBypassImageOptimizer(m.url)}
                    sizes="96px"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(m.id)}
                    className="absolute right-1 top-1 rounded-full bg-charcoal/70 p-1 text-cream"
                    aria-label="Retirer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {pendingFiles.map((p, i) => (
                <div
                  key={p.preview}
                  className="relative aspect-square overflow-hidden rounded-lg border border-charcoal/15 bg-sand/40"
                >
                  <Image
                    src={p.preview}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="96px"
                  />
                  <button
                    type="button"
                    onClick={() => removePending(i)}
                    className="absolute right-1 top-1 rounded-full bg-charcoal/70 p-1 text-cream"
                    aria-label="Retirer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {totalImages < MAX_PRODUCT_IMAGES && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-charcoal/25 bg-sand/30 text-center transition-colors hover:border-burgundy/40">
                  <ImagePlus className="h-6 w-6 text-sage" />
                  <span className="px-1 text-[10px] text-charcoal/60">Ajouter</span>
                  <input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES}
                    multiple
                    className="sr-only"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </label>
              )}
            </div>
            <p className="mt-1 text-xs text-charcoal/50">
              Carré, redimensionné automatiquement (480×480). JPEG, PNG ou WebP.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal" htmlFor="nom">
              Nom du produit
            </label>
            <Input
              id="nom"
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              placeholder="Ex. Dattes Aziza de Figuig"
              required
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-charcoal"
              htmlFor="description"
            >
              Description courte
            </label>
            <textarea
              id="description"
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Résumé pour la fiche produit"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal" htmlFor="prix">
                Prix (MAD)
              </label>
              <Input
                id="prix"
                type="number"
                min={1}
                step={1}
                value={form.prix || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, prix: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-charcoal"
                htmlFor="disponibilite"
              >
                Disponibilité
              </label>
              <select
                id="disponibilite"
                className={selectClass}
                value={form.disponibilite}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    disponibilite: e.target.value as Disponibilite,
                  }))
                }
              >
                <option value="EN_STOCK">En stock</option>
                <option value="LIMITE">Stock limité</option>
                <option value="RUPTURE">Rupture</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-charcoal"
              htmlFor="categorie"
            >
              Catégorie
            </label>
            <select
              id="categorie"
              className={selectClass}
              value={form.categorieId}
              onChange={(e) => setForm((f) => ({ ...f, categorieId: e.target.value }))}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icone} {c.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal" htmlFor="origine">
              Origine
            </label>
            <Input
              id="origine"
              value={form.origine}
              onChange={(e) => setForm((f) => ({ ...f, origine: e.target.value }))}
              placeholder="Région, terroir"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-charcoal"
              htmlFor="composition"
            >
              Composition
            </label>
            <Input
              id="composition"
              value={form.composition}
              onChange={(e) => setForm((f) => ({ ...f, composition: e.target.value }))}
              placeholder="Ingrédients, 100% naturel…"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal" htmlFor="histoire">
              Histoire (optionnel)
            </label>
            <textarea
              id="histoire"
              className={textareaClass}
              value={form.histoire}
              onChange={(e) => setForm((f) => ({ ...f, histoire: e.target.value }))}
              placeholder="Récit artisanal du produit"
            />
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button type="submit" className="w-full sm:flex-1" disabled={submitting}>
              {submitting
                ? "Enregistrement…"
                : isEdit
                  ? "Enregistrer"
                  : "Créer le produit"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
