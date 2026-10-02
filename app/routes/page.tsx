import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getRoutes } from "@/lib/routes";
import { BRAND } from "@/lib/brand";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

const title = `Tourism routes & associations | ${BRAND.name}`;
const description =
  "Birding, wildlife, heritage and community tourism routes — explore each route and the member businesses along it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/routes") },
  openGraph: { title, description, url: absoluteUrl("/routes"), type: "website" },
};

export default async function RoutesPage() {
  const routes = await getRoutes();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1120px] px-5 py-14">
        <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[2px] text-clay">Routes &amp; associations</p>
        <h1 className="mb-3 text-[clamp(1.9rem,4.5vw,2.8rem)]">Tourism routes</h1>
        <p className="mb-10 max-w-[62ch] text-ink-soft">{description}</p>

        {routes.length === 0 ? (
          <div className="rounded-xl2 border border-line bg-paper p-8 text-ink-soft">
            The first routes are being set up now.{" "}
            <Link href="/list-your-business#routes" className="font-semibold text-clay">
              Run a route or tourism association? Put it on {BRAND.name} →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {routes.map((r) => (
              <Link
                key={r.id}
                href={`/routes/${r.slug}`}
                className="group flex flex-col rounded-xl2 border border-line bg-paper p-6 no-underline shadow-card transition hover:-translate-y-1"
              >
                <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ocean">
                  {r.kind === "association" ? "Tourism association" : "Tourism route"}
                  {r.region ? ` · ${r.region}` : ""}
                </span>
                <h2 className="mb-2 mt-1 text-[1.3rem] text-ink group-hover:text-clay">{r.name}</h2>
                {r.summary && <p className="m-0 flex-1 text-[0.92rem] text-ink-soft">{r.summary}</p>}
                <span className="mt-4 text-[0.85rem] font-semibold text-clay">
                  {r.memberCount} member {r.memberCount === 1 ? "business" : "businesses"} →
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-14 rounded-xl2 border border-dashed border-clay bg-sand-2 p-6 text-[0.95rem] text-ink-soft">
          <strong className="text-ink">Run a route or tourism association?</strong> Get a route page with
          your map, story and every member business, plus a &ldquo;Member of&rdquo; badge on their listings.{" "}
          <Link href="/list-your-business#routes" className="font-semibold text-clay">
            See Route Hub packages →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
