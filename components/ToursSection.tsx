import Link from "next/link";
import { categoryHue, Listing, partnerBadge } from "@/lib/data";

export default function ToursSection({
  tours,
  isExample,
}: {
  tours: Listing[];
  isExample: boolean;
}) {
  const shown = tours.filter((t) => t.tier !== "community");
  const community = tours.filter((t) => t.tier === "community");

  if (tours.length === 0) return null;

  return (
    <section id="tours" className="border-b border-line bg-sand py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>Tours &amp; safaris</h2>
          <p className="text-ink-soft">
            Safari companies and tour operators running day trips and multi-day experiences along
            the route.
          </p>
        </div>

        {isExample && (
          <div className="mb-5 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
            Showing <strong>example tour operators</strong> — this is where verified Route22 tour
            partners appear.{" "}
            <a href="#partner" className="whitespace-nowrap font-semibold text-clay no-underline">
              List your tour company →
            </a>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
          {shown.map((t) => (
            <Link
              key={t.id}
              href={`/listings/${t.slug}`}
              className={`group flex flex-col overflow-hidden rounded-xl2 bg-paper no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                t.tier === "featured"
                  ? "border-2 border-clay"
                  : t.tier === "premium"
                    ? "border border-clay"
                    : "border border-line"
              }`}
            >
              <div className={`relative h-[120px] bg-gradient-to-br ${categoryHue.tours}`}>
                {t.tier !== "basic" && (
                  <span
                    className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white ${
                      t.tier === "featured" ? "bg-bush" : "bg-clay"
                    }`}
                  >
                    {t.tier}
                  </span>
                )}
                {partnerBadge(t) && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-ocean px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white backdrop-blur">
                    {partnerBadge(t)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <h3 className="m-0 text-[1.1rem] group-hover:text-clay">{t.name}</h3>
                <span className="text-[0.82rem] text-ink-soft">{t.location}</span>
                <p className="m-0 text-[0.88rem] text-ink-soft">{t.desc}</p>
                <span
                  className={`mt-auto pt-2.5 text-[0.85rem] font-semibold ${
                    t.tier === "basic" ? "text-ink-soft" : "text-clay"
                  }`}
                >
                  View &amp; enquire →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {community.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {community.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 rounded-full border border-dashed border-line bg-paper px-4 py-2 text-[0.85rem] text-ink-soft"
              >
                <span className="font-semibold text-ink">{t.name}</span>
                <span>· {t.location}</span>
                <a href="#partner" className="font-semibold text-clay no-underline">
                  Upgrade →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
