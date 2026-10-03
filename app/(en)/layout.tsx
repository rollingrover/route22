import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import CurrencyProvider from "@/components/CurrencyProvider";
import messages from "@/messages/en.json";
import { SITE_ID } from "@/lib/site";
import { rootMetadata, rootViewport } from "@/lib/rootMetadata";

export const metadata = rootMetadata;
export const viewport = rootViewport;

// Root layout for English-only pages: business-facing pages (pricing, claim,
// edit), legal (privacy), Route22 long-form content and admin. Shared
// client components (Header/Footer) still read translations, in English.
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" data-site={SITE_ID}>
      <body>
        <NextIntlClientProvider locale="en" messages={messages}>
          <CurrencyProvider>{children}</CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
