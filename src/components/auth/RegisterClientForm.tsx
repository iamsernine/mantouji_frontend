"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiRequestError } from "@/lib/api-client";
import { registerClient } from "@/lib/auth";
import { logos } from "@/lib/brand";

export function RegisterClientForm() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerClient(nom.trim(), email.trim(), password);
      router.push(`/login?registered=1&email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Inscription impossible."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-8 pb-24">
      <Image
        src={logos.fullcolor}
        alt="Mantouji"
        width={180}
        height={64}
        className="mb-10 h-14 w-auto"
      />
      <div className="border-b border-charcoal/10 pb-10">
        <h1 className="font-serif text-3xl text-burgundy">Inscription</h1>
        <p className="mt-2 font-light text-charcoal/60">
          Créez un compte client pour sauvegarder vos favoris et laisser des avis.
        </p>

        <div className="mt-8 rounded-xl border border-sage/30 bg-sage-light/40 p-5">
          <h2 className="font-serif text-lg text-burgundy">Vous êtes une coopérative ?</h2>
          <p className="mt-2 text-sm text-charcoal/70">
            Demandez l&apos;accès coopérative — l&apos;équipe Mantouji valide votre dossier.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/register/cooperative">Demande d&apos;inscription coopérative</Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-charcoal/70">
            Compte client
          </h2>
          <div>
            <label className="mb-2 block text-sm font-medium">Nom complet</label>
            <Input required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.ma"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Mot de passe</label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Création…" : "Créer mon compte client"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal/60">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-medium text-burgundy">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
