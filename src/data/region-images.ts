import type { MoroccoMapCode } from "@/data/morocco-admin-regions";

/** Pre-cut region shapes — files in public/images/regions/{MA01..MA12}.svg */
export function getRegionShapeSrc(mapCode: MoroccoMapCode): string {
  return `/images/regions/${mapCode}.svg`;
}
