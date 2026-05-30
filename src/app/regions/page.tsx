import { Suspense } from "react";
import { RegionsExplorer } from "@/components/regions/RegionsExplorer";

export default function RegionsPage() {
  return (
    <div className="relative -mx-4 flex justify-center md:-mx-6">
      <Suspense
        fallback={
          <div
            className="mx-auto aspect-[960/820] w-full max-w-6xl animate-pulse bg-sand/20"
            aria-hidden
          />
        }
      >
        <RegionsExplorer />
      </Suspense>
    </div>
  );
}
