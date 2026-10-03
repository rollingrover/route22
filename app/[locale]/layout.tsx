import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import CurrencyProvider from "@/components/CurrencyProvider";
import { routing } from "@/i18n/routing";
import { SITE_ID } from "@/lib/site";
import { rootMetadata, rootViewport } from "@/lib/rootMetadata";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Root layout for TRANSLATED pages (/, /de, /nl/listings/…, /fr/routes/…).
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const { locale } = params;
  if (!(routing.locales as string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale === "en" ? "en-ZA" : locale} data-site={SITE_ID}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CurrencyProvider>{children}</CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
