"use client";

import { useTranslations } from "next-intl";

import { useMemo, useState } from "react";
import { Category, hasCategory, Listing, listingCategories } from "@/lib/data";
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
  const t = useTranslations("R22");
  const tc = useTranslations("Categories");

  // Tours & safaris have their own dedicated section — keep them out of this
  // general directory so they aren't shown twice.
  const directoryListings = useMemo(() => listings.filter((l) => listingCategories(l).some((c) => c !== "tours")), [
    listings,
  ]);

  const filtered = useMemo(
    () =>
      active === "all" ? directoryListings : directoryListings.filter((l) => hasCategory(l, active)),
    [active, directoryListings]
  );
  const shown = useMemo(() => filtered.filter((l) => l.tier !== "community"), [filtered]);
  const community = useMemo(() => filtered.filter((l) => l.tier === "community"), [filtered]);

  return (
    <section id="listings" className="py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>{t("listings.title")}</h2>
          <p className="text-ink-soft">
            {t("listings.lead")}
          </p>
        </div>

        {isExample && (
          <div className="mb-5 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
            {t.rich("listings.example", { b: (c) => <strong>{c}</strong> })}{" "}
            <a href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
              {t("listings.list")}
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
              {f.key === "all" ? t("listings.all") : tc(f.key)}
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
              {t("listings.community")}
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
