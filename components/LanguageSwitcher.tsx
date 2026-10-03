"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname as useRawPathname } from "next/navigation";
import { isLocalizedPath } from "@/lib/i18nPaths";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_LABELS, SITE_LOCALES, type AppLocale } from "@/i18n/routing";

// Only on translated pages; hidden when the site has one language.
export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const raw = useRawPathname();
  const t = useTranslations("Nav");
  // Hidden on English-only pages (switching there would hit a missing /de/… URL).
  if (SITE_LOCALES.length < 2 || !isLocalizedPath(raw.replace(/^\/(de|nl|fr|it|af|zu)(?=\/|$)/, "") || "/")) return null;
  return (
    <label className="flex items-center">
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value as AppLocale })}
        className="max-w-[5.5rem] rounded-full border border-line bg-paper px-2.5 py-1 text-[0.8rem] font-semibold text-ink-soft sm:max-w-none"
      >
        {SITE_LOCALES.map((l) => (
          <option key={l} value={l}>{l.toUpperCase()} · {LOCALE_LABELS[l]}</option>
        ))}
      </select>
    </label>
  );
}
