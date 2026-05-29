"use client";

import { Check } from "lucide-react";
import { getFiliereIcon } from "@/data/onssa-filiere-icons";
import type { OnssaFiliere } from "@/data/onssa-filieres";
import { cn } from "@/lib/utils";

type Props = {
  filieres: OnssaFiliere[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  inBaseCheck?: (id: string) => boolean;
};

export function OnssaFiliereSelectGrid({
  filieres,
  selectedIds,
  onToggle,
  inBaseCheck,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {filieres.map((f) => {
        const Icon = getFiliereIcon(f.id);
        const selected = selectedIds.includes(f.id);
        const inBase = inBaseCheck?.(f.id);

        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onToggle(f.id)}
            className={cn(
              "relative flex min-h-[7rem] flex-col items-center justify-center gap-2 border px-2 py-3 text-center transition-colors",
              selected
                ? "border-sage bg-sage-light/30"
                : "border-charcoal/15 bg-white hover:border-burgundy/30"
            )}
          >
            {selected && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center bg-sage text-cream">
                <Check className="h-3 w-3 stroke-[2.5]" />
              </span>
            )}
            <Icon className="h-7 w-7 stroke-[1.25] text-charcoal/70" />
            <span className="text-xs font-medium leading-snug text-charcoal line-clamp-3">
              {f.nom}
            </span>
            {inBase !== undefined && (
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wider",
                  inBase ? "text-sage" : "text-charcoal/40"
                )}
              >
                {inBase ? "En base ONSSA" : "Hors base"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
