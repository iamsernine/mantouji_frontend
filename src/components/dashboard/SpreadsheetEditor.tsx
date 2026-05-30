"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Columns,
  Download,
  Rows,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCsv, parseCsv, spreadsheetToCsv } from "@/lib/spreadsheet-csv";
import type { SpreadsheetData } from "@/types/spreadsheet";
import { cn } from "@/lib/utils";

type Props = {
  initial: SpreadsheetData;
  onSave: (data: SpreadsheetData) => void;
  hint?: string;
  /** Valeurs par défaut pour chaque nouvelle ligne (ex. filiere_id, filiere_nom). */
  columnDefaults?: Record<string, string>;
  /** Colonnes non modifiables (affichées en lecture seule). */
  readOnlyHeaders?: string[];
};

function emptyRow(cols: number) {
  return Array.from({ length: cols }, () => "");
}

export function SpreadsheetEditor({
  initial,
  onSave,
  hint,
  columnDefaults,
  readOnlyHeaders = [],
}: Props) {
  const [headers, setHeaders] = useState<string[]>(initial.headers);
  const [rows, setRows] = useState<string[][]>(initial.rows);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectedCols, setSelectedCols] = useState<Set<number>>(new Set());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const readOnlySet = new Set(readOnlyHeaders);

  useEffect(() => {
    setHeaders(initial.headers);
    setRows(initial.rows);
    setSelectedRows(new Set());
    setSelectedCols(new Set());
    setSavedAt(null);
  }, [initial.id, initial.headers, initial.rows]);

  const colCount = headers.length;

  const buildNewRow = () =>
    headers.map((h) => columnDefaults?.[h] ?? "");

  const toggleRow = (ri: number, extend: boolean) => {
    setSelectedRows((prev) => {
      const next = extend ? new Set(prev) : new Set<number>();
      if (next.has(ri)) next.delete(ri);
      else next.add(ri);
      return next;
    });
    setSelectedCols(new Set());
  };

  const toggleCol = (ci: number, extend: boolean) => {
    setSelectedCols((prev) => {
      const next = extend ? new Set(prev) : new Set<number>();
      if (next.has(ci)) next.delete(ci);
      else next.add(ci);
      return next;
    });
    setSelectedRows(new Set());
  };

  const updateCell = (ri: number, ci: number, value: string) => {
    setRows((prev) => {
      const copy = prev.map((r) => [...r]);
      while (copy.length <= ri) copy.push(emptyRow(colCount));
      const row = copy[ri] ?? emptyRow(colCount);
      while (row.length < colCount) row.push("");
      row[ci] = value;
      copy[ri] = row;
      return copy;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, buildNewRow()]);
  };

  const addColumn = () => {
    const name = `col_${headers.length + 1}`;
    setHeaders((h) => [...h, name]);
    setRows((prev) => prev.map((r) => [...r, ""]));
  };

  const deleteSelectedRows = () => {
    if (!selectedRows.size) return;
    setRows((prev) => prev.filter((_, i) => !selectedRows.has(i)));
    setSelectedRows(new Set());
  };

  const deleteSelectedCols = () => {
    if (!selectedCols.size || headers.length <= 1) return;
    const cols = [...selectedCols].sort((a, b) => b - a);
    setHeaders((h) => h.filter((_, i) => !selectedCols.has(i)));
    setRows((prev) =>
      prev.map((r) => r.filter((_, i) => !selectedCols.has(i)))
    );
    setSelectedCols(new Set());
    void cols;
  };

  const handleSave = () => {
    const data: SpreadsheetData = {
      ...initial,
      headers,
      rows: rows.map((r) => headers.map((_, i) => r[i] ?? "")),
      updatedAt: new Date().toISOString(),
    };
    onSave(data);
    setSavedAt(new Date().toLocaleTimeString("fr-FR"));
  };

  const handleExport = () => {
    const data: SpreadsheetData = { ...initial, headers, rows };
    downloadCsv(`${initial.id}-${Date.now()}.csv`, spreadsheetToCsv(data));
  };

  const handleImport = useCallback(
    (text: string) => {
      const parsed = parseCsv(text);
      setHeaders(parsed.headers.length ? parsed.headers : ["col_1"]);
      setRows(parsed.rows);
      setSelectedRows(new Set());
      setSelectedCols(new Set());
    },
    []
  );

  return (
    <div className="space-y-4">
      {hint && <p className="text-sm text-charcoal/60">{hint}</p>}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={addRow}>
          <Rows className="h-4 w-4" />
          Ligne
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={addColumn}>
          <Columns className="h-4 w-4" />
          Colonne
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={deleteSelectedRows}
          disabled={!selectedRows.size}
        >
          <Trash2 className="h-4 w-4" />
          Suppr. lignes
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={deleteSelectedCols}
          disabled={!selectedCols.size}
        >
          <Trash2 className="h-4 w-4" />
          Suppr. colonnes
        </Button>
        <Button type="button" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => handleImport(String(reader.result));
            reader.readAsText(file);
            e.target.value = "";
          }}
        />
      </div>

      {savedAt && (
        <p className="text-xs text-sage">Enregistré à {savedAt}</p>
      )}

      <div className="overflow-x-auto border border-charcoal/15 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-sand/60">
              <th className="w-10 border border-charcoal/10 p-1 text-center text-xs text-charcoal/40">
                #
              </th>
              {headers.map((h, ci) => (
                <th
                  key={ci}
                  className={cn(
                    "min-w-[120px] border border-charcoal/10 p-0",
                    selectedCols.has(ci) && "bg-burgundy/15"
                  )}
                >
                  <button
                    type="button"
                    className="w-full px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-charcoal/70 hover:bg-sand"
                    onClick={(e) => toggleCol(ci, e.shiftKey)}
                  >
                    {h}
                  </button>
                  <input
                    className="w-full border-0 border-t border-charcoal/10 bg-white px-2 py-1.5 text-sm focus:ring-1 focus:ring-burgundy/30"
                    value={h}
                    onChange={(e) =>
                      setHeaders((prev) =>
                        prev.map((x, i) => (i === ci ? e.target.value : x))
                      )
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className={cn(selectedRows.has(ri) && "bg-burgundy/10")}
              >
                <td className="border border-charcoal/10 p-1 text-center">
                  <button
                    type="button"
                    className="text-xs text-charcoal/50 hover:text-burgundy"
                    onClick={(e) => toggleRow(ri, e.shiftKey)}
                  >
                    {ri + 1}
                  </button>
                </td>
                {headers.map((h, ci) => {
                  const readOnly = readOnlySet.has(h);
                  return (
                    <td
                      key={ci}
                      className={cn(
                        "border border-charcoal/10 p-0",
                        selectedCols.has(ci) && "bg-burgundy/5",
                        readOnly && "bg-sand/30"
                      )}
                    >
                      <input
                        className={cn(
                          "w-full min-w-[100px] px-2 py-2 text-sm",
                          readOnly
                            ? "cursor-default bg-sand/20 text-charcoal/70"
                            : "bg-transparent focus:bg-cream focus:outline-none focus:ring-1 focus:ring-inset focus:ring-burgundy/25"
                        )}
                        value={row[ci] ?? ""}
                        readOnly={readOnly}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-charcoal/45">
        Cliquez sur le n° de ligne ou l&apos;en-tête de colonne pour sélectionner
        (Maj+clic = sélection multiple). Modifiez les cellules puis Enregistrer.
      </p>
    </div>
  );
}
