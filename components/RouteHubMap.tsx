"use client";

import dynamic from "next/dynamic";
import type { Listing } from "@/lib/data";

const Inner = dynamic(() => import("./RouteHubMapInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[360px] place-items-center rounded-xl2 border border-line bg-sand-2 text-ink-soft md:h-[460px]">
      Loading map…
    </div>
  ),
});

export default function RouteHubMap(props: { path: [number, number][]; members: Listing[] }) {
  return <Inner {...props} />;
}
