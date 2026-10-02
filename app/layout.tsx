import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_ID, SITE_URL } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import CurrencyProvider from "@/components/CurrencyProvider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: BRAND.title,
  description: BRAND.description,
  keywords: BRAND.keywords,
  applicationName: BRAND.name,
  icons: { icon: BRAND.icon, ...(BRAND.appleIcon ? { apple: BRAND.appleIcon } : {}) },
  openGraph: {
    title: BRAND.ogTitle,
    description: BRAND.ogDescription,
    siteName: BRAND.fullName,
    locale: "en_ZA",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: BRAND.ogTitle, description: BRAND.ogDescription },
};

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" data-site={SITE_ID}>
      <body>
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
