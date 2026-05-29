import {
  Award,
  BarChart3,
  Bell,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Store,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export type CoopNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  shortLabel?: string;
  badgeKey?: "notifications";
};

export const coopNavItems: CoopNavItem[] = [
  {
    href: "/dashboard/cooperative",
    label: "Vue d'ensemble",
    shortLabel: "Accueil",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/cooperative/produits",
    label: "Mes produits",
    shortLabel: "Produits",
    icon: Package,
  },
  {
    href: "/dashboard/cooperative/profil",
    label: "Ma coopérative",
    shortLabel: "Coop",
    icon: UserCircle,
  },
  {
    href: "/dashboard/cooperative/parametres",
    label: "Compte de connexion",
    shortLabel: "Compte",
    icon: Settings,
  },
  {
    href: "/dashboard/cooperative/onssa",
    label: "ONSSA — Filières",
    shortLabel: "ONSSA",
    icon: Award,
  },
  {
    href: "/dashboard/cooperative/notifications",
    label: "Notifications",
    shortLabel: "Alertes",
    icon: Bell,
    badgeKey: "notifications",
  },
  {
    href: "/dashboard/cooperative/analytique",
    label: "Analytique",
    shortLabel: "Stats",
    icon: BarChart3,
  },
  {
    href: "/dashboard/cooperative/avis",
    label: "Avis clients",
    shortLabel: "Avis",
    icon: MessageSquare,
  },
];

/** Public storefront path for the logged-in cooperative (API profile UUID). */
export function coopStorefrontHref(coopProfileId: string): string | null {
  if (!coopProfileId.trim()) return null;
  return `/cooperatives/${coopProfileId}`;
}

export const coopStorefrontNavItem: Omit<CoopNavItem, "href"> = {
  label: "Voir ma vitrine",
  icon: Store,
};
