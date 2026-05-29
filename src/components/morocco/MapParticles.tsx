/** Decorative dots — opacity pulse only, fixed positions */
const PARTICLES = [
  { x: "14%", y: "20%", size: 5 },
  { x: "76%", y: "24%", size: 4 },
  { x: "62%", y: "70%", size: 4 },
  { x: "30%", y: "78%", size: 3 },
];

export function MapParticles() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="map-particle-pulse absolute rounded-full bg-gold/20"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}
