"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { mobileMenuItemVariants } from "@/lib/mobile-menu-motion";
import { cn } from "@/lib/utils";

export type AnimatedMobileMenuLink = {
  href: string;
  label: string;
  badge?: number;
  isActive?: (pathname: string) => boolean;
};

type Props = {
  open: boolean;
  links: AnimatedMobileMenuLink[];
  onNavigate?: () => void;
  /** Panel flottant sous la barre (ne pousse pas le contenu). */
  overlay?: boolean;
  className?: string;
};

function defaultIsActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/dashboard/cooperative") return pathname === href;
  if (href === "/dashboard/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AnimatedMobileMenu({
  open,
  links,
  onNavigate,
  overlay = true,
  className,
}: Props) {
  const pathname = usePathname();
  const itemVariants = mobileMenuItemVariants(links.length);

  return (
    <nav
      aria-label="Navigation"
      className={cn(
        "flex flex-col gap-0",
        overlay
          ? "pointer-events-none absolute top-full right-0 left-0 z-50"
          : "items-center",
        className
      )}
    >
      <AnimatePresence initial={false}>
        {open &&
          links.map((l, i) => {
            const active = l.isActive
              ? l.isActive(pathname)
              : defaultIsActive(pathname, l.href);
            return (
              <motion.div
                key={l.href + l.label}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "pointer-events-auto flex w-full justify-center overflow-hidden bg-cream/95 backdrop-blur-md",
                  i > 0 && "-mt-px"
                )}
              >
                <Link
                  href={l.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex min-h-12 w-full items-center justify-center gap-2 px-8 text-center text-sm uppercase tracking-widest transition-colors",
                    active ? "text-burgundy" : "text-charcoal hover:text-burgundy"
                  )}
                >
                  {l.label}
                  {l.badge != null && l.badge > 0 && (
                    <span className="rounded-full bg-burgundy px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-cream">
                      {l.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </nav>
  );
}
