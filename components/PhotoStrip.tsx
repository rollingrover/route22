import { useTranslations } from "next-intl";

// Own and client photography (used with permission; no children's faces).
const PHOTOS = [
  { src: "/media/strip/lions.webp", caption: "Hluhluwe-iMfolozi" },
  { src: "/media/strip/rhino.webp", caption: "Hluhluwe-iMfolozi" },
  { src: "/media/strip/elephants.webp", caption: "Zululand" },
  { src: "/media/strip/village-trail.webp", caption: "Macabuzela village" },
  { src: "/media/strip/mzamo-kraal.webp", caption: "Mzamo’s Cultural Village" },
  { src: "/media/strip/giraffe.webp", caption: "Hluhluwe" },
  { src: "/media/strip/forest-camp.webp", caption: "Ethlathini forest" },
  { src: "/media/strip/misty-valleys.webp", caption: "Hluhluwe valleys" },
  { src: "/media/strip/nyala.webp", caption: "Hluhluwe" },
];

export default function PhotoStrip() {
  const t = useTranslations("Strip");
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1120px] px-5">
        <h2 className="mb-1">{t("title")}</h2>
        <p className="mb-6 text-ink-soft">{t("lead")}</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PHOTOS.map((p, i) => (
            <figure key={p.src} className={`group relative m-0 overflow-hidden rounded-xl2 ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.caption} loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6 text-[0.78rem] font-semibold text-white">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
