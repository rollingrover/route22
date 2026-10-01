import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { getGuide, getGuides, getAllGuideSlugs } from "@/lib/guides";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getGuide(params.slug);
  if (!result) return { title: "Not found — Route22 Zululand" };
  const { guide } = result;
  const title = `${guide.name} — ${guide.specialty} in ${guide.area} | Route22`;
  const description =
    guide.bio.slice(0, 155) ||
    `${guide.name}, a freelance ${guide.specialty.toLowerCase()} working the ${guide.area} area on the Elephant Coast route.`;
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    title,
    description,
    keywords: [
      `${guide.specialty} ${guide.area}`,
      `freelance ${guide.specialty.toLowerCase()} KwaZulu-Natal`,
      "Elephant Coast guide",
    ],
    alternates: { canonical: url },
    openGraph: { title, description, type: "profile", url },
    twitter: { card: "summary", title, description },
  };
}

export default async function GuideProfilePage({ params }: { params: { slug: string } }) {
  const result = await getGuide(params.slug);
  if (!result) notFound();
  const { guide, isExample } = result;

  const { guides } = await getGuides();
  const others = guides.filter((g) => g.slug !== guide.slug).slice(0, 4);
  const url = absoluteUrl(`/guides/${guide.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: guide.name,
    jobTitle: guide.specialty,
    description: guide.bio,
    address: {
      "@type": "PostalAddress",
      addressLocality: guide.area,
      addressRegion: "KwaZulu-Natal",
      addressCountry: "ZA",
    },
    url,
  };

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden text-white" aria-label={guide.name}>
          <div className="bg-gradient-to-br from-bush/85 to-bush-dk/90">
            <div className="mx-auto max-w-[1120px] px-5 py-16">
              <nav className="mb-5 text-[0.85rem] text-white/80">
                <Link href="/" className="text-white/80 no-underline hover:text-white">
                  Route22
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <Link href="/guides" className="text-white/80 no-underline hover:text-white">
                  Guides &amp; Drivers
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <span className="text-white">{guide.name}</span>
              </nav>
              {guide.tier === "premium" && (
                <span className="mr-2 inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                  Premium
                </span>
              )}
              <span className="inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                {guide.specialty}
              </span>
              <h1 className="mb-3 mt-4 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)]">{guide.name}</h1>
              <p className="max-w-[60ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/90">
                {guide.specialty} working {guide.area} on the Route22 Elephant Coast route.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1120px] px-5 py-14">
          {isExample && (
            <div className="mb-8 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
              This is an <strong>example profile</strong> — a fictional placeholder shown for layout
              purposes. Real freelance guides appear here once published.{" "}
              <Link href="/guides#list-as-guide" className="whitespace-nowrap font-semibold text-clay no-underline">
                List as a guide or driver →
              </Link>
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-[1fr_300px]">
            <article>
              <p className="text-[1.12rem] leading-relaxed text-ink-soft">{guide.bio}</p>

              {guide.tier === "premium" && guide.photoUrls.length > 0 && (
                <div className="mt-9">
                  <h2 className="mb-3 text-[1.5rem]">Photos</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {guide.photoUrls.slice(0, 8).map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt={`${guide.name} — photo ${i + 1}`}
                        className="aspect-square w-full rounded-xl2 border border-line object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {guide.languages.length > 0 && (
                <div className="mt-9">
                  <h2 className="mb-2 text-[1.5rem]">Languages</h2>
                  <p className="m-0 leading-relaxed text-ink-soft">{guide.languages.join(", ")}</p>
                </div>
              )}

              {guide.tier === "premium" && guide.certifications && (
                <div className="mt-9">
                  <h2 className="mb-2 text-[1.5rem]">Certifications &amp; credentials</h2>
                  <p className="m-0 leading-relaxed text-ink-soft">{guide.certifications}</p>
                </div>
              )}

              <div className="mt-9">
                <h2 className="mb-3 text-[1.1rem]">Share this profile</h2>
                <ShareButtons url={url} title={guide.name} summary={guide.specialty} />
              </div>

              <div className="mt-12 rounded-xl2 border border-line bg-sand p-6">
                <h3 className="mb-1 text-[1.25rem]">Get in touch with {guide.name}</h3>
                <p className="mb-4 text-[0.95rem] text-ink-soft">
                  {guide.tier === "premium"
                    ? "Reach out directly using any of the contact methods below."
                    : "Contact this guide to check availability and plan your trip."}
                </p>
                <div className="flex flex-wrap gap-3">
                  {guide.email && (
                    <a
                      href={`mailto:${guide.email}`}
                      className="rounded-full bg-clay px-5 py-2.5 font-semibold text-white no-underline hover:bg-clay-dk"
                    >
                      Email
                    </a>
                  )}
                  {guide.tier === "premium" && guide.phone && (
                    <a
                      href={`tel:${guide.phone}`}
                      className="rounded-full border-2 border-bush px-5 py-2.5 font-semibold text-bush no-underline hover:bg-bush hover:text-white"
                    >
                      Call
                    </a>
                  )}
                  {guide.tier === "premium" && guide.whatsapp && (
                    <a
                      href={`https://wa.me/${guide.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border-2 border-bush px-5 py-2.5 font-semibold text-bush no-underline hover:bg-bush hover:text-white"
                    >
                      WhatsApp
                    </a>
                  )}
                  {guide.tier === "premium" && guide.websiteUrl && (
                    <a
                      href={guide.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border-2 border-bush px-5 py-2.5 font-semibold text-bush no-underline hover:bg-bush hover:text-white"
                    >
                      Website
                    </a>
                  )}
                </div>
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
                      Specialty
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{guide.specialty}</dd>
                  </div>
                  <div className="mb-3 border-b border-line pb-3">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Area
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{guide.area}</dd>
                  </div>
                  <div className="mb-3 last:border-0 last:pb-0">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Profile
                    </dt>
                    <dd className="m-0 text-[0.95rem] capitalize text-ink">{guide.tier}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          {others.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h2 className="mb-5 text-[1.4rem]">More guides on the route</h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {others.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper no-underline shadow-card transition hover:-translate-y-1"
                  >
                    <div className="h-[70px] bg-gradient-to-br from-bush/80 to-bush-dk/90" />
                    <div className="p-3.5">
                      <h3 className="m-0 text-[1rem] text-ink group-hover:text-clay">{g.name}</h3>
                      <span className="text-[0.75rem] text-ink-soft">{g.specialty}</span>
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
