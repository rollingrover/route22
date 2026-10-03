"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import { TILES } from "@/lib/tiles";
import { stops, routeLine } from "@/lib/data";
import type { Listing } from "@/lib/data";
import ListingMarkers from "./map/ListingMarkers";
import ServiceLayer from "./map/ServiceLayer";

// Flies the map to the selected stop when it changes.
function FlyTo({ selected }: { selected: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    const s = stops.find((x) => x.id === selected);
    if (s) map.flyTo([s.lat, s.lng], 10, { duration: 0.8 });
  }, [selected, map]);
  return null;
}

export default function MapInner({
  selected,
  onSelect,
  listings,
  hidden,
  onZoomState,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  listings: Listing[];
  hidden: Set<string>;
  onZoomState: (zoomedIn: boolean) => void;
}) {
  const t = useTranslations("R22");
  return (
    <MapContainer
      center={[-27.6, 32.4]}
      zoom={8}
      scrollWheelZoom={false}
      className="z-[1] h-[380px] w-full rounded-xl2 border border-line shadow-card md:h-[520px]"
    >
      <TileLayer
        attribution={TILES.attribution}
        url={TILES.url}
      />
      <Polyline
        positions={routeLine}
        pathOptions={{ color: "#c1622d", weight: 4, opacity: 0.85, dashArray: "1 8" }}
      />
      {!hidden.has("stops") && stops.map((s) => {
        const active = selected === s.id;
        return (
          <CircleMarker
            key={s.id}
            center={[s.lat, s.lng]}
            radius={active ? 11 : 8}
            pathOptions={{
              color: "#234a2c",
              weight: 2,
              fillColor: active ? "#c1622d" : "#2f5e3a",
              fillOpacity: 0.9,
            }}
            eventHandlers={{ click: () => onSelect(s.id) }}
          >
            <Popup>
              <strong>{s.name}</strong>
              <br />
              <span style={{ color: "#2f5e3a", fontSize: "0.75rem", textTransform: "uppercase" }}>
                {t(`stops.${s.id}.kind`)}
              </span>
              <p style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>{t(`stops.${s.id}.blurb`)}</p>
            </Popup>
          </CircleMarker>
        );
      })}
      <ListingMarkers listings={listings} hidden={hidden} />
      <ServiceLayer hidden={hidden} onZoomState={onZoomState} />
      <FlyTo selected={selected} />
    </MapContainer>
  );
}
