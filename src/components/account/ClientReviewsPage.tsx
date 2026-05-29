"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { deleteMyReview, getMyReviews, updateMyReview, type MyReview } from "@/lib/api";
import { ApiRequestError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { useTopNotification } from "@/components/ui/top-notification";
import { cn } from "@/lib/utils";

export function ClientReviewsPage() {
  const top = useTopNotification();
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<MyReview | null>(null);
  const [editNote, setEditNote] = useState(5);
  const [editComment, setEditComment] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyReviews();
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cet avis ?")) return;
    setBusy(true);
    try {
      await deleteMyReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      if (editing?.id === id) setEditing(null);
      top.show({ variant: "success", title: "Avis supprimé" });
    } catch (err) {
      top.show({
        variant: "error",
        title: "Erreur",
        description: err instanceof ApiRequestError ? err.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await updateMyReview(editing.id, {
        note: editNote,
        commentaire: editComment.trim() || null,
      });
      await load();
      setEditing(null);
      top.show({ variant: "success", title: "Avis modifié" });
    } catch (err) {
      top.show({
        variant: "error",
        title: "Erreur",
        description: err instanceof ApiRequestError ? err.message : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/compte"
        className="inline-flex items-center gap-2 text-sm font-medium text-burgundy"
      >
        <ArrowLeft className="h-4 w-4" />
        Mon compte
      </Link>

      <DashboardSection
        title="Mes avis"
        description="Modifiez ou supprimez vos notes et commentaires sur les produits."
      >
        {loading ? (
          <p className="text-sm text-charcoal/55">Chargement…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-charcoal/55">
            Vous n’avez pas encore publié d’avis.{" "}
            <Link href="/produits" className="text-burgundy hover:underline">
              Parcourir le catalogue
            </Link>
          </p>
        ) : editing ? (
          <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
            <p className="font-medium text-charcoal">{editing.produitNom}</p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEditNote(n)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm",
                    editNote === n
                      ? "border-burgundy bg-burgundy/10 text-burgundy"
                      : "border-charcoal/15"
                  )}
                >
                  {n} ★
                </button>
              ))}
            </div>
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-charcoal/15 px-4 py-3 text-sm"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={busy}>
                Enregistrer
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-charcoal/10 bg-cream/30 p-4">
                <Link href={`/produits/${r.produitId}`} className="text-sm font-medium text-burgundy">
                  {r.produitNom}
                </Link>
                <p className="mt-1 text-xs text-charcoal/55">
                  {"★".repeat(r.note)}
                  {!r.isApproved ? " · En attente" : ""}
                </p>
                {r.commentaire ? (
                  <p className="mt-2 text-sm text-charcoal/75">{r.commentaire}</p>
                ) : null}
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => {
                      setEditing(r);
                      setEditNote(r.note);
                      setEditComment(r.commentaire ?? "");
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-burgundy"
                    disabled={busy}
                    onClick={() => void handleDelete(r.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}
