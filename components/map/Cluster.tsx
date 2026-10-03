"use client";

import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

// Branded marker clustering: nearby pins merge into a numbered bubble when
// zoomed out and split apart as you zoom in.
export default function Cluster({
  children,
  variant = "biz",
  disableAt = 14,
}: {
  children: React.ReactNode;
  variant?: "biz" | "svc" | "park";
  disableAt?: number;
}) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      showCoverageOnHover={false}
      maxClusterRadius={variant === "park" ? 40 : 55}
      disableClusteringAtZoom={disableAt}
      iconCreateFunction={(cluster: { getChildCount: () => number }) => {
        const n = cluster.getChildCount();
        const size = n < 10 ? 34 : n < 50 ? 40 : 48;
        return L.divIcon({
          html: `<div class="dir-cluster dir-cluster--${variant}" style="width:${size}px;height:${size}px">${n}</div>`,
          className: "",
          iconSize: [size, size],
        });
      }}
    >
      {children}
    </MarkerClusterGroup>
  );
}
