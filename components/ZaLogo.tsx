// ZAtours wordmark: sun-over-hills mark + "ZA" / "tours". Pure SVG + text so
// there's no image asset to load; colours follow the theme variables.
export default function ZaLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="rgb(var(--c-bush))" />
        <circle cx="32" cy="34" r="13" fill="rgb(var(--c-gold))" />
        <path d="M0 44c10-7 20-9 32-5s22 2 32-5v30H0z" fill="rgb(var(--c-clay))" />
        <path d="M0 52c12-5 22-5 32-2s20 3 32-2v16H0z" fill="rgb(var(--c-clay-dk))" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-[1.3rem] tracking-tight ${inverted ? "text-white" : "text-ink"}`}
        >
          <span className={inverted ? "text-gold" : "text-bush"}>ZA</span>tours
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
