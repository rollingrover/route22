import { absoluteUrl } from "./site";
import { SITE_LOCALES } from "@/i18n/routing";

// Canonical + complete reciprocal hreflang set for a translated path.
// English has no prefix; others are /de, /nl, /fr, /it.
export function localePath(path: string, locale: string): string {
  const p = path === "/" ? "" : path;
  return locale === "en" ? path : `/${locale}${p}`;
}
export function localeAlternates(path: string, locale: string, canonicalOverride?: string) {
  const languages: Record<string, string> = {};
  for (const l of SITE_LOCALES) languages[l === "en" ? "en" : l] = absoluteUrl(localePath(path, l));
  if (SITE_LOCALES.length > 1) languages["x-default"] = absoluteUrl(localePath(path, "en"));
  return {
    canonical: canonicalOverride ?? absoluteUrl(localePath(path, locale)),
    ...(SITE_LOCALES.length > 1 ? { languages } : {}),
  };
}
