"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { categoryLabel, type Category, type Listing } from "@/lib/data";
import { SERVICE_TYPES, STAY_SUBTYPES, serviceIcon, listingLayerKeys } from "@/lib/mapLayers";
import { ZA_CATEGORY_ICON } from "@/lib/za-assets";
import type { KeyGroup } from "./MapKey";

// Builds the "Places to stay / Things to do / Services" key groups from the
// pinned listings (only entries that actually have pins are shown).
export function useListingAndServiceGroups(pinned: Listing[], zoomedIn: boolean): KeyGroup[] {
  const tk = useTranslations("MapKey");
  const tc = useTranslations("Categories");
  return useMemo(() => {
    const counts = new Map<string, number>();
    pinned.forEach((l) => listingLayerKeys(l).forEach((k) => counts.set(k, (counts.get(k) ?? 0) + 1)));
    const stay = [...STAY_SUBTYPES, "other"]
      .filter((s) => counts.has(`stay:${s}`))
      .map((s) => ({ key: `stay:${s}`, label: tk(`sub_${s}`), icon: ZA_CATEGORY_ICON.stay ?? "", count: counts.get(`stay:${s}`) }));
    const doItems = (Object.keys(categoryLabel) as Category[])
      .filter((c) => c !== "stay" && counts.has(c))
      .map((c) => ({ key: c, label: tc(c), icon: ZA_CATEGORY_ICON[c] ?? "/za/mark.svg", count: counts.get(c) }));
    const services = SERVICE_TYPES.map((s) => ({ key: `svc:${s}`, label: tk(`svc_${s}`), icon: serviceIcon(s) }));
    return [
      { id: "stay", title: tk("stay"), items: stay },
      { id: "do", title: tk("do"), items: doItems },
      { id: "services", title: tk("services"), items: services, note: zoomedIn ? tk("osm") : tk("zoomServices") },
    ];
  }, [pinned, zoomedIn, tk, tc]);
}
