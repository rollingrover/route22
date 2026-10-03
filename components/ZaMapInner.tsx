"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useLocale, useTranslations } from "next-intl";
import { TILES } from "@/lib/tiles";
import { COUNTRIES, places, type PlaceType } from "@/lib/places";
import { categoryLabels, type Category, type Listing } from "@/lib/data";
import { ZA_CATEGORY_ICON } from "@/lib/za-assets";

const iconCache = new Map<string, L.Icon>();
function imgIcon(url: string, size: number) {
  const key = `${url}-${size}`;
  if (!iconCache.has(key)) {
    iconCache.set(key, L.icon({ iconUrl: url, iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] }));
  }
  return iconCache.get(key)!;
}
const PLACE_ICON: Record<PlaceType, string> = {
  national_park: "/za/marker-park.svg",
  reserve: "/za/marker-park.svg",
  heritage_site: "/za/marker-heritage.svg",
};

// `hidden` holds layer keys switched off: "parks", "heritage" or a category.
export default function ZaMapInner({
  listings,
  hidden,
  route22Url,
}: {
  listings: Listing[];
  hidden: Set<string>;
  route22Url: string;
}) {
  const t = useTranslations("Map");
  const tc = useTranslations("Categories");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`; // Leaflet popups render outside the router
  const country = (code: string) => {
    try { return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code; } catch { return COUNTRIES[code as keyof typeof COUNTRIES] ?? code; }
  };
  const shownPlaces = places.filter((p) => !hidden.has(p.type === "heritage_site" ? "heritage" : "parks"));
  // A business shows if ANY of its categories is switched on; its pin uses its primary category.
  const shownListings = listings.filter((l) => (l.categories?.length ? l.categories : [l.category]).some((c) => !hidden.has(c)));

  return (
    <MapContainer
      center={[-15, 27]}
      zoom={4}
      minZoom={3}
      scrollWheelZoom={false}
      className="z-[1] h-[420px] w-full rounded-xl2 border border-line shadow-card md:h-[560px]"
    >
      <TileLayer attribution={TILES.attribution} url={TILES.url} />

      {shownPlaces.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={imgIcon(PLACE_ICON[p.type], p.type === "heritage_site" ? 30 : 28)}>
          <Popup>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, color: "#9a3412", fontWeight: 700 }}>
              {t(p.type)}
            </span>
            <br />
            <strong>{p.name}</strong>
            <br />
            <span style={{ fontSize: "0.75rem", color: "#57534e" }}>{p.province} · {country(p.country)}</span>
            <p style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>{p.blurb}</p>
          </Popup>
        </Marker>
      ))}

      {/* Route22 — the Elephant Coast guide (sister site) */}
      <Marker position={[-27.55, 32.35]} icon={imgIcon("/route22-icon.png", 34)}>
        <Popup>
          <strong>{t("r22Title")}</strong>
          <p style={{ margin: "6px 0", fontSize: "0.85rem" }}>{t("r22Body")}</p>
          <a href={route22Url}>{t("planRoute")}</a>
        </Popup>
      </Marker>

      {shownListings.map((l) => (
        <Marker
          key={l.id}
          position={[l.lat!, l.lng!]}
          icon={imgIcon(ZA_CATEGORY_ICON[l.category as Category] ?? "/za/mark.svg", l.tier === "featured" ? 38 : 32)}
          zIndexOffset={l.tier === "featured" ? 500 : 200}
        >
          <Popup>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, color: "#0e7490", fontWeight: 700 }}>
              {categoryLabels(l, 2, (c) => tc(c))}
            </span>
            <br />
            <strong>{l.name}</strong>
            <br />
            <span style={{ fontSize: "0.75rem", color: "#57534e" }}>
              {l.location}{l.country && l.country !== "ZA" ? ` · ${country(l.country)}` : ""}
            </span>
            <p style={{ margin: "6px 0 0" }}>
              <a href={`${prefix}/listings/${l.slug}`}>{t("viewEnquire")}</a>
            </p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
