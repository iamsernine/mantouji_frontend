import { cn } from "@/lib/utils";

const TILE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%235d2a26' fill-opacity='1'%3E%3Cpath d='M40 0 L50 30 L80 40 L50 50 L40 80 L30 50 L0 40 L30 30 Z'/%3E%3C/g%3E%3C/svg%3E";

const CLASSIC =
  "data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2350625a' fill-opacity='1'%3E%3Cpath d='M32 0l4 12 12 4-12 4-4 12-4-12-12-4 12-4z'/%3E%3C/g%3E%3C/svg%3E";

type ZelligePatternProps = {
  className?: string;
  variant?: "subtle" | "hero" | "section" | "star";
};

const variantStyles = {
  subtle: { bg: CLASSIC, opacity: "opacity-[0.04]" },
  section: { bg: CLASSIC, opacity: "opacity-[0.06]" },
  hero: { bg: TILE, opacity: "opacity-[0.09]" },
  star: { bg: TILE, opacity: "opacity-[0.12]" },
};

export function ZelligePattern({
  className,
  variant = "subtle",
}: ZelligePatternProps) {
  const v = variantStyles[variant];
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        v.opacity,
        className
      )}
      aria-hidden
      style={{
        backgroundImage: `url("${v.bg}")`,
        backgroundSize: variant === "hero" || variant === "star" ? "80px 80px" : "64px 64px",
      }}
    />
  );
}
