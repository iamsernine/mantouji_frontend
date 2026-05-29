export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type Role = "CLIENT" | "COOPERATIVE" | "ADMIN";

export type Disponibilite = "EN_STOCK" | "LIMITE" | "RUPTURE";
