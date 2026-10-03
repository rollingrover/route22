"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import { useLocale, useTranslations } from "next-intl";
import { TILES } from "@/lib/tiles";
import { categoryLabels, type Listing } from "@/lib/data";

const pin = L.icon({ iconUrl: "/za/mark.svg", iconSize: [34, 34], iconAnchor: [17, 32], popupAnchor: [0, -28] });

export default function RouteHubMapInner({ path, members }: { path: [number, number][]; members: Listing[] }) {
  const t = useTranslations("Map");
  const tc = useTranslations("Categories");
  const locale = useLocale();
  const prefix = locale === "en" ? "" : `/${locale}`;
  const pts: [number, number][] = [...path, ...members.map((m) => [m.lat!, m.lng!] as [number, number])];
  const bounds = pts.length ? L.latLngBounds(pts).pad(0.2) : L.latLngBounds([[-35, 16], [-22, 33]]);
  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      className="z-[1] h-[360px] w-full rounded-xl2 border border-line shadow-card md:h-[460px]"
    >
      <TileLayer attribution={TILES.attribution} url={TILES.url} />
      {path.length > 1 && (
        <Polyline positions={path} pathOptions={{ color: "#c2410c", weight: 4, opacity: 0.85, dashArray: "1 8" }} />
      )}
      {members.map((m) => (
        <Marker key={m.id} position={[m.lat!, m.lng!]} icon={pin}>
          <Popup>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#0e7490", fontWeight: 700 }}>
              {categoryLabels(m, 2, (c) => tc(c))}
            </span>
            <br />
            <strong>{m.name}</strong>
            <br />
            <a href={`${prefix}/listings/${m.slug}`}>{t("viewEnquire")}</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
