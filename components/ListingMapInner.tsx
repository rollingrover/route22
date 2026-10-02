"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { TILES } from "@/lib/tiles";

export default function ListingMapInner({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      className="z-[1] h-[260px] w-full rounded-xl2 border border-line shadow-card"
    >
      <TileLayer
        attribution={TILES.attribution}
        url={TILES.url}
      />
      <CircleMarker
        center={[lat, lng]}
        radius={11}
        pathOptions={{ color: "#234a2c", weight: 2, fillColor: "#c1622d", fillOpacity: 0.9 }}
      >
        <Popup>
          <strong>{name}</strong>
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
}
