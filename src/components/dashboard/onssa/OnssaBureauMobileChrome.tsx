"use client";

import { DashboardMobileHeader } from "@/components/dashboard/DashboardMobileHeader";
import type { AnimatedMobileMenuLink } from "@/components/layout/AnimatedMobileMenu";
import { usePathname } from "next/navigation";

const menuLinks: AnimatedMobileMenuLink[] = [
  { href: "/dashboard/onssa", label: "Journal des demandes" },
  { href: "/dashboard/admin/onssa", label: "Gérer les bases ONSSA" },
  { href: "/dashboard/admin", label: "Administration" },
];

export function OnssaBureauMobileChrome() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <DashboardMobileHeader
        homeHref="/dashboard/onssa"
        centerMode="context"
        eyebrow="Bureau ONSSA"
        title="Suivi des agréments"
        menuLinks={menuLinks}
        rightLink={{ href: "/dashboard/admin", label: "Admin" }}
      />
      {pathname === "/dashboard/onssa" && (
        <div className="border-b border-olive/20 bg-olive/10 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-olive">
            ONSSA — lecture
          </p>
        </div>
      )}
    </div>
  );
}
