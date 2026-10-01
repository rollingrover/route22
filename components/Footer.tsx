import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { IS_ZATOURS, ROUTE22_URL, ZATOURS_URL } from "@/lib/site";
import ZaLogo from "./ZaLogo";

export default function Footer() {
  const year = new Date().getFullYear();
  // Cross-link the sister site (only when its URL is known).
  const sister = IS_ZATOURS
    ? { href: ROUTE22_URL, label: "Route22 — Elephant Coast route" }
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
          <p className="mt-3.5 max-w-[40ch] text-[0.9rem]">{BRAND.footerBlurb}</p>
        </div>
        <div>
          <h4 className="font-sans text-[0.8rem] uppercase tracking-[1.5px] text-white">Explore</h4>
          {BRAND.footerExplore.map((l) => (
            <a key={l.href} href={l.href} className="mb-2 block text-[0.9rem] no-underline hover:text-clay">
              {l.label}
            </a>
          ))}
        </div>
        <div>
          <h4 className="font-sans text-[0.8rem] uppercase tracking-[1.5px] text-white">
            For business
          </h4>
          {[
            ["/list-your-business", "List your business"],
            ["/list-your-business#lead", "Plans & pricing"],
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
          © {year} {BRAND.fullName}, a trading line of OpDesk (Pty) Ltd ·{" "}
          <a href="/privacy" className="no-underline hover:text-clay">
            Privacy
          </a>
        </span>
        <span>{BRAND.regionLine}</span>
      </div>
    </footer>
  );
}
