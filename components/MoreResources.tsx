import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

// These sections are English-only for now (long-form content).
const cards = [
  { href: "/guides", key: "guides" },
  { href: "/industry", key: "industry" },
  { href: "/opportunities", key: "opps" },
];

export default function MoreResources() {
  const t = useTranslations("R22");
  const locale = useLocale();
  return (
    <section className="border-t border-line bg-sand py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>{t("more.title")}</h2>
          <p className="text-ink-soft">{t("more.lead")}</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[18px]">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col gap-1.5 rounded-xl2 border border-line bg-paper p-6 no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="m-0 text-[1.15rem] text-ink group-hover:text-clay">{t(`more.${c.key}T`)}</h3>
              <p className="m-0 text-[0.9rem] text-ink-soft">{t(`more.${c.key}D`)}</p>
              <span className="mt-auto pt-2.5 text-[0.85rem] font-semibold text-clay">
                {t("more.explore")}{locale === "en" ? "" : ` ${t("more.englishOnly")}`}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
