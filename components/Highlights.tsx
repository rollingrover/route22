import { useTranslations } from "next-intl";
import Link from "next/link";
import { parks } from "@/lib/parks";

export default function Highlights() {
  const t = useTranslations("R22");
  return (
    <section id="highlights" className="py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>{t("parks.title")}</h2>
          <p className="text-ink-soft">
            {t("parks.lead")}
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[18px]">
          {parks.map((p) => (
            <Link
              key={p.slug}
              href={`/parks/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-paper no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`relative h-[120px] bg-gradient-to-br ${p.hue}`}>
                <span className="absolute left-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white backdrop-blur">
                  {t.has(`parkCards.${p.slug}.region`) ? t(`parkCards.${p.slug}.region`) : p.region}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[0.7rem] font-bold uppercase tracking-wide text-clay">
                  {t.has(`parkCards.${p.slug}.kind`) ? t(`parkCards.${p.slug}.kind`) : p.kind}
                </span>
                <h3 className="mb-1.5 mt-1 text-[1.15rem] text-ink group-hover:text-clay">
                  {p.shortName}
                </h3>
                <p className="m-0 flex-1 text-[0.9rem] text-ink-soft">{t.has(`parkCards.${p.slug}.desc`) ? t(`parkCards.${p.slug}.desc`) : p.cardDesc}</p>
                <span className="mt-3 text-[0.82rem] font-semibold text-bush group-hover:text-clay">
                  {t("parks.explore", { name: p.shortName })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
