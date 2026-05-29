"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainShell({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";

  return (
    <main
      className={cn(
        "mx-auto w-full flex-1",
        isHome
          ? "max-w-full overflow-x-clip px-0 pb-0 pt-0"
          : "min-h-[calc(100vh-4rem)] max-w-7xl overflow-x-clip px-4 pb-12 pt-24 md:px-6 md:pb-12 md:pt-28"
      )}
    >
      {children}
    </main>
  );
}
