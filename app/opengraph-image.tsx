import { ImageResponse } from "next/og";
import { IS_ZATOURS } from "@/lib/site";
import { BRAND } from "@/lib/brand";

// Default social card for every page that doesn't set its own image.
export const alt = BRAND.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const bg = IS_ZATOURS
    ? "linear-gradient(135deg, #14306b 0%, #0c2150 60%, #0a7a52 100%)"
    : "linear-gradient(160deg, #2c4a2f 0%, #1c3320 55%, #14261a 100%)";
  const accent = IS_ZATOURS ? "#f2b705" : "#e9c9a6";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: bg,
          color: "white",
          fontFamily: IS_ZATOURS ? "sans-serif" : "serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: accent }}>
          {BRAND.tagline}
        </div>
        <div style={{ fontSize: 112, fontWeight: 800, marginTop: 16, lineHeight: 1 }}>
          {BRAND.fullName}
        </div>
        <div style={{ fontSize: 36, marginTop: 28, maxWidth: 900, opacity: 0.9 }}>
          {IS_ZATOURS
            ? "Stays, safaris, tours & experiences across South Africa"
            : "Lodges, tours & experiences on the R22 Elephant Coast route"}
        </div>
      </div>
    ),
    size
  );
}
