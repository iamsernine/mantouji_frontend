import { onssaFilieres } from "@/data/onssa-filieres";
import { onssaApprovedFiliereIds } from "@/data/onssa-approved-database";
import type { OnssaFiliere } from "@/data/onssa-filieres";
import type { SpreadsheetData } from "@/types/spreadsheet";

function rowFromDefaults(
  headers: string[],
  values: Record<string, string>
): string[] {
  return headers.map((h) => values[h] ?? "");
}

const FILIERES_SHEET_KEY = "mantouji-onssa-sheet-filieres-v1";
const ACCRED_SHEET_KEY = "mantouji-onssa-sheet-accreditations-v1";

export const FILIERES_HEADERS = [
  "id",
  "nom",
  "description",
  "en_base_nationale",
] as const;

export const ACCRED_HEADERS = [
  "coop_id",
  "coop_nom",
  "filiere_id",
  "filiere_nom",
  "numero_agrement",
  "date_agrement",
  "statut",
  "source_onssa",
] as const;

function truthy(val: string | undefined) {
  const v = (val ?? "").trim().toLowerCase();
  return v === "1" || v === "oui" || v === "yes" || v === "true" || v === "x";
}

function seedFilieresSheet(): SpreadsheetData {
  const approved = new Set(onssaApprovedFiliereIds);
  return {
    id: "filieres",
    name: "Base nationale — filières ONSSA",
    headers: [...FILIERES_HEADERS],
    rows: onssaFilieres.map((f) => [
      f.id,
      f.nom,
      f.description ?? "",
      approved.has(f.id) ? "oui" : "non",
    ]),
    updatedAt: new Date().toISOString(),
  };
}

function seedAccredSheet(): SpreadsheetData {
  return {
    id: "accreditations",
    name: "Agréments coopératives (données ONSSA)",
    headers: [...ACCRED_HEADERS],
    rows: [],
    updatedAt: new Date().toISOString(),
  };
}

function loadSheet(key: string, seed: () => SpreadsheetData): SpreadsheetData {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const s = seed();
      localStorage.setItem(key, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as SpreadsheetData;
  } catch {
    return seed();
  }
}

export function loadFilieresSheet(): SpreadsheetData {
  return loadSheet(FILIERES_SHEET_KEY, seedFilieresSheet);
}

export function loadAccreditationsSheet(): SpreadsheetData {
  return loadSheet(ACCRED_SHEET_KEY, seedAccredSheet);
}

export function saveFilieresSheet(data: SpreadsheetData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    FILIERES_SHEET_KEY,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() })
  );
}

export function saveAccreditationsSheet(data: SpreadsheetData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    ACCRED_SHEET_KEY,
    JSON.stringify({ ...data, updatedAt: new Date().toISOString() })
  );
}

export function getFilieresFromSheet(): OnssaFiliere[] {
  const sheet = loadFilieresSheet();
  const idIdx = sheet.headers.indexOf("id");
  const nomIdx = sheet.headers.indexOf("nom");
  const descIdx = sheet.headers.indexOf("description");
  if (idIdx === -1 || nomIdx === -1) return onssaFilieres;

  return sheet.rows
    .filter((row) => row[idIdx]?.trim())
    .map((row) => ({
      id: row[idIdx].trim(),
      nom: row[nomIdx]?.trim() || row[idIdx].trim(),
      description: descIdx >= 0 ? row[descIdx]?.trim() : undefined,
    }));
}

export function getApprovedFiliereIdsFromSheet(): string[] {
  const sheet = loadFilieresSheet();
  const idIdx = sheet.headers.indexOf("id");
  const baseIdx = sheet.headers.indexOf("en_base_nationale");
  if (idIdx === -1) return onssaApprovedFiliereIds;

  return sheet.rows
    .filter((row) => {
      if (!row[idIdx]?.trim()) return false;
      if (baseIdx === -1) return false;
      return truthy(row[baseIdx]);
    })
    .map((row) => row[idIdx].trim());
}

export function isFiliereInOnssaDatabase(filiereId: string): boolean {
  return getApprovedFiliereIdsFromSheet().includes(filiereId);
}

export function getOnssaFiliereFromDb(id: string) {
  return getFilieresFromSheet().find((f) => f.id === id);
}

export type FiliereSheetRow = {
  id: string;
  nom: string;
  description: string;
  enBaseNationale: boolean;
  rowIndex: number;
};

export function getFiliereRowsFromSheet(): FiliereSheetRow[] {
  const sheet = loadFilieresSheet();
  const idIdx = sheet.headers.indexOf("id");
  const nomIdx = sheet.headers.indexOf("nom");
  const descIdx = sheet.headers.indexOf("description");
  const baseIdx = sheet.headers.indexOf("en_base_nationale");
  if (idIdx === -1) return [];

  return sheet.rows
    .map((row, rowIndex) => ({
      id: row[idIdx]?.trim() ?? "",
      nom: row[nomIdx]?.trim() ?? row[idIdx]?.trim() ?? "",
      description: descIdx >= 0 ? row[descIdx]?.trim() ?? "" : "",
      enBaseNationale: baseIdx >= 0 ? truthy(row[baseIdx]) : false,
      rowIndex,
    }))
    .filter((r) => r.id);
}

