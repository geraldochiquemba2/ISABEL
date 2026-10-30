import type { Store, StoreDelivery, StoreSocials } from "@/data/mock";

export type SocialKey = "instagram" | "tiktok" | "facebook";

export interface SocialLink {
  key: SocialKey;
  label: string;
  handle: string;
  url: string;
}

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

const SOCIAL_HOSTS: Record<SocialKey, string> = {
  instagram: "instagram.com",
  tiktok: "tiktok.com",
  facebook: "facebook.com",
};

// A API pode devolver JSONB como objeto ou como string (driver antigo).
export function parseObject<T>(value: unknown): T | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  if (typeof value === "object") return value as T;
  return null;
}

export function socialUrl(key: SocialKey, value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const host = SOCIAL_HOSTS[key];
  const handle = raw.replace(/^@+/, "").replace(/^\/+/, "").replace(/^www\./i, "");
  if (handle.toLowerCase().startsWith(host)) return `https://${handle}`;
  return `https://${host}/${key === "tiktok" ? "@" : ""}${handle}`;
}

function socialValue(store: any, key: SocialKey): string {
  if (!store) return "";
  const parsed = parseObject<StoreSocials>(store.socials);
  const fromParsed = parsed?.[key];
  const direct = store[key];
  const value = fromParsed || direct;
  return typeof value === "string" ? value.trim() : "";
}

export function getSocialHandle(store: Store | any, key: SocialKey): string {
  return socialValue(store, key);
}

export function getSocialLinks(store: Store | any): SocialLink[] {
  const keys: SocialKey[] = ["instagram", "tiktok", "facebook"];
  return keys
    .map((key) => {
      const value = socialValue(store, key);
      if (!value) return null;
      return {
        key,
        label: SOCIAL_LABELS[key],
        handle: value.replace(/^https?:\/\/(www\.)?/i, ""),
        url: socialUrl(key, value),
      } satisfies SocialLink;
    })
    .filter((x): x is SocialLink => x !== null);
}

export function getDeliveryInfo(store: Store | any): StoreDelivery | null {
  const parsed = parseObject<StoreDelivery>(store?.delivery);
  const zones = (parsed?.zones ?? store?.deliveryZones ?? "").toString().trim();
  const fee = (parsed?.fee ?? store?.deliveryFee ?? "").toString().trim();
  const conditions = (parsed?.conditions ?? store?.deliveryConditions ?? "").toString().trim();
  if (!zones && !fee && !conditions) return null;
  return { zones, fee, conditions };
}
