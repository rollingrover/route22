import Link from "next/link";

const cards = [
  {
    href: "/guides",
    title: "Guides & drivers",
    desc: "Book independent safari, dive, birding, fishing and cultural guides, or a transfer driver.",
  },
  {
    href: "/industry",
    title: "Industry info",
    desc: "Trip-planning guides, seasonal tips, conservation background and operator resources.",
  },
  {
    href: "/opportunities",
    title: "Opportunities",
    desc: "Jobs, internships, volunteer roles, learnerships and tenders along the route.",
  },
];

export default function MoreResources() {
  return (
    <section className="border-t border-line bg-sand py-16">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2>More from Route22</h2>
          <p className="text-ink-soft">Beyond the route itself — people, resources and listings.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[18px]">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col gap-1.5 rounded-xl2 border border-line bg-paper p-6 no-underline shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="m-0 text-[1.15rem] text-ink group-hover:text-clay">{c.title}</h3>
              <p className="m-0 text-[0.9rem] text-ink-soft">{c.desc}</p>
              <span className="mt-auto pt-2.5 text-[0.85rem] font-semibold text-clay">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
