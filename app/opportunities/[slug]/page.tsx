import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import {
  getOpportunity,
  getOpportunities,
  getAllOpportunitySlugs,
  typeLabel,
} from "@/lib/opportunities";
import { absoluteUrl, IS_ZATOURS, route22Only } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  if (IS_ZATOURS) return [];
  const slugs = await getAllOpportunitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getOpportunity(params.slug);
  if (!result) return { title: "Not found — Route22 Zululand" };
  const { opportunity } = result;
  const title = `${opportunity.title} — ${typeLabel[opportunity.type]} at ${opportunity.organisation} | Route22`;
  const description = opportunity.description.slice(0, 155);
  const url = absoluteUrl(`/opportunities/${opportunity.slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "website", url },
    twitter: { card: "summary", title, description },
  };
}

export default async function OpportunityPage({ params }: { params: { slug: string } }) {
  route22Only(); // Route22 corridor content — 404 on ZAtours
  const result = await getOpportunity(params.slug);
  if (!result) notFound();
  const { opportunity, isExample } = result;

  const { opportunities } = await getOpportunities();
  const others = opportunities.filter((o) => o.slug !== opportunity.slug).slice(0, 4);
  const url = absoluteUrl(`/opportunities/${opportunity.slug}`);

  const isJobEligible = opportunity.type === "job" || opportunity.type === "internship";

  const jsonLd = isJobEligible
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: opportunity.title,
        description: opportunity.description,
        hiringOrganization: {
          "@type": "Organization",
          name: opportunity.organisation,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: opportunity.location,
            addressRegion: "KwaZulu-Natal",
            addressCountry: "ZA",
          },
        },
        datePosted: opportunity.createdAt ?? undefined,
        validThrough: opportunity.closesAt ?? undefined,
        employmentType: opportunity.type === "internship" ? "INTERN" : "FULL_TIME",
      }
    : null;

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden text-white" aria-label={opportunity.title}>
          <div className="bg-gradient-to-br from-clay/80 to-clay-dk/90">
            <div className="mx-auto max-w-[1120px] px-5 py-16">
              <nav className="mb-5 text-[0.85rem] text-white/80">
                <Link href="/" className="text-white/80 no-underline hover:text-white">
                  Route22
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <Link href="/opportunities" className="text-white/80 no-underline hover:text-white">
                  Opportunities
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <span className="text-white">{opportunity.title}</span>
              </nav>
              {opportunity.tier === "featured" && (
                <span className="mr-2 inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                  Featured
                </span>
              )}
              <span className="inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                {typeLabel[opportunity.type]}
              </span>
              <h1 className="mb-3 mt-4 max-w-[24ch] text-[clamp(2rem,5vw,3.2rem)]">
                {opportunity.title}
              </h1>
              <p className="max-w-[60ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/90">
                {opportunity.organisation} · {opportunity.location}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1120px] px-5 py-14">
          {isExample && (
            <div className="mb-8 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
              This is an <strong>example opportunity</strong> shown for layout purposes — real
              postings appear here once published.{" "}
              <Link
                href="/opportunities#post-opportunity"
                className="whitespace-nowrap font-semibold text-clay no-underline"
              >
                Post an opportunity →
              </Link>
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-[1fr_300px]">
            <article>
              <h2 className="mb-2 text-[1.5rem]">Description</h2>
              <p className="m-0 leading-relaxed text-ink-soft">{opportunity.description}</p>

              {opportunity.requirements && (
                <div className="mt-9">
                  <h2 className="mb-2 text-[1.5rem]">Requirements</h2>
                  <p className="m-0 leading-relaxed text-ink-soft">{opportunity.requirements}</p>
                </div>
              )}

              <div className="mt-9">
                <h2 className="mb-3 text-[1.1rem]">Share this opportunity</h2>
                <ShareButtons url={url} title={opportunity.title} summary={opportunity.organisation} />
              </div>

              <div className="mt-12 rounded-xl2 border border-line bg-sand p-6">
                <h3 className="mb-1 text-[1.25rem]">How to apply</h3>
                <p className="mb-4 text-[0.95rem] text-ink-soft">
                  Apply directly with {opportunity.organisation}.
                </p>
                <div className="flex flex-wrap gap-3">
                  {opportunity.applyUrl && (
                    <a
                      href={opportunity.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-clay px-5 py-2.5 font-semibold text-white no-underline hover:bg-clay-dk"
                    >
                      Apply online
                    </a>
                  )}
                  {opportunity.applyEmail && (
                    <a
                      href={`mailto:${opportunity.applyEmail}?subject=${encodeURIComponent(
                        `Application: ${opportunity.title}`
                      )}`}
                      className="rounded-full border-2 border-bush px-5 py-2.5 font-semibold text-bush no-underline hover:bg-bush hover:text-white"
                    >
                      Apply by email
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
                      Type
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{typeLabel[opportunity.type]}</dd>
                  </div>
                  <div className="mb-3 border-b border-line pb-3">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Organisation
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{opportunity.organisation}</dd>
                  </div>
                  <div className="mb-3 border-b border-line pb-3">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Location
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{opportunity.location}</dd>
                  </div>
                  <div className="mb-3 last:border-0 last:pb-0">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Closes
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">
                      {opportunity.closesAt ?? "Open until filled"}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          {others.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h2 className="mb-5 text-[1.4rem]">More opportunities</h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/opportunities/${o.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper no-underline shadow-card transition hover:-translate-y-1"
                  >
                    <div className="p-3.5">
                      <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ocean">
                        {typeLabel[o.type]}
                      </span>
                      <h3 className="m-0 text-[1rem] text-ink group-hover:text-clay">{o.title}</h3>
                      <span className="text-[0.75rem] text-ink-soft">{o.organisation}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
