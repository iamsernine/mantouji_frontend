import { Suspense } from "react";
import { RegionsExplorer } from "@/components/regions/RegionsExplorer";
import { PageHeader } from "@/components/ui/PageHeader";

export default function RegionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terroirs du Maroc"
        title="Explorer par région"
        description="Survolez la carte pour voir le nom de chaque région, puis cliquez pour découvrir les coopératives du terroir."
      />
      <div className="relative -mx-4 mt-6 flex justify-center md:-mx-6">
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
    </>
  );
}
