"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { DashboardMobileHeader } from "@/components/dashboard/DashboardMobileHeader";
import type { AnimatedMobileMenuLink } from "@/components/layout/AnimatedMobileMenu";
import { AdminNavLinks } from "./AdminNavLinks";
import { adminNavItems } from "./admin-nav";
import { listPendingCooperatives } from "@/lib/api";
import { usePathname } from "next/navigation";

export function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    listPendingCooperatives()
      .then((res) => setPendingCount(res.data.length))
      .catch(() => setPendingCount(0));
  }, [pathname]);

  const currentLabel =
    adminNavItems.find((item) =>
      item.href === "/dashboard/admin"
        ? pathname === item.href
        : pathname.startsWith(item.href)
    )?.label ?? "Administration";

  const menuLinks = useMemo((): AnimatedMobileMenuLink[] => {
    return adminNavItems.map((item) => ({
      href: item.href,
      label: item.label,
      badge: item.badgeKey === "inscriptions" ? pendingCount : undefined,
    }));
  }, [pendingCount]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-cream lg:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-charcoal/10 bg-cream lg:flex xl:w-72">
        <div className="border-b border-charcoal/10 px-5 py-6">
          <Link href="/dashboard/admin" className="mb-4 inline-block">
            <BrandLogo priority />
          </Link>
          <p className="text-xs font-medium uppercase tracking-widest text-burgundy">
            Administration
          </p>
          <p className="mt-1 font-serif text-lg leading-tight text-charcoal">
            Mantouji
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AdminNavLinks />
        </div>
        <div className="border-t border-charcoal/10 px-5 py-4">
          <Link
            href="/"
            className="text-sm text-charcoal/60 underline-offset-2 hover:text-burgundy hover:underline"
          >
            Retour au site public
          </Link>
        </div>
      </aside>

      <DashboardMobileHeader
        homeHref="/dashboard/admin"
        logoHref="/dashboard/admin"
        centerMode="context"
        eyebrow="Administration"
        title={currentLabel}
        menuLinks={menuLinks}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
