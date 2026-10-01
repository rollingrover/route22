// Site identity + URL helpers. One codebase, two Vercel projects:
//   Route22  — NEXT_PUBLIC_SITE_ID=route22 (default), R22 corridor / Zululand
//   ZAtours  — NEXT_PUBLIC_SITE_ID=zatours, national directory, canonical home
//              for listings
// Both read the same dir_* tables; dir_listings.sites decides who shows what.
import { notFound } from "next/navigation";

export type SiteId = "route22" | "zatours";
export const SITE_ID: SiteId = process.env.NEXT_PUBLIC_SITE_ID === "zatours" ? "zatours" : "route22";
export const IS_ZATOURS = SITE_ID === "zatours";

const DEFAULT_URL: Record<SiteId, string> = {
  route22: "https://www.route22zululand.co.za",
  zatours: "https://www.zatours.co.za",
};

const clean = (u: string) => u.replace(/\/+$/, "");

// This deployment's own origin (canonical URLs, OG, sitemap, emails).
const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_URL[SITE_ID]);

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export { SITE_URL };

// The OTHER site's origin, for cross-links and cross-domain canonicals.
// Deliberately NO default for ZAtours: until NEXT_PUBLIC_ZATOURS_URL is set on
// the Route22 project, Route22 keeps self-canonicals (a canonical pointing at
// a domain that isn't live yet would de-index Route22 for nothing).
export const ZATOURS_URL: string | null = IS_ZATOURS
  ? SITE_URL
  : process.env.NEXT_PUBLIC_ZATOURS_URL
    ? clean(process.env.NEXT_PUBLIC_ZATOURS_URL)
    : null;

export const ROUTE22_URL: string = IS_ZATOURS
  ? clean(process.env.NEXT_PUBLIC_ROUTE22_URL || DEFAULT_URL.route22)
  : SITE_URL;

// ZAtours is the canonical home for listings. A Route22 listing page points
// its canonical at ZAtours when the same listing has a page there too.
export function canonicalListingUrl(listing: { slug: string; sites?: string[] }): string {
  const own = absoluteUrl(`/listings/${listing.slug}`);
  if (IS_ZATOURS || !ZATOURS_URL) return own;
  return listing.sites?.includes("zatours") ? `${ZATOURS_URL}/listings/${listing.slug}` : own;
}

// Route22-only content (parks, industry info, guides, opportunities) 404s on
// ZAtours rather than shipping KZN-corridor pages under a national brand.
export function route22Only(): void {
  if (IS_ZATOURS) notFound();
}
