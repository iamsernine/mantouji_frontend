"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { listPendingCooperatives } from "@/lib/api";
import { adminNavItems } from "./admin-nav";

export function AdminNavLinks({
  onNavigate,
  compact,
}: {
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    listPendingCooperatives()
      .then((res) => setPendingCount(res.data.length))
      .catch(() => setPendingCount(0));
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard/admin"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="flex flex-col gap-1">
      {adminNavItems.map(({ href, label, icon: Icon, badgeKey }) => {
        const showBadge = badgeKey === "inscriptions" && pendingCount > 0;
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
                {pendingCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
