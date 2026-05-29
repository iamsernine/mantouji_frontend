import { Suspense } from "react";

export default function RechercheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="py-12 text-center">Chargement...</div>}>
      {children}
    </Suspense>
  );
}
