import Link from "next/link";
import { OnssaDemandJournal } from "@/components/dashboard/admin/onssa/OnssaDemandJournal";
import { Button } from "@/components/ui/button";

export default function OnssaBureauPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-olive">
          Bureau ONSSA — lecture
        </p>
        <h1 className="font-serif text-2xl text-charcoal">Journal des demandes</h1>
        <p className="mt-2 max-w-xl text-sm text-charcoal/65">
          Consultation et filtres. Édition des bases : espace admin Mantouji.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/dashboard/admin/onssa">Gérer les bases ONSSA (admin)</Link>
        </Button>
      </div>
      <OnssaDemandJournal />
    </div>
  );
}
