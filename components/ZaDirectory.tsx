"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Category, categoryLabel, hasCategory, Listing, listingCategories } from "@/lib/data";
import { CommunityCard, ListingCard } from "./ListingCard";
import { ZA_CATEGORY_ICON } from "@/lib/za-assets";

// ZAtours national directory: search + category + province filters, all
// client-side over the server-rendered list (full list is in the HTML for SEO).
export default function ZaDirectory({
  listings,
  isExample,
}: {
  listings: Listing[];
  isExample: boolean;
}) {
  const t = useTranslations("Directory");
  const tc = useTranslations("Categories");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [prov, setProv] = useState("all");
  const [country, setCountry] = useState("all");
  const locale = useLocale();
  const [route, setRoute] = useState("all");

  const categories = useMemo(() => {
    const counts = new Map<Category, number>();
    listings.forEach((l) => listingCategories(l).forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1)));
    return (Object.keys(categoryLabel) as Category[])
      .filter((c) => counts.has(c))
      .map((c) => ({ key: c, label: tc(c), count: counts.get(c) ?? 0 }));
  }, [listings]);

  const provinces = useMemo(
    () =>
      Array.from(new Set(listings.filter((l) => country === "all" || (l.country || "ZA") === country).map((l) => l.province).filter(Boolean) as string[])).sort(),
    [listings, country]
  );

  const routeOptions = useMemo(() => {
    const m = new Map<string, string>();
    listings.forEach((l) => l.routes?.forEach((r) => m.set(r.slug, r.name)));
    return Array.from(m.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [listings]);

  const countries = useMemo(() => {
    const codes = Array.from(new Set(listings.map((l) => l.country || "ZA")));
    const name = (c: string) => {
      try { return new Intl.DisplayNames([locale], { type: "region" }).of(c) ?? c; } catch { return c; }
    };
    return codes.map((c) => [c, name(c)] as const).sort((a, b) => a[1].localeCompare(b[1]));
  }, [listings, locale]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings.filter(
      (l) =>
        (cat === "all" || hasCategory(l, cat)) &&
        (country === "all" || (l.country || "ZA") === country) &&
        (prov === "all" || l.province === prov) &&
        (route === "all" || Boolean(l.routes?.some((r) => r.slug === route))) &&
        (!needle ||
          [l.name, l.location, l.province, l.desc, ...listingCategories(l).map((c) => tc(c)), ...listingCategories(l).map((c) => categoryLabel[c])]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(needle)))
    );
  }, [listings, q, cat, prov, route, country]);

  const full = filtered.filter((l) => l.tier !== "community");
  const community = filtered.filter((l) => l.tier === "community");

  return (
    <section id="directory" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[640px]">
            <h2 className="mb-1">{t("title")}</h2>
            <p className="m-0 text-ink-soft">{t("lead")}</p>
          </div>
        </div>

        {isExample && (
          <div className="mb-5 rounded-xl border border-dashed border-clay bg-sand-2 px-4 py-3 text-[0.9rem] text-ink-soft">
            {t.rich("example", { b: (c) => <strong>{c}</strong> })}{" "}
            <a href="/list-your-business" className="whitespace-nowrap font-semibold text-clay no-underline">
              {t("listBusiness")}
            </a>
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 rounded-xl2 border border-line bg-paper p-3 shadow-card sm:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-[10px] bg-sand px-3">
            <span aria-hidden="true" className="text-ink-soft">
              ⌕
            </span>
            <span className="sr-only">{t("searchLabel")}</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full border-0 bg-transparent py-3 text-ink outline-none"
            />
          </label>
          {countries.length > 1 && (
            <label className="flex items-center">
              <span className="sr-only">{t("allCountries")}</span>
              <select
                value={country}
                onChange={(e) => { setCountry(e.target.value); setProv("all"); }}
                className="w-full rounded-[10px] border border-line bg-sand px-3 py-3 text-ink sm:w-auto"
              >
                <option value="all">{t("allCountries")}</option>
                {countries.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </label>
          )}
          {routeOptions.length > 0 && (
            <label className="flex items-center">
              <span className="sr-only">Route</span>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-sand px-3 py-3 text-ink sm:w-auto"
              >
                <option value="all">{t("allRoutes")}</option>
                {routeOptions.map(([slug, name]) => (
                  <option key={slug} value={slug}>{name}</option>
                ))}
              </select>
            </label>
          )}
          {provinces.length > 1 && (
            <label className="flex items-center">
              <span className="sr-only">Province</span>
              <select
                value={prov}
                onChange={(e) => setProv(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-sand px-3 py-3 text-ink sm:w-auto"
              >
                <option value="all">{t("allProvinces")}</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {categories.map((c) => {
            const on = cat === c.key;
            const icon = ZA_CATEGORY_ICON[c.key];
            return (
              <button
                key={c.key}
                onClick={() => setCat(on ? "all" : c.key)}
                aria-pressed={on}
                className={`flex flex-col items-center gap-1.5 rounded-xl2 border p-3 text-center transition ${
                  on
                    ? "border-clay bg-paper shadow-card ring-2 ring-clay"
                    : "border-line bg-paper hover:-translate-y-0.5 hover:border-clay hover:shadow-card"
                }`}
              >
                {icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={icon} alt="" width={64} height={64} loading="lazy" className="h-16 w-16" />
                )}
                <span className="text-[0.85rem] font-semibold leading-tight text-ink">{c.label}</span>
                <span className="text-[0.75rem] text-ink-soft">{c.count}</span>
              </button>
            );
          })}
        </div>
        {cat !== "all" && (
          <p className="-mt-4 mb-6 text-[0.85rem] text-ink-soft">
            {t("showing", { category: tc(cat) })} ·{" "}
            <button onClick={() => setCat("all")} className="font-semibold text-clay underline">
              {t("showAll")}
            </button>
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="rounded-xl2 border border-line bg-paper p-6 text-ink-soft">
            {t("none")}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
              {full.map((l) => (
                <ListingCard key={l.id} l={l} showProvince />
              ))}
            </div>
            {community.length > 0 && (
              <div className="mt-12 border-t border-line pt-10">
                <h3 className="mb-1.5 text-[1.15rem]">{t("more")}</h3>
                <p className="mb-5 max-w-[65ch] text-[0.88rem] text-ink-soft">{t("moreLead")}</p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
                  {community.map((l) => (
                    <CommunityCard key={l.id} l={l} showProvince />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
