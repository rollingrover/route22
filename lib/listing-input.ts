// Shared validation for creating listings from the admin form and CSV import.

export const LISTING_CATEGORIES = [
  "stay",
  "tours",
  "wildlife",
  "ocean",
  "culture",
  "eat",
  "transport",
  "volunteer",
] as const;
export const LISTING_TIERS = ["community", "basic", "premium", "featured"] as const;
export const SITES_CHOICES: Record<string, string[]> = {
  both: ["zatours", "route22"],
  zatours: ["zatours"],
  route22: ["route22"],
};

export type ListingInsert = {
  slug: string;
  name: string;
  category: string;
  town: string | null;
  province: string;
  summary: string;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website_url: string | null;
  photo_url: string | null;
  lat: number | null;
  lng: number | null;
  price_from: number | null;
  tier: string;
  sites: string[];
  published: boolean;
};

// Deterministic slug (no random suffix): re-importing the same sheet
// updates existing rows instead of duplicating them, and URLs stay clean.
export function baseSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "listing"
  );
}

function str(v: unknown, max = 500): string | null {
  const s = String(v ?? "").trim();
  return s ? s.slice(0, max) : null;
}

function num(v: unknown, min: number, max: number): number | null | "bad" {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(",", "."));
  if (Number.isNaN(n) || n < min || n > max) return "bad";
  return n;
}

function url(v: unknown): string | null | "bad" {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    const u = new URL(withProto);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : "bad";
  } catch {
    return "bad";
  }
}

function bool(v: unknown, fallback: boolean): boolean {
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return fallback;
  return ["1", "true", "yes", "y", "on"].includes(s);
}

// Returns a clean row, or an error message naming the bad field.
export function parseListing(
  raw: Record<string, unknown>
): { ok: true; row: ListingInsert } | { ok: false; error: string } {
  const name = str(raw.name, 150);
  if (!name) return { ok: false, error: "name is required" };

  const category = String(raw.category ?? "").trim().toLowerCase();
  if (!(LISTING_CATEGORIES as readonly string[]).includes(category)) {
    return { ok: false, error: `category must be one of: ${LISTING_CATEGORIES.join(", ")}` };
  }

  const tier = String(raw.tier ?? "community").trim().toLowerCase() || "community";
  if (!(LISTING_TIERS as readonly string[]).includes(tier)) {
    return { ok: false, error: `tier must be one of: ${LISTING_TIERS.join(", ")}` };
  }

  const sitesKey = String(raw.sites ?? "both").trim().toLowerCase() || "both";
  const sites = SITES_CHOICES[sitesKey];
  if (!sites) return { ok: false, error: "sites must be both, zatours or route22" };

  const email = str(raw.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "email is not valid" };
  }

  const website = url(raw.website_url);
  if (website === "bad") return { ok: false, error: "website_url is not a valid URL" };
  const photo = url(raw.photo_url);
  if (photo === "bad") return { ok: false, error: "photo_url is not a valid URL" };

  const lat = num(raw.lat, -90, 90);
  const lng = num(raw.lng, -180, 180);
  if (lat === "bad" || lng === "bad") return { ok: false, error: "lat/lng out of range" };
  const price = num(raw.price_from, 0, 10_000_000);
  if (price === "bad") return { ok: false, error: "price_from must be a number" };

  const slugRaw = String(raw.slug ?? "").trim();
  const slug = slugRaw ? baseSlug(slugRaw) : baseSlug(name);

  return {
    ok: true,
    row: {
      slug,
      name,
      category,
      town: str(raw.town, 100),
      province: str(raw.province, 60) ?? "KwaZulu-Natal",
      summary: str(raw.summary, 300) ?? "",
      description: str(raw.description, 4000) ?? "",
      phone: str(raw.phone, 40),
      whatsapp: str(raw.whatsapp, 40),
      email,
      website_url: website,
      photo_url: photo,
      lat,
      lng,
      price_from: price,
      tier,
      sites,
      published: bool(raw.published, true),
    },
  };
}

// Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF, BOM).
// Auto-detects ";" as the separator: Excel uses it when Windows regional
// settings are South African (comma is the decimal separator there).
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "");
  const firstLine = s.split(/\r?\n/, 1)[0] ?? "";
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === sep) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}
