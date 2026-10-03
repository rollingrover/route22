import { defineRouting } from "next-intl/routing";
import { SITE_ID } from "@/lib/site";

// ZAtours (national, international travellers): en, de, nl, fr, it.
// Route22 (local Elephant Coast route): the same five plus Afrikaans and
// isiZulu for South African travellers.
// Next wave (ready to add: translation file + entry here): zh, hi, ru.
export const ALL_LOCALES = ["en", "de", "nl", "fr", "it", "af", "zu"] as const;
export type AppLocale = (typeof ALL_LOCALES)[number];
const TRAVELLER: readonly AppLocale[] = ["en", "de", "nl", "fr", "it"];
export const SITE_LOCALES: readonly AppLocale[] = SITE_ID === "zatours" ? TRAVELLER : ALL_LOCALES;

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  de: "Deutsch",
  nl: "Nederlands",
  fr: "Français",
  it: "Italiano",
  af: "Afrikaans",
  zu: "isiZulu",
};

export const routing = defineRouting({
  locales: SITE_LOCALES as unknown as AppLocale[],
  defaultLocale: "en",
  // English keeps its existing, already-indexed URLs (no /en prefix).
  localePrefix: "as-needed",
  // Visitors choose their language; never auto-redirect by browser language.
  localeDetection: false,
});
