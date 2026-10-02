"use client";

import { useEffect, useState } from "react";
import ConsentCheckbox from "./ConsentCheckbox";
import type { Interest } from "./TierCards";

type Status = "idle" | "sending" | "ok" | "error";

const interestOptions: { value: Interest; label: string }[] = [
  { value: "premium", label: "Premium listing" },
  { value: "featured", label: "Featured listing" },
  { value: "opdesk", label: "OpDesk bundle (verified & bookable)" },
  { value: "free", label: "Free listing" },
  { value: "route_hub", label: "Route / association Route Hub" },
  { value: "unsure", label: "Not sure yet — advise me" },
];

// Business lead form -> /api/enquiry -> dir_business_enquiries + Resend.
// Used on the Route22 home (#partner) and the /list-your-business page.
export default function BusinessLeadForm({
  interest,
  listingSlug,
  listingName,
  locationLabel = "Where is your business? (town / province)",
  className = "",
}: {
  interest?: Interest;
  listingSlug?: string;
  listingName?: string;
  locationLabel?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [consent, setConsent] = useState(false);
  const [picked, setPicked] = useState<Interest>(interest ?? "unsure");

  // Tier cards above the form can change the selection after mount.
  useEffect(() => {
    if (interest) setPicked(interest);
  }, [interest]);

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
        body: JSON.stringify({ ...data, interest: picked, listing: listingSlug, consent }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        setMsg("Thanks — we've got it and will reply within one business day.");
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

  const inputCls =
    "rounded-[10px] border border-line bg-sand p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay";

  return (
    <form
      id="lead"
      onSubmit={onSubmit}
      className={`mx-auto max-w-[720px] scroll-mt-24 rounded-xl2 bg-paper p-[30px] text-ink shadow-card ${className}`}
    >
      <h3 className="mt-0">
        {listingName ? `Upgrade or claim ${listingName}` : "Enquire about listing your business"}
      </h3>
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        I&apos;m interested in
        <select
          name="interest_display"
          value={picked}
          onChange={(e) => setPicked(e.target.value as Interest)}
          className={inputCls}
        >
          {interestOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Field label="Business name" name="business" required defaultValue={listingName} cls={inputCls} />
        <Field label="Your name" name="contact" required cls={inputCls} />
        <Field label="Email" name="email" type="email" required cls={inputCls} />
        <Field label="Phone" name="phone" type="tel" cls={inputCls} />
      </div>
      <Field label={locationLabel} name="location" cls={inputCls} />
      <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
        Anything we should know?
        <textarea name="message" rows={4} className={inputCls} />
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
        {status === "sending" ? "Sending…" : "Send"}
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
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  cls,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  cls: string;
}) {
  return (
    <label className="mb-3.5 flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft">
      {label}
      {required ? " *" : ""}
      <input name={name} type={type} required={required} defaultValue={defaultValue} className={cls} />
    </label>
  );
}
