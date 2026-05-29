"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Shield } from "lucide-react";
import { OnssaFiliereSelectGrid } from "@/components/dashboard/onssa/OnssaFiliereSelectGrid";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { onssaFilieres } from "@/data/onssa-filieres";
import {
  getApprovedFilieresForCoop,
  getCoopOnssaDemands,
  loadCoopDeclaredFilieres,
  saveCoopDeclaredFilieres,
  submitOnssaAccreditationDemand,
} from "@/lib/onssa-accreditation-storage";
import {
  getFilieresFromSheet,
  getOnssaFiliereFromDb,
  isFiliereInOnssaDatabase,
} from "@/lib/onssa-db-storage";
import type { OnssaAccreditationDemand } from "@/types/onssa";
import type { OnssaFiliere } from "@/data/onssa-filieres";

export function CoopOnssaPanel() {
  const { coopId, cooperative } = useCoopDashboard();
  const coopName = cooperative?.nomCooperative ?? "Coopérative";

  const [declared, setDeclared] = useState<string[]>([]);
  const [demands, setDemands] = useState<OnssaAccreditationDemand[]>([]);
  const [filieres, setFilieres] = useState<OnssaFiliere[]>(onssaFilieres);
  const [ready, setReady] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setDeclared(loadCoopDeclaredFilieres(coopId));
    setDemands(getCoopOnssaDemands(coopId));
    const fromDb = getFilieresFromSheet();
    setFilieres(fromDb.length ? fromDb : onssaFilieres);
    setReady(true);
  }, [coopId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const approvedIds = getApprovedFilieresForCoop(coopId);

  const toggleFiliere = (id: string) => {
    setDeclared((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const saveFilieres = () => {
    saveCoopDeclaredFilieres(coopId, declared);
    setSavedMsg("Filières enregistrées.");
    setTimeout(() => setSavedMsg(null), 2500);
  };

  const requestAccreditation = (filiereId: string) => {
    submitOnssaAccreditationDemand(coopId, coopName, filiereId);
    refresh();
  };

  const getDemandForFiliere = (filiereId: string) =>
    demands.find((d) => d.filiereId === filiereId);

  const filiereLabel = (id: string) =>
    getOnssaFiliereFromDb(id)?.nom ?? filieres.find((f) => f.id === id)?.nom ?? id;

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/50">Chargement…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-sage">
          Office National de Sécurité Sanitaire
        </p>
        <h1 className="font-serif text-2xl text-burgundy sm:text-3xl">
          Agrément ONSSA par filière
        </h1>
        <p className="mt-2 max-w-xl text-sm text-charcoal/65">
          Sélectionnez vos filières (icônes), puis demandez l&apos;agrément par filière.
          Les refus et validations apparaissent dans Notifications.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-charcoal">Mes filières d&apos;activité</h2>
        <p className="text-sm text-charcoal/60">
          Touchez une filière pour la sélectionner.
        </p>
        <OnssaFiliereSelectGrid
          filieres={filieres}
          selectedIds={declared}
          onToggle={toggleFiliere}
          inBaseCheck={isFiliereInOnssaDatabase}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="button" onClick={saveFilieres}>
            Enregistrer mes filières
          </Button>
          {savedMsg && <p className="text-sm text-sage">{savedMsg}</p>}
        </div>
      </div>

      <div className="space-y-4 border-t border-charcoal/10 pt-8">
        <h2 className="font-serif text-lg text-charcoal">Demandes d&apos;agrément</h2>
        <p className="text-sm text-charcoal/60">
          Une demande par filière déclarée.
        </p>
        {declared.length === 0 ? (
          <p className="text-charcoal/60">
            Enregistrez d&apos;abord au moins une filière.
          </p>
        ) : (
          <ul className="divide-y divide-charcoal/10 border border-charcoal/10 bg-white">
            {declared.map((filiereId) => {
              const demand = getDemandForFiliere(filiereId);
              const inDb = isFiliereInOnssaDatabase(filiereId);
              const isApproved = demand?.status === "approved";

              return (
                <li key={filiereId} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-charcoal">
                        {filiereLabel(filiereId)}
                      </p>
                      <p className="mt-1 text-xs text-charcoal/50">
                        Base ONSSA :{" "}
                        {inDb ? (
                          <span className="text-sage">répertoriée</span>
                        ) : (
                          <span className="text-burgundy">non répertoriée</span>
                        )}
                      </p>
                    </div>
                    {demand ? (
                      <StatusBadge
                        status={demand.status === "approved" ? "approved" : "rejected"}
                      />
                    ) : null}
                  </div>

                  {demand?.status === "rejected" && demand.rejectionReason && (
                    <p className="mt-3 text-sm text-burgundy/90">{demand.rejectionReason}</p>
                  )}

                  {isApproved ? (
                    <p className="mt-3 flex items-center gap-2 text-sm text-sage">
                      <CheckCircle2 className="h-4 w-4" />
                      Agrément actif
                    </p>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="mt-3 w-full sm:w-auto"
                      variant={demand?.status === "rejected" ? "outline" : "default"}
                      onClick={() => requestAccreditation(filiereId)}
                    >
                      <Shield className="h-4 w-4" />
                      {demand?.status === "rejected"
                        ? "Redemander l'agrément"
                        : "Demander l'agrément ONSSA"}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="space-y-3 border-t border-charcoal/10 pt-8">
        <h2 className="font-serif text-lg text-charcoal">Filières agréées</h2>
        {approvedIds.length === 0 ? (
          <p className="text-charcoal/60">Aucune filière agréée pour le moment.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {approvedIds.map((id) => (
              <li
                key={id}
                className="border border-sage/40 bg-sage-light/40 px-3 py-2 text-sm text-charcoal"
              >
                {filiereLabel(id)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
