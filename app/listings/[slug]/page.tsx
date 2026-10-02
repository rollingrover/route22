import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import ListingMap from "@/components/ListingMap";
import ReviewsSection from "@/components/ReviewsSection";
import { getListing, getListings, getAllListingSlugs } from "@/lib/listings";
import { getReviews, REVIEWS_ENABLED } from "@/lib/reviews";
import ListingEnquiryForm from "@/components/ListingEnquiryForm";
import { categoryHue, categoryLabel, categoryLabels, hasCategory, isFreeTier, listingCategories, partnerBadge } from "@/lib/data";
import { absoluteUrl, canonicalListingUrl, IS_ZATOURS } from "@/lib/site";
import { BRAND } from "@/lib/brand";
import OwnerLink from "@/components/OwnerLink";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getListing(params.slug);
  if (!result) return { title: `Not found — ${BRAND.fullName}` };
  const { listing, isExample } = result;
  const title = `${listing.name} — ${categoryLabels(listing)} in ${listing.location} | ${BRAND.name}`;
  const description =
    listing.desc ||
    (IS_ZATOURS
      ? `${listing.name}, a ${categoryLabel[listing.category].toLowerCase()} listing in ${listing.location}, ${listing.province ?? "South Africa"}. Enquire directly on ZAtours.`
      : `${listing.name}, a ${categoryLabel[listing.category].toLowerCase()} listing in ${listing.location} on the Route22 Elephant Coast route.`);
  // ZAtours is the canonical home for listings shown on both sites.
  const canonical = canonicalListingUrl(listing);
  const ownUrl = absoluteUrl(`/listings/${listing.slug}`);
  return {
    title,
    description,
    alternates: { canonical },
    ...(isExample ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      url: ownUrl,
      ...(listing.photoUrl ? { images: [listing.photoUrl] } : {}),
    },
    twitter: {
      card: listing.photoUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(listing.photoUrl ? { images: [listing.photoUrl] } : {}),
    },
  };
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
  const result = await getListing(params.slug);
  if (!result) notFound();
  const { listing, isExample } = result;

  const [{ listings }, reviews] = await Promise.all([getListings(), getReviews(listing.slug)]);
  const others = listings.filter((l) => l.slug !== listing.slug && l.tier !== "community");
  // ZAtours: same province first; Route22: everything is "along the route".
  const nearby = (
    IS_ZATOURS
      ? [
          ...others.filter((l) => l.province && l.province === listing.province),
          ...others.filter((l) => !l.province || l.province !== listing.province),
        ]
      : others.filter((l) => listingCategories(l).some((c) => c !== "tours"))
  ).slice(0, 4);
  const url = absoluteUrl(`/listings/${listing.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": hasCategory(listing, "stay") ? "LodgingBusiness" : "LocalBusiness",
    name: listing.name,
    description: listing.desc,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.location,
      addressRegion: listing.province || "KwaZulu-Natal",
      addressCountry: "ZA",
    },
    ...(listing.lat && listing.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: listing.lat, longitude: listing.lng } }
      : {}),
    ...(reviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length,
          },
        }
      : {}),
    url,
  };

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden text-white" aria-label={listing.name}>
          <div className={`bg-gradient-to-br ${categoryHue[listing.category]}`}>
            <div className="mx-auto max-w-[1120px] px-5 py-16">
              <nav className="mb-5 text-[0.85rem] text-white/80">
                <Link href="/" className="text-white/80 no-underline hover:text-white">
                  {BRAND.name}
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <Link href={BRAND.directoryHref} className="text-white/80 no-underline hover:text-white">
                  {IS_ZATOURS ? "Directory" : "Stay & Do"}
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <span className="text-white">{listing.name}</span>
              </nav>
              {listing.tier !== "basic" && (
                <span className="mr-2 inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                  {listing.tier}
                </span>
              )}
              <span className="mr-2 inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                {categoryLabels(listing)}
              </span>
              {partnerBadge(listing) && (
                <span className="mr-2 inline-block rounded-full bg-ocean px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                  {partnerBadge(listing)}
                </span>
              )}
              {listing.claimed && (
                <span className="inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                  Owner verified
                </span>
              )}
              <h1 className="mb-3 mt-4 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)]">{listing.name}</h1>
              <p className="max-w-[60ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/90">
                {BRAND.listingContext(listing)}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1120px] px-5 py-14">
          {isExample && (
            <div className="mb-8 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
              This is an <strong>example listing</strong> shown for layout purposes — real {BRAND.name}
              partners appear here once published.{" "}
              <Link href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
                List your business →
              </Link>
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-[1fr_300px]">
            <article>
              <p className="text-[1.12rem] leading-relaxed text-ink-soft">
                {listing.desc ||
                  (IS_ZATOURS
                    ? `${listing.name} is listed in the ZAtours directory of places to stay and things to do in South Africa.`
                    : `${listing.name} is part of the Route22 directory of places to stay and things to do along the Elephant Coast.`)}
              </p>

              {/* Map location is a paid perk (Premium / Featured). */}
              {listing.lat && listing.lng && !isFreeTier(listing.tier) && (
                <div className="mt-9">
                  <h2 className="mb-3 text-[1.1rem]">Location</h2>
                  <ListingMap lat={listing.lat} lng={listing.lng} name={listing.name} />
                </div>
              )}

              <div className="mt-9">
                <h2 className="mb-3 text-[1.1rem]">Share this listing</h2>
                <ShareButtons url={url} title={listing.name} summary={listing.desc} />
              </div>

              {REVIEWS_ENABLED && !isExample && (
                <div className="mt-9 border-t border-line pt-9">
                  <ReviewsSection slug={listing.slug} initialReviews={reviews} />
                </div>
              )}

              <div className="mt-12 rounded-xl2 border border-line bg-sand p-6">
                <h3 id="enquire" className="mb-1 text-[1.25rem]">Enquire with {listing.name}</h3>
                <p className="mb-0 text-[0.95rem] text-ink-soft">
                  {listing.verified
                    ? "Verified operator — your enquiry goes straight into their OpDesk bookings inbox."
                    : `Send your dates and questions and ${listing.name} will reply by email.`}
                  {IS_ZATOURS &&
                    " ZAtours is a directory, not a tour operator — you deal with the business directly."}
                </p>
                {!isExample && <ListingEnquiryForm slug={listing.slug} name={listing.name} />}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={BRAND.directoryHref}
                    className="rounded-full border-2 border-bush px-5 py-2.5 font-semibold text-bush no-underline hover:bg-bush hover:text-white"
                  >
                    Back to the directory
                  </Link>
                </div>
                {!isExample && isFreeTier(listing.tier) ? (
                  <p className="mb-0 mt-5 text-[0.8rem]">
                    <OwnerLink slug={listing.slug} claimed={listing.claimed} />
                  </p>
                ) : (
                  !listing.claimed && (
                    <p className="mb-0 mt-5 text-[0.8rem]">
                      <Link
                        href={`/claim?slug=${listing.slug}`}
                        rel="nofollow"
                        className="text-ink-soft underline decoration-line underline-offset-2 hover:text-clay"
                      >
                        Is this your business? Claim it
                      </Link>
                    </p>
                  )
                )}
              </div>
            </article>

            <aside className="md:pt-1">
              <div className="rounded-xl2 border border-line bg-paper p-5 shadow-card">
                <h3 className="mb-3 text-[0.8rem] uppercase tracking-[1.5px] text-bush">
                  Quick facts
                </h3>
                <dl className="m-0">
                  <div className="mb-3 border-b border-line pb-3">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Category
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{categoryLabels(listing)}</dd>
                  </div>
                  <div className="mb-3 border-b border-line pb-3">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Location
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{listing.location}</dd>
                  </div>
                  <div className="mb-3 last:border-0 last:pb-0">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Tier
                    </dt>
                    <dd className="m-0 text-[0.95rem] capitalize text-ink">{listing.tier}</dd>
                  </div>
                </dl>
              </div>

              {(listing.phone || listing.websiteUrl) && (
                <div className="mt-4 rounded-xl2 border border-line bg-paper p-5 shadow-card">
                  <h3 className="mb-3 text-[0.8rem] uppercase tracking-[1.5px] text-bush">
                    Contact
                  </h3>
                  <div className="flex flex-col gap-2">
                    {listing.phone && (
                      <a
                        href={`tel:${listing.phone}`}
                        className="text-[0.9rem] font-semibold text-clay no-underline"
                      >
                        {listing.phone}
                      </a>
                    )}
                    {listing.websiteUrl && (
                      <a
                        href={listing.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.9rem] font-semibold text-clay no-underline"
                      >
                        Visit website ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {nearby.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h2 className="mb-5 text-[1.4rem]">{BRAND.moreHeading}</h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {nearby.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/listings/${l.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper no-underline shadow-card transition hover:-translate-y-1"
                  >
                    <div className={`h-[70px] bg-gradient-to-br ${categoryHue[l.category]}`} />
                    <div className="p-3.5">
                      <h3 className="m-0 text-[1rem] text-ink group-hover:text-clay">{l.name}</h3>
                      <span className="text-[0.75rem] text-ink-soft">{categoryLabel[l.category]}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
