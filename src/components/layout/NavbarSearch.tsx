"use client";

import { Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NavbarSearchProps = {
  variant: "desktop" | "mobile";
  expanded?: boolean;
  className?: string;
  onExpandedChange?: (expanded: boolean) => void;
};

export function NavbarSearch({
  variant,
  expanded = false,
  className,
  onExpandedChange,
}: NavbarSearchProps) {
  const [hovered, setHovered] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const isDesktop = variant === "desktop";
  const isOpen = isDesktop ? hovered : expanded;

  const smoothTransition = {
    type: "spring" as const,
    stiffness: 280,
    damping: 30,
    mass: 0.85,
  };

  useEffect(() => {
    if (!isDesktop && expanded) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 280);
      return () => window.clearTimeout(t);
    }
  }, [expanded, isDesktop]);

  const submit = () => {
    const q = query.trim();
    router.push(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche");
    if (!isDesktop) onExpandedChange?.(false);
    setQuery("");
    setHovered(false);
    inputRef.current?.blur();
  };

  const handleMouseLeave = () => {
    if (document.activeElement === inputRef.current) return;
    setHovered(false);
  };

  if (!isDesktop && !expanded) {
    return (
      <button
        type="button"
        onClick={() => onExpandedChange?.(true)}
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center text-charcoal transition-colors hover:text-burgundy",
          className
        )}
        aria-label="Ouvrir la recherche"
      >
        <Search className="h-5 w-5 stroke-1" />
      </button>
    );
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      onMouseEnter={isDesktop ? () => setHovered(true) : undefined}
      onMouseLeave={isDesktop ? handleMouseLeave : undefined}
      className={cn(
        "flex items-center",
        isDesktop && "justify-center",
        !isDesktop && "min-w-0 flex-1",
        className
      )}
    >
      <motion.div
        layout
        initial={false}
        animate={{
          width: isDesktop ? (isOpen ? 300 : 44) : "100%",
        }}
        transition={isDesktop ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] } : smoothTransition}
        className={cn(
          "flex h-11 w-full items-center overflow-hidden",
          isOpen && "border-b border-burgundy/40 transition-colors duration-500"
        )}
      >
        {isDesktop ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center text-charcoal">
            <Search className="h-5 w-5 stroke-1" />
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onExpandedChange?.(false)}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-charcoal transition-colors hover:text-burgundy"
            aria-label="Fermer la recherche"
          >
            <X className="h-5 w-5 stroke-1" />
          </button>
        )}

        <label className="sr-only" htmlFor={`nav-search-${variant}`}>
          Rechercher un produit
        </label>
        <motion.input
          id={`nav-search-${variant}`}
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={isDesktop ? () => setHovered(true) : undefined}
          placeholder="Dattes, argan, miel..."
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            x: isOpen ? 0 : 8,
          }}
          transition={isDesktop ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] } : smoothTransition}
          className={cn(
            "h-11 min-w-0 flex-1 bg-transparent pr-3 text-sm text-charcoal outline-none placeholder:text-charcoal/40",
            !isOpen && "pointer-events-none"
          )}
        />
      </motion.div>
    </form>
  );
}
