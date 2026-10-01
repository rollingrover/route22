import { Listing } from "@/lib/data";
import { ListingCard } from "./ListingCard";
import OwnerLink from "./OwnerLink";

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
            <a href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
              List your tour company →
            </a>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
          {shown.map((t) => (
            <ListingCard key={t.id} l={t} />
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
                <OwnerLink slug={t.slug} claimed={t.claimed} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
