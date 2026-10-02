import Link from "next/link";
import ZaDirectory from "./ZaDirectory";
import ZaMap from "./ZaMap";
import { ListingCard } from "./ListingCard";
import { Listing } from "@/lib/data";
import { ROUTE22_URL } from "@/lib/site";
import { FOUNDING, formatZAR } from "@/lib/pricing";
import type { Prices } from "@/lib/prices";

// ZAtours home page — national directory. Shares data, cards and the lead
// pipeline with Route22; only the framing and palette differ.
export default function ZaHome({ listings, isExample, prices }: { listings: Listing[]; isExample: boolean; prices: Prices }) {
  const real = isExample ? [] : listings;
  const featured = listings.filter((l) => l.tier === "featured" || l.tier === "premium").slice(0, 6);
  const provinces = new Set(real.map((l) => l.province).filter(Boolean)).size;

  return (
    <>
      <section
        className="relative isolate overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(circle at 85% 20%, rgba(245,158,11,0.22), transparent 45%), linear-gradient(135deg, #1f2a44 0%, #141c30 60%, #10283a 100%)",
        }}
      >
        {/* No hero photo yet — real photography coming. Subtle horizon line only. */}
        <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 -z-10 h-[70px] w-full">
          <path d="M0 80c240-40 480-50 720-30s480 30 720-10v80H0z" fill="rgb(var(--c-sand))" />
        </svg>
        <div className="relative mx-auto max-w-[1120px] px-5 pb-16 pt-16 md:pb-24 md:pt-20">
          <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[3px] text-gold">
            Tourism directory · Southern &amp; East Africa
          </p>
          <h1 className="mb-4 max-w-[19ch] text-[clamp(2.2rem,6vw,3.8rem)] text-white">
            Find where to stay and what to do across Southern &amp; East Africa.
          </h1>
          <p className="max-w-[56ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/85">
            Lodges, guesthouses, safaris, tours and transfers — listed by the businesses that run
            them. Starting in South Africa and growing across the region. Enquire directly; ZAtours
            is a directory, not a tour operator.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#directory"
              className="rounded-full bg-gold px-6 py-3 font-semibold text-ink no-underline hover:brightness-95"
            >
              Browse the directory
            </a>
            <a
              href={ROUTE22_URL}
              className="rounded-full border-2 border-white/60 px-6 py-3 font-semibold text-white no-underline hover:border-white"
            >
              Plan the Elephant Coast route ↗
            </a>
          </div>
          {real.length > 0 && (
            <p className="mt-8 text-[0.85rem] text-white/75">
              {real.length} {real.length === 1 ? "business" : "businesses"} listed
              {provinces > 1 ? ` across ${provinces} provinces` : ""}
            </p>
          )}
        </div>
      </section>

      {featured.length > 0 && (
        <section id="featured" className="scroll-mt-20 border-b border-line bg-paper py-14">
          <div className="mx-auto max-w-[1120px] px-5">
            <h2 className="mb-1">Featured businesses</h2>
            <p className="mb-7 text-ink-soft">
              Hand-picked operators — look for the{" "}
              <span className="rounded-full bg-ocean px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-white">
                Verified &amp; bookable
              </span>{" "}
              badge for live bookings.
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
              {featured.map((l) => (
                <ListingCard key={l.id} l={l} showProvince />
              ))}
            </div>
          </div>
        </section>
      )}

      <ZaMap listings={real} route22Url={ROUTE22_URL} />

      <ZaDirectory listings={listings} isExample={isExample} />

      <section className="bg-sand-2 py-14">
        <div className="mx-auto grid max-w-[1120px] items-center gap-8 px-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[2px] text-clay">
              Regional guide · KwaZulu-Natal
            </p>
            <h2 className="mb-2">Driving the Elephant Coast?</h2>
            <p className="m-0 text-ink-soft">
              Route22 is our sister guide to the R22 — Hluhluwe-iMfolozi, St Lucia, Sodwana, Kosi
              Bay and the reserves of Maputaland, with maps, parks and itineraries.
            </p>
          </div>
          <div className="md:text-right">
            <a
              href={ROUTE22_URL}
              className="inline-block rounded-full bg-bush px-6 py-3 font-semibold text-white no-underline hover:bg-bush-dk"
            >
              Explore Route22 ↗
            </a>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-5 rounded-xl2 border border-line bg-paper px-6 py-8 shadow-card md:flex-row md:items-center md:justify-between md:px-10">
          <div className="max-w-[60ch]">
            <h2 className="mb-1 text-[1.4rem]">Run a tourism business?</h2>
            <p className="m-0 text-ink-soft">
              List free, or upgrade from {formatZAR(prices.premium)}/month for a full page and
              enquiries to your inbox
              {prices.founding
                ? ` — founding-member price, locked for ${FOUNDING.lockYears} years if you join by ${FOUNDING.deadlineLabel}`
                : ""}
              . No commission, ever. OpDesk users show as verified &amp; bookable.
            </p>
          </div>
          <Link
            href="/list-your-business"
            className="shrink-0 rounded-full border-2 border-bush px-6 py-3 text-center font-semibold text-bush no-underline hover:bg-bush hover:text-white"
          >
            See plans
          </Link>
        </div>
      </section>
    </>
  );
}
