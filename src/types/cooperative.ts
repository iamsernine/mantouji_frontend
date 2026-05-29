import type { Region } from "./product";

export type Cooperative = {
  id: string;
  nomCooperative: string;
  description: string;
  histoire: string;
  telephone: string;
  whatsapp: string;
  siteWeb?: string;
  logoUrl: string;
  bannerUrl?: string;
  region: Region;
};

export type CooperativeSummary = Pick<
  Cooperative,
  "id" | "nomCooperative" | "logoUrl" | "region" | "description"
>;
