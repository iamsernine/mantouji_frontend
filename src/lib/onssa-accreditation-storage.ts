import { getOnssaFiliere } from "@/data/onssa-filieres";
import {
  getCoopAccreditedFilieresFromSheet,
  getFilieresFromSheet,
  getOnssaFiliereFromDb,
  isFiliereInOnssaDatabase,
} from "@/lib/onssa-db-storage";
import type {
  CoopNotification,
  OnssaAccreditationDemand,
} from "@/types/onssa";

const DEMANDS_KEY = "mantouji-onssa-demands-v1";

function filieresKey(coopId: string) {
  return `mantouji-coop-filieres-v1-${coopId}`;
}

function notificationsKey(coopId: string) {
  return `mantouji-coop-notifications-v1-${coopId}`;
}

export function loadOnssaDemands(): OnssaAccreditationDemand[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DEMANDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OnssaAccreditationDemand[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOnssaDemands(demands: OnssaAccreditationDemand[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMANDS_KEY, JSON.stringify(demands));
}

export function loadCoopDeclaredFilieres(coopId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(filieresKey(coopId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCoopDeclaredFilieres(coopId: string, filiereIds: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(filieresKey(coopId), JSON.stringify(filiereIds));
}

/** Legacy local notifications (ONSSA workflow only). Prefer API `/coop-registrations/me/notifications`. */
export function loadCoopNotifications(coopId: string): CoopNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(notificationsKey(coopId));
    if (!raw) return [];
    return JSON.parse(raw) as CoopNotification[];
  } catch {
    return [];
  }
}

export function saveCoopNotifications(coopId: string, items: CoopNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(notificationsKey(coopId), JSON.stringify(items));
}

function resolveFiliere(id: string) {
  return getOnssaFiliereFromDb(id) ?? getOnssaFiliere(id);
}

function buildRejectionNotification(demand: OnssaAccreditationDemand): CoopNotification {
  const filiere = resolveFiliere(demand.filiereId);
  return {
    id: `notif-${demand.id}`,
    coopId: demand.coopId,
    type: "onssa_rejected",
    title: "Agrément ONSSA refusé",
    message:
      demand.rejectionReason ??
      `La filière « ${filiere?.nom ?? demand.filiereId} » n'est pas couverte par la base ONSSA.`,
    filiereId: demand.filiereId,
    read: false,
    createdAt: demand.resolvedAt,
  };
}

function buildApprovalNotification(demand: OnssaAccreditationDemand): CoopNotification {
  const filiere = resolveFiliere(demand.filiereId);
  return {
    id: `notif-${demand.id}`,
    coopId: demand.coopId,
    type: "onssa_approved",
    title: "Agrément ONSSA accordé",
    message: `La filière « ${filiere?.nom ?? demand.filiereId} » est agréée conformément à la base ONSSA.`,
    filiereId: demand.filiereId,
    read: false,
    createdAt: demand.resolvedAt,
  };
}

function pushNotification(coopId: string, notification: CoopNotification) {
  const all = loadCoopNotifications(coopId);
  saveCoopNotifications(coopId, [notification, ...all]);
}

export function submitOnssaAccreditationDemand(
  coopId: string,
  coopName: string,
  filiereId: string
): OnssaAccreditationDemand {
  const existing = loadOnssaDemands().find(
    (d) =>
      d.coopId === coopId &&
      d.filiereId === filiereId &&
      d.status === "approved"
  );
  if (existing) return existing;

  const inDb = isFiliereInOnssaDatabase(filiereId);
  const now = new Date().toISOString();
  const demand: OnssaAccreditationDemand = {
    id: `onssa-${Date.now()}`,
    coopId,
    coopName,
    filiereId,
    inOnssaDatabase: inDb,
    status: inDb ? "approved" : "rejected",
    createdAt: now,
    resolvedAt: now,
    rejectionReason: inDb
      ? undefined
      : "Cette filière n'est pas répertoriée dans la base nationale ONSSA. Rendez-vous au bureau ONSSA pour régulariser votre dossier.",
  };

  const all = [demand, ...loadOnssaDemands()];
  saveOnssaDemands(all);

  if (inDb) {
    pushNotification(coopId, buildApprovalNotification(demand));
  } else {
    pushNotification(coopId, buildRejectionNotification(demand));
  }

  return demand;
}

export function pushCoopRegistrationNotification(params: {
  coopId: string;
  status: "approved" | "rejected";
  coopName: string;
  adminMessage?: string;
}) {
  const now = new Date().toISOString();
  const title =
    params.status === "approved"
      ? "Demande d’inscription approuvée"
      : "Demande d’inscription refusée";
  const message =
    params.status === "approved"
      ? `Votre coopérative « ${params.coopName} » est maintenant approuvée.`
      : params.adminMessage?.trim()
        ? `Refus : ${params.adminMessage.trim()}`
        : `Votre demande d’inscription pour « ${params.coopName} » a été refusée.`;

  const notification: CoopNotification = {
    id: `notif-coop-reg-${params.status}-${Date.now()}`,
    coopId: params.coopId,
    type:
      params.status === "approved"
        ? "coop_registration_approved"
        : "coop_registration_rejected",
    title,
    message,
    read: false,
    createdAt: now,
  };
  const all = loadCoopNotifications(params.coopId);
  saveCoopNotifications(params.coopId, [notification, ...all]);
}

export function getCoopOnssaDemands(coopId: string) {
  return loadOnssaDemands().filter((d) => d.coopId === coopId);
}

export function getApprovedFilieresForCoop(coopId: string) {
  const fromDemands = getCoopOnssaDemands(coopId)
    .filter((d) => d.status === "approved")
    .map((d) => d.filiereId);
  const fromSheet = getCoopAccreditedFilieresFromSheet(coopId);
  return [...new Set([...fromSheet, ...fromDemands])];
}

export function markAllNotificationsRead(coopId: string) {
  const all = loadCoopNotifications(coopId).map((n) => ({ ...n, read: true }));
  saveCoopNotifications(coopId, all);
}

export function markNotificationRead(coopId: string, notificationId: string) {
  const all = loadCoopNotifications(coopId).map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveCoopNotifications(coopId, all);
}

export function getRejectedDemandsForBureau() {
  return loadOnssaDemands().filter((d) => d.status === "rejected");
}

export function getApprovedDemandsForBureau() {
  return loadOnssaDemands().filter((d) => d.status === "approved");
}
