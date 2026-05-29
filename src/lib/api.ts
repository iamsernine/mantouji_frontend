import { apiRequest, ApiRequestError, getApiBaseUrl } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth-storage";
import type { ApiSuccess } from "@/types/api";
import {
  mapAvis,
  mapCategorie,
  mapCertification,
  mapCooperative,
  mapProductDetail,
  mapProductListItem,
  mapRegion,
  type Paginated,
} from "@/lib/mappers";
import type { Cooperative } from "@/types/cooperative";
import type { Categorie, Certification, Produit, Region } from "@/types/product";

function success<T>(data: T, message = "Operation successful"): ApiSuccess<T> {
  return { success: true, message, data };
}

async function fetchAllPages<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  size = 100
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let total = 0;
  do {
    const search = new URLSearchParams();
    search.set("page", String(page));
    search.set("size", String(size));
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") search.set(k, String(v));
    }
    const res = await apiRequest<Paginated<T>>(`${path}?${search.toString()}`, {
      next: { revalidate: 60 },
    });
    items.push(...res.data.items);
    total = res.data.total;
    page += 1;
  } while (items.length < total);
  return items;
}

export async function getRegions(): Promise<ApiSuccess<Region[]>> {
  const res = await apiRequest<Array<{ id: string; nom: string; description?: string | null }>>(
    "/regions",
    { next: { revalidate: 300 } }
  );
  return success(res.data.map(mapRegion));
}

export async function getCategories(): Promise<ApiSuccess<Categorie[]>> {
  const res = await apiRequest<Array<{ id: string; nom: string; description?: string | null }>>(
    "/categories",
    { next: { revalidate: 300 } }
  );
  return success(res.data.map(mapCategorie));
}

export async function getCertifications(): Promise<ApiSuccess<Certification[]>> {
  const res = await apiRequest<
    Array<{ id: string; nom: string; description?: string | null; logoUrl?: string | null }>
  >("/certifications", {
    next: { revalidate: 300 },
  });
  return success(res.data.map(mapCertification));
}

export async function getCooperatives(params?: {
  regionId?: string;
  search?: string;
  isApproved?: boolean;
}) {
  const items = await fetchAllPages<Parameters<typeof mapCooperative>[0]>("/cooperatives", {
    regionId: params?.regionId,
    search: params?.search,
    isApproved: params?.isApproved ?? true,
  });
  return success(items.map(mapCooperative));
}

export async function getCooperativeById(id: string) {
  try {
    const res = await apiRequest<Parameters<typeof mapCooperative>[0]>(`/cooperatives/${id}`, {
      next: { revalidate: 60 },
    });
    return success(mapCooperative(res.data));
  } catch {
    return null;
  }
}

export async function getMyCooperative() {
  const res = await apiRequest<Parameters<typeof mapCooperative>[0]>("/cooperatives/me", {
    auth: true,
    cache: "no-store",
  });
  return mapCooperative(res.data);
}

export async function updateMyCooperative(payload: {
  nomCooperative?: string;
  description?: string;
  histoire?: string;
  telephone?: string;
  whatsapp?: string;
  siteWeb?: string;
  regionId?: string;
}) {
  const res = await apiRequest<Parameters<typeof mapCooperative>[0]>("/cooperatives/me", {
    method: "PUT",
    auth: true,
    body: payload,
  });
  return mapCooperative(res.data);
}

// --- Coop registration requests (Postgres-backed) ---
export async function submitCoopRegistrationRequest(payload: {
  contactPrenom: string;
  contactNom: string;
  contactEmail: string;
  contactTelephone: string;
  motDePasse: string;
  nomCooperative: string;
  regionId: string;
  description?: string;
  histoire?: string;
  telephone?: string;
  whatsapp?: string;
  siteWeb?: string;
}): Promise<ApiSuccess<{ id: string }>> {
  return apiRequest("/coop-registrations", {
    method: "POST",
    body: payload,
  });
}

export async function uploadCoopRegistrationDocument(params: {
  requestId: string;
  kind: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("kind", params.kind);
  const res = await fetch(`${getApiBaseUrl()}/coop-registrations/${params.requestId}/documents`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });
  const raw = await res.text();
  const json = raw ? JSON.parse(raw) : { success: false, message: "Invalid response" };
  if (!res.ok || !json.success) {
    throw new ApiRequestError(json.message ?? "Upload failed", res.status, json.errors ?? {});
  }
  return json as ApiSuccess<{ id: string; url: string }>;
}

