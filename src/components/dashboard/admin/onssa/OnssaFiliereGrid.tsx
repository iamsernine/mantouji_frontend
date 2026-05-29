"use client";

import { Plus } from "lucide-react";
import { getFiliereIcon } from "@/data/onssa-filiere-icons";
import type { FiliereSheetRow } from "@/lib/onssa-db-storage";
import { cn } from "@/lib/utils";

type Props = {
  filieres: FiliereSheetRow[];
  onSelect: (filiere: FiliereSheetRow) => void;
  onAddFiliere?: () => void;
};

export function OnssaFiliereGrid({ filieres, onSelect, onAddFiliere }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {filieres.map((f) => {
        const Icon = getFiliereIcon(f.id);
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f)}
            className={cn(
              "flex min-h-[7.5rem] flex-col items-center justify-center gap-2 border border-charcoal/15 bg-white px-3 py-4 text-center transition-colors hover:border-burgundy/40 hover:bg-sand/30",
              f.enBaseNationale && "border-sage/50 bg-sage-light/20"
            )}
          >
            <Icon
              className="h-8 w-8 stroke-[1.25] text-charcoal/70"
              aria-hidden
            />
            <span className="text-xs font-medium leading-snug text-charcoal line-clamp-3">
              {f.nom}
            </span>
            {f.enBaseNationale && (
              <span className="text-[10px] uppercase tracking-wider text-sage">
                En base
              </span>
            )}
          </button>
        );
      })}
      {onAddFiliere && (
        <button
          type="button"
          onClick={onAddFiliere}
          className="flex min-h-[7.5rem] flex-col items-center justify-center gap-2 border border-dashed border-charcoal/25 bg-transparent px-3 py-4 text-charcoal/55 hover:border-burgundy/35 hover:text-burgundy"
        >
          <Plus className="h-8 w-8 stroke-[1.25]" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Nouvelle filière
          </span>
        </button>
      )}
    </div>
  );
}
