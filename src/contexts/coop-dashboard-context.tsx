"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  createProduct,
  deleteProduct,
  deleteProductMedia,
  getCooperativeProductReviews,
  getMyCooperative,
  getProductsByCooperative,
  MAX_PRODUCT_IMAGES,
  updateProduct,
  uploadProductImage,
} from "@/lib/api";
import type {
  CoopProductInput,
  CoopProductRecord,
  CoopReviewRecord,
} from "@/types/coop-dashboard";
import type { Cooperative } from "@/types/cooperative";
import type { Produit } from "@/types/product";

function toCoopRecord(p: Produit, avis: Produit["avis"]): CoopProductRecord {
  return {
    ...p,
    avis,
    moderationStatus: "approved",
  };
}

type CoopDashboardContextValue = {
  coopId: string;
  cooperative: Cooperative | undefined;
  products: CoopProductRecord[];
  reviews: CoopReviewRecord[];
  ready: boolean;
  createProduct: (input: CoopProductInput) => Promise<CoopProductRecord>;
  updateProduct: (id: string, input: CoopProductInput) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProducts: () => Promise<CoopProductRecord[]>;
  refreshCooperative: () => Promise<Cooperative | undefined>;
};

const CoopDashboardContext = createContext<CoopDashboardContextValue | null>(null);

export function CoopDashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const coopId = user?.cooperativeProfileId ?? "";
  const [cooperative, setCooperative] = useState<Cooperative | undefined>();
  const [products, setProducts] = useState<CoopProductRecord[]>([]);
  const [reviews, setReviews] = useState<CoopReviewRecord[]>([]);
  const [ready, setReady] = useState(false);

  const refreshCooperative = useCallback(async () => {
    if (!coopId) {
      setCooperative(undefined);
      return undefined;
    }
    try {
      const coop = await getMyCooperative();
      setCooperative(coop);
      return coop;
    } catch {
      return undefined;
    }
  }, [coopId]);

  const load = useCallback(async (): Promise<CoopProductRecord[]> => {
    if (!coopId) {
      setCooperative(undefined);
      setProducts([]);
      setReviews([]);
      setReady(true);
      return [];
    }
    try {
      const coop = await getMyCooperative();
      setCooperative(coop);
      const list = await getProductsByCooperative(coopId);
      const productIds = list.map((p) => p.id);
      const reviewRows = await getCooperativeProductReviews(productIds);

      const avisByProduct = new Map<string, Produit["avis"]>();
      const namedReviews: CoopReviewRecord[] = [];
      for (const row of reviewRows) {
        const produit = list.find((p) => p.id === row.produitId);
        const nom = produit?.nom ?? "Produit";
        const { produitId, ...avis } = row;
        const listForProduct = avisByProduct.get(produitId) ?? [];
        listForProduct.push(avis);
        avisByProduct.set(produitId, listForProduct);
        namedReviews.push({ ...avis, produitId, produitNom: nom });
      }

      const records = list.map((p) =>
        toCoopRecord(p, avisByProduct.get(p.id) ?? [])
      );
      setProducts(records);
      setReviews(namedReviews);
      return records;
    } catch {
      setProducts([]);
      setReviews([]);
      return [];
    } finally {
      setReady(true);
    }
  }, [coopId]);

  useEffect(() => {
    setReady(false);
    void load();
  }, [load]);

  const createProductHandler = useCallback(
    async (input: CoopProductInput) => {
      const res = await createProduct({
        categorieId: input.categorieId,
        nom: input.nom,
        description: input.description,
        origine: input.origine,
        composition: input.composition,
        prix: input.prix,
        disponibilite: input.disponibilite !== "RUPTURE",
      });

      for (const file of (input.imageFiles ?? []).slice(0, MAX_PRODUCT_IMAGES)) {
        await uploadProductImage(res.data.id, file, input.nom);
      }

      const records = await load();
      const created = records.find((p) => p.id === res.data.id);
      if (created) return created;

      return toCoopRecord(
        {
          id: res.data.id,
          nom: input.nom,
          description: input.description,
          origine: input.origine,
          composition: input.composition,
          prix: input.prix,
          disponibilite: input.disponibilite,
          categorie: { id: input.categorieId, nom: "", slug: "", icone: "" },
          cooperative: {
            id: coopId,
            nomCooperative: cooperative?.nomCooperative ?? "",
            logoUrl: cooperative?.logoUrl ?? "",
            region: cooperative?.region ?? { id: "", nom: "", description: "" },
            description: "",
          },
          medias: [],
          certifications: [],
          avis: [],
          ratingSummary: { averageRating: 0, reviewsCount: 0 },
          viewsCount: 0,
          regionId: cooperative?.region.id ?? "",
        },
        []
      );
    },
    [load, cooperative, coopId]
  );

  const updateProductHandler = useCallback(
    async (id: string, input: CoopProductInput) => {
      await updateProduct(id, {
        categorieId: input.categorieId,
        nom: input.nom,
        description: input.description,
        origine: input.origine,
        composition: input.composition,
        prix: input.prix,
        disponibilite: input.disponibilite !== "RUPTURE",
      });

      for (const mediaId of input.removeMediaIds ?? []) {
        await deleteProductMedia(mediaId);
      }
      const kept =
        (products.find((p) => p.id === id)?.medias.length ?? 0) -
        (input.removeMediaIds?.length ?? 0);
      const slots = Math.max(0, MAX_PRODUCT_IMAGES - kept);
      for (const file of (input.imageFiles ?? []).slice(0, slots)) {
        await uploadProductImage(id, file, input.nom);
      }

      await load();
    },
    [load, products]
  );

  const deleteProductHandler = useCallback(
    async (id: string) => {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setReviews((prev) => prev.filter((r) => r.produitId !== id));
    },
    []
  );

  const value = useMemo(
    () => ({
      coopId,
      cooperative,
      products,
      reviews,
      ready,
      createProduct: createProductHandler,
      updateProduct: updateProductHandler,
      deleteProduct: deleteProductHandler,
      resetProducts: load,
      refreshCooperative,
    }),
    [
      coopId,
      cooperative,
      products,
      reviews,
      ready,
      createProductHandler,
      updateProductHandler,
      deleteProductHandler,
      load,
      refreshCooperative,
    ]
  );

  return (
    <CoopDashboardContext.Provider value={value}>
      {children}
    </CoopDashboardContext.Provider>
  );
}

export function useCoopDashboard() {
  const ctx = useContext(CoopDashboardContext);
  if (!ctx) {
    throw new Error("useCoopDashboard must be used within CoopDashboardProvider");
  }
  return ctx;
}
