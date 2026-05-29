"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOnssaFiliereFromDb } from "@/lib/onssa-db-storage";
import { loadOnssaDemands } from "@/lib/onssa-accreditation-storage";
import type { OnssaAccreditationDemand } from "@/types/onssa";

type StatusFilter = "all" | "approved" | "rejected";

export function OnssaDemandJournal() {
  const [demands, setDemands] = useState<OnssaAccreditationDemand[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [filiereFilter, setFiliereFilter] = useState("");
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    setDemands(
      loadOnssaDemands().sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filiereOptions = useMemo(() => {
    const ids = [...new Set(demands.map((d) => d.filiereId))];
    return ids.map((id) => ({
      id,
      nom: getOnssaFiliereFromDb(id)?.nom ?? id,
    }));
  }, [demands]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return demands.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (filiereFilter && d.filiereId !== filiereFilter) return false;
      if (!q) return true;
      const filiereNom =
        getOnssaFiliereFromDb(d.filiereId)?.nom?.toLowerCase() ?? "";
      return (
        d.coopName.toLowerCase().includes(q) ||
        d.coopId.toLowerCase().includes(q) ||
        d.filiereId.toLowerCase().includes(q) ||
        filiereNom.includes(q)
      );
    });
  }, [demands, statusFilter, filiereFilter, search]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 border border-charcoal/10 bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-charcoal/55">
            Recherche
          </label>
          <Input
            placeholder="Coop, filière…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-charcoal/55">
            Statut
          </label>
          <select
            className="flex h-11 w-full border border-charcoal/15 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">Tous</option>
            <option value="approved">Accordé</option>
            <option value="rejected">Refusé</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-charcoal/55">
            Filière
          </label>
          <select
            className="flex h-11 w-full border border-charcoal/15 bg-white px-3 text-sm"
            value={filiereFilter}
            onChange={(e) => setFiliereFilter(e.target.value)}
          >
            <option value="">Toutes</option>
            {filiereOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <p className="text-sm text-charcoal/60">
            {filtered.length} / {demands.length} entrée
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Coopérative</TableHead>
            <TableHead>Filière</TableHead>
            <TableHead>En base</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="hidden md:table-cell">Motif</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-charcoal/50">
                Aucune demande ne correspond aux filtres.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="whitespace-nowrap text-charcoal/70">
                  {new Date(d.createdAt).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{d.coopName}</p>
                  <p className="text-xs text-charcoal/45">{d.coopId}</p>
                </TableCell>
                <TableCell>
                  {getOnssaFiliereFromDb(d.filiereId)?.nom ?? d.filiereId}
                </TableCell>
                <TableCell className="text-sm">
                  {d.inOnssaDatabase ? (
                    <span className="text-sage">Oui</span>
                  ) : (
                    <span className="text-burgundy">Non</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={d.status} />
                </TableCell>
                <TableCell className="hidden max-w-xs truncate md:table-cell text-charcoal/65">
                  {d.rejectionReason ?? "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
