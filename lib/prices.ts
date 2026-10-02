// Directory price list — read from dir_packages (edited in OpDesk Admin →
// Directory → Packages), so ZAtours, Route22 and OpDesk billing all use the
// same numbers. Falls back to the constants in lib/pricing.ts if the table
// can't be reached, so pricing pages always render.
import { getSupabase } from "./supabase";
import { FOUNDING, INCLUDED_CATEGORIES, LISTING_PLANS, isFoundingOpen } from "./pricing";

export type PackageRow = {
  key: string;
  kind: "listing" | "addon" | "route_hub" | "member_rate";
  name: string;
  description: string | null;
  founding_price: number;
  standard_price: number;
  included_categories: number | null;
  features: string[];
  min_quantity: number | null;
  sort_order: number;
};

export type Prices = {
  founding: boolean;
  premium: number;
  featured: number;
  extraCategory: number;
  standard: { premium: number; featured: number; extraCategory: number };
  included: { free: number; premium: number; featured: number };
  packages: PackageRow[];
  // Current price (founding or standard) for any package key.
  price: (key: string) => number;
  standardPrice: (key: string) => number;
  get: (key: string) => PackageRow | undefined;
};

const FALLBACK: PackageRow[] = [
  { key: "free", kind: "listing", name: "Free", description: null, founding_price: 0, standard_price: 0, included_categories: 1, features: [], min_quantity: null, sort_order: 10 },
  { key: "premium", kind: "listing", name: "Premium", description: null, founding_price: LISTING_PLANS.founding.premium, standard_price: LISTING_PLANS.standard.premium, included_categories: INCLUDED_CATEGORIES.premium, features: [], min_quantity: null, sort_order: 20 },
  { key: "featured", kind: "listing", name: "Featured", description: null, founding_price: LISTING_PLANS.founding.featured, standard_price: LISTING_PLANS.standard.featured, included_categories: INCLUDED_CATEGORIES.featured, features: [], min_quantity: null, sort_order: 30 },
  { key: "extra_category", kind: "addon", name: "Extra category", description: null, founding_price: LISTING_PLANS.founding.extraCategory, standard_price: LISTING_PLANS.standard.extraCategory, included_categories: null, features: [], min_quantity: null, sort_order: 40 },
];

export function buildPrices(rows: PackageRow[], now: Date = new Date()): Prices {
  const founding = isFoundingOpen(now);
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const fb = new Map(FALLBACK.map((r) => [r.key, r]));
  const get = (k: string) => byKey.get(k) ?? fb.get(k);
  const price = (k: string) => {
    const r = get(k);
    return r ? Number(founding ? r.founding_price : r.standard_price) : 0;
  };
  const standardPrice = (k: string) => Number(get(k)?.standard_price ?? 0);
  return {
    founding,
    premium: price("premium"),
    featured: price("featured"),
    extraCategory: price("extra_category"),
    standard: { premium: standardPrice("premium"), featured: standardPrice("featured"), extraCategory: standardPrice("extra_category") },
    included: {
      free: get("free")?.included_categories ?? 1,
      premium: get("premium")?.included_categories ?? 2,
      featured: get("featured")?.included_categories ?? 3,
    },
    packages: rows.length ? rows : FALLBACK,
    price,
    standardPrice,
    get,
  };
}

export async function getPrices(): Promise<Prices> {
  const supabase = getSupabase();
  if (!supabase) return buildPrices(FALLBACK);
  const { data, error } = await supabase
    .from("dir_packages")
    .select("key, kind, name, description, founding_price, standard_price, included_categories, features, min_quantity, sort_order")
    .eq("active", true)
    .order("sort_order");
  if (error || !data?.length) return buildPrices(FALLBACK);
  return buildPrices(
    data.map((r) => ({
      ...r,
      founding_price: Number(r.founding_price),
      standard_price: Number(r.standard_price),
      features: Array.isArray(r.features) ? (r.features as string[]) : [],
    })) as PackageRow[]
  );
}

// Serializable snapshot for client components (functions can't cross the
// server→client boundary).
export type PriceSnapshot = Omit<Prices, "price" | "standardPrice" | "get">;
export function snapshot(p: Prices): PriceSnapshot {
  const { price: _p, standardPrice: _s, get: _g, ...rest } = p;
  void _p; void _s; void _g;
  return rest;
}
export function fromSnapshot(s: PriceSnapshot): Prices {
  return buildPrices(s.packages);
}

export { FOUNDING };
