import { useTranslations } from "next-intl";
export default function Hero() {
  const t = useTranslations("R22");
  return (
    <section
      id="top"
      className="relative grid min-h-[88vh] items-center overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(circle at 70% 20%, rgba(193,98,45,0.35), transparent 55%), linear-gradient(160deg, #2c4a2f 0%, #1c3320 45%, #14261a 100%)",
      }}
    >
      {/* Own photography: elephant on the tar road. Phones: full background.
          Desktop: framed beside the headline (it's a portrait shot). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/route22-mobile.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[30%_70%] lg:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,26,0.88)_0%,rgba(20,38,26,0.6)_55%,rgba(20,38,26,0.25)_100%)] lg:hidden"
      />
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-60 lg:block"
        style={{
          background:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 26px)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-[1120px] items-center gap-12 px-5 py-24 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
        <p className="mb-3.5 text-[0.72rem] uppercase tracking-[3px] text-[#e9c9a6]">
          {t("hero.eyebrow")}
        </p>
        <h1 className="mb-4 max-w-[15ch] text-[clamp(2.2rem,6vw,4rem)]">
          {t("hero.title")}
        </h1>
        <p className="max-w-[56ch] text-[clamp(1rem,2.2vw,1.2rem)] text-sand-2">
          {t("hero.lead")}
        </p>
        <div className="my-7 flex flex-wrap gap-3.5">
          <a
            href="#route"
            className="rounded-full bg-clay px-6 py-3 font-semibold text-white no-underline hover:bg-clay-dk"
          >
            {t("hero.explore")}
          </a>
          <a
            href="#itineraries"
            className="rounded-full border-2 border-white/50 px-6 py-3 font-semibold text-white no-underline hover:bg-white/10"
          >
            {t("hero.itins")}
          </a>
        </div>
        <ul className="flex list-none flex-wrap gap-x-9 gap-y-4 p-0">
          {[
            ["~200 km", t("hero.stat1")],
            ["7+", t("hero.stat2")],
            ["1", t("hero.stat3")],
          ].map(([big, small]) => (
            <li key={small} className="flex flex-col">
              <strong className="font-serif text-[1.7rem]">{big}</strong>
              <span className="text-[0.8rem] tracking-wide text-[#d9cbb4]">{small}</span>
            </li>
          ))}
        </ul>
        </div>
        <figure className="relative m-0 hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/route22-elephant-road.webp"
            alt={t("hero.photoAlt")}
            width={896}
            height={1195}
            className="w-full rotate-[1.5deg] rounded-2xl border-4 border-white/90 object-cover shadow-2xl"
          />
        </figure>
      </div>
    </section>
  );
}
