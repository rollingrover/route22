"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { categoryHue, categoryLabels, isFreeTier, Listing, partnerBadge, type Category } from "@/lib/data";
import OwnerLink from "./OwnerLink";
import { IS_ZATOURS } from "@/lib/site";
import { ZA_CATEGORY_ICON } from "@/lib/za-assets";

// Card for listings that have their own page (basic / premium / featured).
// Free (basic) cards get a quiet owner link under the card body — outside the
// card's own <Link>, since anchors can't nest.
function useCardText() {
  const t = useTranslations("Card");
  const locale = useLocale();
  const countryName = (code?: string) => {
    if (!code || code === "ZA") return null;
    try { return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code; } catch { return code; }
  };
  const tc = useTranslations("Categories");
  const tk = useTranslations("MapKey");
  const badge = (b: string | null) =>
    b === "Verified & bookable" ? t("verified") : b === "Live availability" ? t("liveAvailability") : b;
  // "Opening December 2026" — month + year in the visitor's language.
  const opening = (iso?: string) => {
    if (!iso || new Date(iso) <= new Date()) return null;
    const date = new Date(iso).toLocaleDateString(locale, { month: "long", year: "numeric" });
    return t("opening", { date });
  };
  // Stays show their type ("Campsite", "Lodge") instead of the generic "Stay".
  const catFor = (l: Listing) => (c: Category) => (c === "stay" && l.subtype ? tk(`sub_${l.subtype}`) : tc(c));
  return { t, cat: (c: Category) => tc(c), catFor, badge, countryName, opening };
}

export function ListingCard({ l, showProvince = false }: { l: Listing; showProvince?: boolean }) {
  const { t, catFor, badge, countryName, opening } = useCardText();
  const cat = catFor(l);
  const place =
    showProvince && l.province && l.province !== l.location
      ? `${l.location} · ${l.province}`
      : l.location;
  const placeLine = [place, countryName(l.country)].filter(Boolean).join(" · ");
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl2 bg-paper shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
        l.tier === "featured"
          ? "border-2 border-clay"
          : l.tier === "premium"
            ? "border border-clay"
            : "border border-line"
      }`}
    >
      <Link href={`/listings/${l.slug}`} className="flex flex-1 flex-col no-underline">
        <div
          className={`relative h-[140px] bg-gradient-to-br ${
            IS_ZATOURS && !l.photoUrl ? "from-sand-2 to-[#e9dcc6]" : categoryHue[l.category]
          }`}
          style={
            l.photoUrl
              ? { backgroundImage: `url(${l.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          {IS_ZATOURS && !l.photoUrl && ZA_CATEGORY_ICON[l.category] && (
            // No photo yet: show the category artwork instead of a bare gradient.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ZA_CATEGORY_ICON[l.category]}
              alt=""
              width={96}
              height={96}
              loading="lazy"
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
            />
          )}
          {l.tier !== "basic" && (
            <span
              className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white ${
                l.tier === "featured" ? "bg-bush" : "bg-clay"
              }`}
            >
              {l.tier === "featured" ? t("featured") : t("premium")}
            </span>
          )}
          {opening(l.opensOn) && (
            <span className="absolute bottom-2.5 left-2.5 rounded-full bg-gold px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-ink">
              {opening(l.opensOn)}
            </span>
          )}
          {(l.claimed || partnerBadge(l)) && (
            <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1">
              {partnerBadge(l) && (
                <span className="rounded-full bg-ocean px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white backdrop-blur">
                  {badge(partnerBadge(l))}
                </span>
              )}
              {l.claimed && (
                <span className="rounded-full bg-black/35 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white backdrop-blur">
                  {t("claimed")}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ocean">
            {categoryLabels(l, 2, cat)}
          </span>
          <h3 className="m-0 text-[1.1rem] text-ink group-hover:text-clay">{l.name}</h3>
          <span className="text-[0.82rem] text-ink-soft">{placeLine}</span>
          <p className="m-0 text-[0.88rem] text-ink-soft">{l.desc}</p>
          <span
            className={`mt-auto pt-2.5 text-[0.85rem] font-semibold ${
              l.tier === "basic" ? "text-ink-soft" : "text-clay"
            }`}
          >
            {l.tier === "basic" ? t("viewDetails") : t("viewEnquire")}
          </span>
        </div>
      </Link>
      {isFreeTier(l.tier) && (
        <div className="border-t border-line px-4 py-2">
          <OwnerLink slug={l.slug} claimed={l.claimed} />
        </div>
      )}
    </div>
  );
}

// Free "community" entry — no page of its own.
export function CommunityCard({ l, showProvince = false }: { l: Listing; showProvince?: boolean }) {
  const { catFor, countryName } = useCardText();
  const cat = catFor(l);
  const place =
    showProvince && l.province && l.province !== l.location
      ? `${l.location} · ${l.province}`
      : l.location;
  const placeLine = [place, countryName(l.country)].filter(Boolean).join(" · ");
  return (
    <div className="flex flex-col overflow-hidden rounded-xl2 border border-dashed border-line bg-sand">
      <div
        className={`h-[80px] bg-gradient-to-br ${categoryHue[l.category]} opacity-80`}
        style={
          l.photoUrl
            ? { backgroundImage: `url(${l.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 1 }
            : undefined
        }
      />
      <div className="flex flex-col gap-1 p-3.5">
        <span className="text-[0.68rem] font-bold uppercase tracking-wide text-ink-soft">
          {categoryLabels(l, 2, cat)}
        </span>
        <h4 className="m-0 text-[0.95rem] text-ink">{l.name}</h4>
        <span className="text-[0.78rem] text-ink-soft">{placeLine}</span>
        <OwnerLink slug={l.slug} claimed={l.claimed} className="mt-1.5" />
      </div>
    </div>
  );
}
