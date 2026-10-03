import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TripRequestForm from "@/components/TripRequestForm";
import { BRAND } from "@/lib/brand";
import { localeAlternates } from "@/lib/alternates";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Plan" });
  return {
    title: `${t("metaTitle")} | ${BRAND.name}`,
    description: t("metaDescription"),
    alternates: localeAlternates("/plan", params.locale),
  };
}

export default async function PlanPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Plan");
  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-[1120px] gap-10 px-5 py-14 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[2px] text-clay">{t("eyebrow")}</p>
          <h1 className="mb-3 text-[clamp(1.9rem,4.5vw,2.8rem)]">{t("title")}</h1>
          <p className="mb-8 max-w-[62ch] text-ink-soft">{t("lead")}</p>
          <TripRequestForm />
        </div>
        <aside className="lg:pt-24">
          <div className="rounded-xl2 border border-line bg-sand-2 p-6">
            <h2 className="mb-4 text-[1.15rem]">{t("howTitle")}</h2>
            <ol className="m-0 grid list-none gap-4 p-0">
              {(["how1", "how2", "how3"] as const).map((k, i) => (
                <li key={k} className="flex gap-3 text-[0.95rem] text-ink">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bush text-[0.85rem] font-bold text-white">{i + 1}</span>
                  {t(k)}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </main>
      <Footer />
    </>
  );
}
