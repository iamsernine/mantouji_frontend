"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Settings, Star } from "lucide-react";
import { AccountMenuGroup, AccountMenuRow } from "@/components/account/AccountMenuRow";
import { UserAvatarDisplay } from "@/components/account/UserAvatarDisplay";
import { Button } from "@/components/ui/button";
import { useTopNotification } from "@/components/ui/top-notification";
import { useAuth } from "@/contexts/auth-context";
import { resendVerificationEmail } from "@/lib/auth";
import { getFavoriteIds } from "@/lib/favorites";
export function ClientAccountHome() {
  const router = useRouter();
  const top = useTopNotification();
  const { user, logout } = useAuth();

  if (!user) return null;

  const favoriteCount = getFavoriteIds().length;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-serif text-2xl text-burgundy md:text-3xl">Mon compte</h1>

      <div className="flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-5">
        <UserAvatarDisplay nom={user.nom} avatarUrl={user.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg text-charcoal">{user.nom}</p>
          <p className="truncate text-sm text-charcoal/55">{user.email}</p>
        </div>
        <Link
          href="/compte/parametres"
          className="shrink-0 text-sm font-medium text-burgundy hover:underline"
        >
          Modifier
        </Link>
      </div>

      {!user.isVerified ? (
        <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5">
          <p className="text-sm font-semibold text-charcoal">Email non vérifié</p>
          <p className="mt-1 text-sm text-charcoal/70">
            Confirmez votre adresse pour noter et commenter les produits.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={async () => {
              try {
                await resendVerificationEmail(user.email);
                top.show({
                  variant: "success",
                  title: "Email envoyé",
                  description: "Vérifiez votre boîte de réception.",
                });
              } catch {
                top.show({ variant: "error", title: "Échec de l’envoi" });
              }
            }}
          >
            Renvoyer l’email
          </Button>
        </div>
      ) : null}

      <AccountMenuGroup title="Activité">
        <AccountMenuRow
          href="/favoris"
          icon={Heart}
          label="Mes favoris"
          description={
            favoriteCount > 0
              ? `${favoriteCount} produit${favoriteCount > 1 ? "s" : ""}`
              : "Vos coups de cœur"
          }
        />
        <AccountMenuRow
          href="/compte/avis"
          icon={Star}
          label="Mes avis"
          description="Notes et commentaires publiés"
        />
      </AccountMenuGroup>

      <AccountMenuGroup title="Compte">
        <AccountMenuRow
          href="/compte/parametres"
          icon={Settings}
          label="Paramètres"
          description="Photo, mot de passe, sécurité"
        />
        <AccountMenuRow
          icon={LogOut}
          label="Déconnexion"
          danger
          onClick={() => {
            logout();
            router.push("/login");
          }}
        />
      </AccountMenuGroup>
    </div>
  );
}
