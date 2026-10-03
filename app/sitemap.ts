import type { MetadataRoute } from "next";
import { SITE_URL, IS_ZATOURS, canonicalListingUrl } from "@/lib/site";
import { parks } from "@/lib/parks";
import { industryPosts } from "@/lib/industry";
import { getListings } from "@/lib/listings";
import { getRoutes } from "@/lib/routes";
import { SITE_LOCALES } from "@/i18n/routing";
import { localePath } from "@/lib/alternates";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllOpportunitySlugs } from "@/lib/opportunities";

export const revalidate = 300;

// Translated pages: one entry per language, each listing every language
// version as an alternate (reciprocal hreflang, as on ethlathini.co.za).
function localized(path: string, changeFrequency: "daily" | "weekly" | "monthly", priority: number): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(SITE_LOCALES.map((l) => [l, `${SITE_URL}${localePath(path, l)}`]));
  return SITE_LOCALES.map((l) => ({
    url: `${SITE_URL}${localePath(path, l)}`,
    changeFrequency,
    priority: l === "en" ? priority : Math.max(0.3, priority - 0.1),
    ...(SITE_LOCALES.length > 1 ? { alternates: { languages } } : {}),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { listings, isExample } = await getListings();

  // Only real listings with their own page, and only where THIS site is the
  // canonical home (Route22 drops listings canonicalised to ZAtours).
  const listingRoutes: MetadataRoute.Sitemap = isExample
    ? []
    : listings
        .filter((l) => l.tier !== "community")
        .filter((l) => canonicalListingUrl(l) === `${SITE_URL}/listings/${l.slug}`)
        .flatMap((l) => localized(`/listings/${l.slug}`, "weekly", 0.7));

  const routes = await getRoutes();
  const common: MetadataRoute.Sitemap = [
    ...localized("/", "weekly", 1),
    ...localized("/routes", "weekly", 0.7),
    ...localized("/plan", "monthly", 0.6),
    ...routes.flatMap((r) => localized(`/routes/${r.slug}`, "weekly", 0.7)),
    { url: `${SITE_URL}/list-your-business`, changeFrequency: "monthly", priority: 0.5 },
  ];

  if (IS_ZATOURS) return [...common, ...listingRoutes];

  const [guideSlugs, opportunitySlugs] = await Promise.all([
    getAllGuideSlugs(),
    getAllOpportunitySlugs(),
  ]);

  return [
    ...common,
    { url: `${SITE_URL}/guides`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/industry`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/opportunities`, changeFrequency: "daily", priority: 0.8 },
    ...parks.map((p) => ({
      url: `${SITE_URL}/parks/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...industryPosts.map((p) => ({
      url: `${SITE_URL}/industry/${p.slug}`,
      lastModified: p.publishedDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...listingRoutes,
    ...guideSlugs.map((slug) => ({
      url: `${SITE_URL}/guides/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...opportunitySlugs.map((slug) => ({
      url: `${SITE_URL}/opportunities/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
