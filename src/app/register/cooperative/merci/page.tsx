"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { logos } from "@/lib/brand";

function MerciContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("id");

  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <Image
        src={logos.fullcolor}
        alt="Mantouji"
        width={160}
        height={56}
        className="mx-auto mb-8 h-12 w-auto"
      />
      <h1 className="font-serif text-3xl text-burgundy">Demande envoyée</h1>
      <p className="mt-4 font-light text-charcoal/70">
        Merci pour votre confiance. Nous avons bien reçu votre demande d&apos;inscription
        coopérative.
      </p>
      <p className="mt-3 text-sm text-charcoal/60">
        Un email de confirmation a été envoyé (simulation locale). Après vérification de
        votre dossier, vous recevrez un second email d&apos;approbation ou de refus.
      </p>
      {ref && (
        <p className="mt-4 text-xs uppercase tracking-widest text-sage">
          Référence : {ref}
        </p>
      )}
      <div className="mt-10 flex flex-col gap-3">
        <Button asChild variant="outline">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </div>
  );
}

export default function CoopRegisterMerciPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-charcoal/50">Chargement…</p>}>
      <MerciContent />
    </Suspense>
  );
}
