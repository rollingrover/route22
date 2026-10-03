import type { Metadata } from "next";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
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
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/alternates";
import type { Category } from "@/lib/data";
import { getRouteMemberships } from "@/lib/routes";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const result = await getListing(params.slug);
  const tm = await getTranslations({ locale: params.locale, namespace: "Meta" });
  const tcm = await getTranslations({ locale: params.locale, namespace: "Categories" });
  if (!result) return { title: `Not found — ${BRAND.fullName}` };
  const { listing, isExample } = result;
  const catText = categoryLabels(listing, 2, (c: Category) => tcm(c));
  const title = `${tm("listingTitle", { name: listing.name, category: catText, location: listing.location })} | ${BRAND.name}`;
  const description =
    listing.desc ||
    (params.locale !== "en" ? tm("listingDesc", { name: listing.name, category: catText, location: listing.location, brand: BRAND.name }) : null) ||
    (IS_ZATOURS
      ? `${listing.name}, a ${categoryLabel[listing.category].toLowerCase()} listing in ${listing.location}, ${listing.province ?? "South Africa"}. Enquire directly on ZAtours.`
      : `${listing.name}, a ${categoryLabel[listing.category].toLowerCase()} listing in ${listing.location} on the Route22 Elephant Coast route.`);
  // ZAtours is the canonical home for listings shown on both sites.
  const canonical = canonicalListingUrl(listing);
  const ownUrl = absoluteUrl(`/listings/${listing.slug}`);
  return {
    title,
    description,
    // English keeps the cross-site canonical (ZAtours is home); translations self-canonicalise.
    alternates: localeAlternates(`/listings/${listing.slug}`, params.locale, params.locale === "en" ? canonical : undefined),
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

export default async function ListingPage({ params }: { params: { slug: string; locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Listing");
  const tc = await getTranslations("Categories");
  const tcard = await getTranslations("Card");
  const tdir = await getTranslations("Directory");
  const cat = (c: Category) => tc(c);
  const result = await getListing(params.slug);
  if (!result) notFound();
  const { listing, isExample } = result;
  const memberOf = isExample ? [] : (await getRouteMemberships()).get(listing.slug) ?? [];

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
      addressCountry: listing.country || "ZA",
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
                  {IS_ZATOURS ? t("directory") : t("stayDo")}
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
                {categoryLabels(listing, 3, cat)}
              </span>
              {partnerBadge(listing) && (
                <span className="mr-2 inline-block rounded-full bg-ocean px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                  {partnerBadge(listing) === "Verified & bookable" ? tcard("verified") : partnerBadge(listing)}
                </span>
              )}
              {listing.claimed && (
                <span className="inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                  Owner verified
                </span>
              )}
              <h1 className="mb-3 mt-4 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)]">{listing.name}</h1>
              <p className="max-w-[60ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/90">
                {IS_ZATOURS
                  ? [listing.location, listing.province && listing.province !== listing.location ? listing.province : null,
                      new Intl.DisplayNames([params.locale], { type: "region" }).of(listing.country || "ZA")]
                      .filter(Boolean)
                      .join(" · ")
                  : BRAND.listingContext(listing)}
              </p>
              {memberOf.length > 0 && (
                <p className="m-0 mt-2 flex flex-wrap gap-2">
                  {memberOf.map((r) => (
                    <Link key={r.slug} href={`/routes/${r.slug}`} className="rounded-full bg-white/15 px-3 py-1 text-[0.75rem] font-semibold text-white no-underline backdrop-blur hover:bg-white/25">
                      {t("memberOf", { name: r.name })}
                    </Link>
                  ))}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1120px] px-5 py-14">
          {isExample && (
            <div className="mb-8 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
              {t.rich("example", { b: (c) => <strong>{c}</strong>, brand: BRAND.name })}{" "}
              <NextLink href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
                {tdir("listBusiness")}
              </NextLink>
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-[1fr_300px]">
            <article>
              <p className="text-[1.12rem] leading-relaxed text-ink-soft">
                {listing.desc ||
                  (IS_ZATOURS
                    ? t("descZatours", { name: listing.name })
                    : t("descRoute22", { name: listing.name }))}
              </p>

              {/* Map location is a paid perk (Premium / Featured). */}
              {listing.lat && listing.lng && !isFreeTier(listing.tier) && (
                <div className="mt-9">
                  <h2 className="mb-3 text-[1.1rem]">{t("location")}</h2>
                  <ListingMap lat={listing.lat} lng={listing.lng} name={listing.name} />
                </div>
              )}

              <div className="mt-9">
                <h2 className="mb-3 text-[1.1rem]">{t("share")}</h2>
                <ShareButtons url={url} title={listing.name} summary={listing.desc} />
              </div>

              {REVIEWS_ENABLED && !isExample && (
                <div className="mt-9 border-t border-line pt-9">
                  <ReviewsSection slug={listing.slug} initialReviews={reviews} />
                </div>
              )}

              <div className="mt-12 rounded-xl2 border border-line bg-sand p-6">
                <h3 id="enquire" className="mb-1 text-[1.25rem]">{t("enquireWith", { name: listing.name })}</h3>
                <p className="mb-0 text-[0.95rem] text-ink-soft">
                  {listing.verified
                    ? t("verifiedNote")
                    : t("replyNote", { name: listing.name })}
                  {IS_ZATOURS &&
                    ` ${t("directoryNote")}`}
                </p>
                {!isExample && <ListingEnquiryForm slug={listing.slug} name={listing.name} />}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={BRAND.directoryHref}
                    className="rounded-full border-2 border-bush px-5 py-2.5 font-semibold text-bush no-underline hover:bg-bush hover:text-white"
                  >
                    {t("back")}
                  </Link>
                </div>
                {!isExample && isFreeTier(listing.tier) ? (
                  <p className="mb-0 mt-5 text-[0.8rem]">
                    <OwnerLink slug={listing.slug} claimed={listing.claimed} />
                  </p>
                ) : (
                  !listing.claimed && (
                    <p className="mb-0 mt-5 text-[0.8rem]">
                      <NextLink
                        href={`/claim?slug=${listing.slug}`}
                        rel="nofollow"
                        className="text-ink-soft underline decoration-line underline-offset-2 hover:text-clay"
                      >
                        {t("claimIt")}
                      </NextLink>
                    </p>
                  )
                )}
              </div>
            </article>

            <aside className="md:pt-1">
              <div className="rounded-xl2 border border-line bg-paper p-5 shadow-card">
                <h3 className="mb-3 text-[0.8rem] uppercase tracking-[1.5px] text-bush">
                  {t("quickFacts")}
                </h3>
                <dl className="m-0">
                  <div className="mb-3 border-b border-line pb-3">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      {t("category")}
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{categoryLabels(listing, 3, cat)}</dd>
                  </div>
                  <div className="mb-0">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      {t("location")}
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{listing.location}</dd>
                  </div>
                </dl>
              </div>

              {(listing.phone || listing.websiteUrl) && (
                <div className="mt-4 rounded-xl2 border border-line bg-paper p-5 shadow-card">
                  <h3 className="mb-3 text-[0.8rem] uppercase tracking-[1.5px] text-bush">
                    {t("contact")}
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
                        {t("website")}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {nearby.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h2 className="mb-5 text-[1.4rem]">{IS_ZATOURS ? t("more") : t("moreRoute")}</h2>
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
