"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useLocale, useTranslations } from "next-intl";
import { TILES } from "@/lib/tiles";
import { COUNTRIES, places, type PlaceType } from "@/lib/places";
import type { Listing } from "@/lib/data";
import Cluster from "./map/Cluster";
import ListingMarkers from "./map/ListingMarkers";
import ServiceLayer from "./map/ServiceLayer";

const cache = new Map<string, L.Icon>();
const imgIcon = (url: string, size: number) => {
  const k = `${url}${size}`;
  if (!cache.has(k)) cache.set(k, L.icon({ iconUrl: url, iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] }));
  return cache.get(k)!;
};
const PLACE_ICON: Record<PlaceType, string> = {
  national_park: "/za/marker-park.svg",
  reserve: "/za/marker-park.svg",
  heritage_site: "/za/marker-heritage.svg",
};

export default function ZaMapInner({
  listings,
  hidden,
  route22Url,
  onZoomState,
}: {
  listings: Listing[];
  hidden: Set<string>;
  route22Url: string;
  onZoomState: (zoomedIn: boolean) => void;
}) {
  const t = useTranslations("Map");
  const locale = useLocale();
  const country = (code: string) => {
    try { return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code; } catch { return COUNTRIES[code as keyof typeof COUNTRIES] ?? code; }
  };
  const shownPlaces = places.filter((p) => !hidden.has(p.type === "heritage_site" ? "heritage" : "parks"));

  return (
    <MapContainer center={[-15, 27]} zoom={4} minZoom={3} scrollWheelZoom={false}
      className="z-[1] h-[440px] w-full rounded-xl2 border border-line shadow-card md:h-[600px]">
      <TileLayer attribution={TILES.attribution} url={TILES.url} />

      <Cluster variant="park" disableAt={8}>
        {shownPlaces.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={imgIcon(PLACE_ICON[p.type], p.type === "heritage_site" ? 30 : 28)}>
            <Popup>
              <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, color: "#9a3412", fontWeight: 700 }}>{t(p.type)}</span>
              <br /><strong>{p.name}</strong><br />
              <span style={{ fontSize: "0.75rem", color: "#57534e" }}>{p.province} · {country(p.country)}</span>
              <p style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>{p.blurb}</p>
            </Popup>
          </Marker>
        ))}
      </Cluster>

      {!hidden.has("route22") && (
        <Marker position={[-27.55, 32.35]} icon={imgIcon("/route22-icon.png", 34)}>
          <Popup>
            <strong>{t("r22Title")}</strong>
            <p style={{ margin: "6px 0", fontSize: "0.85rem" }}>{t("r22Body")}</p>
            <a href={route22Url}>{t("planRoute")}</a>
          </Popup>
        </Marker>
      )}

      <ListingMarkers listings={listings} hidden={hidden} />
      <ServiceLayer hidden={hidden} onZoomState={onZoomState} />
    </MapContainer>
  );
}
