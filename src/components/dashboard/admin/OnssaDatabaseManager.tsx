"use client";

import { useCallback, useEffect, useState } from "react";
import { OnssaDemandJournal } from "@/components/dashboard/admin/onssa/OnssaDemandJournal";
import { OnssaFiliereGrid } from "@/components/dashboard/admin/onssa/OnssaFiliereGrid";
import { OnssaFullTablesPanel } from "@/components/dashboard/admin/onssa/OnssaFullTablesPanel";
import { FiliereAdminPanel } from "@/components/dashboard/admin/onssa/FiliereAdminPanel";
import {
  FILIERES_HEADERS,
  getFiliereRowsFromSheet,
  loadFilieresSheet,
  saveFilieresSheet,
  type FiliereSheetRow,
} from "@/lib/onssa-db-storage";
import { cn } from "@/lib/utils";

type Tab = "filieres" | "journal" | "tableaux";

export function OnssaDatabaseManager() {
  const [tab, setTab] = useState<Tab>("filieres");
  const [filieres, setFilieres] = useState<FiliereSheetRow[]>([]);
  const [selected, setSelected] = useState<FiliereSheetRow | null>(null);

  const refresh = useCallback(() => {
    setFilieres(getFiliereRowsFromSheet());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleFiliereUpdated = () => {
    const rows = getFiliereRowsFromSheet();
    setFilieres(rows);
    setSelected((prev) => {
      if (!prev) return null;
      return rows.find((f) => f.id === prev.id) ?? null;
    });
  };

  const openFiliere = (f: FiliereSheetRow) => {
    setSelected(f);
  };

  const addFiliere = () => {
    const sheet = loadFilieresSheet();
    const id = `filiere-${Date.now()}`;
    const newRow = sheet.headers.map((h) => {
      if (h === "id") return id;
      if (h === "nom") return "Nouvelle filière";
      if (h === "en_base_nationale") return "non";
      return "";
    });
    saveFilieresSheet({ ...sheet, rows: [...sheet.rows, newRow] });
    refresh();
    const created = getFiliereRowsFromSheet().find((f) => f.id === id);
    if (created) setSelected(created);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "filieres", label: "Filières" },
    { id: "journal", label: "Journal des demandes" },
    { id: "tableaux", label: "Tableaux complets" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-olive">
          Bases ONSSA
        </p>
        <h1 className="font-serif text-2xl text-charcoal sm:text-3xl">
          Gestion des données ONSSA
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal/65">
          Filières en grille, édition dans l&apos;onglet (sans overlay plein
          écran), journal filtrable et tableurs CSV.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-charcoal/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              if (t.id !== "filieres") setSelected(null);
            }}
            className={cn(
              "min-h-11 px-4 text-sm font-medium uppercase tracking-wide transition-colors",
              tab === t.id
                ? "border-b-2 border-burgundy text-burgundy"
                : "text-charcoal/55 hover:text-charcoal"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "filieres" && (
        <div className="space-y-4">
          {selected ? (
            <FiliereAdminPanel
              filiere={selected}
              onBack={() => setSelected(null)}
              onUpdated={handleFiliereUpdated}
            />
          ) : (
            <>
              <p className="text-sm text-charcoal/60">
                Cliquez sur une filière pour ouvrir le tableur des agréments dans
                cet onglet.
              </p>
              <OnssaFiliereGrid
                filieres={filieres}
                onSelect={openFiliere}
                onAddFiliere={addFiliere}
              />
            </>
          )}
        </div>
      )}

      {tab === "journal" && (
        <div className="space-y-3">
          <h2 className="font-serif text-lg text-charcoal">Journal des demandes</h2>
          <p className="text-sm text-charcoal/60">
            Filtrez par statut, filière ou recherche texte.
          </p>
          <OnssaDemandJournal />
        </div>
      )}

      {tab === "tableaux" && <OnssaFullTablesPanel onSaved={refresh} />}

      <p className="border-t border-charcoal/10 pt-4 text-xs text-charcoal/45">
        Colonnes filières : {FILIERES_HEADERS.join(" · ")}
      </p>
    </div>
  );
}
