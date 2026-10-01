import Link from "next/link";
import { itineraries, Listing } from "@/lib/data";

export default function Itineraries({ listings }: { listings: Listing[] }) {
  return (
    <section id="itineraries" className="bg-sand-2 py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>Sample itineraries</h2>
          <p className="text-ink-soft">
            Starting points you can tailor. Longer, slower and wilder the further north you go.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px]">
          {itineraries.map((it) => {
            const sponsor = it.sponsorSlug
              ? listings.find((l) => l.slug === it.sponsorSlug)
              : undefined;
            return (
              <article
                key={it.title}
                className="flex flex-col rounded-xl2 border border-line border-t-[5px] border-t-bush bg-paper p-[22px] shadow-card"
              >
                <span className="text-[0.75rem] font-bold uppercase tracking-[1.5px] text-bush">
                  {it.days}
                </span>
                <h3 className="mb-2.5 mt-1">{it.title}</h3>
                <ol className="m-0 list-decimal pl-[1.1rem] text-[0.92rem] text-ink-soft">
                  {it.stops.map((s) => (
                    <li key={s} className="mb-1">
                      {s}
                    </li>
                  ))}
                </ol>
                {sponsor && (
                  <Link
                    href={`/listings/${sponsor.slug}`}
                    className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-[0.8rem] font-semibold text-ink-soft no-underline hover:text-clay"
                  >
                    Sponsored by {sponsor.name} →
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
