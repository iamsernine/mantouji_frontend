import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuRowProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  variant?: "default" | "danger";
};

export function MenuRow({
  href,
  icon: Icon,
  label,
  subtitle,
  variant = "default",
}: MenuRowProps) {
  return (
    <Link
      href={href}
      className="flex min-h-[56px] items-center justify-between px-1 py-3 transition-colors hover:bg-sand/50 active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <Icon
          className={cn(
            "h-5 w-5",
            variant === "danger" ? "text-terracotta" : "text-muted"
          )}
        />
        <div>
          <span
            className={cn(
              "text-base font-medium",
              variant === "danger" ? "text-terracotta" : "text-charcoal"
            )}
          >
            {label}
          </span>
          {subtitle && (
            <p className="text-xs text-sage">{subtitle}</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-charcoal/30" />
    </Link>
  );
}
