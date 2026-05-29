"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { applyPreferredLanguage, getStoredPreferredLanguage } from "@/lib/locale-preference";

/** Applies saved language preference to the document (dir/lang). */
export function LocaleApplier() {
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    const lang = user?.preferredLanguage ?? getStoredPreferredLanguage() ?? "fr";
    applyPreferredLanguage(lang);
  }, [ready, user?.preferredLanguage]);

  return null;
}
