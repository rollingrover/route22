import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import { BRAND } from "@/lib/brand";

// Shared by both root layouts ([locale] and (en)).
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BRAND.title,
  description: BRAND.description,
  keywords: BRAND.keywords,
  applicationName: BRAND.name,
  icons: { icon: BRAND.icon, ...(BRAND.appleIcon ? { apple: BRAND.appleIcon } : {}) },
  // One shared social image for all languages (route handler, never locale-prefixed).
  openGraph: { title: BRAND.ogTitle, description: BRAND.ogDescription, siteName: BRAND.fullName, locale: "en_ZA", type: "website", images: [{ url: "/api/og", width: 1200, height: 630, alt: BRAND.ogTitle }] },
  twitter: { card: "summary_large_image", title: BRAND.ogTitle, description: BRAND.ogDescription, images: ["/api/og"] },
};

export const rootViewport: Viewport = { themeColor: BRAND.themeColor };
