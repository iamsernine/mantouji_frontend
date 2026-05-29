import Link from "next/link";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel = "Explorer le catalogue",
  actionHref = "/produits",
}: EmptyStateProps) {
  return (
    <div className="border-b border-charcoal/10 py-16 text-center">
      <p className="font-serif text-xl text-charcoal">{title}</p>
      <p className="mx-auto mt-3 max-w-sm font-light text-charcoal/60">{description}</p>
      {actionHref && (
        <Button asChild variant="outline" className="mt-8">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
