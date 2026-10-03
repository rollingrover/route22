// Shared map-layer logic for the ZAtours and Route22 maps: which "key" entries
// a listing belongs to, stay sub-types and service types.
import type { Category, Listing } from "./data";

export const STAY_SUBTYPES = ["bnb", "guesthouse", "lodge", "hotel", "campsite", "self_catering", "backpackers"] as const;
export type StaySubtype = (typeof STAY_SUBTYPES)[number];

export const SERVICE_TYPES = ["atm", "fuel", "clinic", "hospital", "pharmacy", "police", "airport", "bank", "fastfood"] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number] | "other";

// Key ids a listing appears under: stays by sub-type ("stay:lodge"), other
// categories by category ("tours"). Visible if ANY of its keys is switched on.
export function listingLayerKeys(l: Listing): string[] {
  const cats = (l.categories?.length ? l.categories : [l.category]) as Category[];
  return cats.map((c) => (c === "stay" ? `stay:${l.subtype || "other"}` : c));
}

export const serviceIcon = (t: string) => `/map/svc-${(SERVICE_TYPES as readonly string[]).includes(t) ? t : "other"}.svg`;

// Paid tiers only (map pins are a Premium / Featured perk).
export function pinnable(l: Listing) {
  return (l.tier === "premium" || l.tier === "featured") && typeof l.lat === "number" && typeof l.lng === "number";
}
