import type { Metadata } from "next";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/alternates";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getRoutes } from "@/lib/routes";
import { BRAND } from "@/lib/brand";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Routes" });
  const title = `${t("metaTitle")} | ${BRAND.name}`;
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: localeAlternates("/routes", params.locale),
    openGraph: { title, description, url: absoluteUrl("/routes"), type: "website" },
  };
}

export default async function RoutesPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Routes");
  const routes = await getRoutes();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1120px] px-5 py-14">
        <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[2px] text-clay">{t("eyebrow")}</p>
        <h1 className="mb-3 text-[clamp(1.9rem,4.5vw,2.8rem)]">{t("title")}</h1>
        <p className="mb-10 max-w-[62ch] text-ink-soft">{t("lead")}</p>

        {routes.length === 0 ? (
          <div className="rounded-xl2 border border-line bg-paper p-8 text-ink-soft">
            {t("empty")}{" "}
            <NextLink href="/list-your-business#routes" className="font-semibold text-clay">
              {t("runRoute", { brand: BRAND.name })}
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {routes.map((r) => (
              <Link
                key={r.id}
                href={`/routes/${r.slug}`}
                className="group flex flex-col rounded-xl2 border border-line bg-paper p-6 no-underline shadow-card transition hover:-translate-y-1"
              >
                <span className="text-[0.7rem] font-bold uppercase tracking-wide text-ocean">
                  {r.kind === "association" ? t("association") : t("route")}
                  {r.region ? ` · ${r.region}` : ""}
                </span>
                <h2 className="mb-2 mt-1 text-[1.3rem] text-ink group-hover:text-clay">{r.name}</h2>
                {r.summary && <p className="m-0 flex-1 text-[0.92rem] text-ink-soft">{r.summary}</p>}
                <span className="mt-4 text-[0.85rem] font-semibold text-clay">
                  {t("members", { count: r.memberCount })} →
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-14 rounded-xl2 border border-dashed border-clay bg-sand-2 p-6 text-[0.95rem] text-ink-soft">
          <strong className="text-ink">{t("boxTitle")}</strong> {t("boxBody")}{" "}
          <NextLink href="/list-your-business#routes" className="font-semibold text-clay">
            {t("boxCta")}
          </NextLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
