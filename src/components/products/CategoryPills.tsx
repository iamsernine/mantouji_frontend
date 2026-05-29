"use client";

import { cn } from "@/lib/utils";
import type { Categorie } from "@/types/product";

type CategoryPillsProps = {
  categories: Categorie[];
  selectedId: string;
  onSelect: (id: string) => void;
  totalCount?: number;
};

export function CategoryPills({
  categories,
  selectedId,
  onSelect,
  totalCount,
}: CategoryPillsProps) {
  const pills = [
    ...(totalCount !== undefined
      ? [{ id: "", label: `Tous (${totalCount})` }]
      : [{ id: "", label: "Tous" }]),
    ...categories.slice(0, 6).map((c) => ({ id: c.id, label: c.nom })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {pills.map((p) => (
        <button
          key={p.id || "all"}
          type="button"
          onClick={() => onSelect(p.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            selectedId === p.id
              ? "bg-sage-light text-sage-dark"
              : "border border-charcoal/15 bg-white text-charcoal/70"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
