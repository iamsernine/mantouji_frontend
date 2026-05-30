import { RegionShapeImage } from "@/components/regions/RegionShapeImage";
import type { RegionProfile } from "@/data/region-profiles";

type RegionDetailHeroProps = {
  title: string;
  profile: RegionProfile;
};

export function RegionDetailHero({ title, profile }: RegionDetailHeroProps) {
  return (
    <section className="grid gap-10 border-b border-charcoal/10 pb-10 lg:grid-cols-[1fr_min(100%,320px)] lg:items-start lg:gap-12">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-sage">Région</p>
          <h1 className="mt-2 font-serif text-4xl text-burgundy text-balance lg:text-5xl">
            {title}
          </h1>
        </div>

        <p className="max-w-xl text-base font-light leading-relaxed text-charcoal/80 lg:text-lg">
          {profile.intro}
        </p>
      </div>

      <div className="flex justify-center lg:justify-end lg:pt-2">
        <RegionShapeImage mapCode={profile.mapCode} alt={`Carte de la région ${title}`} />
      </div>
    </section>
  );
}
