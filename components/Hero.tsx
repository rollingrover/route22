export default function Hero() {
  return (
    <section
      id="top"
      className="relative grid min-h-[88vh] items-center overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(circle at 70% 20%, rgba(193,98,45,0.35), transparent 55%), linear-gradient(160deg, #2c4a2f 0%, #1c3320 45%, #14261a 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 26px)",
        }}
      />
      <div className="relative mx-auto w-full max-w-[1120px] px-5 py-24">
        <p className="mb-3.5 text-[0.72rem] uppercase tracking-[3px] text-[#e9c9a6]">
          The Elephant Coast • KwaZulu-Natal • South Africa
        </p>
        <h1 className="mb-4 max-w-[15ch] text-[clamp(2.2rem,6vw,4rem)]">
          Drive the wildest road in South Africa.
        </h1>
        <p className="max-w-[56ch] text-[clamp(1rem,2.2vw,1.2rem)] text-sand-2">
          The R22 threads north from the N2 at Hluhluwe up to the Mozambique border — past the
          Big Five reserves, World Heritage wetlands, dive reefs and 400-year-old fish traps of
          Maputaland. Route22 is your guide to every stop along the way.
        </p>
        <div className="my-7 flex flex-wrap gap-3.5">
          <a
            href="#route"
            className="rounded-full bg-clay px-6 py-3 font-semibold text-white no-underline hover:bg-clay-dk"
          >
            Explore the route
          </a>
          <a
            href="#itineraries"
            className="rounded-full border-2 border-white/50 px-6 py-3 font-semibold text-white no-underline hover:bg-white/10"
          >
            See itineraries
          </a>
        </div>
        <ul className="flex list-none flex-wrap gap-x-9 gap-y-4 p-0">
          {[
            ["~200 km", "of tarred route"],
            ["7+", "major game reserves"],
            ["1", "World Heritage Site"],
          ].map(([big, small]) => (
            <li key={small} className="flex flex-col">
              <strong className="font-serif text-[1.7rem]">{big}</strong>
              <span className="text-[0.8rem] tracking-wide text-[#d9cbb4]">{small}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
