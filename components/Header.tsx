"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { isLocalizedPath } from "@/lib/i18nPaths";
import { BRAND } from "@/lib/brand";
import { IS_ZATOURS } from "@/lib/site";
import ZaLogo from "./ZaLogo";
import { CurrencySwitcher } from "./CurrencyProvider";

export default function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Nav");
  const label = (l: { label: string; key?: string }) => (l.key ? t(l.key) : l.label);

  return (
    <header className="sticky top-0 z-[1000] flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-5 py-2 backdrop-blur">
      <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
        {IS_ZATOURS ? (
          <span className="py-1">
            <ZaLogo />
          </span>
        ) : (
          <>
            <Image
              src="/logo-mark.png"
              alt={BRAND.logoAlt}
              width={543}
              height={329}
              priority
              className="h-11 w-auto"
            />
            <span className="hidden flex-col leading-none sm:flex">
              <strong className="whitespace-nowrap font-serif text-lg text-ink">ROUTE 22</strong>
              <em className="text-[0.68rem] uppercase not-italic tracking-[2px] text-bush">
                Elephant Coast
              </em>
            </span>
          </>
        )}
      </Link>

      {/* Both sites collapse to the menu below 1360px: nav links + language +
          currency selectors don’t fit narrower (German labels are long).
          ZAtours (3 links) only below md. Class strings are static so
          Tailwind keeps them. */}
      <nav
        className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-[60px] flex-col gap-4 border-b border-line bg-paper px-5 py-4 ${
          IS_ZATOURS
            ? "min-[1360px]:static min-[1360px]:flex min-[1360px]:flex-row min-[1360px]:items-center min-[1360px]:gap-5 min-[1360px]:border-0 min-[1360px]:bg-transparent min-[1360px]:p-0"
            : "min-[1360px]:static min-[1360px]:flex min-[1360px]:flex-row min-[1360px]:items-center min-[1360px]:gap-4 min-[1360px]:border-0 min-[1360px]:bg-transparent min-[1360px]:p-0"
        }`}
      >
        {BRAND.nav.map((l) =>
          l.external || !isLocalizedPath(l.href.split("#")[0] || "/") ? (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-[0.9rem] font-medium text-ink-soft no-underline hover:text-clay"
            >
              {label(l)}
            </a>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="whitespace-nowrap text-[0.9rem] font-medium text-ink-soft no-underline hover:text-clay"
            >
              {label(l)}
            </Link>
          )
        )}
        <CurrencySwitcher className="sm:hidden" />
        {/* English-only business page: plain link, never locale-prefixed. */}
        <NextLink
          href="/list-your-business"
          onClick={() => setOpen(false)}
          className={
            IS_ZATOURS
              ? "whitespace-nowrap rounded-full border-2 border-bush px-4 py-1.5 text-[0.9rem] font-semibold text-bush no-underline hover:bg-bush hover:text-white"
              : "whitespace-nowrap rounded-full bg-bush px-4 py-2 font-semibold text-white no-underline hover:bg-bush-dk"
          }
        >
          {t("listBusiness")}
        </NextLink>
      </nav>

      {/* Language + currency stay visible at every width (outside the
          collapsible menu), so visitors can always find them. */}
      <div className="ml-auto flex items-center gap-2 min-[1360px]:ml-0">
        <LanguageSwitcher />
        <CurrencySwitcher className="hidden sm:flex" />
      </div>

      <button
        className={`cursor-pointer border-0 bg-transparent text-2xl text-ink min-[1360px]:hidden`}
        aria-label={t("menu")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
    </header>
  );
}
