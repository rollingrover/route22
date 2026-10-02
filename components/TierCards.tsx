import { FOUNDING, formatZAR, opdeskBundle } from "@/lib/pricing";
import { fromSnapshot, type PriceSnapshot } from "@/lib/prices";

export type Interest = "premium" | "featured" | "opdesk" | "free" | "unsure" | "route_hub";

type Tier = {
  key: Interest;
  name: string;
  price: string;
  was?: string; // standard price, struck through while founding pricing runs
  per: string;
  highlight?: boolean;
  badge?: string;
  perks: string[];
  cta: string;
};

const cats = (n: number) => `${n} ${n === 1 ? "category" : "categories"}`;

export function getTiers(siteName: string, snap: PriceSnapshot): Tier[] {
  const p = fromSnapshot(snap);
  const lock = p.founding ? `Founding price locked ${FOUNDING.lockYears} years` : "";
  const feats = (key: string, fallback: string[]) => {
    const f = p.get(key)?.features ?? [];
    return (f.length ? f : fallback).map((x) => x.replace("ZAtours", siteName));
  };
  return [
    {
      key: "free",
      name: "Free",
      price: "R0",
      per: "",
      perks: feats("free", [`Listed in ${cats(p.included.free)}`, "Claim it to get your own page", "Edit any time — no account needed"]),
      cta: "Get listed free",
    },
    {
      key: "premium",
      name: p.get("premium")?.name ?? "Premium",
      price: formatZAR(p.premium),
      was: p.founding && p.standard.premium !== p.premium ? formatZAR(p.standard.premium) : undefined,
      per: "/ month",
      highlight: true,
      badge: p.founding ? "Founding price" : "Most popular",
      perks: [...feats("premium", [`Listed in ${cats(p.included.premium)}`]), ...(lock ? [lock] : [])],
      cta: "Go Premium",
    },
    {
      key: "featured",
      name: p.get("featured")?.name ?? "Featured",
      price: formatZAR(p.featured),
      was: p.founding && p.standard.featured !== p.featured ? formatZAR(p.standard.featured) : undefined,
      per: "/ month",
      badge: p.founding ? "Founding price" : undefined,
      perks: [...feats("featured", ["Everything in Premium", `Listed in ${cats(p.included.featured)}`, `Spotlight on the ${siteName} home page`]), ...(lock ? [lock] : [])],
      cta: "Go Featured",
    },
    {
      key: "opdesk",
      name: "OpDesk bundle",
      price: opdeskBundle.amount ? formatZAR(opdeskBundle.amount) : "With OpDesk",
      per: opdeskBundle.amount ? "/ month" : "",
      badge: "Verified & bookable",
      perks: [
        "Featured listing included",
        "“Verified & bookable” badge",
        "Guest enquiries land in your OpDesk bookings",
        "Optional live availability on your listing",
        "Bookings, invoices, staff & fleet in one dashboard",
      ],
      cta: "Ask about the bundle",
    },
  ];
}

// One line explaining founding pricing + extra categories; shown under the cards.
export function pricingNote(snap: PriceSnapshot): string {
  const p = fromSnapshot(snap);
  const extra = `Extra categories ${formatZAR(p.extraCategory)}/month each on paid plans.`;
  return p.founding
    ? `Founding-member prices for businesses that join by ${FOUNDING.deadlineLabel}, locked for ${FOUNDING.lockYears} years from sign-up (standard prices after that date: ${formatZAR(p.standard.premium)} / ${formatZAR(p.standard.featured)}). ${extra}`
    : extra;
}

export default function TierCards({
  siteName,
  prices,
  onPick,
  ctaHref = "#lead",
}: {
  siteName: string;
  prices: PriceSnapshot;
  onPick?: (k: Interest) => void;
  ctaHref?: string;
}) {
  const tiers = getTiers(siteName, prices);
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5">
      {tiers.map((t) => (
        <div
          key={t.key}
          className={`relative flex flex-col rounded-xl2 bg-paper p-6 text-ink shadow-card ${
            t.highlight ? "border-2 border-clay lg:-translate-y-2" : "border border-line"
          }`}
        >
          {t.badge && (
            <span
              className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white ${
                t.key === "opdesk" ? "bg-ocean" : "bg-clay"
              }`}
            >
              {t.badge}
            </span>
          )}
          <h3 className="text-[1.3rem]">{t.name}</h3>
          <p className="mb-3.5 mt-0 font-serif text-[1.5rem] text-clay">
            {t.price}
            {t.per && <span className="font-sans text-[0.85rem] text-ink-soft"> {t.per}</span>}
            {t.was && (
              <span className="ml-2 font-sans text-[0.85rem] text-ink-soft line-through" aria-label={`Standard price ${t.was}`}>
                {t.was}
              </span>
            )}
          </p>
          <ul className="mb-5 flex flex-1 list-none flex-col gap-2.5 p-0">
            {t.perks.map((p) => (
              <li
                key={p}
                className="relative pl-[22px] text-[0.92rem] before:absolute before:left-0 before:font-bold before:text-bush before:content-['✓']"
              >
                {p}
              </li>
            ))}
          </ul>
          <a
            href={ctaHref}
            onClick={onPick ? () => onPick(t.key) : undefined}
            className={`rounded-full py-2.5 text-center font-semibold no-underline ${
              t.highlight
                ? "bg-clay text-white hover:bg-clay-dk"
                : "border-2 border-bush text-bush hover:bg-bush hover:text-white"
            }`}
          >
            {t.cta}
          </a>
        </div>
      ))}
    </div>
  );
}
