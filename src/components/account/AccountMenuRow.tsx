"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccountMenuRow({
  href,
  onClick,
  icon: Icon,
  label,
  description,
  danger,
  className,
}: {
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  description?: string;
  danger?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      <Icon className="h-5 w-5 shrink-0 stroke-[1.25] text-charcoal/45" />
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm", danger ? "text-burgundy" : "text-charcoal")}>{label}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-xs text-charcoal/50">{description}</span>
        ) : null}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-charcoal/30" />
    </>
  );

  const rowClass = cn(
    "flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sand/50",
    className
  );

  if (href) {
    return (
      <Link href={href} className={rowClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rowClass}>
      {inner}
    </button>
  );
}

export function AccountMenuGroup({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {title ? (
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-charcoal/45">{title}</p>
      ) : null}
      <div className="divide-y divide-charcoal/8 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
        {children}
      </div>
    </div>
  );
}
