import { Suspense } from "react";

export default function ProduitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="py-12 text-center">Chargement...</div>}>{children}</Suspense>;
}
