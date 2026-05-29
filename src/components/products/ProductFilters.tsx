"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Disponibilite } from "@/types/api";
import type { Categorie, Certification, Region } from "@/types/product";

export type ProductFiltersState = {
  search: string;
  regionId: string;
  categorieId: string;
  certificationId: string;
  prixMax: number;
  disponibilite: Disponibilite | "";
};

type ProductFiltersProps = {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
  prixMaxRange?: number;
  categories: Categorie[];
  regions: Region[];
  certifications: Certification[];
};

function FilterFields({
  filters,
  onChange,
  prixMaxRange = 200,
  categories,
  regions,
  certifications,
}: ProductFiltersProps) {
  const update = (patch: Partial<ProductFiltersState>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Recherche
        </label>
        <Input
          placeholder="Nom du produit..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Région
        </label>
        <select
          className="flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-3 text-base"
          value={filters.regionId}
          onChange={(e) => update({ regionId: e.target.value })}
        >
          <option value="">Toutes les régions</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Catégorie
        </label>
        <select
          className="flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-3 text-base"
          value={filters.categorieId}
          onChange={(e) => update({ categorieId: e.target.value })}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icone} {c.nom}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Certification
        </label>
        <select
          className="flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-3 text-base"
          value={filters.certificationId}
          onChange={(e) => update({ certificationId: e.target.value })}
        >
          <option value="">Toutes</option>
          {certifications.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Prix max : {filters.prixMax} MAD
        </label>
        <input
          type="range"
          min={20}
          max={prixMaxRange}
          step={5}
          value={filters.prixMax}
          onChange={(e) => update({ prixMax: Number(e.target.value) })}
          className="w-full accent-burgundy"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Disponibilité
        </label>
        <select
          className="flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-3 text-base"
          value={filters.disponibilite}
          onChange={(e) =>
            update({
              disponibilite: e.target.value as ProductFiltersState["disponibilite"],
            })
          }
        >
          <option value="">Toutes</option>
          <option value="EN_STOCK">En stock</option>
          <option value="LIMITE">Stock limité</option>
          <option value="RUPTURE">Rupture</option>
        </select>
      </div>
      <Button
        variant="ghost"
        onClick={() =>
          onChange({
            search: "",
            regionId: "",
            categorieId: "",
            certificationId: "",
            prixMax: prixMaxRange,
            disponibilite: "",
          })
        }
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-28 border-t border-charcoal/10 py-6">
          <h2 className="mb-4 font-serif text-lg font-semibold text-charcoal">
            Filtres
          </h2>
          <FilterFields {...props} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtrer les produits</SheetTitle>
            </SheetHeader>
            <FilterFields {...props} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export const defaultFilters: ProductFiltersState = {
  search: "",
  regionId: "",
  categorieId: "",
  certificationId: "",
  prixMax: 200,
  disponibilite: "",
};
