import {
  COOP_PROOF_LABELS,
  type CoopProofDocument,
  type CoopProofDocumentKind,
} from "@/types/coop-registration";
import { buildProofStorageKey, putProofBlob } from "@/lib/idb-coop-proofs";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.readAsDataURL(file);
  });
}

export async function fileToProofDocument(
  file: File,
  kind: CoopProofDocumentKind,
  requestId: string
): Promise<CoopProofDocument> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      `« ${file.name} » dépasse 4 Mo. Compressez le fichier ou choisissez un autre format.`
    );
  }
  const docId = `doc-${kind}-${Date.now()}`;
  const storageKey = buildProofStorageKey(requestId, docId);
  await putProofBlob(storageKey, file);
  return {
    id: docId,
    kind,
    label: COOP_PROOF_LABELS[kind],
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    storageKey,
  };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
