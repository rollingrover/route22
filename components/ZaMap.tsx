"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Listing } from "@/lib/data";
import { places } from "@/lib/places";
import type { MapLayers } from "./ZaMapInner";

const ZaMapInner = dynamic(() => import("./ZaMapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center rounded-xl2 border border-line bg-sand-2 text-ink-soft md:h-[560px]">
      Loading map…
    </div>
  ),
});

// "Explore South Africa": national parks, reserves and World Heritage Sites,
// plus business pins. Pins are a paid perk — only Premium / Featured listings
// with a location appear (free listings never show on the map).
export default function ZaMap({ listings, route22Url }: { listings: Listing[]; route22Url: string }) {
  const t = useTranslations("Map");
  const [layers, setLayers] = useState<MapLayers>({ parks: true, heritage: true, businesses: true });
  const pinned = listings.filter(
    (l) => (l.tier === "premium" || l.tier === "featured") && typeof l.lat === "number" && typeof l.lng === "number"
  );
  const parks = places.filter((p) => p.type !== "heritage_site").length;
  const heritage = places.length - parks;

  const toggle = (k: keyof MapLayers, label: string, count: number, icon: string) => (
    <label
      className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[0.85rem] font-medium ${
        layers[k] ? "border-bush bg-paper text-ink" : "border-line bg-sand text-ink-soft"
      }`}
    >
      <input
        type="checkbox"
        checked={layers[k]}
        onChange={(e) => setLayers((s) => ({ ...s, [k]: e.target.checked }))}
        className="sr-only"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={20} height={20} className={`h-5 w-5 ${layers[k] ? "" : "opacity-40 grayscale"}`} />
      {label} <span className="text-ink-soft">({count})</span>
    </label>
  );

  return (
    <section id="map" className="scroll-mt-20 border-b border-line bg-paper py-14">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[640px]">
            <h2 className="mb-1">{t("title")}</h2>
            <p className="m-0 text-ink-soft">{t("lead")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {toggle("parks", t("parks"), parks, "/za/marker-park.svg")}
            {toggle("heritage", t("heritage"), heritage, "/za/marker-heritage.svg")}
            {toggle("businesses", t("businesses"), pinned.length, "/za/mark.svg")}
          </div>
        </div>
        <ZaMapInner listings={pinned} layers={layers} route22Url={route22Url} />
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
