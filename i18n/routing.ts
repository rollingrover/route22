import { defineRouting } from "next-intl/routing";
import { SITE_ID } from "@/lib/site";

// Traveller languages. ZAtours launches with all five; Route22 stays
// English-only until its long-form home-page content is translated.
// Next wave (ready to add: translation file + entry here): zh, hi, ru.
export const ALL_LOCALES = ["en", "de", "nl", "fr", "it"] as const;
export type AppLocale = (typeof ALL_LOCALES)[number];
export const SITE_LOCALES: readonly AppLocale[] = SITE_ID === "zatours" ? ALL_LOCALES : ["en"];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  de: "Deutsch",
  nl: "Nederlands",
  fr: "Français",
  it: "Italiano",
};

export const routing = defineRouting({
  locales: SITE_LOCALES as unknown as AppLocale[],
  defaultLocale: "en",
  // English keeps its existing, already-indexed URLs (no /en prefix).
  localePrefix: "as-needed",
  // Visitors choose their language; never auto-redirect by browser language.
  localeDetection: false,
});
