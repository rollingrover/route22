"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { stops } from "@/lib/data";
import { Amenity } from "@/lib/amenities";

// Leaflet touches `window`, so the actual map is loaded client-only.
const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[520px] place-items-center rounded-xl2 border border-line bg-sand-2 text-ink-soft">
      Loading map…
    </div>
  ),
});

export default function RouteMap({ amenities }: { amenities: Amenity[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAmenities, setShowAmenities] = useState(false);

  return (
    <section id="route" className="bg-sand-2 py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[720px]">
            <h2>The Route</h2>
            <p className="text-ink-soft">
              Tap a stop to see what&apos;s there. The route is best driven over 4–7 days.
            </p>
          </div>
          {amenities.length > 0 && (
            <label className="mb-1 flex items-center gap-2 text-[0.85rem] font-medium text-ink-soft">
              <input
                type="checkbox"
                checked={showAmenities}
                onChange={(e) => setShowAmenities(e.target.checked)}
                className="h-4 w-4 accent-clay"
              />
              Show ATMs, clinics &amp; fast food
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-[1.6fr_1fr]">
          <MapInner
            selected={selected}
            onSelect={setSelected}
            amenities={amenities}
            showAmenities={showAmenities}
          />

          <aside className="flex max-h-none flex-col gap-2.5 overflow-y-auto pr-1 md:max-h-[520px]">
            {stops.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`rounded-xl border bg-paper p-3 text-left transition hover:border-clay hover:shadow-card ${
                  selected === s.id ? "border-clay shadow-card" : "border-line"
                }`}
              >
                <span className="text-[0.72rem] font-semibold uppercase tracking-wide text-bush">
                  {s.kind}
                </span>
                <h4 className="my-0.5 text-[1.02rem]">{s.name}</h4>
                <p className="m-0 text-[0.88rem] text-ink-soft">{s.blurb}</p>
              </button>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
