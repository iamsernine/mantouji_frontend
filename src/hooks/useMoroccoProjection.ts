"use client";

import { useMemo } from "react";
import { geoMercator, type GeoProjection } from "d3-geo";
import type { FeatureCollection } from "geojson";

export const MOROCCO_MAP_WIDTH = 960;
export const MOROCCO_MAP_HEIGHT = 820;

/** Fits Morocco GeoJSON into the SVG box — keeps map centred at all breakpoints */
export function useMoroccoProjection(
  geoData: FeatureCollection | null
): GeoProjection | null {
  return useMemo(() => {
    if (!geoData) return null;
    const projection = geoMercator();
    projection.fitExtent(
      [
        [32, 28],
        [MOROCCO_MAP_WIDTH - 32, MOROCCO_MAP_HEIGHT - 28],
      ],
      geoData
    );
    return projection;
  }, [geoData]);
}
