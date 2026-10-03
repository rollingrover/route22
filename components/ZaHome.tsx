import Link from "next/link";
import { useTranslations } from "next-intl";
import ZaDirectory from "./ZaDirectory";
import ZaMap from "./ZaMap";
import PhotoStrip from "./PhotoStrip";
import PlanTripBand from "./PlanTripBand";
import { ListingCard } from "./ListingCard";
import { Listing } from "@/lib/data";
import { ROUTE22_URL } from "@/lib/site";
import { FOUNDING, formatZAR } from "@/lib/pricing";
import type { Prices } from "@/lib/prices";

// ZAtours home page — national directory. Shares data, cards and the lead
// pipeline with Route22; only the framing and palette differ.
export default function ZaHome({ listings, isExample, prices }: { listings: Listing[]; isExample: boolean; prices: Prices }) {
  const t = useTranslations("Home");
  const real = isExample ? [] : listings;
  const featured = listings.filter((l) => l.tier === "featured" || l.tier === "premium").slice(0, 6);
  const provinces = new Set(real.map((l) => l.province).filter(Boolean)).size;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-bush-dk text-white">
        {/* Own photography: dawn over the Hluhluwe coastal plain, behind the framed photo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/zatours-dawn-bg.webp" alt="" fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_70%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(90deg, rgba(20,28,48,0.82) 0%, rgba(20,28,48,0.5) 48%, rgba(20,28,48,0.1) 100%)" }} />
        <div className="relative mx-auto grid max-w-[1120px] items-center gap-10 px-5 pb-16 pt-16 md:pb-24 md:pt-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
          <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[3px] text-gold">
            {t("eyebrow")}
          </p>
          <h1 className="mb-4 max-w-[19ch] text-[clamp(2.2rem,6vw,3.8rem)] text-white">
            {t("title")}
          </h1>
          <p className="max-w-[56ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/85">
            {t("lead")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#directory"
              className="rounded-full bg-gold px-6 py-3 font-semibold text-ink no-underline hover:brightness-95"
            >
              {t("browseCta")}
            </a>
            <a
              href={ROUTE22_URL}
              className="rounded-full border-2 border-white/60 px-6 py-3 font-semibold text-white no-underline hover:border-white"
            >
              {t("planRoute")}
            </a>
          </div>
          {real.length > 0 && (
            <p className="mt-8 text-[0.85rem] text-white/75">
              {t("count", { count: real.length })}
              {provinces > 1 ? t("acrossProvinces", { count: provinces }) : ""}
            </p>
          )}
          </div>
          {/* Own photography: elephant crossing in front of the game vehicle at sunrise. */}
          <figure className="relative m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/zatours-desktop.webp"
              alt={t("photoAlt")}
              width={1080}
              height={810}
              fetchPriority="high"
              className="w-full -rotate-1 rounded-2xl border-4 border-white/90 object-cover shadow-2xl"
            />
          </figure>
        </div>
      </section>

      {featured.length > 0 && (
        <section id="featured" className="scroll-mt-20 border-b border-line bg-paper py-14">
          <div className="mx-auto max-w-[1120px] px-5">
            <h2 className="mb-1">{t("featuredTitle")}</h2>
            <p className="mb-7 text-ink-soft">
              {t.rich("featuredLead", {
                badge: (chunks) => (
                  <span className="rounded-full bg-ocean px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-white">
                    {chunks}
                  </span>
                ),
              })}
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
              {featured.map((l) => (
                <ListingCard key={l.id} l={l} showProvince />
              ))}
            </div>
          </div>
        </section>
      )}

      <PhotoStrip />

      <ZaMap listings={real} route22Url={ROUTE22_URL} />

      <ZaDirectory listings={listings} isExample={isExample} />

      <PlanTripBand />

      <section className="bg-sand-2 py-14">
        <div className="mx-auto grid max-w-[1120px] items-center gap-8 px-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[2px] text-clay">
              {t("r22Eyebrow")}
            </p>
            <h2 className="mb-2">{t("r22Title")}</h2>
            <p className="m-0 text-ink-soft">{t("r22Body")}</p>
          </div>
          <div className="md:text-right">
            <a
              href={ROUTE22_URL}
              className="inline-block rounded-full bg-bush px-6 py-3 font-semibold text-white no-underline hover:bg-bush-dk"
            >
              {t("r22Cta")}
            </a>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-5 rounded-xl2 border border-line bg-paper px-6 py-8 shadow-card md:flex-row md:items-center md:justify-between md:px-10">
          <div className="max-w-[60ch]">
            <h2 className="mb-1 text-[1.4rem]">{t("bizTitle")}</h2>
            <p className="m-0 text-ink-soft">
              {t("bizBody", { price: formatZAR(prices.premium) })}
              {prices.founding ? ` ${t("bizFounding", { years: FOUNDING.lockYears, deadline: FOUNDING.deadlineLabel })}` : ""}
            </p>
          </div>
          <Link
            href="/list-your-business"
            className="shrink-0 rounded-full border-2 border-bush px-6 py-3 text-center font-semibold text-bush no-underline hover:bg-bush hover:text-white"
          >
            {t("bizCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
