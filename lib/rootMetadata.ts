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
  openGraph: { title: BRAND.ogTitle, description: BRAND.ogDescription, siteName: BRAND.fullName, locale: "en_ZA", type: "website" },
  twitter: { card: "summary_large_image", title: BRAND.ogTitle, description: BRAND.ogDescription },
};

export const rootViewport: Viewport = { themeColor: BRAND.themeColor };
