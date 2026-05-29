export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Explorer",
    links: [
      { label: "Produits", href: "/produits" },
      { label: "Coopératives", href: "/cooperatives" },
      { label: "Régions", href: "/regions" },
      { label: "ONSSA — Filières", href: "/certifications" },
    ],
  },
  {
    title: "Mantouji",
    links: [
      { label: "Notre histoire", href: "/a-propos" },
      { label: "Recherche", href: "/recherche" },
      { label: "Favoris", href: "/favoris" },
      { label: "Mon compte", href: "/compte" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Centre d'aide", href: "/a-propos#aide" },
      { label: "Contact", href: "/compte" },
      { label: "WhatsApp", href: "https://wa.me/212612345678", external: true },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/a-propos#mentions" },
      { label: "Confidentialité", href: "/a-propos#confidentialite" },
      { label: "Conditions d'utilisation", href: "/a-propos#conditions" },
      { label: "Cookies", href: "/a-propos#cookies" },
    ],
  },
];
