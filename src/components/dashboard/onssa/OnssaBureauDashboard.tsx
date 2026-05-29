"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Database } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { onssaApprovedFiliereIds } from "@/data/onssa-approved-database";
import { getOnssaFiliere, onssaFilieres } from "@/data/onssa-filieres";
import {
  getApprovedDemandsForBureau,
  getRejectedDemandsForBureau,
  loadOnssaDemands,
} from "@/lib/onssa-accreditation-storage";
export function OnssaBureauDashboard() {
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    loadOnssaDemands();
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const rejected = getRejectedDemandsForBureau();
  const approved = getApprovedDemandsForBureau();

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/50">Chargement…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-olive">
          Bureau ONSSA
        </p>
        <h1 className="font-serif text-2xl text-charcoal sm:text-3xl">
          Suivi des agréments par filière
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal/65">
          Les demandes sont traitées automatiquement : agrément si la filière est dans la
          base nationale, sinon refus avec notification à la coopérative et visibilité
          ici pour traitement au bureau.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="border border-charcoal/10 bg-white p-4">
          <p className="text-2xl font-semibold text-burgundy">{rejected.length}</p>
          <p className="text-sm text-charcoal/60">Refus (hors base ou signalés)</p>
        </div>
        <div className="border border-charcoal/10 bg-white p-4">
          <p className="text-2xl font-semibold text-sage">{approved.length}</p>
          <p className="text-sm text-charcoal/60">Agréments accordés</p>
        </div>
        <div className="border border-charcoal/10 bg-white p-4 col-span-2 sm:col-span-1">
          <p className="text-2xl font-semibold text-charcoal">
            {onssaApprovedFiliereIds.length}
          </p>
          <p className="text-sm text-charcoal/60">Filières en base nationale</p>
        </div>
      </div>

      <DashboardSection
        title="Dossiers refusés — à traiter au bureau"
        description="Coopératives ayant demandé une filière absente de la base ONSSA."
      >
        {rejected.length === 0 ? (
          <p className="text-charcoal/60">Aucun refus enregistré.</p>
        ) : (
          <ul className="space-y-3">
            {rejected.map((d) => (
              <li
                key={d.id}
                className="border border-burgundy/20 bg-burgundy/5 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-charcoal">{d.coopName}</p>
                    <p className="text-sm text-charcoal/70">
                      Filière : {getOnssaFiliere(d.filiereId)?.nom ?? d.filiereId}
                    </p>
                    <p className="mt-1 text-xs text-charcoal/50">
                      {new Date(d.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <StatusBadge status="rejected" />
                </div>
                <p className="mt-3 flex items-start gap-2 text-sm text-burgundy">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {d.rejectionReason}
                </p>
                <p className="mt-2 text-xs text-charcoal/50">
                  Action bureau : mettre à jour la base nationale ou accompagner la
                  coopérative.
                </p>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>

      <DashboardSection title="Agréments accordés (automatiques)">
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {approved.slice(0, 15).map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-charcoal/10 py-2 text-sm"
            >
              <span>
                {d.coopName} — {getOnssaFiliere(d.filiereId)?.nom}
              </span>
              <CheckCircle2 className="h-4 w-4 text-sage" />
            </li>
          ))}
        </ul>
        {approved.length > 15 && (
          <p className="mt-2 text-xs text-charcoal/50">
            + {approved.length - 15} autres agréments
          </p>
        )}
      </DashboardSection>

      <DashboardSection
        title="Base nationale des filières ONSSA"
        description="Seules ces filières déclenchent un agrément automatique."
      >
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {onssaFilieres.map((f) => {
            const inDb = onssaApprovedFiliereIds.includes(f.id);
            return (
              <li
                key={f.id}
                className={`flex items-center justify-between gap-2 border px-3 py-2 text-sm ${
                  inDb
                    ? "border-sage/30 bg-sage-light/40"
                    : "border-charcoal/10 bg-sand/30 text-charcoal/50"
                }`}
              >
                <span>{f.nom}</span>
                {inDb ? (
                  <Database className="h-4 w-4 text-sage" aria-label="En base" />
                ) : (
                  <span className="text-xs uppercase tracking-wider">Hors base</span>
                )}
              </li>
            );
          })}
        </ul>
      </DashboardSection>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={refresh}>
          Actualiser
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/admin">Retour admin Mantouji</Link>
        </Button>
      </div>
    </div>
  );
}
