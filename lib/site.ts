// Route22 — site-wide URL helper.
// Used to build absolute canonical URLs for OpenGraph metadata and social
// sharing, so shared links always point back to this site.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.route22zululand.co.za").replace(
  /\/+$/,
  ""
);

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export { SITE_URL };

// Which directory front end this deployment is. Both sites read the same
// dir_* tables; this decides which listings show (dir_listings.sites) and
// how enquiries/leads are tagged. Set NEXT_PUBLIC_SITE_ID per deployment.
export type SiteId = "route22" | "zatours";
export const SITE_ID: SiteId = process.env.NEXT_PUBLIC_SITE_ID === "zatours" ? "zatours" : "route22";
