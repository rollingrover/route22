import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#14110d] pb-6 pt-12 text-[#d9cbb4]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-[30px] px-5 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Image
            src="/logo-mark.png"
            alt="Route22 Elephant Coast logo"
            width={543}
            height={329}
            className="h-14 w-auto brightness-0 invert"
          />
          <p className="mt-3.5 max-w-[40ch] text-[0.9rem]">
            Route22 Zululand — a guide to the Elephant Coast tourism route, from St Lucia to Kosi
            Bay.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-[0.8rem] uppercase tracking-[1.5px] text-white">Explore</h4>
          {[
            ["/#route", "The Route"],
            ["/#highlights", "Parks"],
            ["/#itineraries", "Itineraries"],
            ["/#listings", "Stay & Do"],
            ["/guides", "Guides & Drivers"],
            ["/industry", "Industry Info"],
            ["/opportunities", "Opportunities"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="mb-2 block text-[0.9rem] no-underline hover:text-clay">
              {label}
            </a>
          ))}
        </div>
        <div>
          <h4 className="font-sans text-[0.8rem] uppercase tracking-[1.5px] text-white">
            For business
          </h4>
          {["List your business", "Partner tiers", "Enquire"].map((label) => (
            <a key={label} href="/#partner" className="mb-2 block text-[0.9rem] no-underline hover:text-clay">
              {label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1120px] flex-wrap justify-between gap-2.5 border-t border-[#2a251d] px-5 pt-5 text-[0.8rem]">
        <span>
          © {year} Route22 Zululand, a trading line of OpDesk (Pty) Ltd ·{" "}
          <a href="/privacy" className="no-underline hover:text-clay">
            Privacy
          </a>
        </span>
        <span>Elephant Coast · KwaZulu-Natal · South Africa</span>
      </div>
    </footer>
  );
}
