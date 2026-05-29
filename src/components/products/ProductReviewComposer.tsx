"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { createProductReview } from "@/lib/api";
import { resendVerificationEmail } from "@/lib/auth";
import { ApiRequestError } from "@/lib/api-client";
import { useAuth } from "@/contexts/auth-context";
import { useTopNotification } from "@/components/ui/top-notification";
import { cn } from "@/lib/utils";

export function ProductReviewComposer({ produitId }: { produitId: string }) {
  const router = useRouter();
  const { user, role, ready } = useAuth();
  const top = useTopNotification();

  const [note, setNote] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [busy, setBusy] = useState(false);

  const displayed = hover ?? note;

  const nextUrl = useMemo(() => `/produits/${produitId}#avis-composer`, [produitId]);

  const canReview = !!user && user.isVerified && role === "CLIENT";
  const gateMessage = useMemo(() => {
    if (!ready) return "Chargement…";
    if (!user) return "Connectez-vous pour laisser un avis.";
    if (role !== "CLIENT") return "Seuls les clients peuvent laisser un avis.";
    if (!user.isVerified) return "Vérifiez votre email pour laisser un avis.";
    return "";
  }, [ready, user, role]);

  async function handleSubmit() {
    if (busy) return;

    if (!user) {
      top.show({
        variant: "warning",
        title: "Connexion requise",
        description: "Connectez-vous pour noter et commenter ce produit.",
        actionLabel: "Se connecter",
        onAction: () => router.push(`/login?next=${encodeURIComponent(nextUrl)}`),
      });
      return;
    }

    if (role !== "CLIENT") {
      top.show({
        variant: "warning",
        title: "Accès réservé aux clients",
        description: "Seuls les comptes client peuvent commenter ou noter un produit.",
        durationMs: 6500,
      });
      return;
    }

    if (!user.isVerified) {
      top.show({
        variant: "warning",
        title: "Email non vérifié",
        description:
          "Veuillez vérifier votre email pour pouvoir commenter ou noter un produit.",
        actionLabel: "Renvoyer l’email",
        onAction: async () => {
          await resendVerificationEmail(user.email);
          top.show({
            variant: "success",
            title: "Email envoyé",
            description:
              "Nous venons de vous renvoyer l’email de confirmation. Après vérification, reconnectez-vous.",
          });
        },
      });
      return;
    }

    if (note < 1 || note > 5) {
      top.show({
        variant: "warning",
        title: "Note manquante",
        description: "Choisissez une note entre 1 et 5 étoiles.",
        durationMs: 4500,
      });
      return;
    }

    try {
      setBusy(true);
      await createProductReview({
        produitId,
        note,
        commentaire: commentaire.trim() ? commentaire.trim() : undefined,
      });
      setNote(0);
      setHover(null);
      setCommentaire("");
      top.show({
        variant: "success",
        title: "Merci pour votre avis",
        description: "Votre note et votre commentaire ont été publiés.",
        durationMs: 5000,
      });
      router.refresh();
    } catch (e) {
      if (e instanceof ApiRequestError) {
        if (e.status === 401) {
          top.show({
            variant: "warning",
            title: "Session expirée",
            description: "Veuillez vous reconnecter pour laisser un avis.",
            actionLabel: "Se connecter",
            onAction: () => router.push(`/login?next=${encodeURIComponent(nextUrl)}`),
          });
          return;
        }
        if (e.status === 403) {
          top.show({
            variant: "warning",
            title: "Action non autorisée",
            description:
              "Votre compte doit être vérifié pour commenter ou noter un produit.",
            actionLabel: "Renvoyer l’email",
            onAction: async () => {
              await resendVerificationEmail(user.email);
              top.show({
                variant: "success",
                title: "Email envoyé",
                description:
                  "Nous venons de vous renvoyer l’email de confirmation. Après vérification, reconnectez-vous.",
              });
            },
          });
          return;
        }
        top.show({
          variant: "error",
          title: "Impossible d’envoyer l’avis",
          description: e.message,
        });
        return;
      }

      top.show({
        variant: "error",
        title: "Erreur inattendue",
        description: "Veuillez réessayer dans quelques instants.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-charcoal/10 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-semibold text-charcoal">Laisser un avis</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Votre note aide d’autres clients à choisir.
          </p>
        </div>
        {!canReview ? (
          <div className="rounded-full border border-charcoal/15 bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal/70">
            {gateMessage}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const active = value <= displayed;
            return (
              <button
                key={value}
                type="button"
                disabled={busy || !canReview}
                className="rounded-md p-1 disabled:opacity-40"
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setNote(value)}
                aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    active ? "fill-gold text-gold" : "text-charcoal/20"
                  )}
                />
              </button>
            );
          })}
        </div>
        <span className="text-sm font-semibold text-charcoal/70">
          {note ? `${note}/5` : "—"}
        </span>
      </div>

      <div className="mt-4">
        <label className="text-sm font-semibold text-charcoal" htmlFor="avis-commentaire">
          Commentaire (optionnel)
        </label>
        <textarea
          id="avis-commentaire"
          className="mt-2 w-full resize-none rounded-xl border border-charcoal/15 bg-white px-3 py-2 text-sm text-charcoal outline-none ring-0 placeholder:text-charcoal/40 focus:border-charcoal/30"
          rows={4}
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Partagez votre expérience…"
          disabled={busy || !canReview}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-charcoal/55">
          {user && !user.isVerified ? (
            <button
              type="button"
              className="font-semibold text-burgundy hover:underline disabled:opacity-60"
              disabled={busy}
              onClick={async () => {
                try {
                  setBusy(true);
                  await resendVerificationEmail(user.email);
                  top.show({
                    variant: "success",
                    title: "Email envoyé",
                    description:
                      "Nous venons de vous renvoyer l’email de confirmation. Après vérification, reconnectez-vous.",
                  });
                } catch {
                  top.show({
                    variant: "error",
                    title: "Échec de l’envoi",
                    description: "Impossible de renvoyer l’email pour le moment.",
                  });
                } finally {
                  setBusy(false);
                }
              }}
            >
              Renvoyer l’email de confirmation
            </button>
          ) : (
            <span>Vous devez être connecté et avoir vérifié votre email.</span>
          )}
        </div>
        <button
          type="button"
          disabled={busy || !ready}
          onClick={handleSubmit}
          className="rounded-xl bg-burgundy px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy/90 disabled:opacity-60"
        >
          {busy ? "Envoi…" : "Publier"}
        </button>
      </div>
    </section>
  );
}

