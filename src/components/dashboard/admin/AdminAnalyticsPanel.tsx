"use client";

import { PageHeader } from "@/components/ui/PageHeader";

export function AdminAnalyticsPanel() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytique"
        description="Les statistiques détaillées seront alimentées par l'API Mantouji."
      />
      <p className="text-sm text-charcoal/60">
        Consultez le tableau de bord principal pour les demandes coopératives en attente et le
        nombre d&apos;utilisateurs.
      </p>
    </div>
  );
}
