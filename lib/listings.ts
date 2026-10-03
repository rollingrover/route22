import { getRouteMemberships } from "./routes";
import { getSupabase } from "./supabase";
import { T } from "./tables";
import { SITE_ID } from "./site";
import { exampleListings, Listing } from "./data";

const tierRank: Record<string, number> = { featured: 0, premium: 1, basic: 2, community: 3 };

// Read from the public view (published rows only, verified computed live).
const COLUMNS =
  "id, slug, name, category, categories, country, town, province, description, tier, sites, photo_url, photo_urls, opens_on, subtype, website_url, phone, email, lat, lng, claimed, partner_source, verified, has_live_availability";

function mapRow(r: Record<string, unknown>): Listing {
  return {
    id: String(r.id),
    slug: r.slug as string,
    name: r.name as string,
    category: r.category as Listing["category"],
    categories: Array.isArray(r.categories) ? (r.categories as Listing["category"][]) : undefined,
    location: (r.town as string) || (r.province as string) || "",
    province: (r.province as string) ?? undefined,
    country: (r.country as string) || "ZA",
    photoUrls: Array.isArray(r.photo_urls) ? (r.photo_urls as string[]).filter(Boolean) : undefined,
    opensOn: (r.opens_on as string) ?? undefined,
    subtype: (r.subtype as string) ?? undefined,
    sites: Array.isArray(r.sites) ? (r.sites as string[]) : undefined,
    desc: (r.description as string) ?? "",
    tier: r.tier as Listing["tier"],
    photoUrl: (r.photo_url as string) ?? undefined,
    websiteUrl: (r.website_url as string) ?? undefined,
    phone: (r.phone as string) ?? undefined,
    lat: (r.lat as number) ?? undefined,
    lng: (r.lng as number) ?? undefined,
    claimed: Boolean(r.claimed),
    partnerSource: (r.partner_source as string) ?? undefined,
    email: (r.email as string) ?? undefined,
    verified: Boolean(r.verified),
    hasLiveAvailability: Boolean(r.has_live_availability),
  };
}

// Fetch published listings from Supabase, ordered so Featured > Premium > Basic > Community.
// If Supabase isn't configured yet (no env vars) or the table is empty, we fall
// back to the clearly-marked EXAMPLE listings so the site always renders.
export async function getListings(): Promise<{ listings: Listing[]; isExample: boolean }> {
  const supabase = getSupabase();
  if (!supabase) return { listings: exampleListings, isExample: true };

  const [{ data, error }, memberships] = await Promise.all([
    supabase.from(T.publicListings).select(COLUMNS).contains("sites", [SITE_ID]),
    getRouteMemberships(),
  ]);

  if (error || !data || data.length === 0) {
    return { listings: exampleListings, isExample: true };
  }

  const listings: Listing[] = data
    .map(mapRow)
    .map((l) => (memberships.has(l.slug) ? { ...l, routes: memberships.get(l.slug) } : l))
    .sort(
      (a, b) =>
        (tierRank[a.tier] ?? 9) - (tierRank[b.tier] ?? 9) ||
        Number(Boolean(b.verified)) - Number(Boolean(a.verified))
    );

  return { listings, isExample: false };
}

// Fetch a single published listing by slug, for the /listings/[slug] detail page.
// Falls back to matching the example set when Supabase isn't configured.
// "community" tier listings have no individual page by design — always returns
// null for them so the route 404s even if a slug is guessed.
export async function getListing(
  slug: string
): Promise<{ listing: Listing; isExample: boolean } | null> {
  const supabase = getSupabase();
  if (!supabase) {
    const listing = exampleListings.find((l) => l.slug === slug);
    if (!listing || listing.tier === "community") return null;
    return { listing, isExample: true };
  }

  const { data, error } = await supabase
    .from(T.publicListings)
    .select(COLUMNS)
    .contains("sites", [SITE_ID])
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    const listing = exampleListings.find((l) => l.slug === slug);
    if (!listing || listing.tier === "community") return null;
    return { listing, isExample: true };
  }

  const listing = mapRow(data);
  if (listing.tier === "community") return null;
  return { listing, isExample: false };
}

// Fetch a listing by slug for the /claim flow — unlike getListing(), this
// includes "community" tier rows (they have no page but are the ones most
// likely to need claiming) and does not require it to be a paid tier.
export async function getListingForClaim(
  slug: string
): Promise<{ listing: Listing; isExample: boolean } | null> {
  const supabase = getSupabase();
  if (!supabase) {
    const listing = exampleListings.find((l) => l.slug === slug);
    return listing ? { listing, isExample: true } : null;
  }

  const { data, error } = await supabase
    .from(T.publicListings)
    .select(COLUMNS)
    .contains("sites", [SITE_ID])
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    const listing = exampleListings.find((l) => l.slug === slug);
    return listing ? { listing, isExample: true } : null;
  }

  return { listing: mapRow(data), isExample: false };
}

// Slugs for generateStaticParams — combines example slugs with anything live in
// Supabase so both render at build time / on revalidation. Community-tier
// listings are excluded since they have no individual page.
export async function getAllListingSlugs(): Promise<string[]> {
  const { listings } = await getListings();
  return listings.filter((l) => l.tier !== "community").map((l) => l.slug);
}
