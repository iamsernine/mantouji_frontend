"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { DashboardMobileHeader } from "@/components/dashboard/DashboardMobileHeader";
import type { AnimatedMobileMenuLink } from "@/components/layout/AnimatedMobileMenu";
import { CoopNavLinks } from "./CoopNavLinks";
import { coopNavItems, coopStorefrontHref, coopStorefrontNavItem } from "./coop-nav";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { fetchCoopUnreadNotificationsCount } from "@/lib/coop-notifications-api";
import { usePathname } from "next/navigation";

export function CoopDashboardShell({ children }: { children: React.ReactNode }) {
  const { cooperative, coopId } = useCoopDashboard();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    void fetchCoopUnreadNotificationsCount().then(setUnread);
  }, [coopId, pathname]);

  const storefrontHref = coopStorefrontHref(cooperative?.id ?? coopId);

  const currentLabel =
    coopNavItems.find((item) =>
      item.href === "/dashboard/cooperative"
        ? pathname === item.href
        : pathname.startsWith(item.href)
    )?.label ?? "Espace coopérative";

  const menuLinks = useMemo((): AnimatedMobileMenuLink[] => {
    const primary = coopNavItems.map((item) => ({
      href: item.href,
      label: item.label,
      badge: item.badgeKey === "notifications" ? unread : undefined,
    }));
    const secondary = storefrontHref
      ? [{ href: storefrontHref, label: coopStorefrontNavItem.label }]
      : [];
    return [...primary, ...secondary];
  }, [unread, storefrontHref]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-cream lg:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-charcoal/10 bg-cream lg:flex xl:w-72">
        <div className="border-b border-charcoal/10 px-5 py-6">
          <Link href="/dashboard/cooperative" className="mb-4 inline-block">
            <BrandLogo priority />
          </Link>
          <p className="text-xs font-medium uppercase tracking-widest text-sage">
            Espace coopérative
          </p>
          <p className="mt-1 font-serif text-lg leading-tight text-burgundy">
            {cooperative?.nomCooperative ?? "Coopérative"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <CoopNavLinks />
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
        homeHref="/dashboard/cooperative"
        logoHref="/dashboard/cooperative"
        centerMode="context"
        eyebrow={cooperative?.nomCooperative ?? "Coopérative"}
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
