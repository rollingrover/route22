import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPicker from "@/components/PricingPicker";
import { getListingForClaim } from "@/lib/listings";
import { categoryLabel, isFreeTier } from "@/lib/data";
import { BRAND } from "@/lib/brand";
import { absoluteUrl, IS_ZATOURS } from "@/lib/site";
import { FOUNDING, formatZAR, listingPrices, opdeskBundle } from "@/lib/pricing";
import { pricingNote } from "@/components/TierCards";

const title = `List your business — free, Premium & Featured plans | ${BRAND.name}`;
const description = IS_ZATOURS
  ? "Get your tourism business in front of travellers planning trips across South Africa. Free listing, Premium and Featured plans, or verified & bookable with OpDesk."
  : "Get your business in front of travellers planning the R22 Elephant Coast route. Free listing, Premium and Featured plans, or verified & bookable with OpDesk.";

export const metadata: Metadata = {
  title,
  description,
  // Canonical without ?listing= so per-listing variants never get indexed.
  alternates: { canonical: absoluteUrl("/list-your-business") },
  openGraph: { title, description, type: "website", url: absoluteUrl("/list-your-business") },
};

export default async function ListYourBusinessPage({
  searchParams,
}: {
  searchParams: { listing?: string; plan?: string };
}) {
  const slug = (searchParams.listing ?? "").trim();
  const found = slug ? await getListingForClaim(slug) : null;
  const listing = found && !found.isExample ? found.listing : null;
  const plan = searchParams.plan;
  const prices = listingPrices();
  const initialInterest =
    plan === "premium" || plan === "featured" || plan === "opdesk" || plan === "free"
      ? plan
      : listing
        ? "premium"
        : undefined;

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-line bg-paper py-14">
          <div className="mx-auto max-w-[1120px] px-5">
            <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[2px] text-clay">
              For business owners
            </p>
            <h1 className="mb-3 max-w-[22ch] text-[clamp(1.9rem,4.5vw,2.8rem)]">
              {IS_ZATOURS
                ? "Get found by travellers planning South Africa"
                : "Get found by travellers on the Elephant Coast"}
            </h1>
            <p className="max-w-[62ch] text-[1.05rem] text-ink-soft">
              <strong className="text-ink">No commission, no per-booking or per-enquiry fees — ever.</strong>{" "}
              Every business can list for free. Upgrade for a full page, enquiries straight to your
              inbox and better placement — or link your listing to OpDesk to show as{" "}
              <strong className="text-ink">verified &amp; bookable</strong>.
            </p>

            {prices.founding && (
              <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-clay bg-sand px-4 py-2 text-[0.9rem] text-ink">
                <strong className="text-clay">Founding members:</strong> Premium from{" "}
                {formatZAR(prices.premium)}/month, price locked for {FOUNDING.lockYears} years. Offer closes{" "}
                {FOUNDING.deadlineLabel}.
              </div>
            )}

            {listing && (
              <div className="mt-7 max-w-[720px] rounded-xl2 border border-line bg-sand p-5">
                <p className="m-0 text-[0.78rem] font-bold uppercase tracking-wide text-ink-soft">
                  Your listing
                </p>
                <p className="m-0 mt-1 text-[1.1rem] font-semibold text-ink">{listing.name}</p>
                <p className="m-0 text-[0.88rem] text-ink-soft">
                  {categoryLabel[listing.category]} · {listing.location} · currently{" "}
                  <strong className="capitalize text-ink">
                    {isFreeTier(listing.tier) ? "free" : listing.tier}
                  </strong>
                </p>
                {!listing.claimed && (
                  <p className="mb-0 mt-3 text-[0.9rem] text-ink-soft">
                    Not claimed yet?{" "}
                    <Link href={`/claim?slug=${listing.slug}`} className="font-semibold text-clay">
                      Claim it free first
                    </Link>{" "}
                    — you&apos;ll get your own page and an edit link. You can upgrade any time.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-[1120px] px-5">
            <PricingPicker
              siteName={BRAND.name}
              listingSlug={listing?.slug}
              listingName={listing?.name}
              initialInterest={initialInterest}
            />

            <p className="mx-auto mt-6 max-w-[62ch] text-center text-[0.82rem] text-ink-soft">
              {pricingNote()} Prices in ZAR per month. We reply within one business day to confirm your details and
              how to pay — nothing is charged until you agree.
              {IS_ZATOURS
                ? " KwaZulu-Natal listings on the R22 corridor also appear on Route22."
                : " Your listing also appears on ZAtours, South Africa's national tourism directory."}
            </p>

            <div className="mx-auto mt-16 grid max-w-[900px] gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-2 text-[1.15rem]">Is the free listing really free?</h2>
                <p className="m-0 text-[0.95rem] text-ink-soft">
                  Yes. Your name, category and town stay in the directory at no cost. Claim it to
                  get your own page and a private link to edit your details.
                </p>
              </div>
              <div>
                <h2 className="mb-2 text-[1.15rem]">What does “verified &amp; bookable” mean?</h2>
                <p className="m-0 text-[0.95rem] text-ink-soft">
                  The badge shows while your listing is linked to an active OpDesk subscription.
                  Guest enquiries go straight into your OpDesk bookings, and you can choose to show
                  live availability.{" "}
                  <a href={opdeskBundle.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-clay">
                    About OpDesk ↗
                  </a>
                </p>
              </div>
              <div>
                <h2 className="mb-2 text-[1.15rem]">Who runs {BRAND.name}?</h2>
                <p className="m-0 text-[0.95rem] text-ink-soft">
                  {BRAND.fullName} is a trading line of OpDesk (Pty) Ltd. We&apos;re a directory, not
                  a tour operator — travellers contact and book with you directly.
                </p>
              </div>
              <div>
                <h2 className="mb-2 text-[1.15rem]">Can I change plans later?</h2>
                <p className="m-0 text-[0.95rem] text-ink-soft">
                  Yes — move between Free, Premium and Featured as your season changes. Just reply to
                  any of our emails or send the form again.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
