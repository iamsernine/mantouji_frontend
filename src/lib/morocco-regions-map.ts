/** Simplified Morocco map paths for legacy SVG fallback views. */
export const MOROCCO_MAP_VIEWBOX = "0 0 220 380";

export type MoroccoRegionPath = {
  id: string;
  d: string;
  labelX: number;
  labelY: number;
  shortLabel: string;
};

export const moroccoRegionPaths: MoroccoRegionPath[] = [
  {
    id: "r1",
    d: "M 132 38 L 198 44 C 210 52 214 78 208 108 L 198 148 C 188 168 168 172 152 158 L 138 118 C 128 88 126 58 132 38 Z",
    labelX: 172,
    labelY: 98,
    shortLabel: "Oriental",
  },
  {
    id: "r4",
    d: "M 72 42 L 132 38 L 138 118 L 152 158 L 118 168 L 88 148 L 68 108 L 62 72 72 42 Z",
    labelX: 108,
    labelY: 108,
    shortLabel: "Fès",
  },
  {
    id: "r5",
    d: "M 28 78 L 62 72 L 68 108 L 88 148 L 72 198 L 48 208 L 32 178 L 24 138 L 22 108 28 78 Z",
    labelX: 52,
    labelY: 148,
    shortLabel: "Marrakech",
  },
  {
    id: "r3",
    d: "M 118 168 L 152 158 L 198 148 L 188 218 L 158 258 L 118 248 L 88 198 L 118 168 Z",
    labelX: 148,
    labelY: 208,
    shortLabel: "Drâa",
  },
  {
    id: "r2",
    d: "M 48 208 L 72 198 L 88 198 L 118 248 L 158 258 L 142 308 L 98 322 L 58 312 L 38 268 L 48 208 Z",
    labelX: 98,
    labelY: 278,
    shortLabel: "Souss",
  },
];

/** Country silhouette (decorative outline). */
export const moroccoOutlinePath =
  "M 28 78 L 72 42 L 132 38 L 198 44 C 214 58 216 100 208 148 L 198 218 L 188 268 L 158 308 L 142 328 L 98 338 L 52 322 L 32 268 L 22 208 L 18 148 L 22 108 28 78 Z";
