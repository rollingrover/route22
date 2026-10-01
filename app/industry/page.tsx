import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { industryPosts } from "@/lib/industry";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industry Info — Travel Tips, Conservation & Trip Planning | Route22",
  description:
    "Editorial resources for the Elephant Coast tourism industry and travellers: trip planning, seasonal travel tips, conservation and community tourism, and self-drive safari guidance.",
  keywords: [
    "Elephant Coast travel tips",
    "Zululand tourism resources",
    "KwaZulu-Natal trip planning",
  ],
  alternates: { canonical: absoluteUrl("/industry") },
  openGraph: {
    title: "Industry Info | Route22",
    description: "Travel tips, conservation info and trip-planning resources for the Elephant Coast.",
    type: "website",
    url: absoluteUrl("/industry"),
  },
};

export default function IndustryIndexPage() {
  return (
    <>
      <Header />
      <main>
        <section className="py-16">
          <div className="mx-auto max-w-[1120px] px-5">
            <div className="mb-8 max-w-[720px]">
              <h1>Industry info</h1>
              <p className="text-ink-soft">
                Trip-planning guides, seasonal tips, conservation background and operator resources
                for the Elephant Coast.
              </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
              {industryPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/industry/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-[100px] bg-gradient-to-br from-ocean/80 to-bush/80">
                    <span className="absolute left-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white backdrop-blur">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <h3 className="m-0 text-[1.1rem] text-ink group-hover:text-clay">{p.title}</h3>
                    <p className="m-0 text-[0.88rem] text-ink-soft">{p.intro}</p>
                    <span className="mt-auto pt-2.5 text-[0.85rem] font-semibold text-bush group-hover:text-clay">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
