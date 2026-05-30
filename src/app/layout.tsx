import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mantouji — Terroirs du Maroc",
  description:
    "Vitrine premium des produits du terroir marocain et des coopératives qui les portent.",
  icons: {
    icon: "/images/icon.svg",
    shortcut: "/images/icon.svg",
    apple: "/images/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${notoSerif.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream font-sans antialiased">
        <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip">
          <AppProviders>
            <ConditionalChrome>{children}</ConditionalChrome>
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
