"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiRequestError } from "@/lib/api-client";
import { getRegions, submitCoopRegistrationRequest, uploadCoopRegistrationDocument } from "@/lib/api";
import { formatFileSize } from "@/lib/coop-proof-upload";
import type { Region } from "@/types/product";
import {
  COOP_PROOF_LABELS,
  REQUIRED_PROOF_KINDS,
  type CoopProofDocumentKind,
  type CoopRegistrationInput,
} from "@/types/coop-registration";

const selectClass =
  "flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-base text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30";

const textareaClass =
  "min-h-[96px] w-full resize-y rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-base text-charcoal placeholder:text-charcoal/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30";

const OPTIONAL_PROOF_KINDS: CoopProofDocumentKind[] = [
  "attestation_fiscale",
  "autre",
];

function emptyForm(): Omit<CoopRegistrationInput, "proofDocuments"> {
  return {
    contactPrenom: "",
    contactNom: "",
    contactEmail: "",
    contactTelephone: "",
    nomCooperative: "",
    description: "",
    histoire: "",
    regionId: "",
    telephone: "",
    whatsapp: "",
    siteWeb: "",
    motDePasse: "",
  };
}

export function CoopRegistrationForm() {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [proofFiles, setProofFiles] = useState<
    Partial<Record<CoopProofDocumentKind, File>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getRegions()
      .then(({ data }) => {
        setRegions(data);
        if (data[0]) {
          setForm((f) => (f.regionId ? f : { ...f, regionId: data[0].id }));
        }
      })
      .catch(() => setRegions([]));
  }, []);

  const setProofFile = (kind: CoopProofDocumentKind, file: File | undefined) => {
    setProofFiles((prev) => {
      const next = { ...prev };
      if (file) next[kind] = file;
      else delete next[kind];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.contactPrenom.trim() ||
      !form.contactNom.trim() ||
      !form.contactEmail.trim() ||
      !form.nomCooperative.trim() ||
      !form.description.trim()
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!form.contactEmail.includes("@")) {
      setError("Adresse email invalide.");
      return;
    }

    if (form.motDePasse.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const missing = REQUIRED_PROOF_KINDS.filter((k) => !proofFiles[k]);
      if (missing.length) {
        setError("Ajoutez les pièces justificatives obligatoires.");
        setSubmitting(false);
        return;
      }

      const create = await submitCoopRegistrationRequest({
        contactPrenom: form.contactPrenom.trim(),
        contactNom: form.contactNom.trim(),
        contactEmail: form.contactEmail.trim(),
        contactTelephone: form.contactTelephone.trim(),
        motDePasse: form.motDePasse,
        nomCooperative: form.nomCooperative.trim(),
        regionId: form.regionId,
        description: form.description,
        histoire: form.histoire,
        telephone: form.telephone || form.contactTelephone,
        whatsapp: form.whatsapp || form.contactTelephone,
        siteWeb: form.siteWeb,
      });

      const requestId = create.data.id;

      // Upload proofs (server-stored, previewable by admin)
      for (const kind of REQUIRED_PROOF_KINDS) {
        const f = proofFiles[kind]!;
        await uploadCoopRegistrationDocument({ requestId, kind, file: f });
      }
      for (const kind of OPTIONAL_PROOF_KINDS) {
        const f = proofFiles[kind];
        if (f) await uploadCoopRegistrationDocument({ requestId, kind, file: f });
      }

      router.push(`/register/cooperative/merci?id=${encodeURIComponent(requestId)}`);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Une erreur est survenue. Réessayez."
      );
      setSubmitting(false);
    }
  };

  const renderFileField = (
    kind: CoopProofDocumentKind,
    required?: boolean
  ) => {
    const file = proofFiles[kind];
    const inputId = `proof-${kind}`;

    return (
      <div key={kind}>
        <label className="mb-2 block text-sm font-medium" htmlFor={inputId}>
          {COOP_PROOF_LABELS[kind]}
          {required ? " *" : ""}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor={inputId}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-dashed border-charcoal/25 bg-white px-4 text-sm text-charcoal/80 hover:border-burgundy/40 hover:bg-sand/30"
          >
            <FileUp className="h-4 w-4 text-sage" />
            {file ? "Remplacer le fichier" : "Choisir un fichier"}
          </label>
          <input
            id={inputId}
            type="file"
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setProofFile(kind, f);
              e.target.value = "";
            }}
          />
          {file && (
            <div className="flex flex-1 items-center justify-between gap-2 border border-charcoal/10 bg-sand/20 px-3 py-2 text-sm">
              <span className="truncate">
                {file.name} · {formatFileSize(file.size)}
              </span>
              <button
                type="button"
                className="shrink-0 text-charcoal/50 hover:text-burgundy"
                onClick={() => setProofFile(kind, undefined)}
                aria-label="Retirer le fichier"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-charcoal/45">PDF ou image, max. 4 Mo</p>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-serif text-xl text-burgundy">Responsable de la coopérative</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          Personne référente pour l&apos;échange avec Mantouji.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="prenom">
            Prénom *
          </label>
          <Input
            id="prenom"
            value={form.contactPrenom}
            onChange={(e) => setForm((f) => ({ ...f, contactPrenom: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="nom">
            Nom *
          </label>
          <Input
            id="nom"
            value={form.contactNom}
            onChange={(e) => setForm((f) => ({ ...f, contactNom: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="email">
          Email *
        </label>
        <Input
          id="email"
          type="email"
          value={form.contactEmail}
          onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
          placeholder="contact@macoop.ma"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="motDePasse">
          Mot de passe *
        </label>
        <Input
          id="motDePasse"
          type="password"
          minLength={8}
          value={form.motDePasse}
          onChange={(e) => setForm((f) => ({ ...f, motDePasse: e.target.value }))}
          placeholder="8 caractères minimum"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="contactTel">
          Téléphone du responsable *
        </label>
        <Input
          id="contactTel"
          type="tel"
          value={form.contactTelephone}
          onChange={(e) => setForm((f) => ({ ...f, contactTelephone: e.target.value }))}
          placeholder="+212 6 XX XX XX XX"
          required
        />
      </div>

      <div className="border-t border-charcoal/10 pt-6">
        <h2 className="font-serif text-xl text-burgundy">Votre coopérative</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          Ces informations seront vérifiées par notre équipe avant publication.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="nomCoop">
          Nom de la coopérative *
        </label>
        <Input
          id="nomCoop"
          value={form.nomCooperative}
          onChange={(e) => setForm((f) => ({ ...f, nomCooperative: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="region">
          Région *
        </label>
        <select
          id="region"
          className={selectClass}
          value={form.regionId}
          onChange={(e) => setForm((f) => ({ ...f, regionId: e.target.value }))}
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="description">
          Description *
        </label>
        <textarea
          id="description"
          className={textareaClass}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Activité, produits phares…"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="histoire">
          Histoire & savoir-faire *
        </label>
        <textarea
          id="histoire"
          className={textareaClass}
          value={form.histoire}
          onChange={(e) => setForm((f) => ({ ...f, histoire: e.target.value }))}
          placeholder="Parcours, valeurs, ancrage territorial…"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="telCoop">
            Téléphone coopérative *
          </label>
          <Input
            id="telCoop"
            type="tel"
            value={form.telephone}
            onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="whatsapp">
            WhatsApp *
          </label>
          <Input
            id="whatsapp"
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            placeholder="2126XXXXXXXX"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="site">
          Site web (optionnel)
        </label>
        <Input
          id="site"
          type="url"
          value={form.siteWeb ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, siteWeb: e.target.value }))}
          placeholder="https://"
        />
      </div>

      <div className="border-t border-charcoal/10 pt-6">
        <h2 className="font-serif text-xl text-burgundy">Pièces justificatives</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          Optionnel pour l&apos;instant — l&apos;équipe Mantouji pourra vous les demander
          lors de la validation.
        </p>
      </div>

      <div className="space-y-4">
        {REQUIRED_PROOF_KINDS.map((kind) => renderFileField(kind, true))}
        {OPTIONAL_PROOF_KINDS.map((kind) => renderFileField(kind))}
      </div>

      {error && <p className="text-sm text-burgundy">{error}</p>}

      <p className="text-xs text-charcoal/50">
        En envoyant cette demande, vous acceptez que Mantouji vérifie les informations
        et documents fournis. Un email vous confirmera la réception, puis l&apos;approbation
        ou le refus de votre inscription.
      </p>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Envoi en cours…" : "Envoyer ma demande d'inscription"}
      </Button>
    </form>
  );
}
