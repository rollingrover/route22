"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ConsentCheckbox from "./ConsentCheckbox";

type Status = "idle" | "sending" | "ok" | "error";

const inputCls =
  "rounded-[10px] border border-line bg-paper p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay";
const labelCls = "flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft";

export default function ListingEnquiryForm({ slug, name }: { slug: string; name: string }) {
  const t = useTranslations("Enquiry");
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
        setMsg(t("sent", { name }));
        form.reset();
        setConsent(false);
      } else {
        setStatus("error");
        setMsg(json.error || t("error"));
      }
    } catch {
      setStatus("error");
      setMsg(t("network"));
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
          {t("name")}
          <input name="name" required maxLength={120} className={inputCls} />
        </label>
        <label className={labelCls}>
          {t("email")}
          <input name="email" type="email" required className={inputCls} />
        </label>
        <label className={labelCls}>
          {t("phone")}
          <input name="phone" type="tel" className={inputCls} />
        </label>
        <label className={labelCls}>
          {t("guests")}
          <input name="guests" type="number" min={1} max={500} className={inputCls} />
        </label>
        <label className={labelCls}>
          {t("from")}
          <input name="dateFrom" type="date" min={today} className={inputCls} />
        </label>
        <label className={labelCls}>
          {t("to")}
          <input name="dateTo" type="date" min={today} className={inputCls} />
        </label>
      </div>
      <label className={`${labelCls} mb-3.5`}>
        {t("message")}
        <textarea name="message" rows={4} maxLength={3000} className={inputCls} />
      </label>
      <ConsentCheckbox
        checked={consent}
        onChange={setConsent}
        purpose={t("purpose", { name })}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-clay px-6 py-3 font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("send")}
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
