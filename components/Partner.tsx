"use client";

import { useState } from "react";
import ConsentCheckbox from "./ConsentCheckbox";
import { formatZAR, pricing } from "@/lib/pricing";

const tiers = [
  {
    name: "Basic",
    price: "Free",
    per: "",
    featured: false,
    perks: ["Name & category", "Pin on the route map", "Standard listing placement"],
    cta: "Get listed",
  },
  {
    name: "Premium",
    price: formatZAR(pricing.listingsPremium.amount),
    per: "/ month",
    featured: true,
    perks: [
      "Photo gallery & full description",
      "Direct booking / contact link",
      "Priority placement in its category",
      "“Premium partner” badge",
      "Enquiry form → straight to your inbox",
    ],
    cta: "Go Premium",
  },
  {
    name: "Featured",
    price: formatZAR(pricing.listingsFeatured.amount),
    per: "/ month",
    featured: false,
    perks: [
      "Everything in Premium",
      "Homepage & hub-page spotlight",
      "Top of its category & route segment",
      "Featured in a sponsored itinerary",
    ],
    cta: "Go Featured",
  },
];

type Status = "idle" | "sending" | "ok" | "error";

export default function Partner() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, consent }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        setMsg("Thanks — your enquiry is on its way. We'll be in touch shortly.");
        form.reset();
        setConsent(false);
      } else {
        setStatus("error");
        setMsg(json.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <section
      id="partner"
      className="py-16 text-white"
      style={{
        background:
          "linear-gradient(160deg, rgba(35,74,44,0.96), rgba(20,38,26,0.96)), radial-gradient(circle at 15% 30%, rgba(193,98,45,0.4), transparent 50%)",
      }}
    >
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 max-w-[720px]">
          <h2 className="text-white">Put your business on the route</h2>
          <p className="text-white/90">
            Route22 reaches travellers actively planning to spend time — and money — in Zululand.
            Get in front of them.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-xl2 bg-paper p-6 text-ink shadow-card ${
                t.featured ? "border-2 border-clay md:-translate-y-2" : ""
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-clay px-3.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-[1.4rem]">{t.name}</h3>
              <p className="mb-3.5 mt-0 font-serif text-[1.5rem] text-clay">
                {t.price}
                {t.per && <span className="font-sans text-[0.85rem] text-ink-soft">{t.per}</span>}
              </p>
              <ul className="mb-5 flex flex-1 list-none flex-col gap-2.5 p-0">
                {t.perks.map((p) => (
                  <li key={p} className="relative pl-[22px] text-[0.92rem] before:absolute before:left-0 before:font-bold before:text-bush before:content-['✓']">
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href="#enquiry"
                className={`rounded-full py-2.5 text-center font-semibold no-underline ${
                  t.featured
                    ? "bg-clay text-white"
                    : "border-2 border-bush text-bush hover:bg-bush hover:text-white"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mx-auto mb-10 max-w-[60ch] text-center text-[0.85rem] text-[#e5dcc9]">
          Pricing shown is illustrative — final partner rates are set by Route22. Additional revenue
          options on the route include sponsored itineraries, booking commissions, lead packages,
          and regional co-marketing.
        </p>

        <form
          id="enquiry"
          onSubmit={onSubmit}
          className="mx-auto max-w-[720px] rounded-xl2 bg-paper p-[30px] text-ink shadow-card"
        >
          <h3 className="mt-0">Enquire about listing your business</h3>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Field label="Business name" name="business" required />
            <Field label="Your name" name="contact" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
          </div>
          <Field label="Where on the route are you? (town / nearest reserve)" name="location" />
          <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
            Tell us about your business
            <textarea
              name="message"
              rows={4}
              className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
            />
          </label>
          <ConsentCheckbox
            checked={consent}
            onChange={setConsent}
            purpose="to contact me about listing my business"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-clay px-6 py-3 font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send enquiry"}
          </button>
          {msg && (
            <p
              className={`mt-3 min-h-[1.2em] text-[0.9rem] font-semibold ${
                status === "error" ? "text-clay-dk" : "text-bush"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
      {label}
      {required ? " *" : ""}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
      />
    </label>
  );
}
