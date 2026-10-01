"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Opportunity, OpportunityType, typeLabel } from "@/lib/opportunities";

const types: { key: "all" | OpportunityType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "job", label: "Jobs" },
  { key: "internship", label: "Internships" },
  { key: "volunteer", label: "Volunteer" },
  { key: "learnership", label: "Learnerships" },
  { key: "tender", label: "Tenders" },
  { key: "other", label: "Other" },
];

export default function OpportunitiesBoard({
  opportunities,
  isExample,
}: {
  opportunities: Opportunity[];
  isExample: boolean;
}) {
  const [active, setActive] = useState<"all" | OpportunityType>("all");

  const shown = useMemo(
    () => (active === "all" ? opportunities : opportunities.filter((o) => o.type === active)),
    [active, opportunities]
  );

  return (
    <>
      {isExample && (
        <div className="mb-5 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
          Showing <strong>example opportunities</strong> — this is where real postings appear.{" "}
          <Link href="#post-opportunity" className="whitespace-nowrap font-semibold text-clay no-underline">
            Post an opportunity →
          </Link>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2.5">
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-full border px-4 py-2 text-[0.88rem] font-medium transition ${
              active === t.key
                ? "border-bush bg-bush text-white"
                : "border-line bg-paper text-ink-soft hover:border-clay"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
        {shown.map((o) => (
          <Link
            key={o.slug}
            href={`/opportunities/${o.slug}`}
            className={`group flex flex-col gap-1.5 rounded-xl2 bg-paper p-4 no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
              o.tier === "featured" ? "border-2 border-clay" : "border border-line"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ocean">
                {typeLabel[o.type]}
              </span>
              {o.tier === "featured" && (
                <span className="rounded-full bg-clay px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-white">
                  Featured
                </span>
              )}
            </div>
            <h3 className="m-0 text-[1.1rem] text-ink group-hover:text-clay">{o.title}</h3>
            <span className="text-[0.82rem] text-ink-soft">
              {o.organisation} · {o.location}
            </span>
            <p className="m-0 text-[0.88rem] text-ink-soft">{o.description}</p>
            <span className="mt-auto pt-2.5 text-[0.85rem] font-semibold text-clay">
              View details →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
