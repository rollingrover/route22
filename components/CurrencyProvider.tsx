"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { getSupabase } from "@/lib/supabase";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";

type Ctx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  // Approximate amount in the chosen currency for a ZAR value (null = ZAR or no rate).
  approx: (zar: number) => string | null;
};

const CurrencyCtx = createContext<Ctx>({ currency: "ZAR", setCurrency: () => {}, approx: () => null });
const KEY = "dir-currency";

// Visitor's display currency: their saved choice, else their region's
// currency (via /api/geo), else ZAR. Rates come from fx_rates (daily).
export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("ZAR");
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* private mode */ }
    if (saved && CURRENCIES.some((c) => c.code === saved)) {
      setCurrencyState(saved as CurrencyCode);
    } else {
      fetch("/api/geo").then((r) => r.json()).then((d) => {
        if (alive && d?.currency && CURRENCIES.some((c) => c.code === d.currency)) setCurrencyState(d.currency);
      }).catch(() => {});
    }
    const sb = getSupabase();
    if (sb) {
      sb.from("fx_rates").select("code, rate").then(({ data }) => {
        if (alive && data) setRates(Object.fromEntries(data.map((r) => [r.code as string, Number(r.rate)])));
      });
    }
    return () => { alive = false; };
  }, []);

  const value = useMemo<Ctx>(() => ({
    currency,
    setCurrency: (c) => {
      setCurrencyState(c);
      try { localStorage.setItem(KEY, c); } catch { /* ignore */ }
    },
    approx: (zar) => {
      if (currency === "ZAR" || !zar) return null;
      const rate = rates[currency];
      if (!rate) return null;
      const cur = CURRENCIES.find((c) => c.code === currency)!;
      const v = zar * rate;
      const rounded = v >= 1000 ? Math.round(v / 10) * 10 : v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
      return `≈ ${cur.symbol}${rounded.toLocaleString("en")} ${cur.code}`;
    },
  }), [currency, rates]);

  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyCtx);
}

// Small "≈ $5 USD" line under a ZAR price. Renders nothing for ZAR visitors.
export function Approx({ zar, className = "" }: { zar: number; className?: string }) {
  const { approx } = useCurrency();
  const text = approx(zar);
  if (!text) return null;
  return (
    <span className={`block font-sans text-[0.75rem] font-normal text-ink-soft ${className}`} title="Approximate — prices are in ZAR. Rates by Exchange Rate API">
      {text}
    </span>
  );
}

export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const t = useTranslations("Nav");
  return (
    <label className={`flex items-center ${className}`}>
      <span className="sr-only">{t("currency")}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="rounded-full border border-line bg-paper px-2.5 py-1 text-[0.8rem] font-semibold text-ink-soft"
        title="Show approximate prices in your currency (prices are set in ZAR)"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>{c.code}</option>
        ))}
      </select>
    </label>
  );
}
