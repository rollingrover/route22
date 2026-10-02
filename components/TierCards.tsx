import { FOUNDING, INCLUDED_CATEGORIES, formatZAR, listingPrices, opdeskBundle } from "@/lib/pricing";

export type Interest = "premium" | "featured" | "opdesk" | "free" | "unsure";

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

export function getTiers(siteName: string): Tier[] {
  const p = listingPrices();
  const lock = p.founding ? ` — founding price locked ${FOUNDING.lockYears} years` : "";
  return [
    {
      key: "free",
      name: "Free",
      price: "R0",
      per: "",
      perks: [
        `Name, town & ${cats(INCLUDED_CATEGORIES.basic)} in the directory`,
        "Claim it to get your own page",
        "Edit your details any time — no account needed",
      ],
      cta: "Get listed free",
    },
    {
      key: "premium",
      name: "Premium",
      price: formatZAR(p.premium),
      was: p.founding ? formatZAR(p.standard.premium) : undefined,
      per: "/ month",
      highlight: true,
      badge: p.founding ? "Founding price" : "Most popular",
      perks: [
        `Listed in ${cats(INCLUDED_CATEGORIES.premium)}`,
        "Full page: photos & full description",
        "Website, phone & booking links",
        "Enquiry form straight to your inbox",
        `Priority placement & “Premium” badge${lock}`,
      ],
      cta: "Go Premium",
    },
    {
      key: "featured",
      name: "Featured",
      price: formatZAR(p.featured),
      was: p.founding ? formatZAR(p.standard.featured) : undefined,
      per: "/ month",
      badge: p.founding ? "Founding price" : undefined,
      perks: [
        "Everything in Premium",
        `Listed in ${cats(INCLUDED_CATEGORIES.featured)}`,
        `Spotlight on the ${siteName} home page`,
        "Top of your categories",
        `Included in featured round-ups${lock}`,
      ],
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
export function pricingNote(): string {
  const p = listingPrices();
  const extra = `Extra categories ${formatZAR(p.extraCategory)}/month each on paid plans.`;
  return p.founding
    ? `Founding-member prices for businesses that join by ${FOUNDING.deadlineLabel}, locked for ${FOUNDING.lockYears} years from sign-up (standard prices after that date: ${formatZAR(p.standard.premium)} / ${formatZAR(p.standard.featured)}). ${extra}`
    : extra;
}

export default function TierCards({
  siteName,
  onPick,
  ctaHref = "#lead",
}: {
  siteName: string;
  onPick?: (k: Interest) => void;
  ctaHref?: string;
}) {
  const tiers = getTiers(siteName);
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
