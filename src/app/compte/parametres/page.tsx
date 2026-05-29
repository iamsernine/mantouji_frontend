"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SettingsHub } from "@/components/account/SettingsHub";
import { useAuth } from "@/contexts/auth-context";
import { roleFromStored } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function CompteParametresPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready || !user) return;
    const role = roleFromStored(user.role);
    if (role === "COOPERATIVE") router.replace("/dashboard/cooperative/parametres");
    if (role === "ADMIN") router.replace("/dashboard/admin");
  }, [ready, user, router]);

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/60">Chargement…</p>;
  }

  if (user && roleFromStored(user.role) !== "CLIENT") {
    return <p className="py-12 text-center text-charcoal/60">Redirection…</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-12">
      <SettingsHub backHref="/compte" backLabel="Mon compte" />
    </div>
  );
}
