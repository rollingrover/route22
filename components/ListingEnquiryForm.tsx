"use client";

import { useEffect, useState } from "react";
import ConsentCheckbox from "./ConsentCheckbox";

type Status = "idle" | "sending" | "ok" | "error";

const inputCls =
  "rounded-[10px] border border-line bg-paper p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay";
const labelCls = "flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft";

export default function ListingEnquiryForm({ slug, name }: { slug: string; name: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [consent, setConsent] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => setStartedAt(Date.now()), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/listing-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, slug, consent, startedAt }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        setMsg(`Sent — ${name} will reply to you by email.`);
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
    <form onSubmit={onSubmit} className="mt-4">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
        <label className={labelCls}>
          Your name
          <input name="name" required maxLength={120} className={inputCls} />
        </label>
        <label className={labelCls}>
          Email
          <input name="email" type="email" required className={inputCls} />
        </label>
        <label className={labelCls}>
          Phone (optional)
          <input name="phone" type="tel" className={inputCls} />
        </label>
        <label className={labelCls}>
          Guests
          <input name="guests" type="number" min={1} max={500} className={inputCls} />
        </label>
        <label className={labelCls}>
          From
          <input name="dateFrom" type="date" min={today} className={inputCls} />
        </label>
        <label className={labelCls}>
          To
          <input name="dateTo" type="date" min={today} className={inputCls} />
        </label>
      </div>
      <label className={`${labelCls} mb-3.5`}>
        Message
        <textarea name="message" rows={4} maxLength={3000} className={inputCls} />
      </label>
      <ConsentCheckbox
        checked={consent}
        onChange={setConsent}
        purpose={`to send my enquiry to ${name} so they can reply to me`}
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
          className={`mt-3 text-[0.9rem] font-semibold ${
            status === "ok" ? "text-bush" : "text-clay-dk"
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
