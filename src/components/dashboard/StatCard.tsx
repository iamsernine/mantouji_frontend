import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: "burgundy" | "sage" | "gold";
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "burgundy",
}: StatCardProps) {
  const accentClass = {
    burgundy: "text-burgundy",
    sage: "text-sage",
    gold: "text-gold",
  }[accent];

  return (
    <div className="border-b border-charcoal/10 py-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-widest text-charcoal/50">{title}</p>
        <Icon className={cn("h-5 w-5", accentClass)} />
      </div>
      <p className="mt-2 font-serif text-3xl font-bold text-charcoal">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-charcoal/55">{subtitle}</p>}
    </div>
  );
}
