"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Category } from "@/lib/data";

const CATS: Category[] = ["stay", "tours", "wildlife", "ocean", "culture", "eat", "transport", "volunteer"];
type Status = "idle" | "sending" | "ok" | "error";

export default function TripRequestForm() {
  const t = useTranslations("Plan");
  const tc = useTranslations("Categories");
  const locale = useLocale();
  const startedAt = useRef<number>(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");
    const f = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/trip-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          flexible: f.flexible === "on",
          adults: Number(f.adults),
          children: Number(f.children),
          categories: cats,
          consent,
          locale,
          startedAt: startedAt.current,
        }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        setMsg(t("sent"));
      } else {
        setStatus("error");
        setMsg(json.error || t("error"));
      }
    } catch {
      setStatus("error");
      setMsg(t("network"));
    }
  }

  const input = "rounded-[10px] border border-line bg-sand p-2.5 text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay";
  const label = "flex flex-col gap-1.5 text-[0.85rem] font-semibold text-ink-soft";

  if (status === "ok") {
    return <p className="rounded-xl2 border border-bush bg-paper p-6 text-[1.02rem] font-semibold text-bush">{msg}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl2 border border-line bg-paper p-6 shadow-card md:p-8">
      {/* Honeypot: hidden from people, bots fill it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>{t("name")} *<input name="name" required className={input} /></label>
        <label className={label}>{t("email")} *<input name="email" type="email" required className={input} /></label>
        <label className={label}>{t("phone")}<input name="phone" type="tel" className={input} /></label>
        <label className={label}>{t("area")}<input name="area" placeholder={t("areaPh")} className={input} /></label>
        <label className={label}>{t("from")}<input name="dateFrom" type="date" className={input} /></label>
        <label className={label}>{t("to")}<input name="dateTo" type="date" className={input} /></label>
      </div>
      <label className="flex items-center gap-2 text-[0.9rem] text-ink">
        <input type="checkbox" name="flexible" /> {t("flexible")}
      </label>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <label className={label}>{t("adults")}<input name="adults" type="number" min={1} max={99} defaultValue={2} className={input} /></label>
        <label className={label}>{t("children")}<input name="children" type="number" min={0} max={99} defaultValue={0} className={input} /></label>
        <label className={label}>{t("budget")}
          <select name="budget" defaultValue="unsure" className={input}>
            {(["budget", "mid", "luxury", "unsure"] as const).map((b) => <option key={b} value={b}>{t(`budget_${b}`)}</option>)}
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="mb-2 text-[0.85rem] font-semibold text-ink-soft">{t("interests")}</legend>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => {
            const on = cats.includes(c);
            return (
              <button key={c} type="button" aria-pressed={on}
                onClick={() => setCats((s) => (on ? s.filter((x) => x !== c) : [...s, c]))}
                className={`rounded-full border px-3.5 py-1.5 text-[0.85rem] font-medium ${on ? "border-bush bg-bush text-white" : "border-line bg-sand text-ink-soft hover:border-bush"}`}>
                {tc(c)}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className={label}>{t("message")}<textarea name="message" rows={4} placeholder={t("messagePh")} className={input} /></label>
      <label className="flex items-start gap-2.5 text-[0.85rem] text-ink-soft">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-1" />
        <span>{t.rich("consent", { link: (c) => <a href="/privacy" target="_blank" className="font-semibold text-clay underline">{c}</a> })}</span>
      </label>
      <div>
        <button type="submit" disabled={status === "sending"}
          className="rounded-full bg-clay px-6 py-3 font-semibold text-white hover:bg-clay-dk disabled:opacity-60">
          {status === "sending" ? t("sending") : t("send")}
        </button>
        {msg && <p className="mt-3 text-[0.9rem] font-semibold text-clay-dk">{msg}</p>}
      </div>
    </form>
  );
}
