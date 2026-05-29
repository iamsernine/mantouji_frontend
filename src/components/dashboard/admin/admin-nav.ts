import {
  BarChart3,
  ClipboardList,
  Database,
  History,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  shortLabel?: string;
  badgeKey?: "inscriptions";
};

export const adminNavItems: AdminNavItem[] = [
  {
    href: "/dashboard/admin",
    label: "Vue d'ensemble",
    shortLabel: "Accueil",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/admin/inscriptions",
    label: "Inscriptions coop.",
    shortLabel: "Inscriptions",
    icon: ClipboardList,
    badgeKey: "inscriptions",
  },
  {
    href: "/dashboard/admin/historique",
    label: "Historique",
    shortLabel: "Historique",
    icon: History,
  },
  {
    href: "/dashboard/admin/onssa",
    label: "Bases ONSSA",
    shortLabel: "ONSSA",
    icon: Database,
  },
  {
    href: "/dashboard/admin/analytique",
    label: "Analytique",
    shortLabel: "Stats",
    icon: BarChart3,
  },
];
