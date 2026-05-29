import { PageHeader } from "@/components/ui/PageHeader";

export default function AdminHistoriquePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Historique"
        description="L'historique des actions admin sera disponible dans une prochaine version API."
      />
      <p className="text-sm text-charcoal/60">
        Les validations de coopératives et modération des avis sont gérées depuis le tableau de
        bord et les inscriptions en attente.
      </p>
    </div>
  );
}
