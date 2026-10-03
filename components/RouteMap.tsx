"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { stops, type Listing } from "@/lib/data";
import { pinnable } from "@/lib/mapLayers";
import MapKey, { type KeyGroup } from "./map/MapKey";
import { useListingAndServiceGroups } from "./map/useKeyGroups";

// Leaflet touches `window`, so the actual map is loaded client-only.
const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[520px] place-items-center rounded-xl2 border border-line bg-sand-2 text-ink-soft">
      Loading map…
    </div>
  ),
});

export default function RouteMap({ listings = [] }: { listings?: Listing[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [zoomedIn, setZoomedIn] = useState(false);
  const t = useTranslations("R22");
  const tk = useTranslations("MapKey");
  const pinned = useMemo(() => listings.filter(pinnable), [listings]);
  const base = useListingAndServiceGroups(pinned, zoomedIn);
  const groups: KeyGroup[] = [
    { id: "route", title: tk("route"), items: [{ key: "stops", label: tk("stops"), icon: "/route22-icon.png", count: stops.length }] },
    ...base,
  ];

  return (
    <section id="route" className="bg-sand-2 py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[720px]">
            <h2>{t("route.title")}</h2>
            <p className="text-ink-soft">
              {t("route.lead")}
            </p>
          </div>
        </div>

        <MapKey groups={groups} hidden={hidden} setHidden={setHidden} />

        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-[1.6fr_1fr]">
          <MapInner
            selected={selected}
            onSelect={setSelected}
            listings={pinned}
            hidden={hidden}
            onZoomState={setZoomedIn}
          />

          <aside className="flex max-h-none flex-col gap-2.5 overflow-y-auto pr-1 md:max-h-[520px]">
            {stops.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`rounded-xl border bg-paper p-3 text-left transition hover:border-clay hover:shadow-card ${
                  selected === s.id ? "border-clay shadow-card" : "border-line"
                }`}
              >
                <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-bush">
                  {t(`stops.${s.id}.kind`)}
                </span>
                <h4 className="my-0.5 text-[1.02rem]">{s.name}</h4>
                <p className="m-0 text-[0.88rem] text-ink-soft">{t(`stops.${s.id}.blurb`)}</p>
              </button>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
