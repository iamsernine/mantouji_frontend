import { Award, Leaf, Recycle } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import { ZelligePattern } from "@/components/ui/zellige-pattern";
import type { Cooperative } from "@/types/cooperative";

export function CooperativeHero({ cooperative }: { cooperative: Cooperative }) {
  const bannerSrc = cooperative.bannerUrl || cooperative.logoUrl;

  return (
    <>
      <section className="relative -mx-4 overflow-hidden md:mx-0 md:rounded-3xl">
        <div className="relative h-36 sm:h-44 md:h-48">
          {bannerSrc ? (
            <ProductImage
              src={bannerSrc}
              alt={`Bannière ${cooperative.nomCooperative}`}
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-sage/50 via-cream to-burgundy/30" />
          )}
          <ZelligePattern variant="hero" className="mix-blend-soft-light opacity-[0.07]" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/25 to-transparent" />
        </div>

        <div className="absolute bottom-4 left-4 flex items-end gap-4 sm:left-6">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-cream bg-cream shadow-md sm:h-20 sm:w-20">
            <ProductImage
              src={cooperative.logoUrl}
              alt={cooperative.nomCooperative}
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="pb-1 text-white">
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal sm:text-xs">
              <Award className="h-3 w-3" />
              Artisanat marocain
            </span>
            <h1 className="mt-1 font-serif text-xl font-bold sm:text-2xl md:text-3xl">
              {cooperative.nomCooperative}
            </h1>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-4 border-t border-charcoal/10 py-6 sm:gap-6 sm:py-8">
        {[
          { icon: Recycle, label: "Commerce équitable" },
          { icon: Leaf, label: "Bio" },
          { icon: Award, label: "Fait main" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <Icon className="h-5 w-5 text-muted" />
            <span className="text-xs font-medium text-charcoal">{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
