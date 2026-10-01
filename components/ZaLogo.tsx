import { ZA_MARK } from "@/lib/za-assets";

// ZAtours wordmark: the acacia map-pin from the original ZAtours artwork +
// "ZA" / "tours" set in the heading face.
export default function ZaLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ZA_MARK} alt="" width={36} height={36} className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-[1.35rem] font-extrabold tracking-tight ${inverted ? "text-white" : "text-ink"}`}
        >
          <span className="text-clay">ZA</span>tours
        </span>
        <span
          className={`mt-0.5 text-[0.6rem] uppercase tracking-[2px] ${
            inverted ? "text-foot-text" : "text-ink-soft"
          }`}
        >
          South Africa&apos;s tourism directory
        </span>
      </span>
    </span>
  );
}
