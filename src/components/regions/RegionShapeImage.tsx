import type { MoroccoMapCode } from "@/data/morocco-admin-regions";
import { getRegionMapFill } from "@/data/moroccoRegions";
import { getRegionShapeSrc } from "@/data/region-images";

type RegionShapeImageProps = {
  mapCode: MoroccoMapCode;
  alt: string;
  className?: string;
};

export function RegionShapeImage({ mapCode, alt, className }: RegionShapeImageProps) {
  const src = getRegionShapeSrc(mapCode);
  const fill = getRegionMapFill(mapCode);

  return (
    <div
      className={`relative aspect-[320/380] w-full max-w-[280px] lg:max-w-[320px] ${className ?? ""}`}
    >
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0"
        style={{
          backgroundColor: fill,
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  );
}
