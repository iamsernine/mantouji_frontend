"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { LocaleApplier } from "@/components/providers/LocaleApplier";
import { TopNotificationProvider } from "@/components/ui/top-notification";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocaleApplier />
      <TopNotificationProvider>{children}</TopNotificationProvider>
    </AuthProvider>
  );
}
