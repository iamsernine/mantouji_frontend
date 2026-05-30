"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  AnimatedMobileMenu,
  type AnimatedMobileMenuLink,
} from "@/components/layout/AnimatedMobileMenu";
import { mobileMenuSmooth } from "@/lib/mobile-menu-motion";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const explorerLink: AnimatedMobileMenuLink = {
  href: "/produits",
  label: "Explorer",
  isActive: (pathname) =>
    pathname.startsWith("/produits") ||
    pathname.startsWith("/cooperatives") ||
    pathname.startsWith("/regions"),
};

function buildMainNavLinks(isAuthenticated: boolean): AnimatedMobileMenuLink[] {
  return [
    { href: "/", label: "Accueil" },
    explorerLink,
    { href: "/cooperatives", label: "Coopératives" },
    isAuthenticated
      ? { href: "/favoris", label: "Favoris" }
      : { href: "/regions", label: "Régions" },
  ];
}

export function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const mainLinks = useMemo(() => buildMainNavLinks(Boolean(user)), [user]);
  const links = useMemo(
    () => [
      ...mainLinks,
      { href: user ? "/compte" : "/login", label: user ? "Mon compte" : "Compte" },
    ],
    [mainLinks, user]
  );
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const desktopLinks = mainLinks.filter((link) => link.href !== "/cooperatives");

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-colors duration-500",
        menuOpen && !searchOpen
          ? "border-b border-transparent bg-cream/95 backdrop-blur-md"
          : isHome
            ? scrolled
              ? "border-b border-charcoal/5 bg-cream/90 backdrop-blur-md"
              : "bg-transparent"
            : "border-b border-charcoal/5 bg-cream/95 backdrop-blur-md"
      )}
    >
      {/* Desktop & tablet — hover expand */}
      <div className="mx-auto hidden h-24 max-w-7xl items-center gap-8 px-8 md:grid md:grid-cols-[auto_1fr_auto] lg:px-12">
        <Link
          href="/"
          className="flex shrink-0 items-center overflow-hidden"
          aria-label="Mantouji — accueil"
        >
          <BrandLogo priority />
        </Link>

        <div className="flex min-w-0 items-center justify-center px-4">
          <NavbarSearch variant="desktop" className="w-full max-w-[320px]" />
        </div>

        <nav className="flex shrink-0 items-center justify-end gap-6 lg:gap-8">
          {[...desktopLinks, links[links.length - 1]].map((l) => {
            const active = l.isActive
              ? l.isActive(pathname)
              : pathname === l.href ||
                (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm uppercase tracking-widest transition-colors",
                  active ? "text-burgundy" : "text-charcoal/70 hover:text-burgundy"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile — search replaces logo + menu; menu overlays content below bar */}
      <div className="relative md:hidden">
        <div className="relative h-20 overflow-hidden">
          <div className="flex h-full items-center px-4">
            <AnimatePresence mode="wait" initial={false}>
              {searchOpen ? (
                <motion.div
                  key="search-open"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={mobileMenuSmooth}
                  className="flex w-full min-w-0 items-center"
                >
                  <NavbarSearch
                    variant="mobile"
                    expanded
                    className="w-full"
                    onExpandedChange={setSearchOpen}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="nav-default"
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
                    <Link
                      href="/"
                      className="flex max-w-[52vw] items-center justify-center overflow-hidden"
                      aria-label="Mantouji — accueil"
                    >
                      <BrandLogo priority />
                    </Link>
                  </div>

                  <NavbarSearch
                    variant="mobile"
                    onExpandedChange={(v) => (v ? openSearch() : setSearchOpen(false))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatedMobileMenu
          open={menuOpen && !searchOpen}
          links={links}
          onNavigate={() => setMenuOpen(false)}
        />
      </div>
    </motion.header>
  );
}
