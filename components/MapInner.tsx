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
import { Amenity, amenityCategoryLabel } from "@/lib/amenities";

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
  amenities,
  showAmenities,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  amenities: Amenity[];
  showAmenities: boolean;
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
      {stops.map((s) => {
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
      {showAmenities &&
        amenities.map((a) => (
          <CircleMarker
            key={a.id}
            center={[a.lat, a.lng]}
            radius={4}
            pathOptions={{ color: "#7a7568", weight: 1, fillColor: "#a9a394", fillOpacity: 0.85 }}
          >
            <Popup>
              <strong>{a.name}</strong>
              <br />
              <span style={{ color: "#7a7568", fontSize: "0.72rem", textTransform: "uppercase" }}>
                {amenityCategoryLabel[a.category]}
              </span>
            </Popup>
          </CircleMarker>
        ))}
      <FlyTo selected={selected} />
    </MapContainer>
  );
}
