import { ImageResponse } from "next/og";
import { IS_ZATOURS } from "@/lib/site";
import { BRAND } from "@/lib/brand";

// Default social card for every page that doesn't set its own image.
const size = { width: 1200, height: 630 };

// Shared social card for every page and language: /api/og
export const runtime = "edge";

export async function GET() {
  const hero: string | null = null; // real photography to come
  const bg = IS_ZATOURS
    ? "linear-gradient(135deg, #1f2a44 0%, #141c30 60%, #10283a 100%)"
    : "linear-gradient(160deg, #2c4a2f 0%, #1c3320 55%, #14261a 100%)";
  const accent = IS_ZATOURS ? "#f59e0b" : "#e9c9a6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px 80px",
          background: bg,
          color: "white",
          fontFamily: IS_ZATOURS ? "sans-serif" : "serif",
          position: "relative",
        }}
      >
        {hero && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt=""
            width={1200}
            height={395}
            style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 395, objectFit: "cover" }}
          />
        )}
        {hero && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              background: "linear-gradient(180deg, rgba(20,28,48,0) 25%, rgba(20,28,48,0.95) 64%)",
            }}
          />
        )}
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: accent }}>
          {BRAND.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 100, fontWeight: 800, marginTop: 10, lineHeight: 1 }}>
          {BRAND.fullName}
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 20, maxWidth: 950, opacity: 0.9 }}>
          {IS_ZATOURS
            ? "Stays, safaris, tours & experiences across Southern & East Africa"
            : "Lodges, tours & experiences on the R22 Elephant Coast route"}
        </div>
      </div>
    ),
    size
  );
}
