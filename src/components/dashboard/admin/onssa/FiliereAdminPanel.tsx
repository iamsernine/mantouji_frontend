"use client";

import { createElement, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getFiliereIcon } from "@/data/onssa-filiere-icons";
import { SpreadsheetEditor } from "@/components/dashboard/SpreadsheetEditor";
import { Button } from "@/components/ui/button";
import {
  getFiliereAccreditationSpreadsheet,
  saveFiliereAccreditationSpreadsheet,
  updateFiliereRowInSheet,
  type FiliereSheetRow,
} from "@/lib/onssa-db-storage";
import type { SpreadsheetData } from "@/types/spreadsheet";

type Props = {
  filiere: FiliereSheetRow;
  onBack: () => void;
  onUpdated: () => void;
};

export function FiliereAdminPanel({ filiere, onBack, onUpdated }: Props) {
  const [enBase, setEnBase] = useState(filiere.enBaseNationale);
  const [sheetData, setSheetData] = useState<SpreadsheetData | null>(null);

  useEffect(() => {
    setEnBase(filiere.enBaseNationale);
    setSheetData(getFiliereAccreditationSpreadsheet(filiere));
  }, [filiere]);

  const columnDefaults = useMemo(
    () => ({
      filiere_id: filiere.id,
      filiere_nom: filiere.nom,
      statut: "agréé",
      source_onssa: "onssa.ma",
    }),
    [filiere]
  );

  if (!sheetData) {
    return <p className="py-8 text-center text-charcoal/50">Chargement…</p>;
  }

  const saveFiliereMeta = () => {
    updateFiliereRowInSheet(filiere.rowIndex, { enBaseNationale: enBase });
    onUpdated();
  };

  return (
    <div className="space-y-4 border border-charcoal/10 bg-white">
      <div className="flex flex-col gap-4 border-b border-charcoal/10 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Filières
          </Button>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-charcoal/15">
              {createElement(getFiliereIcon(filiere.id), {
                className: "h-6 w-6 stroke-[1.25] text-charcoal/70",
              })}
            </div>
            <div>
              <h2 className="font-serif text-xl text-burgundy">{filiere.nom}</h2>
              <p className="text-xs text-charcoal/50">{filiere.id}</p>
            </div>
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-burgundy"
            checked={enBase}
            onChange={(e) => setEnBase(e.target.checked)}
          />
          En base nationale ONSSA
        </label>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-2">
        <Button type="button" size="sm" variant="outline" onClick={saveFiliereMeta}>
          Enregistrer la filière
        </Button>
      </div>

      <div className="border-t border-charcoal/10 p-4">
        <p className="mb-3 text-sm text-charcoal/60">
          Agréments pour cette filière — plusieurs lignes, colonnes filière
          préremplies.
        </p>
        <SpreadsheetEditor
          key={sheetData.id}
          initial={sheetData}
          columnDefaults={columnDefaults}
          readOnlyHeaders={["filiere_id", "filiere_nom"]}
          onSave={(data) => {
            saveFiliereAccreditationSpreadsheet(filiere.id, filiere.nom, data);
            setSheetData(getFiliereAccreditationSpreadsheet(filiere));
            onUpdated();
          }}
        />
      </div>
    </div>
  );
}
