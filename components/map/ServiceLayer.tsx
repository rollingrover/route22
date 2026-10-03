"use client";

import { useEffect, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import { serviceIcon } from "@/lib/mapLayers";
import Cluster from "./Cluster";

type Svc = { id: string; name: string | null; category: string; lat: number; lng: number };
const icons = new Map<string, L.Icon>();
const iconFor = (c: string) => {
  if (!icons.has(c)) icons.set(c, L.icon({ iconUrl: serviceIcon(c), iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12] }));
  return icons.get(c)!;
};

// Services (ATM, fuel, clinic …) load for the visible area only, once zoomed
// in far enough — so the map stays fast even with thousands of points.
export default function ServiceLayer({
  hidden,
  minZoom = 10,
  onZoomState,
}: {
  hidden: Set<string>;
  minZoom?: number;
  onZoomState?: (zoomedIn: boolean) => void;
}) {
  const t = useTranslations("MapKey");
  const [items, setItems] = useState<Svc[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = (map: L.Map) => {
    const zoomedIn = map.getZoom() >= minZoom;
    onZoomState?.(zoomedIn);
    if (!zoomedIn) { setItems([]); return; }
    const b = map.getBounds().pad(0.2);
    const sb = getSupabase();
    if (!sb) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const { data } = await sb
        .from("dir_amenities")
        .select("id, name, category, lat, lng")
        .eq("published", true)
        .gte("lat", b.getSouth()).lte("lat", b.getNorth())
        .gte("lng", b.getWest()).lte("lng", b.getEast())
        .limit(1500);
      setItems((data as Svc[]) || []);
    }, 250);
  };

  const map = useMapEvents({ moveend: () => load(map), zoomend: () => load(map) });
  useEffect(() => { load(map); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = items.filter((s) => !hidden.has(`svc:${s.category}`));
  if (!shown.length) return null;
  return (
    <Cluster variant="svc" disableAt={15}>
      {shown.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={iconFor(s.category)}>
          <Popup>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#475569", fontWeight: 700 }}>
              {t(`svc_${["atm","bank","clinic","hospital","pharmacy","police","fuel","airport","fastfood"].includes(s.category) ? s.category : "other"}`)}
            </span>
            {s.name && (<><br /><strong>{s.name}</strong></>)}
          </Popup>
        </Marker>
      ))}
    </Cluster>
  );
}
