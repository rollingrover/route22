import Image from "next/image";

export default function Intro() {
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
          One road. Every reason to come to Zululand.
        </h2>
        <p className="text-[1.12rem] text-ink-soft">
          The Route22 corridor follows the R22 (the Lubombo road) as its spine, linking stretches
          of the N2, the P453 and the road to St Lucia, then running all the way up to Kosi Bay and
          round toward Pongola. Along it sits the densest concentration of wildlife, wilderness and
          coastline in the country — from Africa&apos;s oldest game park to its first World Heritage
          Site.
        </p>
      </div>
    </section>
  );
}
