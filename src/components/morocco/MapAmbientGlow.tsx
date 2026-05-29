/** Static glow — opacity only (no scale/position animation) */
export function MapAmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="map-glow-pulse absolute left-1/2 top-1/2 h-[72%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage/12 blur-3xl" />
      <div className="map-glow-pulse-slow absolute bottom-[8%] right-[6%] h-44 w-44 rounded-full bg-burgundy/8 blur-3xl" />
      <div className="map-glow-pulse-slow absolute left-[4%] top-[18%] h-36 w-36 rounded-full bg-gold/10 blur-3xl" />
    </div>
  );
}
