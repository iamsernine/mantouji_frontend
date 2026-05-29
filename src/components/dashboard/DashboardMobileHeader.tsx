"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  AnimatedMobileMenu,
  type AnimatedMobileMenuLink,
} from "@/components/layout/AnimatedMobileMenu";
import { mobileMenuSmooth } from "@/lib/mobile-menu-motion";
import { cn } from "@/lib/utils";

type Props = {
  homeHref: string;
  eyebrow: string;
  title: string;
  menuLinks: AnimatedMobileMenuLink[];
  rightLink?: { href: string; label: string };
  logoHref?: string;
  /** Centre de la barre : texte contextuel ou logo Mantouji (comme la landing). */
  centerMode?: "context" | "logo";
};

export function DashboardMobileHeader({
  homeHref,
  eyebrow,
  title,
  menuLinks,
  rightLink = { href: "/", label: "Site" },
  logoHref,
  centerMode = "logo",
}: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 lg:hidden",
        menuOpen
          ? "border-b border-transparent bg-cream/95 backdrop-blur-md"
          : "border-b border-charcoal/10 bg-cream/95 backdrop-blur-md"
      )}
    >
      <div className="relative">
        <div className="relative h-20 overflow-hidden">
          <div className="flex h-full items-center px-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key="dash-nav-bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={mobileMenuSmooth}
                className="flex w-full items-center gap-2"
              >
                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-charcoal transition-colors hover:text-burgundy"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? (
                    <X className="h-6 w-6 stroke-1" />
                  ) : (
                    <Menu className="h-6 w-6 stroke-1" />
                  )}
                </button>

                <div className="flex min-w-0 flex-1 justify-center">
                  {centerMode === "logo" ? (
                    <Link
                      href={logoHref ?? homeHref}
                      className="flex max-w-[52vw] items-center justify-center overflow-hidden"
                      aria-label="Accueil tableau de bord"
                      onClick={() => setMenuOpen(false)}
                    >
                      <BrandLogo />
                    </Link>
                  ) : (
                    <div className="min-w-0 px-2 text-center">
                      <p className="truncate text-[10px] uppercase tracking-widest text-charcoal/55">
                        {eyebrow}
                      </p>
                      <p className="truncate font-serif text-sm text-burgundy">
                        {title}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href={rightLink.href}
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-xs uppercase tracking-wider text-charcoal/70 hover:text-burgundy sm:w-auto sm:px-2"
                >
                  {rightLink.label}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatedMobileMenu
          open={menuOpen}
          links={menuLinks}
          onNavigate={() => setMenuOpen(false)}
        />
      </div>
    </header>
  );
}
