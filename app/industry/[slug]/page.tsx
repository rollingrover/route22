import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { industryPosts, getIndustryPost } from "@/lib/industry";
import { absoluteUrl, IS_ZATOURS, route22Only } from "@/lib/site";

export function generateStaticParams() {
  if (IS_ZATOURS) return [];
  return industryPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getIndustryPost(params.slug);
  if (!post) return { title: "Not found — Route22 Zululand" };
  const url = absoluteUrl(`/industry/${post.slug}`);
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: { title: post.seoTitle, description: post.seoDescription, type: "article", url },
    twitter: { card: "summary", title: post.seoTitle, description: post.seoDescription },
  };
}

export default function IndustryPostPage({ params }: { params: { slug: string } }) {
  route22Only(); // Route22 corridor content — 404 on ZAtours
  const post = getIndustryPost(params.slug);
  if (!post) notFound();

  const others = industryPosts.filter((p) => p.slug !== post.slug).slice(0, 4);
  const url = absoluteUrl(`/industry/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription,
    keywords: post.keywords.join(", "),
    datePublished: post.publishedDate,
    url,
  };

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden text-white" aria-label={post.title}>
          <div className="bg-gradient-to-br from-ocean/85 to-bush/80">
            <div className="mx-auto max-w-[1120px] px-5 py-16">
              <nav className="mb-5 text-[0.85rem] text-white/80">
                <Link href="/" className="text-white/80 no-underline hover:text-white">
                  Route22
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <Link href="/industry" className="text-white/80 no-underline hover:text-white">
                  Industry Info
                </Link>{" "}
                <span className="opacity-60">/</span>{" "}
                <span className="text-white">{post.title}</span>
              </nav>
              <span className="inline-block rounded-full bg-black/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide backdrop-blur">
                {post.category}
              </span>
              <h1 className="mb-3 mt-4 max-w-[24ch] text-[clamp(2rem,5vw,3.2rem)]">{post.title}</h1>
              <p className="max-w-[60ch] text-[clamp(1rem,2.2vw,1.15rem)] text-white/90">
                {post.intro}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1120px] px-5 py-14">
          <div className="grid gap-10 md:grid-cols-[1fr_260px]">
            <article>
              {post.sections.map((s) => (
                <div key={s.heading} className="mt-9 first:mt-0">
                  <h2 className="mb-2 text-[1.5rem]">{s.heading}</h2>
                  <p className="m-0 leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              ))}

              <div className="mt-9">
                <h2 className="mb-3 text-[1.1rem]">Share this article</h2>
                <ShareButtons url={url} title={post.title} summary={post.intro} />
              </div>
            </article>

            <aside className="md:pt-1">
              <div className="rounded-xl2 border border-line bg-paper p-5 shadow-card">
                <h3 className="mb-3 text-[0.8rem] uppercase tracking-[1.5px] text-bush">
                  About this article
                </h3>
                <dl className="m-0">
                  <div className="mb-3 border-b border-line pb-3">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Category
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{post.category}</dd>
                  </div>
                  <div className="mb-3 last:border-0 last:pb-0">
                    <dt className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">
                      Published
                    </dt>
                    <dd className="m-0 text-[0.95rem] text-ink">{post.publishedDate}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          {others.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <h2 className="mb-5 text-[1.4rem]">More industry info</h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                {others.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/industry/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper no-underline shadow-card transition hover:-translate-y-1"
                  >
                    <div className="h-[70px] bg-gradient-to-br from-ocean/80 to-bush/80" />
                    <div className="p-3.5">
                      <h3 className="m-0 text-[1rem] text-ink group-hover:text-clay">{p.title}</h3>
                      <span className="text-[0.75rem] text-ink-soft">{p.category}</span>
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
