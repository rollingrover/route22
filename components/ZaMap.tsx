"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Listing } from "@/lib/data";
import { places } from "@/lib/places";
import { pinnable } from "@/lib/mapLayers";
import MapKey, { type KeyGroup } from "./map/MapKey";
import { useListingAndServiceGroups } from "./map/useKeyGroups";

const ZaMapInner = dynamic(() => import("./ZaMapInner"), {
  ssr: false,
  loading: () => <div className="grid h-[440px] place-items-center rounded-xl2 border border-line bg-sand-2 text-ink-soft md:h-[600px]">…</div>,
});

// "Explore" map with a grouped key: places to stay (by type), things to do,
// parks & heritage, and services (shown when zoomed in). Pins cluster.
export default function ZaMap({ listings, route22Url }: { listings: Listing[]; route22Url: string }) {
  const t = useTranslations("Map");
  const tk = useTranslations("MapKey");
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [zoomedIn, setZoomedIn] = useState(false);
  const pinned = useMemo(() => listings.filter(pinnable), [listings]);
  const base = useListingAndServiceGroups(pinned, zoomedIn);
  const parks = places.filter((p) => p.type !== "heritage_site").length;
  const groups: KeyGroup[] = [
    base[0],
    base[1],
    { id: "parks", title: tk("parks"), items: [
      { key: "parks", label: t("parks"), icon: "/za/marker-park.svg", count: parks },
      { key: "heritage", label: t("heritage"), icon: "/za/marker-heritage.svg", count: places.length - parks },
      { key: "route22", label: "Route22", icon: "/route22-icon.png" },
    ] },
    base[2],
  ];

  return (
    <section id="map" className="scroll-mt-20 border-b border-line bg-paper py-14">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-4 max-w-[680px]">
          <h2 className="mb-1">{t("title")}</h2>
          <p className="m-0 text-ink-soft">{t("lead")}</p>
        </div>
        <MapKey groups={groups} hidden={hidden} setHidden={setHidden} />
        <ZaMapInner listings={pinned} hidden={hidden} route22Url={route22Url} onZoomState={setZoomedIn} />
        <p className="mb-0 mt-3 text-[0.8rem] text-ink-soft">
          {t("note")}{" "}
          <a href="/list-your-business" className="font-semibold text-clay">{t("pinCta")}</a>
        </p>
      </div>
    </section>
  );
}
