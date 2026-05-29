import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  centered = false,
}: PageHeaderProps) {
  return (
    <header className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-sage">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-3xl font-bold text-charcoal md:text-4xl">
        {title}
      </h1>
      <div
        className={cn(
          "mt-3 h-0.5 w-12 bg-gold/60",
          centered && "mx-auto"
        )}
      />
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed text-muted",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}
