import { cn } from "@/lib/utils";
import { ZelligePattern } from "./zellige-pattern";

type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
  pattern?: "none" | "subtle" | "section";
  tone?: "cream" | "white" | "sand";
};

export function SectionShell({
  children,
  className,
  pattern = "section",
  tone = "cream",
}: SectionShellProps) {
  const bg =
    tone === "white"
      ? "bg-white"
      : tone === "sand"
        ? "bg-sand/50"
        : "bg-cream";

  return (
    <section
      className={cn("relative overflow-hidden rounded-2xl md:rounded-3xl", bg, className)}
    >
      {pattern !== "none" && <ZelligePattern variant={pattern} />}
      <div className="relative">{children}</div>
    </section>
  );
}
