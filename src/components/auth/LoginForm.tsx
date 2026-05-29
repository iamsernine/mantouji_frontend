"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { ApiRequestError } from "@/lib/api-client";
import { getDashboardPath, resendVerificationEmail } from "@/lib/auth";
import { logos } from "@/lib/brand";
import { useTopNotification } from "@/components/ui/top-notification";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const top = useTopNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const role = await login(email.trim(), password);
      const next = searchParams.get("next");
      if (next) {
        router.push(next);
      } else {
        router.push(getDashboardPath(role));
      }
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "Connexion impossible. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col py-8">
      <Image
        src={logos.fullcolor}
        alt="Mantouji"
        width={180}
        height={64}
        className="mb-10 h-14 w-auto"
      />
      <div className="border-b border-charcoal/10 pb-10">
        <h1 className="font-serif text-3xl text-burgundy">Connexion</h1>
        <p className="mt-2 font-light text-charcoal/60">
          Connectez-vous avec votre compte Mantouji.
        </p>

        {searchParams.get("registered") === "1" ? (
          <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-4">
            <p className="text-sm font-semibold text-charcoal">Confirmez votre email</p>
            <p className="mt-1 text-sm text-charcoal/70">
              Nous avons envoyé un email de vérification. Ouvrez-le pour activer votre compte,
              puis connectez-vous.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="text-sm font-semibold text-burgundy hover:underline"
                onClick={async () => {
                  const targetEmail = searchParams.get("email") ?? email.trim();
                  if (!targetEmail) {
                    top.show({
                      variant: "warning",
                      title: "Email requis",
                      description: "Saisissez votre email pour renvoyer la confirmation.",
                      durationMs: 5500,
                    });
                    return;
                  }
                  try {
                    await resendVerificationEmail(targetEmail);
                    top.show({
                      variant: "success",
                      title: "Email envoyé",
                      description: "Un nouvel email de confirmation vient d’être envoyé.",
                    });
                  } catch {
                    top.show({
                      variant: "error",
                      title: "Échec de l’envoi",
                      description: "Impossible de renvoyer l’email pour le moment.",
                    });
                  }
                }}
              >
                Renvoyer l’email
              </button>
              <span className="text-xs text-charcoal/60">
                Pensez à vérifier vos spams.
              </span>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium uppercase tracking-widest text-charcoal/70">
              Email
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.ma"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium uppercase tracking-widest text-charcoal/70">
              Mot de passe
            </label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
          <p className="text-center text-sm text-charcoal/60">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-medium text-burgundy">
              S&apos;inscrire
            </Link>
          </p>
        </form>
        <div className="mt-8 flex flex-col gap-3 border-t border-charcoal/10 pt-8">
          <Button variant="outline" asChild>
            <Link href="/register/cooperative">Inscrire ma coopérative</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
