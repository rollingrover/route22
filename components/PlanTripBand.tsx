import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// "Not sure where to start?" — sends visitors who won't browse to the trip-request form.
export default function PlanTripBand() {
  const t = useTranslations("Plan");
  return (
    <section className="py-12">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-5 rounded-xl2 bg-bush px-6 py-8 text-white shadow-card md:flex-row md:items-center md:justify-between md:px-10">
        <div className="max-w-[62ch]">
          <h2 className="mb-1 text-[1.4rem] text-white">{t("bandTitle")}</h2>
          <p className="m-0 text-white/85">{t("bandBody")}</p>
        </div>
        <Link href="/plan" className="shrink-0 rounded-full bg-gold px-6 py-3 text-center font-semibold text-ink no-underline hover:brightness-95">
          {t("nav")} →
        </Link>
      </div>
    </section>
  );
}
