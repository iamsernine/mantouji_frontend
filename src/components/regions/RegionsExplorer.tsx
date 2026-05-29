"use client";

import { useRouter } from "next/navigation";
import { InteractiveMoroccoMapLazy } from "@/components/morocco/InteractiveMoroccoMapLazy";

export function RegionsExplorer() {
  const router = useRouter();

  return (
    <InteractiveMoroccoMapLazy
      onRegionSelect={(slug) => router.push(`/regions/${slug}`)}
    />
  );
}
