"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { categoryLabel, type Category, type Listing } from "@/lib/data";
import { places } from "@/lib/places";
import { ZA_CATEGORY_ICON } from "@/lib/za-assets";

const ZaMapInner = dynamic(() => import("./ZaMapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center rounded-xl2 border border-line bg-sand-2 text-ink-soft md:h-[560px]">…</div>
  ),
});

// "Explore" map: parks, reserves and World Heritage Sites, plus business pins
// split by category (each with its own icon and toggle). Pins are a paid perk —
// only Premium / Featured listings with a location appear.
export default function ZaMap({ listings, route22Url }: { listings: Listing[]; route22Url: string }) {
  const t = useTranslations("Map");
  const tc = useTranslations("Categories");
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const pinned = useMemo(
    () => listings.filter((l) => (l.tier === "premium" || l.tier === "featured") && typeof l.lat === "number" && typeof l.lng === "number"),
    [listings]
  );
  // Categories that actually have pins, with counts (a business counts in each of its categories).
  const cats = useMemo(() => {
    const counts = new Map<Category, number>();
    pinned.forEach((l) => (l.categories?.length ? l.categories : [l.category]).forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)));
    return (Object.keys(categoryLabel) as Category[]).filter((c) => counts.has(c)).map((c) => ({ c, n: counts.get(c)! }));
  }, [pinned]);
  const parks = places.filter((p) => p.type !== "heritage_site").length;
  const heritage = places.length - parks;

  const toggle = (key: string) =>
    setHidden((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });

  const chip = (key: string, label: string, count: number, icon: string) => {
    const on = !hidden.has(key);
    return (
      <button
        key={key}
        type="button"
        onClick={() => toggle(key)}
        aria-pressed={on}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.85rem] font-medium ${
          on ? "border-bush bg-paper text-ink" : "border-line bg-sand text-ink-soft"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" width={20} height={20} className={`h-5 w-5 ${on ? "" : "opacity-40 grayscale"}`} />
        {label} <span className="text-ink-soft">({count})</span>
      </button>
    );
  };

  return (
    <section id="map" className="scroll-mt-20 border-b border-line bg-paper py-14">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-4 max-w-[680px]">
          <h2 className="mb-1">{t("title")}</h2>
          <p className="m-0 text-ink-soft">{t("lead")}</p>
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {chip("parks", t("parks"), parks, "/za/marker-park.svg")}
          {chip("heritage", t("heritage"), heritage, "/za/marker-heritage.svg")}
        </div>
        {cats.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[0.75rem] font-bold uppercase tracking-wide text-ink-soft">{t("businesses")}:</span>
            {cats.map(({ c, n }) => chip(c, tc(c), n, ZA_CATEGORY_ICON[c] ?? "/za/mark.svg"))}
          </div>
        )}
        <ZaMapInner listings={pinned} hidden={hidden} route22Url={route22Url} />
        <p className="mb-0 mt-3 text-[0.8rem] text-ink-soft">
          {t("note")}{" "}
          <a href="/list-your-business" className="font-semibold text-clay">
            {t("pinCta")}
          </a>
        </p>
      </div>
    </section>
  );
}
