"use client";

import dynamic from "next/dynamic";

function MapLoadingSkeleton() {
  return (
    <div
      className="mx-auto aspect-[960/820] w-full max-w-6xl animate-pulse bg-sand/20"
      aria-hidden
    />
  );
}

export const InteractiveMoroccoMapLazy = dynamic(
  () =>
    import("@/components/morocco/InteractiveMoroccoMap").then(
      (m) => m.InteractiveMoroccoMap
    ),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
);
