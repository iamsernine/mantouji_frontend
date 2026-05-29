"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/brand-logo";
import { FooterLinks } from "@/components/layout/FooterLinks";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="mt-auto w-full max-w-full overflow-x-clip border-t border-charcoal/8 bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-10 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12 lg:px-12">
        <div className="flex w-full min-w-0 max-w-full flex-row items-start justify-between gap-4">
          <FooterLinks className="min-w-0 flex-1" />
          <Link href="/" aria-label="Mantouji — accueil" className="shrink-0 self-start">
            <BrandLogo size="footer" color="fullcolor" />
          </Link>
        </div>
        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-charcoal/60">
          Vitrine des terroirs du Maroc — produits authentiques et coopératives de confiance.
        </p>
        <p className="mt-8 text-xs text-charcoal/40">
          © {new Date().getFullYear()} Mantouji. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
