"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { TILES } from "@/lib/tiles";
import { places, placeTypeLabel, type PlaceType } from "@/lib/places";
import { categoryLabels, type Listing } from "@/lib/data";

const iconCache = new Map<string, L.Icon | L.DivIcon>();
function imgIcon(url: string, size: number) {
  const key = `${url}-${size}`;
  if (!iconCache.has(key)) {
    iconCache.set(key, L.icon({ iconUrl: url, iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] }));
  }
  return iconCache.get(key)!;
}
const ICON: Record<PlaceType, string> = {
  national_park: "/za/marker-park.webp",
  reserve: "/za/marker-park.webp",
  heritage_site: "/za/marker-heritage.webp",
};

export type MapLayers = { parks: boolean; heritage: boolean; businesses: boolean };

export default function ZaMapInner({
  listings,
  layers,
  route22Url,
}: {
  listings: Listing[];
  layers: MapLayers;
  route22Url: string;
}) {
  const shownPlaces = places.filter((p) =>
    p.type === "heritage_site" ? layers.heritage : layers.parks
  );
  return (
    <MapContainer
      center={[-28.8, 25.5]}
      zoom={5}
      minZoom={4}
      scrollWheelZoom={false}
      className="z-[1] h-[420px] w-full rounded-xl2 border border-line shadow-card md:h-[560px]"
    >
      <TileLayer attribution={TILES.attribution} url={TILES.url} />

      {shownPlaces.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={imgIcon(ICON[p.type], p.type === "heritage_site" ? 30 : 28)}>
          <Popup>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, color: "#9a3412", fontWeight: 700 }}>
              {placeTypeLabel[p.type]}
            </span>
            <br />
            <strong>{p.name}</strong>
            <br />
            <span style={{ fontSize: "0.75rem", color: "#57534e" }}>{p.province}</span>
            <p style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>{p.blurb}</p>
          </Popup>
        </Marker>
      ))}

      {/* Route22 — the Elephant Coast guide (sister site) */}
      <Marker position={[-27.55, 32.35]} icon={imgIcon("/route22-icon.png", 34)}>
        <Popup>
          <strong>Route22 — Elephant Coast</strong>
          <p style={{ margin: "6px 0" , fontSize: "0.85rem" }}>
            The R22 from Hluhluwe to Kosi Bay: parks, beaches and itineraries.
          </p>
          <a href={route22Url}>Plan the route ↗</a>
        </Popup>
      </Marker>

      {layers.businesses &&
        listings.map((l) => (
          <Marker key={l.id} position={[l.lat!, l.lng!]} icon={imgIcon("/za/mark.webp", l.tier === "featured" ? 40 : 34)}>
            <Popup>
              <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, color: "#0e7490", fontWeight: 700 }}>
                {categoryLabels(l, 2)}
              </span>
              <br />
              <strong>{l.name}</strong>
              <br />
              <span style={{ fontSize: "0.75rem", color: "#57534e" }}>{l.location}</span>
              <p style={{ margin: "6px 0 0" }}>
                <a href={`/listings/${l.slug}`}>View &amp; enquire →</a>
              </p>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