export function updateFiliereRowInSheet(
  rowIndex: number,
  patch: Partial<Pick<FiliereSheetRow, "nom" | "description" | "enBaseNationale">>
) {
  const sheet = loadFilieresSheet();
  const row = sheet.rows[rowIndex];
  if (!row) return;

  const idIdx = sheet.headers.indexOf("id");
  const nomIdx = sheet.headers.indexOf("nom");
  const descIdx = sheet.headers.indexOf("description");
  const baseIdx = sheet.headers.indexOf("en_base_nationale");

  if (patch.nom !== undefined && nomIdx >= 0) row[nomIdx] = patch.nom;
  if (patch.description !== undefined && descIdx >= 0) row[descIdx] = patch.description;
  if (patch.enBaseNationale !== undefined && baseIdx >= 0) {
    row[baseIdx] = patch.enBaseNationale ? "oui" : "non";
  }
  if (idIdx >= 0 && !row[idIdx]) return;

  sheet.rows[rowIndex] = row;
  saveFilieresSheet(sheet);
}

export function appendAccreditationRow(values: Record<string, string>) {
  const sheet = loadAccreditationsSheet();
  const newRow = sheet.headers.map((h) => values[h] ?? "");
  saveAccreditationsSheet({
    ...sheet,
    rows: [...sheet.rows, newRow],
  });
}

export function getAccreditationsForFiliere(filiereId: string) {
  const sheet = loadAccreditationsSheet();
  const filIdx = sheet.headers.indexOf("filiere_id");
  if (filIdx === -1) return [];

  return sheet.rows
    .map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) => row[filIdx]?.trim() === filiereId);
}

/** Vue tableur des agréments pour une seule filière (lignes multiples). */
export function getFiliereAccreditationSpreadsheet(filiere: {
  id: string;
  nom: string;
}): SpreadsheetData {
  const full = loadAccreditationsSheet();
  const filIdx = full.headers.indexOf("filiere_id");
  const defaults = {
    filiere_id: filiere.id,
    filiere_nom: filiere.nom,
    statut: "agréé",
    source_onssa: "onssa.ma",
  };

  let rows =
    filIdx === -1
      ? []
      : full.rows.filter((row) => row[filIdx]?.trim() === filiere.id);

  if (rows.length === 0) {
    rows = [rowFromDefaults(full.headers, defaults)];
  }

  return {
    id: `accred-filiere-${filiere.id}`,
    name: `Agréments — ${filiere.nom}`,
    headers: [...full.headers],
    rows: rows.map((row) => {
      const copy = full.headers.map((_, i) => row[i] ?? "");
      const idI = full.headers.indexOf("filiere_id");
      const nomI = full.headers.indexOf("filiere_nom");
      if (idI >= 0) copy[idI] = filiere.id;
      if (nomI >= 0) copy[nomI] = filiere.nom;
      return copy;
    }),
    updatedAt: full.updatedAt,
  };
}

/** Fusionne les lignes éditées d'une filière dans la table agréments globale. */
export function saveFiliereAccreditationSpreadsheet(
  filiereId: string,
  filiereNom: string,
  data: SpreadsheetData
) {
  const full = loadAccreditationsSheet();
  const filIdx = full.headers.indexOf("filiere_id");
  const nomIdx = full.headers.indexOf("filiere_nom");
  const headers = data.headers.length ? data.headers : [...full.headers];

  const hasContent = (row: string[]) =>
    row.some((cell, i) => {
      const h = headers[i];
      if (h === "filiere_id" || h === "filiere_nom") return false;
      return cell.trim() !== "";
    });

  const editedRows = data.rows
    .filter(hasContent)
    .map((row) => {
      const copy = headers.map((_, i) => row[i] ?? "");
      if (filIdx >= 0) copy[filIdx] = filiereId;
      if (nomIdx >= 0) copy[nomIdx] = filiereNom;
      return copy;
    });

  const otherRows =
    filIdx === -1
      ? full.rows
      : full.rows.filter((row) => row[filIdx]?.trim() !== filiereId);

  saveAccreditationsSheet({
    ...full,
    headers,
    rows: [...otherRows, ...editedRows],
    updatedAt: new Date().toISOString(),
  });
}

export function getCoopAccreditedFilieresFromSheet(coopId: string): string[] {
  const sheet = loadAccreditationsSheet();
  const coopIdx = sheet.headers.indexOf("coop_id");
  const filIdx = sheet.headers.indexOf("filiere_id");
  const statIdx = sheet.headers.indexOf("statut");
  if (coopIdx === -1 || filIdx === -1) return [];

  return sheet.rows
    .filter((row) => {
      if (row[coopIdx]?.trim() !== coopId) return false;
      if (statIdx >= 0) {
        const s = (row[statIdx] ?? "").toLowerCase();
        return s.includes("agré") || s === "approved" || s === "actif";
      }
      return true;
    })
    .map((row) => row[filIdx]?.trim())
    .filter(Boolean) as string[];
}
