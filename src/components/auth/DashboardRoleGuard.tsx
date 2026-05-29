"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { roleFromStored } from "@/lib/auth";
import type { Role } from "@/types/api";

export function DashboardRoleGuard({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: Role;
}) {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    const role = roleFromStored(user.role);
    if (role !== allowedRole) {
      router.replace("/compte");
    }
  }, [user, ready, allowedRole, router]);

  if (!ready || !user || roleFromStored(user.role) !== allowedRole) {
    return <p className="py-12 text-center text-charcoal/60">Vérification de l&apos;accès…</p>;
  }

  return <>{children}</>;
}
