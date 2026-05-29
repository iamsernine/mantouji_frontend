"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientReviewsPage } from "@/components/account/ClientReviewsPage";
import { useAuth } from "@/contexts/auth-context";
import { roleFromStored } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function CompteAvisPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready || !user) return;
    if (roleFromStored(user.role) !== "CLIENT") router.replace("/compte");
  }, [ready, user, router]);

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/60">Chargement…</p>;
  }

  if (user && roleFromStored(user.role) !== "CLIENT") {
    return null;
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
    <div className="py-8 md:py-12">
      <ClientReviewsPage />
    </div>
  );
}
