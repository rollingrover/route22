"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Category, categoryHue, categoryLabel, Listing, partnerBadge } from "@/lib/data";

const filters: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "stay", label: "Stay" },
  { key: "wildlife", label: "Wildlife & parks" },
  { key: "ocean", label: "Diving & ocean" },
  { key: "culture", label: "Culture" },
  { key: "eat", label: "Eat & drink" },
];

export default function Listings({
  listings,
  isExample,
}: {
  listings: Listing[];
  isExample: boolean;
}) {
  const [active, setActive] = useState<"all" | Category>("all");

  // Tours & safaris have their own dedicated section — keep them out of this
  // general directory so they aren't shown twice.
  const directoryListings = useMemo(() => listings.filter((l) => l.category !== "tours"), [
    listings,
  ]);

  const filtered = useMemo(
    () =>
      active === "all" ? directoryListings : directoryListings.filter((l) => l.category === active),
    [active, directoryListings]
  );
  const shown = useMemo(() => filtered.filter((l) => l.tier !== "community"), [filtered]);
  const community = useMemo(() => filtered.filter((l) => l.tier === "community"), [filtered]);

  return (
    <section id="listings" className="py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>Where to stay &amp; what to do</h2>
          <p className="text-ink-soft">
            Lodges, camps, restaurants and experiences along the route.
          </p>
        </div>

        {isExample && (
          <div className="mb-5 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
            Showing <strong>example listings</strong> — this is where verified Route22 partners
            appear.{" "}
            <a href="#partner" className="whitespace-nowrap font-semibold text-clay no-underline">
              List your business →
            </a>
          </div>
        )}

        <div className="mb-5 flex flex-wrap gap-2.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`rounded-full border px-4 py-2 text-[0.88rem] font-medium transition ${
                active === f.key
                  ? "border-bush bg-bush text-white"
                  : "border-line bg-paper text-ink-soft hover:border-clay"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
          {shown.map((l) => (
            <Link
              key={l.id}
              href={`/listings/${l.slug}`}
              className={`group flex flex-col overflow-hidden rounded-xl2 bg-paper no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                l.tier === "featured"
                  ? "border-2 border-clay"
                  : l.tier === "premium"
                    ? "border border-clay"
                    : "border border-line"
              }`}
            >
              <div
                className={`relative h-[140px] bg-gradient-to-br ${categoryHue[l.category]}`}
                style={
                  l.photoUrl
                    ? { backgroundImage: `url(${l.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : undefined
                }
              >
                {l.tier !== "basic" && (
                  <span
                    className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white ${
                      l.tier === "featured" ? "bg-bush" : "bg-clay"
                    }`}
                  >
                    {l.tier}
                  </span>
                )}
                {(l.claimed || partnerBadge(l)) && (
                  <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1">
                    {partnerBadge(l) && (
                      <span className="rounded-full bg-ocean px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white backdrop-blur">
                        {partnerBadge(l)}
                      </span>
                    )}
                    {l.claimed && (
                      <span className="rounded-full bg-black/35 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white backdrop-blur">
                        Claimed
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ocean">
                  {categoryLabel[l.category]}
                </span>
                <h3 className="m-0 text-[1.1rem] group-hover:text-clay">{l.name}</h3>
                <span className="text-[0.82rem] text-ink-soft">{l.location}</span>
                <p className="m-0 text-[0.88rem] text-ink-soft">{l.desc}</p>
                <span
                  className={`mt-auto pt-2.5 text-[0.85rem] font-semibold ${
                    l.tier === "basic" ? "text-ink-soft" : "text-clay"
                  }`}
                >
                  {l.tier === "basic" ? "View details →" : "View & enquire →"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {community.length > 0 && (
          <div className="mt-12 border-t border-line pt-10">
            <h3 className="mb-1.5 text-[1.15rem]">Also along the route</h3>
            <p className="mb-5 max-w-[65ch] text-[0.88rem] text-ink-soft">
              Free community listings — businesses on the route that haven&apos;t yet taken a full
              Route22 page. Know one, or run one?{" "}
              <a href="#partner" className="whitespace-nowrap font-semibold text-clay no-underline">
                Get a full listing →
              </a>
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {community.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-col overflow-hidden rounded-xl2 border border-dashed border-line bg-sand"
                >
                  <div
                    className={`h-[80px] bg-gradient-to-br ${categoryHue[l.category]} opacity-80`}
                    style={
                      l.photoUrl
                        ? { backgroundImage: `url(${l.photoUrl})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 1 }
                        : undefined
                    }
                  />
                  <div className="flex flex-col gap-1 p-3.5">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wide text-ink-soft">
                      {categoryLabel[l.category]}
                    </span>
                    <h4 className="m-0 text-[0.95rem] text-ink">{l.name}</h4>
                    <span className="text-[0.78rem] text-ink-soft">{l.location}</span>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                      <a
                        href="#partner"
                        className="text-[0.8rem] font-semibold text-clay no-underline"
                      >
                        Upgrade →
                      </a>
                      <Link
                        href={`/claim?slug=${l.slug}`}
                        className="text-[0.8rem] font-semibold text-bush no-underline"
                      >
                        Is this yours? Claim it →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
