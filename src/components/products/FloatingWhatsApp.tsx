"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/produits/")
  ) {
    return null;
  }

  const href = generateWhatsAppLink("212612345678");

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  );
}
