import Link from "next/link";
import { footerColumns } from "@/lib/footer-links";
import { cn } from "@/lib/utils";

export function FooterLinks({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid w-full min-w-0 max-w-full grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-4 md:gap-x-8",
        className
      )}
    >
      {footerColumns.map((column) => (
        <div key={column.title} className="min-w-0">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-charcoal/45 sm:text-[11px]">
            {column.title}
          </p>
          <ul className="space-y-2">
            {column.links.map((link) => (
              <li key={link.label} className="min-w-0">
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs leading-snug text-charcoal/65 break-words transition-colors hover:text-burgundy sm:text-sm"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="block text-xs leading-snug text-charcoal/65 break-words transition-colors hover:text-burgundy sm:text-sm"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
