import { useTranslations } from "next-intl";
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
  const tr = useTranslations("R22");
  const shown = tours.filter((t) => t.tier !== "community");
  const community = tours.filter((t) => t.tier === "community");

  if (tours.length === 0) return null;

  return (
    <section id="tours" className="border-b border-line bg-sand py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>{tr("tours.title")}</h2>
          <p className="text-ink-soft">
            {tr("tours.lead")}
          </p>
        </div>

        {isExample && (
          <div className="mb-5 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
            {tr.rich("tours.example", { b: (c) => <strong>{c}</strong> })}{" "}
            <a href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
              {tr("tours.listTour")}
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
