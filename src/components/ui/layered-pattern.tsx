import { cn } from "@/lib/utils";
import { patternUrl } from "@/lib/brand";

type LayeredPatternProps = {
  className?: string;
  /** White wash above the pattern (e.g. CTA block) */
  whiteOverlay?: boolean;
};

export function LayeredPattern({
  className,
  whiteOverlay = false,
}: LayeredPatternProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: `url("${patternUrl}")`,
          backgroundSize: "480px",
          backgroundPosition: "center top",
          opacity: 0.35,
        }}
      />
      {whiteOverlay && <div className="absolute inset-0 bg-white/65" aria-hidden />}
    </div>
  );
}
