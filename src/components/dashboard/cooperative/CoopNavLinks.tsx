"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchCoopUnreadNotificationsCount } from "@/lib/coop-notifications-api";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { coopNavItems, coopStorefrontHref, coopStorefrontNavItem } from "./coop-nav";

export function CoopNavLinks({
  onNavigate,
  compact,
}: {
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const { coopId, cooperative } = useCoopDashboard();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    void fetchCoopUnreadNotificationsCount().then(setUnread);
  }, [coopId, pathname]);

  const isActive = (href: string) =>
    href === "/dashboard/cooperative"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const storefrontHref = coopStorefrontHref(cooperative?.id ?? coopId);

  return (
    <nav className="flex flex-col gap-1">
      {coopNavItems.map(({ href, label, icon: Icon, badgeKey }) => {
        const showBadge = badgeKey === "notifications" && unread > 0;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 transition-colors",
              compact ? "text-base" : "text-sm",
              isActive(href)
                ? "bg-burgundy/10 font-medium text-burgundy"
                : "text-charcoal/75 hover:bg-sand/80 hover:text-charcoal"
            )}
          >
            <Icon className="h-5 w-5 shrink-0 stroke-[1.25]" />
            <span className="flex-1">{label}</span>
            {showBadge && (
              <span className="rounded-full bg-burgundy px-2 py-0.5 text-[10px] font-semibold text-cream">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
      {storefrontHref && (
        <>
          <div className="my-3 border-t border-charcoal/10" />
          <Link
            href={storefrontHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-charcoal/70 hover:bg-sand/80 hover:text-charcoal"
          >
            <coopStorefrontNavItem.icon className="h-5 w-5 shrink-0 stroke-[1.25]" />
            <span>{coopStorefrontNavItem.label}</span>
          </Link>
        </>
      )}
    </nav>
  );
}
