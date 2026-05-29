"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ClientAccountHome } from "@/components/account/ClientAccountHome";
import { useAuth } from "@/contexts/auth-context";
import { roleFromStored } from "@/lib/auth";

export default function ComptePage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready || !user) return;
    const role = roleFromStored(user.role);
    if (role === "COOPERATIVE") {
      router.replace("/dashboard/cooperative/profil");
    } else if (role === "ADMIN") {
      router.replace("/dashboard/admin");
    }
  }, [ready, user, router]);

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/60">Chargement…</p>;
  }

  if (user && roleFromStored(user.role) !== "CLIENT") {
    return <p className="py-12 text-center text-charcoal/60">Redirection…</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <h1 className="font-serif text-3xl text-burgundy">Mon compte</h1>
        <p className="text-charcoal/70">Connectez-vous pour accéder à votre espace.</p>
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <ClientAccountHome />
    </div>
  );
}
