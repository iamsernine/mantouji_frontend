"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, ImagePlus } from "lucide-react";
import { CooperativeHero } from "@/components/cooperatives/CooperativeHero";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { coopStorefrontHref } from "@/components/dashboard/cooperative/coop-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductImage } from "@/components/ui/product-image";
import { useTopNotification } from "@/components/ui/top-notification";
import { useCoopDashboard } from "@/contexts/coop-dashboard-context";
import { getRegions, updateMyCooperative, uploadCooperativeBanner, uploadCooperativeLogo } from "@/lib/api";
import { ApiRequestError } from "@/lib/api-client";
import type { Cooperative } from "@/types/cooperative";
import type { Region } from "@/types/product";

const ACCEPT = "image/jpeg,image/png,image/webp";

const textareaClass =
  "flex w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-base text-charcoal placeholder:text-charcoal/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30";

type Draft = {
  nomCooperative: string;
  description: string;
  histoire: string;
  telephone: string;
  whatsapp: string;
  siteWeb: string;
  regionId: string;
};

export function CoopVitrineEditor() {
  const { cooperative, coopId, ready, refreshCooperative } = useCoopDashboard();
  const top = useTopNotification();
  const [regions, setRegions] = useState<Region[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "banner" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storefrontHref = coopStorefrontHref(cooperative?.id ?? coopId);

  useEffect(() => {
    getRegions().then((res) => setRegions(res.data));
  }, []);

  useEffect(() => {
    if (!cooperative) return;
    setDraft({
      nomCooperative: cooperative.nomCooperative,
      description: cooperative.description,
      histoire: cooperative.histoire,
      telephone: cooperative.telephone,
      whatsapp: cooperative.whatsapp,
      siteWeb: cooperative.siteWeb ?? "",
      regionId: cooperative.region.id,
    });
  }, [cooperative]);

  const previewCoop: Cooperative | undefined = useMemo(() => {
    if (!cooperative || !draft) return cooperative;
    const region =
      regions.find((r) => r.id === draft.regionId) ?? cooperative.region;
    return {
      ...cooperative,
      nomCooperative: draft.nomCooperative,
      description: draft.description,
      histoire: draft.histoire,
      telephone: draft.telephone,
      whatsapp: draft.whatsapp,
      siteWeb: draft.siteWeb || undefined,
      region,
    };
  }, [cooperative, draft, regions]);

  const patchDraft = (patch: Partial<Draft>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  };

  const handleUpload = async (kind: "logo" | "banner", file: File | undefined) => {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Format accepté : JPEG, PNG ou WebP.");
      return;
    }
    setError(null);
    setUploading(kind);
    try {
      if (kind === "logo") await uploadCooperativeLogo(file);
      else await uploadCooperativeBanner(file);
      await refreshCooperative();
      top.show({ variant: "success", title: kind === "logo" ? "Logo mis à jour" : "Bannière mise à jour" });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Téléversement impossible.");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      await updateMyCooperative({
        nomCooperative: draft.nomCooperative.trim(),
        description: draft.description.trim() || undefined,
        histoire: draft.histoire.trim() || undefined,
        telephone: draft.telephone.trim() || undefined,
        whatsapp: draft.whatsapp.trim() || undefined,
        siteWeb: draft.siteWeb.trim() || undefined,
        regionId: draft.regionId || undefined,
      });
      await refreshCooperative();
      top.show({ variant: "success", title: "Page coopérative enregistrée" });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return <p className="text-sm text-charcoal/60">Chargement de la coopérative…</p>;
  }

  if (!cooperative || !draft) {
    return (
      <p className="text-sm text-charcoal/60">
        Profil coopérative introuvable. Contactez le support si le problème persiste.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal md:text-3xl">
            Ma coopérative
          </h1>
          <p className="mt-1 max-w-xl text-charcoal/60">
            Contenu affiché sur votre vitrine publique — nom, présentation, logo et contacts de la
            coopérative (pas votre compte personnel).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {storefrontHref ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={storefrontHref} target="_blank" rel="noopener noreferrer">
                Voir la vitrine
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/cooperative/parametres">Compte de connexion</Link>
          </Button>
        </div>
      </div>

      {previewCoop ? (
        <DashboardSection
          title="Aperçu"
          description="Tel que les visiteurs le voient sur le site."
        >
          <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
            <CooperativeHero cooperative={previewCoop} />
            {(previewCoop.description || previewCoop.histoire) && (
              <div className="border-t border-charcoal/10 p-5">
                <h3 className="font-serif text-lg text-burgundy">À propos</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                  {previewCoop.histoire || previewCoop.description}
                </p>
              </div>
            )}
          </div>
        </DashboardSection>
      ) : null}

      <DashboardSection
        title="Identité visuelle"
        description="Logo et bannière de la coopérative (visibles sur la vitrine)."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-charcoal">Logo de la coopérative</p>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-charcoal/15 bg-sand">
                <ProductImage
                  src={cooperative.logoUrl}
                  alt={draft.nomCooperative}
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <label className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" disabled={uploading === "logo"} asChild>
                  <span>
                    <ImagePlus className="mr-2 inline h-4 w-4" />
                    {uploading === "logo" ? "Envoi…" : "Modifier"}
                  </span>
                </Button>
                <input
                  type="file"
                  accept={ACCEPT}
                  className="sr-only"
                  onChange={(e) => {
                    void handleUpload("logo", e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <p className="mt-1 text-xs text-charcoal/50">Carré, 192×192 px max.</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-charcoal">Bannière</p>
            <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl border border-charcoal/15 bg-sand sm:h-32">
              {cooperative.bannerUrl ? (
                <ProductImage
                  src={cooperative.bannerUrl}
                  alt="Bannière"
                  className="object-cover"
                  sizes="400px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-charcoal/45">
                  Aucune bannière
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" disabled={uploading === "banner"} asChild>
                <span>
                  <ImagePlus className="mr-2 inline h-4 w-4" />
                  {uploading === "banner" ? "Envoi…" : "Modifier"}
                </span>
              </Button>
              <input
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => {
                  void handleUpload("banner", e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <p className="mt-1 text-xs text-charcoal/50">Paysage, 1200×320 px max.</p>
          </div>
        </div>
      </DashboardSection>

      <form onSubmit={(e) => void handleSave(e)} className="space-y-8">
        <DashboardSection
          title="Présentation"
          description="Textes publiés sur la page de votre coopérative."
        >
          <div className="max-w-xl space-y-4">
            <div>
              <label htmlFor="nom-coop" className="mb-1 block text-sm font-medium text-charcoal">
                Nom de la coopérative
              </label>
              <Input
                id="nom-coop"
                value={draft.nomCooperative}
                onChange={(e) => patchDraft({ nomCooperative: e.target.value })}
                required
                maxLength={200}
              />
            </div>
            <div>
              <label htmlFor="region-coop" className="mb-1 block text-sm font-medium text-charcoal">
                Région
              </label>
              <select
                id="region-coop"
                value={draft.regionId}
                onChange={(e) => patchDraft({ regionId: e.target.value })}
                className="flex h-11 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-base text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
                required
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="desc-coop" className="mb-1 block text-sm font-medium text-charcoal">
                À propos (résumé)
              </label>
              <textarea
                id="desc-coop"
                value={draft.description}
                onChange={(e) => patchDraft({ description: e.target.value })}
                rows={4}
                placeholder="Qui vous êtes, ce que vous produisez, votre territoire…"
                className={textareaClass}
              />
            </div>
            <div>
              <label htmlFor="hist-coop" className="mb-1 block text-sm font-medium text-charcoal">
                Notre histoire
              </label>
              <textarea
                id="hist-coop"
                value={draft.histoire}
                onChange={(e) => patchDraft({ histoire: e.target.value })}
                rows={6}
                placeholder="Parcours de la coopérative, savoir-faire, valeurs…"
                className={textareaClass}
              />
              <p className="mt-1 text-xs text-charcoal/50">
                Affiché en priorité sur la vitrine si renseigné.
              </p>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection
          title="Contact coopérative"
          description="Coordonnées affichées aux clients sur la vitrine et les fiches produit."
        >
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tel-coop" className="mb-1 block text-sm font-medium text-charcoal">
                Téléphone
              </label>
              <Input
                id="tel-coop"
                value={draft.telephone}
                onChange={(e) => patchDraft({ telephone: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="wa-coop" className="mb-1 block text-sm font-medium text-charcoal">
                WhatsApp
              </label>
              <Input
                id="wa-coop"
                value={draft.whatsapp}
                onChange={(e) => patchDraft({ whatsapp: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="web-coop" className="mb-1 block text-sm font-medium text-charcoal">
                Site web
              </label>
              <Input
                id="web-coop"
                type="url"
                value={draft.siteWeb}
                onChange={(e) => patchDraft({ siteWeb: e.target.value })}
                placeholder="https://"
              />
            </div>
          </div>
        </DashboardSection>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer la page coopérative"}
          </Button>
          {error ? <p className="text-sm text-burgundy">{error}</p> : null}
        </div>
      </form>
    </div>
  );
}
