"use client";

import { useMemo, useState } from "react";
import { Category, categoryLabel, Listing } from "@/lib/data";
import { CommunityCard, ListingCard } from "./ListingCard";

// ZAtours national directory: search + category + province filters, all
// client-side over the server-rendered list (full list is in the HTML for SEO).
export default function ZaDirectory({
  listings,
  isExample,
}: {
  listings: Listing[];
  isExample: boolean;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [prov, setProv] = useState("all");

  const categories = useMemo(() => {
    const counts = new Map<Category, number>();
    listings.forEach((l) => counts.set(l.category, (counts.get(l.category) ?? 0) + 1));
    return (Object.keys(categoryLabel) as Category[])
      .filter((c) => counts.has(c))
      .map((c) => ({ key: c, label: categoryLabel[c], count: counts.get(c) ?? 0 }));
  }, [listings]);

  const provinces = useMemo(
    () =>
      Array.from(new Set(listings.map((l) => l.province).filter(Boolean) as string[])).sort(),
    [listings]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings.filter(
      (l) =>
        (cat === "all" || l.category === cat) &&
        (prov === "all" || l.province === prov) &&
        (!needle ||
          [l.name, l.location, l.province, l.desc, categoryLabel[l.category]]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(needle)))
    );
  }, [listings, q, cat, prov]);

  const full = filtered.filter((l) => l.tier !== "community");
  const community = filtered.filter((l) => l.tier === "community");

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[0.88rem] font-medium transition ${
      active ? "border-bush bg-bush text-white" : "border-line bg-paper text-ink-soft hover:border-bush"
    }`;

  return (
    <section id="directory" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[640px]">
            <h2 className="mb-1">Browse the directory</h2>
            <p className="m-0 text-ink-soft">
              Places to stay, tours, safaris, transfers and experiences — contact each business
              directly.
            </p>
          </div>
        </div>

        {isExample && (
          <div className="mb-5 rounded-xl border border-dashed border-clay bg-sand-2 px-4 py-3 text-[0.9rem] text-ink-soft">
            Showing <strong>example listings</strong> while the directory fills up.{" "}
            <a href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
              List your business →
            </a>
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 rounded-xl2 border border-line bg-paper p-3 shadow-card sm:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-[10px] bg-sand px-3">
            <span aria-hidden="true" className="text-ink-soft">
              ⌕
            </span>
            <span className="sr-only">Search</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, town or activity"
              className="w-full border-0 bg-transparent py-3 text-ink outline-none"
            />
          </label>
          {provinces.length > 1 && (
            <label className="flex items-center">
              <span className="sr-only">Province</span>
              <select
                value={prov}
                onChange={(e) => setProv(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-sand px-3 py-3 text-ink sm:w-auto"
              >
                <option value="all">All provinces</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="mb-6 flex flex-wrap gap-2.5">
          <button onClick={() => setCat("all")} className={chip(cat === "all")}>
            All
          </button>
          {categories.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={chip(cat === c.key)}>
              {c.label} <span className="opacity-70">({c.count})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl2 border border-line bg-paper p-6 text-ink-soft">
            Nothing matches that yet — try a different search, or check back soon as new businesses
            are added.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
              {full.map((l) => (
                <ListingCard key={l.id} l={l} showProvince />
              ))}
            </div>
            {community.length > 0 && (
              <div className="mt-12 border-t border-line pt-10">
                <h3 className="mb-1.5 text-[1.15rem]">More businesses</h3>
                <p className="mb-5 max-w-[65ch] text-[0.88rem] text-ink-soft">
                  Free directory entries for businesses that haven&apos;t set up a full page yet.
                </p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
                  {community.map((l) => (
                    <CommunityCard key={l.id} l={l} showProvince />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
