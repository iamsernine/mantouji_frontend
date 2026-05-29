import { cn } from "@/lib/utils";

export function DashboardSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="font-serif text-xl font-semibold text-charcoal md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-base text-charcoal/60">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
