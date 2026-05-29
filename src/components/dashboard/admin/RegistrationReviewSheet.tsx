"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ProofDocumentsList } from "@/components/dashboard/admin/ProofDocumentsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  adminApproveCoopRequest,
  adminGetCoopRequest,
  adminRejectCoopRequest,
  getRegions,
} from "@/lib/api";
import { ApiRequestError } from "@/lib/api-client";

export function RegistrationReviewSheet({
  requestId,
  open,
  onOpenChange,
  onReviewed,
}: {
  requestId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewed: () => void;
}) {
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [regionNames, setRegionNames] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [request, setRequest] = useState<any | null>(null);

  useEffect(() => {
    getRegions()
      .then(({ data }) =>
        setRegionNames(Object.fromEntries(data.map((r) => [r.id, r.nom])))
      )
      .catch(() => setRegionNames({}));
  }, []);

  const regionName = (id: string) => regionNames[id] ?? id;

  useEffect(() => {
    if (!open || !requestId) return;
    setActionError(null);
    adminGetCoopRequest(requestId)
      .then((r) => setRequest(r.data))
      .catch(() => setRequest(null));
  }, [open, requestId]);

  if (!requestId) return null;
  if (!request) return null;

  const handleApprove = async () => {
    setActionError(null);
    setBusy("approve");
    try {
      await adminApproveCoopRequest(requestId);
      onOpenChange(false);
      onReviewed();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Action impossible."
      );
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async () => {
    setActionError(null);
    setBusy("reject");
    try {
      if (!rejectNote.trim()) {
        setActionError("Veuillez saisir un message de refus.");
        return;
      }
      await adminRejectCoopRequest(requestId, rejectNote.trim());
      setShowReject(false);
      setRejectNote("");
      onOpenChange(false);
      onReviewed();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Action impossible."
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="responsive" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-burgundy">
            {request.nomCooperative}
          </SheetTitle>
          <div className="flex items-center gap-2 pt-1">
            <StatusBadge status={request.status} />
            <span className="text-xs text-charcoal/50">
              {new Date(request.createdAt).toLocaleString("fr-FR")}
            </span>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <DashboardSection title="Responsable">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-charcoal/50">Nom</dt>
                <dd>
                  {request.contactPrenom} {request.contactNom}
                </dd>
              </div>
              <div>
                <dt className="text-charcoal/50">Email</dt>
                <dd>{request.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-charcoal/50">Téléphone</dt>
                <dd>{request.contactTelephone}</dd>
              </div>
            </dl>
          </DashboardSection>

          <DashboardSection title="Coopérative">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-charcoal/50">Région</dt>
                <dd>{regionName(request.regionId)}</dd>
              </div>
              <div>
                <dt className="text-charcoal/50">Description</dt>
                <dd className="text-charcoal/80">{request.description}</dd>
              </div>
              <div>
                <dt className="text-charcoal/50">Histoire</dt>
                <dd className="italic text-charcoal/75">{request.histoire}</dd>
              </div>
              <div>
                <dt className="text-charcoal/50">Contacts coop.</dt>
                <dd>
                  Tél. {request.telephone} · WhatsApp {request.whatsapp}
                  {request.siteWeb ? ` · ${request.siteWeb}` : ""}
                </dd>
              </div>
            </dl>
          </DashboardSection>

          <DashboardSection
            title="Pièces justificatives"
            description="Vérifiez l'authenticité avant validation."
          >
            <ProofDocumentsList
              documents={(request.documents ?? []).map((d: any) => ({
                id: String(d.id),
                kind: d.kind,
                label: d.kind,
                fileName: d.fileName,
                mimeType: d.mimeType,
                sizeBytes: d.sizeBytes,
                url: d.url,
              }))}
            />
          </DashboardSection>

          {actionError && (
            <p className="rounded-lg border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-sm text-burgundy">
              {actionError}
            </p>
          )}

          {request.status === "pending" && (
            <div className="space-y-3 border-t border-charcoal/10 pt-4">
              {!showReject ? (
                <div className="flex flex-col gap-2">
                  <Button type="button" onClick={() => void handleApprove()} disabled={busy === "approve" || busy === "reject"}>
                    <Check className="h-4 w-4" />
                    {busy === "approve" ? "Approbation…" : "Approuver"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReject(true)}
                    disabled={busy === "approve" || busy === "reject"}
                  >
                    <X className="h-4 w-4" />
                    Refuser la demande
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 border border-burgundy/20 bg-sand/40 p-4">
                  <p className="text-sm font-medium">Motif du refus (optionnel)</p>
                  <Input
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Ex. documents illisibles ou incomplets"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button type="button" onClick={() => void handleReject()} disabled={busy === "approve" || busy === "reject"}>
                      {busy === "reject" ? "Refus…" : "Confirmer le refus"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowReject(false)}
                      disabled={busy === "approve" || busy === "reject"}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {request.adminNote && (
            <p className="text-sm text-charcoal/65">
              <span className="font-medium">Note admin :</span> {request.adminNote}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
