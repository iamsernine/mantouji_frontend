"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SettingsSectionContent } from "@/components/account/SettingsSectionContent";
import { AccountMenuGroup, AccountMenuRow } from "@/components/account/AccountMenuRow";
import {
  getSettingsNavItems,
  settingsSectionTitle,
  type SettingsSectionId,
} from "@/components/account/settings-nav";
import { useSettingsAccount } from "@/components/account/use-settings-account";
import { cn } from "@/lib/utils";

type MobileView = "list" | "section";

export function SettingsHub({
  backHref,
  backLabel = "Retour",
  className,
  mode = "client",
}: {
  backHref: string;
  backLabel?: string;
  className?: string;
  mode?: "client" | "cooperative";
}) {
  const s = useSettingsAccount();
  const navItems = getSettingsNavItems(mode);
  const [mobileView, setMobileView] = useState<MobileView>("list");

  const openSection = (id: SettingsSectionId) => {
    s.setActiveSection(id);
    s.setError(null);
    setMobileView("section");
  };

  if (s.loading && !s.account) {
    return <p className="py-8 text-center text-sm text-charcoal/60">Chargement…</p>;
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-burgundy lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-burgundy lg:mt-0 lg:text-3xl">
          {mode === "cooperative" ? "Compte de connexion" : "Paramètres"}
        </h1>
        <p className="mt-1 text-sm text-charcoal/60">
          {mode === "cooperative"
            ? "Identifiants du responsable — non affichés sur la vitrine publique. Modifiez la coopérative depuis « Ma coopérative »."
            : "Compte, sécurité et confidentialité."}
        </p>
      </div>

      {/* Mobile: settings list → one section */}
      <div className="lg:hidden">
        {mobileView === "list" ? (
          <AccountMenuGroup>
            {navItems.map((item) => (
              <AccountMenuRow
                key={item.id}
                icon={item.icon}
                label={item.label}
                onClick={() => openSection(item.id)}
              />
            ))}
          </AccountMenuGroup>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className="inline-flex items-center gap-2 text-sm font-medium text-burgundy"
            >
              <ArrowLeft className="h-4 w-4" />
              Paramètres
            </button>
            <h2 className="font-serif text-xl text-charcoal">
              {settingsSectionTitle(s.activeSection, mode)}
            </h2>
            <div className="rounded-2xl border border-charcoal/10 bg-white p-5">
              <SettingsSectionContent section={s.activeSection} s={s} mode={mode} bare />
            </div>
          </div>
        )}
      </div>

      {/* Desktop: single scrollable page */}
      <div className="hidden max-w-2xl space-y-10 lg:block">
        {navItems.map((item) => (
          <SettingsSectionContent key={item.id} section={item.id} s={s} mode={mode} />
        ))}
      </div>

      {s.error ? <p className="mt-4 text-sm text-burgundy">{s.error}</p> : null}
    </div>
  );
}
