"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useLocale, useTranslations } from "next-intl";
import { categoryLabels, type Category, type Listing } from "@/lib/data";
import { listingLayerKeys } from "@/lib/mapLayers";
import { ZA_CATEGORY_ICON } from "@/lib/za-assets";
import Cluster from "./Cluster";

const cache = new Map<string, L.Icon>();
const icon = (url: string, size: number) => {
  const k = `${url}${size}`;
  if (!cache.has(k)) cache.set(k, L.icon({ iconUrl: url, iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] }));
  return cache.get(k)!;
};

// Paid listings as clustered pins, each with its category icon; hidden by key.
export default function ListingMarkers({ listings, hidden }: { listings: Listing[]; hidden: Set<string> }) {
  const t = useTranslations("Map");
  const tc = useTranslations("Categories");
  const tk = useTranslations("MapKey");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`; // popups render outside the router
  const shown = listings.filter((l) => listingLayerKeys(l).some((k) => !hidden.has(k)));
  return (
    <Cluster variant="biz">
      {shown.map((l) => (
        <Marker
          key={l.id}
          position={[l.lat!, l.lng!]}
          icon={icon(ZA_CATEGORY_ICON[l.category as Category] ?? "/za/mark.svg", l.tier === "featured" ? 38 : 32)}
          zIndexOffset={l.tier === "featured" ? 500 : 200}
        >
          <Popup>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, color: "#0e7490", fontWeight: 700 }}>
              {l.category === "stay" && l.subtype ? tk(`sub_${l.subtype}`) : categoryLabels(l, 2, (c) => tc(c))}
            </span>
            <br />
            <strong>{l.name}</strong>
            <br />
            <span style={{ fontSize: "0.75rem", color: "#57534e" }}>{l.location}</span>
            <p style={{ margin: "6px 0 0" }}>
              <a href={`${prefix}/listings/${l.slug}`}>{t("viewEnquire")}</a>
            </p>
          </Popup>
        </Marker>
      ))}
    </Cluster>
  );
}
