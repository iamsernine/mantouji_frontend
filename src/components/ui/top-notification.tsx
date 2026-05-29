"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TopNotice = {
  id: string;
  title: string;
  description?: string;
  variant?: "info" | "warning" | "success" | "error";
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  durationMs?: number;
};

type Ctx = {
  show: (notice: Omit<TopNotice, "id">) => void;
};

const TopNotificationContext = createContext<Ctx | null>(null);

export function useTopNotification() {
  const ctx = useContext(TopNotificationContext);
  if (!ctx) throw new Error("useTopNotification must be used within TopNotificationProvider");
  return ctx;
}

function variantClasses(variant: TopNotice["variant"]) {
  switch (variant) {
    case "success":
      return "border-sage/30 bg-sage/10 text-charcoal";
    case "warning":
      return "border-gold/30 bg-gold/10 text-charcoal";
    case "error":
      return "border-burgundy/30 bg-burgundy/10 text-charcoal";
    default:
      return "border-charcoal/15 bg-white/70 text-charcoal";
  }
}

export function TopNotificationProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<TopNotice | null>(null);
  const [busy, setBusy] = useState(false);

  const show = useCallback((notice: Omit<TopNotice, "id">) => {
    setCurrent({ id: `${Date.now()}`, durationMs: 6500, variant: "info", ...notice });
  }, []);

  useEffect(() => {
    if (!current) return;
    const t = window.setTimeout(() => setCurrent(null), current.durationMs ?? 6500);
    return () => window.clearTimeout(t);
  }, [current]);

  const value = useMemo<Ctx>(() => ({ show }), [show]);

  return (
    <TopNotificationContext.Provider value={value}>
      <div className="relative">
        {current ? (
          <div className="pointer-events-none fixed left-0 right-0 top-0 z-[60] px-3 pt-3">
            <div
              className={cn(
                "pointer-events-auto mx-auto flex w-full max-w-3xl items-start justify-between gap-4 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur",
                variantClasses(current.variant)
              )}
              role="status"
              aria-live="polite"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">{current.title}</p>
                {current.description ? (
                  <p className="mt-1 text-sm text-charcoal/70">{current.description}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {current.actionLabel && current.onAction ? (
                  <button
                    type="button"
                    disabled={busy}
                    className="rounded-xl border border-charcoal/20 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-cream disabled:opacity-60"
                    onClick={async () => {
                      try {
                        setBusy(true);
                        await current.onAction?.();
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    {busy ? "…" : current.actionLabel}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="rounded-xl px-2 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal/70 hover:text-charcoal"
                  onClick={() => setCurrent(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </TopNotificationContext.Provider>
  );
}

