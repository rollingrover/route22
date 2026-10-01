"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Guide } from "@/lib/guides";

export default function GuidesDirectory({
  guides,
  isExample,
}: {
  guides: Guide[];
  isExample: boolean;
}) {
  const specialties = useMemo(
    () => Array.from(new Set(guides.map((g) => g.specialty))).sort(),
    [guides]
  );
  const [active, setActive] = useState<"all" | string>("all");

  const shown = useMemo(
    () => (active === "all" ? guides : guides.filter((g) => g.specialty === active)),
    [active, guides]
  );

  return (
    <>
      {isExample && (
        <div className="mb-5 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
          Showing <strong>example guides</strong> — this is where verified freelance guides appear.{" "}
          <Link href="#list-as-guide" className="whitespace-nowrap font-semibold text-clay no-underline">
            List as a guide →
          </Link>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2.5">
        <button
          onClick={() => setActive("all")}
          className={`rounded-full border px-4 py-2 text-[0.88rem] font-medium transition ${
            active === "all"
              ? "border-bush bg-bush text-white"
              : "border-line bg-paper text-ink-soft hover:border-clay"
          }`}
        >
          All
        </button>
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`rounded-full border px-4 py-2 text-[0.88rem] font-medium transition ${
              active === s
                ? "border-bush bg-bush text-white"
                : "border-line bg-paper text-ink-soft hover:border-clay"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[18px]">
        {shown.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className={`group flex flex-col overflow-hidden rounded-xl2 bg-paper no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
              g.tier === "premium" ? "border-2 border-clay" : "border border-line"
            }`}
          >
            <div className="relative h-[100px] bg-gradient-to-br from-bush/80 to-bush-dk/90">
              {g.tier === "premium" && (
                <span className="absolute left-2.5 top-2.5 rounded-full bg-clay px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white">
                  Premium
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ocean">
                {g.specialty}
              </span>
              <h3 className="m-0 text-[1.1rem] text-ink group-hover:text-clay">{g.name}</h3>
              <span className="text-[0.82rem] text-ink-soft">{g.area}</span>
              <p className="m-0 text-[0.88rem] text-ink-soft">{g.bio}</p>
              <span
                className={`mt-auto pt-2.5 text-[0.85rem] font-semibold ${
                  g.tier === "free" ? "text-ink-soft" : "text-clay"
                }`}
              >
                View profile →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
