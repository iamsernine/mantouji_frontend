"use client";

import { useCallback, useEffect, useState } from "react";
import { SpreadsheetEditor } from "@/components/dashboard/SpreadsheetEditor";
import {
  loadAccreditationsSheet,
  loadFilieresSheet,
  saveAccreditationsSheet,
  saveFilieresSheet,
} from "@/lib/onssa-db-storage";
import type { SpreadsheetData } from "@/types/spreadsheet";
import { cn } from "@/lib/utils";

type SubTab = "filieres" | "accreditations";

export function OnssaFullTablesPanel({ onSaved }: { onSaved?: () => void }) {
  const [sub, setSub] = useState<SubTab>("filieres");
  const [filieresSheet, setFilieresSheet] = useState<SpreadsheetData | null>(null);
  const [accredSheet, setAccredSheet] = useState<SpreadsheetData | null>(null);

  const refresh = useCallback(() => {
    setFilieresSheet(loadFilieresSheet());
    setAccredSheet(loadAccreditationsSheet());
    onSaved?.();
  }, [onSaved]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!filieresSheet || !accredSheet) {
    return <p className="py-8 text-center text-charcoal/50">Chargement…</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-charcoal/60">
        Vue tableur complète — import/export CSV, édition en masse. Pas de cartes :
        données brutes uniquement.
      </p>

      <div className="flex gap-2 border-b border-charcoal/10">
        {(
          [
            { id: "filieres" as const, label: "Table filières" },
            { id: "accreditations" as const, label: "Table agréments" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSub(t.id)}
            className={cn(
              "min-h-10 px-3 text-xs font-medium uppercase tracking-wide",
              sub === t.id
                ? "border-b-2 border-burgundy text-burgundy"
                : "text-charcoal/50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sub === "filieres" ? (
        <SpreadsheetEditor
          initial={filieresSheet}
          onSave={(data) => {
            saveFilieresSheet(data);
            refresh();
          }}
        />
      ) : (
        <SpreadsheetEditor
          initial={accredSheet}
          onSave={(data) => {
            saveAccreditationsSheet(data);
            refresh();
          }}
        />
      )}
    </div>
  );
}
