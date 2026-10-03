import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { parks, getPark } from "@/lib/parks";
import { absoluteUrl, IS_ZATOURS, route22Only } from "@/lib/site";

// Pre-render every park page at build time.
export function generateStaticParams() {
  if (IS_ZATOURS) return [];
  return parks.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const park = getPark(params.slug);
  if (!park) return { title: "Not found — Route22 Zululand" };
  const url = absoluteUrl(`/parks/${park.slug}`);
  return {
    title: park.seoTitle,
    description: park.seoDescription,
    keywords: park.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: park.seoTitle,
      description: park.seoDescription,
      type: "article",
      url,
    },
    twitter: { card: "summary_large_image", title: park.seoTitle, description: park.seoDescription },
  };
}

export default function ParkPage({ params }: { params: { slug: string } }) {
  route22Only(); // Route22 corridor content — 404 on ZAtours
  const park = getPark(params.slug);
  if (!park) notFound();

  const others = parks.filter((p) => p.slug !== park.slug).slice(0, 4);
  const url = absoluteUrl(`/parks/${park.slug}`);

  // TouristAttraction structured data for richer search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: park.name,
    description: park.seoDescription,
    keywords: park.keywords.join(", "),
    address: {
      "@type": "PostalAddress",
      addressRegion: "KwaZulu-Natal",
      addressCountry: "ZA",
    },
    isAccessibleForFree: false,
    touristType: "Wildlife, nature and safari travellers",
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden text-white"
          aria-label={park.name}
        >
          <div className={`bg-gradient-to-br ${park.hue}`}>
            <div className="mx-auto max-w-[1120px] px-5 py-16">
              <nav className="mb-5 text-[0.85rem] text-white/80">
                <Link href="/" className="text-white/80 no-underline hover:text-white">
                  Route22
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <Link href="/#highlights" className="text-white/80 no-underline hover:text-white">
                  Parks
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <span className="text-white">{park.shortName}</span>
              </nav>
              <span className="inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                {park.kind} · {park.region}
              </span>
              <h1 className="mb-3 mt-4 max-w-[18ch] text-[clamp(2rem,5vw,3.2rem)]">{park.name}</h1>
              <p className="max-w-[60ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/90">
                {park.tagline}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1120px] px-5 py-14">
          <div className="grid gap-10 md:grid-cols-[1fr_300px]">
            {/* Main content */}
            <article>
              <p className="text-[1.12rem] leading-relaxed text-ink-soft">{park.heroBlurb}</p>

              {park.sections.map((s) => (
                <div key={s.heading} className="mt-9">
                  <h2 className="mb-2 text-[1.5rem]">{s.heading}</h2>
                  <p className="m-0 leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              ))}

              <div className="mt-9">
                <h2 className="mb-3 text-[1.1rem]">Share this page</h2>
                <ShareButtons url={url} title={park.name} summary={park.tagline} />
              </div>

              {/* CTA */}
              <div className="mt-12 rounded-xl2 border border-line bg-sand p-6">
                <h3 className="mb-1 text-[1.25rem]">Planning a visit to {park.shortName}?</h3>
                <p className="mb-4 text-[0.95rem] text-ink-soft">
                  Find lodges, camps, tours and activities near {park.shortName} in the Route22
                  directory — or list your own business on the route.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/#listings"
                    className="rounded-full bg-clay px-5 py-2.5 font-semibold text-white no-underline hover:bg-clay-dk"
                  >
                    Where to stay &amp; do
                  </Link>
                  <Link
                    href="/#partner"
                    className="rounded-full border-2 border-bush px-5 py-2.5 font-semibold text-bush no-underline hover:bg-bush hover:text-white"
                  >
                    List your business
                  </Link>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="md:pt-1">
              <div className="rounded-xl2 border border-line bg-paper p-5 shadow-card">
                <h3 className="mb-3 text-[0.8rem] uppercase tracking-[1.5px] text-bush">
                  Quick facts
                </h3>
                <dl className="m-0">
                  {park.quickFacts.map((f) => (
                    <div key={f.label} className="mb-3 border-b border-line pb-3 last:border-0 last:pb-0">
                      <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                        {f.label}
                      </dt>
                      <dd className="m-0 text-[0.95rem] text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>

          {/* Other parks */}
          <div className="mt-16 border-t border-line pt-10">
            <h2 className="mb-5 text-[1.4rem]">More stops along the route</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/parks/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper no-underline shadow-card transition hover:-translate-y-1"
                >
                  <div className={`h-[70px] bg-gradient-to-br ${p.hue}`} />
                  <div className="p-3.5">
                    <h3 className="m-0 text-[1rem] text-ink group-hover:text-clay">{p.shortName}</h3>
                    <span className="text-[0.75rem] text-ink-soft">{p.kind}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
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
