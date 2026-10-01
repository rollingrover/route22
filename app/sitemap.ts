import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { parks } from "@/lib/parks";
import { industryPosts } from "@/lib/industry";
import { getAllListingSlugs } from "@/lib/listings";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllOpportunitySlugs } from "@/lib/opportunities";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listingSlugs, guideSlugs, opportunitySlugs] = await Promise.all([
    getAllListingSlugs(),
    getAllGuideSlugs(),
    getAllOpportunitySlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/guides`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/industry`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/opportunities`, changeFrequency: "daily", priority: 0.8 },
  ];

  const parkRoutes: MetadataRoute.Sitemap = parks.map((p) => ({
    url: `${SITE_URL}/parks/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industryPosts.map((p) => ({
    url: `${SITE_URL}/industry/${p.slug}`,
    lastModified: p.publishedDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listingSlugs.map((slug) => ({
    url: `${SITE_URL}/listings/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${SITE_URL}/guides/${slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const opportunityRoutes: MetadataRoute.Sitemap = opportunitySlugs.map((slug) => ({
    url: `${SITE_URL}/opportunities/${slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...parkRoutes,
    ...industryRoutes,
    ...listingRoutes,
    ...guideRoutes,
    ...opportunityRoutes,
  ];
}
