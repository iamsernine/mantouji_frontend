"use client";

import { DashboardSection } from "@/components/dashboard/DashboardSection";

/**
 * Processed coop registration requests are removed from the database after
 * approve/reject (see backend coop_registration_service). History is visible via
 * cooperative in-app notifications (Postgres).
 */
export function CoopRegistrationHistoryTable() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-burgundy">
          Historique
        </p>
        <h1 className="font-serif text-2xl text-charcoal sm:text-3xl">
          Dossiers traités
        </h1>
        <p className="mt-2 max-w-xl text-sm text-charcoal/65">
          Les demandes approuvées ou refusées sont migrées vers un compte coopérative réel
          puis archivées. Les coopératives reçoivent la décision dans leur centre de
          notifications (données PostgreSQL).
        </p>
      </div>

      <DashboardSection title="Inscriptions traitées">
        <p className="text-charcoal/60">
          Aucun dossier archivé côté admin : consultez l&apos;espace coopérative →
          Notifications pour le message de décision, ou les comptes coopératives actifs dans
          la liste des coopératives approuvées.
        </p>
      </DashboardSection>
    </div>
  );
}
