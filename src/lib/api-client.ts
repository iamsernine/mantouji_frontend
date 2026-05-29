import type { ApiError, ApiResponse, ApiSuccess } from "@/types/api";
import { getAccessToken } from "@/lib/auth-storage";

function getApiBase() {
  if (typeof window === "undefined") {
    return (
      process.env.API_INTERNAL_URL ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:8000/api/v1"
    );
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
}

export class ApiRequestError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiSuccess<T>> {
  const { method = "GET", body, auth = false, cache, next } = options;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getAccessToken();
    if (!token) {
      throw new ApiRequestError("Session expirée. Veuillez vous reconnecter.", 401);
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBase()}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  const raw = await res.text();
  if (!raw) {
    if (!res.ok) {
      throw new ApiRequestError("Request failed", res.status);
    }
    return {
      success: true,
      message: "OK",
      data: null as T,
    };
  }

  let json: ApiResponse<T> | ApiError;
  try {
    json = JSON.parse(raw) as ApiResponse<T> | ApiError;
  } catch {
    throw new ApiRequestError("Invalid API response", res.status);
  }

  if (!res.ok || !json.success) {
    const err = json as ApiError;
    throw new ApiRequestError(
      err.message ?? "Request failed",
      res.status,
      err.errors ?? {}
    );
  }
  return json as ApiSuccess<T>;
}

export function getApiBaseUrl() {
  return getApiBase();
}

/** Browser-facing API host (uploads, media). Never use Docker-internal hostnames. */
export function getPublicBaseUrl() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000/api/v1";
  return base.replace(/\/api\/v1\/?$/, "");
}
