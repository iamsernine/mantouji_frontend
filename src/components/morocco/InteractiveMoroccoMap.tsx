"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { getCooperatives, getProducts } from "@/lib/api";
import type { MoroccoMapCode } from "@/data/morocco-admin-regions";
import { regionSlugFromName } from "@/data/morocco-admin-regions";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import type { GeoProjection } from "d3-geo";
import {
  buildMoroccoRegionsData,
  getRegionFromGeoProperties,
  getRegionMapFill,
} from "@/data/moroccoRegions";
import { useMoroccoGeoJson } from "@/hooks/useMoroccoGeoJson";
import {
  MOROCCO_MAP_HEIGHT,
  MOROCCO_MAP_WIDTH,
  useMoroccoProjection,
} from "@/hooks/useMoroccoProjection";
import { MapAmbientGlow } from "@/components/morocco/MapAmbientGlow";
import { MapParticles } from "@/components/morocco/MapParticles";
import { RegionCursorLabel } from "@/components/morocco/RegionCursorLabel";

type MapGeo = {
  rsmKey: string;
  properties?: Record<string, unknown>;
};

const MAP_FILL = {
  default: "#e6dfd1",
  hover: "#2b2b2b",
  stroke: "rgba(43, 43, 43, 0.28)",
  strokeHover: "rgba(43, 43, 43, 0.45)",
};

type InteractiveMoroccoMapProps = {
  /** Region URL slug (e.g. oriental, souss-massa) */
  onRegionSelect?: (regionSlug: string) => void;
};

function getGeoId(geo: MapGeo): string {
  const props = geo.properties;
  return (props?.mapCode as string) || (props?.id as string) || geo.rsmKey;
}

function pointerFromMouseEvent(
  e: React.MouseEvent<SVGElement>
): { x: number; y: number } | null {
  const { clientX, clientY } = e;
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;
  return { x: clientX, y: clientY };
}

function pointerFromFocusEvent(
  e: React.FocusEvent<SVGElement>
): { x: number; y: number } {
  const rect = e.currentTarget.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function regionStyle(mapCode: MoroccoMapCode | string) {
  const fill = getRegionMapFill(mapCode as MoroccoMapCode);

  return {
    default: {
      fill,
      stroke: MAP_FILL.stroke,
      strokeWidth: 0.55,
      outline: "none",
      transition: "fill 200ms ease, stroke 200ms ease",
      cursor: "pointer",
      pointerEvents: "all" as const,
    },
    hover: {
      fill: MAP_FILL.hover,
      stroke: MAP_FILL.strokeHover,
      strokeWidth: 0.85,
      outline: "none",
      cursor: "pointer",
      pointerEvents: "all" as const,
    },
    pressed: {
      fill: MAP_FILL.hover,
      stroke: MAP_FILL.strokeHover,
      strokeWidth: 0.85,
      outline: "none",
      cursor: "pointer",
      pointerEvents: "all" as const,
    },
  };
}

export const InteractiveMoroccoMap = memo(function InteractiveMoroccoMap({
  onRegionSelect,
}: InteractiveMoroccoMapProps) {
  const { geoData, loading, error } = useMoroccoGeoJson();
  const projection = useMoroccoProjection(geoData);
  const [regionLookup, setRegionLookup] = useState(() =>
    buildMoroccoRegionsData([], [])
  );

  useEffect(() => {
    Promise.all([getCooperatives(), getProducts()])
      .then(([coopsRes, productsRes]) => {
        setRegionLookup(
          buildMoroccoRegionsData(coopsRes.data, productsRes.data)
        );
      })
      .catch(() => setRegionLookup(buildMoroccoRegionsData([], [])));
  }, []);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const clearHover = useCallback(() => {
    setHoveredName(null);
  }, []);

  const onMapSurfaceMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as Element;
      if (!target.closest("path")) clearHover();
    },
    [clearHover]
  );

  const onRegionEnter = useCallback(
    (name: string, e: React.MouseEvent<SVGElement>) => {
      setHoveredName(name);
      const pt = pointerFromMouseEvent(e);
      if (pt) setPointer(pt);
    },
    []
  );

  const onRegionMove = useCallback(
    (name: string, e: React.MouseEvent<SVGElement>) => {
      setHoveredName(name);
      const pt = pointerFromMouseEvent(e);
      if (pt) setPointer(pt);
    },
    []
  );

  const onRegionFocus = useCallback(
    (name: string, e: React.FocusEvent<SVGElement>) => {
      setHoveredName(name);
      setPointer(pointerFromFocusEvent(e));
    },
    []
  );

  if (loading) {
    return (
      <div
        className="mx-auto aspect-[960/820] w-full max-w-6xl animate-pulse bg-sand/20"
        aria-hidden
      />
    );
  }

  if (error || !geoData || !projection) {
    return (
      <p className="py-16 text-center text-sm text-charcoal/60">
        Impossible de charger la carte géographique.
      </p>
    );
  }

  return (
    <div className="morocco-map-root relative mx-auto w-full max-w-6xl">
      <div
        className="relative mx-auto w-full"
        style={{ aspectRatio: `${MOROCCO_MAP_WIDTH} / ${MOROCCO_MAP_HEIGHT}` }}
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <MapAmbientGlow />
          <MapParticles />
        </div>

        <div
          className="absolute inset-0 z-10"
          onMouseLeave={clearHover}
          onMouseMove={onMapSurfaceMove}
        >
          <ComposableMap
            projection={
              projection as unknown as (width: number, height: number) => GeoProjection
            }
            width={MOROCCO_MAP_WIDTH}
            height={MOROCCO_MAP_HEIGHT}
            className="morocco-map-svg pointer-events-auto block h-full w-full touch-manipulation"
            aria-label="Carte interactive des régions du Maroc"
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoId = getGeoId(geo);
                  const regionMeta = getRegionFromGeoProperties(
                    geo.properties as Record<string, unknown>,
                    regionLookup
                  );
                  const name = regionMeta?.name ?? geoId;
                  const regionSlug =
                    regionMeta?.id ?? regionSlugFromName(name);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      tabIndex={0}
                      role="button"
                      aria-label={name}
                      onMouseEnter={(e) => onRegionEnter(name, e)}
                      onMouseMove={(e) => onRegionMove(name, e)}
                      onFocus={(e) => onRegionFocus(name, e)}
                      onBlur={clearHover}
                      onClick={() => onRegionSelect?.(regionSlug)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRegionSelect?.(regionSlug);
                        }
                      }}
                      style={regionStyle(regionMeta?.mapCode ?? geoId)}
                      className="focus:outline-none focus-visible:stroke-sage focus-visible:stroke-[2px]"
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {hoveredName && (
        <RegionCursorLabel name={hoveredName} x={pointer.x} y={pointer.y} />
      )}
    </div>
  );
});
