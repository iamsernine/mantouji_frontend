"use client";

type RegionCursorLabelProps = {
  name: string;
  x: number;
  y: number;
};

/** Minimal label at cursor — not a card */
export function RegionCursorLabel({ name, x, y }: RegionCursorLabelProps) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  return (
    <div
      className="pointer-events-none fixed z-[100] -translate-y-full whitespace-nowrap font-serif text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
      style={{ left: x + 14, top: y - 10 }}
      role="tooltip"
    >
      {name}
    </div>
  );
}
