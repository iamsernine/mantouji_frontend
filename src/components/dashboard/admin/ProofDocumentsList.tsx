"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/coop-proof-upload";

export type ProofDocumentPreview = {
  id: string;
  label: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
};

export function ProofDocumentsList({
  documents,
  compact,
}: {
  documents: ProofDocumentPreview[];
  compact?: boolean;
}) {
  if (!documents?.length) {
    return (
      <p className="text-sm text-charcoal/50">
        Aucun document joint (dossier antérieur à la mise à jour).
      </p>
    );
  }

  const isImage = (mime: string) => mime.startsWith("image/");
  const isPdf = (mime: string) => mime === "application/pdf";

  return (
    <ul className={compact ? "space-y-3" : "grid gap-4 lg:grid-cols-2"}>
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="border border-charcoal/10 bg-white p-3"
        >
          <div className="mb-3 flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-charcoal">{doc.label}</p>
              <p className="truncate text-xs text-charcoal/55">
                {doc.fileName} · {formatFileSize(doc.sizeBytes)}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "overflow-hidden rounded-lg border border-charcoal/10 bg-sand/20",
              compact ? "h-40" : "h-72"
            )}
          >
            {doc.url ? (
              isImage(doc.mimeType) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doc.url}
                alt={doc.label}
                className="h-full w-full object-contain bg-white"
              />
              ) : isPdf(doc.mimeType) ? (
              <iframe
                src={doc.url}
                title={doc.label}
                className="h-full w-full bg-white"
              />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-xs text-charcoal/60">
                  Aperçu indisponible pour ce format.
                </div>
              )
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-xs text-charcoal/60">
                Aperçu indisponible.
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
