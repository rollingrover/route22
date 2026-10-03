import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Intro() {
  const t = useTranslations("R22");
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[780px] px-5 text-center">
        <Image
          src="/logo.png"
          alt="Route22 Elephant Coast"
          width={583}
          height={772}
          className="mx-auto mb-6 h-40 w-auto"
        />
        <h2 className="mb-3 text-[clamp(1.6rem,3.5vw,2.4rem)]">
          {t("intro.title")}
        </h2>
        <p className="text-[1.12rem] text-ink-soft">
          {t("intro.body")}
        </p>
      </div>
    </section>
  );
}
