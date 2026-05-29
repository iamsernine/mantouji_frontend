"use client";

import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";
import { MOROCCO_GEOJSON_URL } from "@/data/moroccoRegions";

type UseMoroccoGeoJsonResult = {
  geoData: FeatureCollection | null;
  loading: boolean;
  error: boolean;
};

let cached: FeatureCollection | null = null;
let inflight: Promise<FeatureCollection> | null = null;

function loadGeoJson(): Promise<FeatureCollection> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = fetch(MOROCCO_GEOJSON_URL)
    .then((res) => {
      if (!res.ok) throw new Error("GeoJSON fetch failed");
      return res.json() as Promise<FeatureCollection>;
    })
    .then((data) => {
      cached = data;
      return data;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useMoroccoGeoJson(): UseMoroccoGeoJsonResult {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;
    loadGeoJson()
      .then((data) => {
        if (!cancelled) setGeoData(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { geoData, loading, error };
}