export async function adminListPendingCoopRequests() {
  return apiRequest<any[]>("/coop-registrations/admin/pending", { auth: true, cache: "no-store" });
}

export async function adminGetCoopRequest(id: string) {
  return apiRequest<any>(`/coop-registrations/admin/${id}`, { auth: true, cache: "no-store" });
}

export async function adminApproveCoopRequest(id: string) {
  return apiRequest<{ cooperativeProfileId: string }>(`/coop-registrations/admin/${id}/approve`, {
    method: "POST",
    auth: true,
  });
}

export async function adminRejectCoopRequest(id: string, message: string) {
  return apiRequest(`/coop-registrations/admin/${id}/reject`, {
    method: "POST",
    auth: true,
    body: { message },
  });
}

export async function getMyCoopNotifications() {
  return apiRequest<any[]>("/coop-registrations/me/notifications", { auth: true, cache: "no-store" });
}

async function uploadCooperativeImage(
  path: "/medias/cooperative/logo" | "/medias/cooperative/banner",
  file: File
): Promise<Cooperative> {
  const formData = new FormData();
  formData.append("file", file);
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getAccessToken();
  if (!token) throw new ApiRequestError("Session expirée. Veuillez vous reconnecter.", 401);
  headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  const raw = await res.text();
  const json = raw ? JSON.parse(raw) : { success: false, message: "Invalid response" };
  if (!res.ok || !json.success) {
    throw new ApiRequestError(json.message ?? "Upload failed", res.status, json.errors ?? {});
  }
  return mapCooperative(json.data);
}

export function uploadCooperativeLogo(file: File) {
  return uploadCooperativeImage("/medias/cooperative/logo", file);
}

export function uploadCooperativeBanner(file: File) {
  return uploadCooperativeImage("/medias/cooperative/banner", file);
}

export async function deleteProductMedia(mediaId: string) {
  return apiRequest(`/medias/${mediaId}`, { method: "DELETE", auth: true });
}

export const MAX_PRODUCT_IMAGES = 3;

export async function getProducts(params?: {
  categorieId?: string;
  cooperativeId?: string;
  regionId?: string;
  search?: string;
  featured?: boolean;
  minPrix?: number;
  maxPrix?: number;
  disponibilite?: boolean;
}) {
  const items = await fetchAllPages<Parameters<typeof mapProductListItem>[0]>("/produits", {
    categorieId: params?.categorieId,
    cooperativeId: params?.cooperativeId,
    regionId: params?.regionId,
    search: params?.search,
    featured: params?.featured,
    minPrix: params?.minPrix,
    maxPrix: params?.maxPrix,
    disponibilite: params?.disponibilite,
  });
  return success(
    items.map((p) =>
      mapProductListItem(p, params?.regionId ?? p.cooperative?.id ?? "")
    )
  );
}

export async function getProductById(id: string) {
  try {
    const res = await apiRequest<Parameters<typeof mapProductDetail>[0]>(`/produits/${id}`, {
      next: { revalidate: 30 },
    });
    const regionId = res.data.cooperative?.id ?? "";
    return success(mapProductDetail(res.data, regionId));
  } catch {
    return null;
  }
}

export async function getProductReviews(id: string) {
  const items = await fetchAllPages<{
    id: string;
    note: number;
    commentaire?: string | null;
    date: string;
    user?: { nom: string };
  }>(`/produits/${id}/avis`);
  return success(mapAvis(items));
}

/** All approved reviews for a cooperative's products (public API, paginated per product). */
export async function getCooperativeProductReviews(productIds: string[]) {
  if (!productIds.length) return [] as Array<ReturnType<typeof mapAvis>[number] & { produitId: string }>;

  const batches = await Promise.all(
    productIds.map(async (produitId) => {
      try {
        const { data } = await getProductReviews(produitId);
        return data.map((a) => ({ ...a, produitId }));
      } catch {
        return [];
      }
    })
  );
  return batches.flat().sort((a, b) => b.date.localeCompare(a.date));
}

