"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export type KeyItem = { key: string; label: string; icon: string; count?: number };
export type KeyGroup = { id: string; title: string; items: KeyItem[]; note?: string };

// Collapsible, grouped map key: tick layers on/off, or a whole group at once.
// Collapsed by default on phones, open on larger screens.
export default function MapKey({
  groups,
  hidden,
  setHidden,
}: {
  groups: KeyGroup[];
  hidden: Set<string>;
  setHidden: (next: Set<string>) => void;
}) {
  const t = useTranslations("MapKey");
  const [open, setOpen] = useState(false);
  const toggle = (k: string) => {
    const n = new Set(hidden);
    if (n.has(k)) n.delete(k); else n.add(k);
    setHidden(n);
  };
  const setGroup = (g: KeyGroup, visible: boolean) => {
    const n = new Set(hidden);
    g.items.forEach((i) => (visible ? n.delete(i.key) : n.add(i.key)));
    setHidden(n);
  };
  const live = groups.filter((g) => g.items.length);

  return (
    <div className="mb-4 rounded-xl2 border border-line bg-paper shadow-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-ink md:hidden"
        aria-expanded={open}
      >
        {t("key")} <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      <div className={`${open ? "grid" : "hidden"} gap-4 px-4 pb-4 md:grid md:grid-cols-2 md:pt-4 ${live.length >= 4 ? "lg:grid-cols-4" : live.length === 3 ? "lg:grid-cols-3" : ""}`}>
        {live.map((g) => {
          const allOn = g.items.every((i) => !hidden.has(i.key));
          return (
            <div key={g.id}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[0.72rem] font-bold uppercase tracking-wide text-ink-soft">{g.title}</span>
                <button type="button" onClick={() => setGroup(g, !allOn)} className="text-[0.72rem] font-semibold text-clay underline">
                  {allOn ? t("hideAll") : t("showAll")}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((i) => {
                  const on = !hidden.has(i.key);
                  return (
                    <button
                      key={i.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(i.key)}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.8rem] ${
                        on ? "border-bush bg-paper text-ink" : "border-line bg-sand text-ink-soft line-through decoration-ink-soft/40"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.icon} alt="" width={18} height={18} className={`h-[18px] w-[18px] ${on ? "" : "opacity-40 grayscale"}`} />
                      {i.label}
                      {typeof i.count === "number" && <span className="text-ink-soft">({i.count})</span>}
                    </button>
                  );
                })}
              </div>
              {g.note && <p className="mb-0 mt-2 text-[0.72rem] text-ink-soft">{g.note}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
