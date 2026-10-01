"use client";

import { useMemo, useState } from "react";
import { Category, Listing } from "@/lib/data";
import { CommunityCard, ListingCard } from "./ListingCard";

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
            <a href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
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
            <ListingCard key={l.id} l={l} />
          ))}
        </div>

        {community.length > 0 && (
          <div className="mt-12 border-t border-line pt-10">
            <h3 className="mb-1.5 text-[1.15rem]">Also along the route</h3>
            <p className="mb-5 max-w-[65ch] text-[0.88rem] text-ink-soft">
              Free community listings — businesses on the route that haven&apos;t yet taken a full
              Route22 page.
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {community.map((l) => (
                <CommunityCard key={l.id} l={l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
