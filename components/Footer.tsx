"use client";

import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { IS_ZATOURS, ZATOURS_URL } from "@/lib/site";
import ZaLogo from "./ZaLogo";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isLocalizedPath } from "@/lib/i18nPaths";

export default function Footer() {
  const year = new Date().getFullYear();
  const t = useTranslations("Footer");
  const tn = useTranslations("Nav");
  const label = (l: { label: string; key?: string }) =>
    !l.key ? l.label : l.key === "browse" || l.key === "plan" || l.key.startsWith("r22") ? tn(l.key) : t(l.key);
  // Cross-link the sister site (only when its URL is known).
  // (ZAtours already links Route22 under "Explore".)
  const sister = IS_ZATOURS
    ? null
    : ZATOURS_URL
      ? { href: ZATOURS_URL, label: "ZAtours — South Africa directory" }
      : null;

  return (
    <footer className="bg-foot pb-6 pt-12 text-foot-text">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-[30px] px-5 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          {IS_ZATOURS ? (
            <ZaLogo inverted />
          ) : (
            <Image
              src="/logo-mark.png"
              alt={BRAND.logoAlt}
              width={543}
              height={329}
              className="h-14 w-auto brightness-0 invert"
            />
          )}
          <p className="mt-3.5 max-w-[40ch] text-[0.9rem]">{IS_ZATOURS ? t("blurbZatours") : t("r22Blurb")}</p>
        </div>
        <div>
          <h4 className="font-sans text-[0.8rem] uppercase tracking-[1.5px] text-white">{t("explore")}</h4>
          {BRAND.footerExplore.map((l) => (
            l.external || !isLocalizedPath(l.href.split("#")[0] || "/") ? (
              <a key={l.href} href={l.href} className="mb-2 block text-[0.9rem] no-underline hover:text-clay">
                {label(l)}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="mb-2 block text-[0.9rem] no-underline hover:text-clay">
                {label(l)}
              </Link>
            )
          ))}
        </div>
        <div>
          <h4 className="font-sans text-[0.8rem] uppercase tracking-[1.5px] text-white">
            {t("forBusiness")}
          </h4>
          {[
            ["/list-your-business", tn("listBusiness")],
            ["/list-your-business#lead", t("plans")],
          ].map(([href, label]) => (
            <a key={label} href={href} className="mb-2 block text-[0.9rem] no-underline hover:text-clay">
              {label}
            </a>
          ))}
          {sister && (
            <a href={sister.href} className="mb-2 block text-[0.9rem] no-underline hover:text-clay">
              {sister.label}
            </a>
          )}
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap justify-between gap-2.5 border-t border-foot-line px-5 pt-5 text-[0.8rem]">
        <span>
          © {year} {t("tradingLine", { brand: BRAND.fullName })} ·{" "}
          <a href="/privacy" className="no-underline hover:text-clay">
            {t("privacy")}
          </a>
        </span>
        <span>{IS_ZATOURS ? t("regionLine") : t("r22Region")}</span>
      </div>
    </footer>
  );
}
