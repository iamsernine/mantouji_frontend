export type CoopRegistrationStatus = "pending" | "approved" | "rejected";

export type CoopProofDocumentKind =
  | "statuts"
  | "registre_commerce"
  | "identite_responsable"
  | "attestation_fiscale"
  | "autre";

export const COOP_PROOF_LABELS: Record<CoopProofDocumentKind, string> = {
  statuts: "Statuts de la coopérative",
  registre_commerce: "Registre de commerce / ICE",
  identite_responsable: "Pièce d'identité du responsable",
  attestation_fiscale: "Attestation fiscale (optionnel)",
  autre: "Autre justificatif (optionnel)",
};

export const REQUIRED_PROOF_KINDS: CoopProofDocumentKind[] = [
  "statuts",
  "registre_commerce",
  "identite_responsable",
];

export type CoopProofDocument = {
  id: string;
  kind: CoopProofDocumentKind;
  label: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  /**
   * Where the file is stored for preview.
   * We use IndexedDB to avoid localStorage quota issues.
   */
  storageKey: string;
};

export type CoopRegistrationInput = {
  contactPrenom: string;
  contactNom: string;
  contactEmail: string;
  contactTelephone: string;
  nomCooperative: string;
  description: string;
  histoire: string;
  regionId: string;
  telephone: string;
  whatsapp: string;
  siteWeb?: string;
  /** Stored only for local demo workflow (admin approves later). */
  motDePasse: string;
  proofDocuments: CoopProofDocument[];
};

export type CoopRegistrationRequest = CoopRegistrationInput & {
  id: string;
  status: CoopRegistrationStatus;
  createdAt: string;
  reviewedAt?: string;
  adminNote?: string;
};

export type SentEmailRecord = {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  relatedRequestId?: string;
};
