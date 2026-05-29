"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Button } from "@/components/ui/button";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { getMyCoopNotifications } from "@/lib/api";
import type { CoopNotification } from "@/types/onssa";

export function CoopNotificationsPanel() {
  const { coopId } = useCoopDashboard();
  const [notifications, setNotifications] = useState<CoopNotification[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    getMyCoopNotifications()
      .then((res) => setNotifications(res.data as any))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unread = notifications.filter((n) => !n.read).length;

  if (!ready) {
    return <p className="py-12 text-center text-charcoal/50">Chargement…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-sage">
            Centre de notifications
          </p>
          <h1 className="font-serif text-2xl text-burgundy sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-2 max-w-xl text-sm text-charcoal/65">
            Agréments ONSSA, refus de filière et messages liés à votre espace
            coopérative.
          </p>
        </div>
        {unread > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              refresh();
            }}
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer lu
          </Button>
        )}
      </div>

      {unread > 0 && (
        <div className="flex items-center gap-3 border border-burgundy/20 bg-burgundy/5 px-4 py-3">
          <Bell className="h-5 w-5 text-burgundy" />
          <p className="text-sm font-medium text-charcoal">
            {unread} non lue{unread > 1 ? "s" : ""}
          </p>
        </div>
      )}

      <DashboardSection title="Toutes les notifications">
        {notifications.length === 0 ? (
          <p className="text-charcoal/60">Aucune notification pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`border p-4 text-sm ${
                  n.read
                    ? "border-charcoal/10 bg-white text-charcoal/70"
                    : "border-burgundy/20 bg-burgundy/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-charcoal">{n.title}</p>
                    <p className="mt-1 text-charcoal/70">{n.message}</p>
                    <p className="mt-2 text-xs text-charcoal/45">
                      {new Date(n.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      className="shrink-0 text-xs uppercase tracking-wider text-burgundy"
                      onClick={() => {
                        refresh();
                      }}
                    >
                      Lu
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}
