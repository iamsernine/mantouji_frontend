"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiRequestError } from "@/lib/api-client";
import { verifyEmail } from "@/lib/auth";
import { logos } from "@/lib/brand";

type Status = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Lien de confirmation invalide (jeton manquant).");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await verifyEmail(token);
        if (!cancelled) {
          setStatus("success");
          setMessage("Votre email est confirmé. Vous pouvez maintenant vous connecter.");
        }
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof ApiRequestError
            ? err.message
            : "Impossible de confirmer votre email. Le lien est peut-être expiré."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 pb-24">
      <Image
        src={logos.fullcolor}
        alt="Mantouji"
        width={180}
        height={64}
        className="mb-8 h-14 w-auto"
      />
      <div className="rounded-2xl border border-charcoal/10 bg-white p-6">
        <h1 className="font-serif text-2xl text-burgundy">
          {status === "loading"
            ? "Confirmation en cours…"
            : status === "success"
              ? "Email confirmé"
              : "Confirmation impossible"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
          {status === "loading" ? "Veuillez patienter pendant la vérification de votre compte." : message}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {status === "success" ? (
            <Button asChild className="w-full">
              <Link href="/login">Se connecter</Link>
            </Button>
          ) : null}
          {status === "error" ? (
            <>
              <Button asChild className="w-full">
                <Link href="/login?registered=1">Renvoyer l’email depuis la connexion</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Créer un compte</Link>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-charcoal/60">Chargement de la confirmation…</p>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
