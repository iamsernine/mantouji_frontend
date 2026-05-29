"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "@/components/products/FloatingWhatsApp";
import { MainShell } from "@/components/layout/MainShell";
import { Navbar } from "@/components/layout/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/dashboard/cooperative") ||
    pathname.startsWith("/dashboard/admin") ||
    pathname.startsWith("/dashboard/onssa");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <MainShell>{children}</MainShell>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  );
}
