import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteHubMap from "@/components/RouteHubMap";
import { CommunityCard, ListingCard } from "@/components/ListingCard";
import { getRoute } from "@/lib/routes";
import { getListings } from "@/lib/listings";
import { BRAND } from "@/lib/brand";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const route = await getRoute(params.slug);
  if (!route) return { title: `Not found — ${BRAND.fullName}` };
  const title = `${route.name} — ${route.kind === "association" ? "tourism association" : "tourism route"} | ${BRAND.name}`;
  const description = route.summary || `${route.name}: the route and its member businesses on ${BRAND.name}.`;
  const url = absoluteUrl(`/routes/${route.slug}`);
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website" } };
}

export default async function RoutePage({ params }: { params: { slug: string } }) {
  const route = await getRoute(params.slug);
  if (!route) notFound();
  const { listings, isExample } = await getListings();
  const members = isExample ? [] : listings.filter((l) => l.routes?.some((r) => r.slug === route.slug));
  const full = members.filter((m) => m.tier !== "community");
  const community = members.filter((m) => m.tier === "community");
  // Map pins are a paid perk (Premium / Featured), same as the main map.
  const pinned = members.filter(
    (m) => (m.tier === "premium" || m.tier === "featured") && typeof m.lat === "number" && typeof m.lng === "number"
  );

  return (
    <>
      <Header />
      <main>
        <section className="bg-bush-dk py-14 text-white">
          <div className="mx-auto max-w-[1120px] px-5">
            <p className="mb-2 text-[0.8rem]">
              <Link href="/routes" className="text-white/80 no-underline hover:text-white">Routes</Link>
              <span className="opacity-60"> / </span>
              <span className="text-white/80">{route.name}</span>
            </p>
            <div className="flex flex-wrap items-center gap-5">
              {route.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={route.logoUrl} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-xl bg-white object-contain p-1" />
              )}
              <div>
                <p className="m-0 text-[0.75rem] font-bold uppercase tracking-[2px] text-gold">
                  {route.kind === "association" ? "Tourism association" : "Tourism route"}
                  {route.region ? ` · ${route.region}` : ""}
                </p>
                <h1 className="m-0 text-[clamp(1.9rem,4.5vw,2.8rem)] text-white">{route.name}</h1>
              </div>
            </div>
            {route.summary && <p className="mt-4 max-w-[62ch] text-white/85">{route.summary}</p>}
            {route.websiteUrl && (
              <a href={route.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-gold">
                Official website ↗
              </a>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-5 py-12">
          {route.description && (
            <p className="mb-10 max-w-[70ch] whitespace-pre-line text-[1.02rem] leading-relaxed text-ink">{route.description}</p>
          )}
          {(pinned.length > 0 || route.path.length > 1) && (
            <div className="mb-12">
              <h2 className="mb-4 text-[1.4rem]">On the map</h2>
              <RouteHubMap path={route.path} members={pinned} />
            </div>
          )}

          <h2 className="mb-5 text-[1.4rem]">
            Member businesses <span className="text-ink-soft">({members.length})</span>
          </h2>
          {members.length === 0 ? (
            <p className="text-ink-soft">Member businesses are being added.</p>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
                {full.map((l) => <ListingCard key={l.id} l={l} showProvince />)}
              </div>
              {community.length > 0 && (
                <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
                  {community.map((l) => <CommunityCard key={l.id} l={l} showProvince />)}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
