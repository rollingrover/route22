"use client";

import dynamic from "next/dynamic";

const ListingMapInner = dynamic(() => import("./ListingMapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[260px] place-items-center rounded-xl2 border border-line bg-sand-2 text-ink-soft">
      Loading map…
    </div>
  ),
});

export default function ListingMap({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  return <ListingMapInner lat={lat} lng={lng} name={name} />;
}