export async function createProductReview(payload: {
  produitId: string;
  note: number;
  commentaire?: string;
}) {
  return apiRequest("/avis", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export type MyReview = {
  id: string;
  note: number;
  commentaire: string;
  date: string;
  produitId: string;
  produitNom: string;
  isApproved: boolean;
};

export async function getMyReviews() {
  const res = await apiRequest<MyReview[]>("/avis/me", { auth: true, cache: "no-store" });
  return success(res.data);
}

export async function updateMyReview(
  reviewId: string,
  payload: { note?: number; commentaire?: string | null }
) {
  return apiRequest<MyReview>(`/avis/${reviewId}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });
}

export async function deleteMyReview(reviewId: string) {
  return apiRequest(`/avis/${reviewId}`, { method: "DELETE", auth: true });
}

export function getCooperative(id: string): Cooperative | undefined {
  return undefined;
}

export function getProduct(id: string): Produit | undefined {
  return undefined;
}

export async function getProductsByCooperative(coopId: string): Promise<Produit[]> {
  const { data } = await getProducts({ cooperativeId: coopId });
  return data;
}

export async function getFeaturedProducts(limit = 4): Promise<Produit[]> {
  const { data } = await getProducts({ featured: true });
  return data.slice(0, limit);
}

export async function getFeaturedCooperatives(limit = 3): Promise<Cooperative[]> {
  const { data } = await getCooperatives({ isApproved: true });
  return data.slice(0, limit);
}

export async function getCooperativesByRegion(regionId: string): Promise<Cooperative[]> {
  const { data } = await getCooperatives({ regionId, isApproved: true });
  return data;
}

export async function getCooperativesByRegionSlug(slug: string): Promise<Cooperative[]> {
  const { getAdminRegionBySlug } = await import("@/data/morocco-admin-regions");
  const admin = getAdminRegionBySlug(slug);
  if (!admin) return [];
  const { data: regions } = await getRegions();
  const needle = admin.nom.toLowerCase().split(/[\s-]/)[0] ?? "";
  const match = regions.find(
    (r) =>
      r.nom.toLowerCase().includes(needle) ||
      needle.includes(r.nom.toLowerCase().split("-")[0] ?? "")
  );
  if (!match) return getCooperatives({ isApproved: true }).then((r) => r.data);
  return getCooperativesByRegion(match.id);
}

export async function uploadProductImage(
  produitId: string,
  file: File,
  altText?: string
): Promise<ApiSuccess<{ id: string; url: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("produitId", produitId);
  if (altText) formData.append("altText", altText);

  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiBaseUrl()}/medias/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  const json = (await res.json()) as ApiSuccess<{ id: string; url: string }> | {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
  };

  if (!res.ok || !json.success) {
    throw new ApiRequestError(
      json.message ?? "Image upload failed",
      res.status,
      "errors" in json && json.errors ? json.errors : {}
    );
  }
  return json;
}

export async function createProduct(payload: {
  categorieId: string;
  nom: string;
  description?: string;
  origine?: string;
  composition?: string;
  prix: number;
  disponibilite?: boolean;
}) {
  return apiRequest<{ id: string; nom: string }>("/produits", {
    method: "POST",
    body: {
      categorieId: payload.categorieId,
      nom: payload.nom,
      description: payload.description,
      origine: payload.origine,
      composition: payload.composition,
      prix: payload.prix,
      disponibilite: payload.disponibilite ?? true,
    },
    auth: true,
  });
}

export async function updateProduct(
  id: string,
  payload: Partial<{
    categorieId: string;
    nom: string;
    description: string;
    origine: string;
    composition: string;
    prix: number;
    disponibilite: boolean;
    isFeatured: boolean;
  }>
) {
  return apiRequest(`/produits/${id}`, {
    method: "PUT",
    body: payload,
    auth: true,
  });
}

export async function deleteProduct(id: string) {
  return apiRequest(`/produits/${id}`, { method: "DELETE", auth: true });
}

export async function approveCooperative(cooperativeId: string) {
  return apiRequest(`/admin/cooperatives/${cooperativeId}/approve`, {
    method: "PATCH",
    auth: true,
  });
}

export async function listPendingCooperatives() {
  return getCooperatives({ isApproved: false });
}

export async function listAdminUsers(page = 1, size = 20) {
  return apiRequest<Paginated<{
    id: string;
    nom: string;
    email: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
  }>>(`/admin/utilisateurs?page=${page}&size=${size}`, { auth: true, cache: "no-store" });
}
