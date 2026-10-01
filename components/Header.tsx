"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { IS_ZATOURS } from "@/lib/site";
import ZaLogo from "./ZaLogo";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-5 py-2 backdrop-blur">
      <Link href="/" className="flex items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
        {IS_ZATOURS ? (
          <span className="py-1">
            <ZaLogo />
          </span>
        ) : (
          <>
            <Image
              src="/logo-mark.png"
              alt={BRAND.logoAlt}
              width={543}
              height={329}
              priority
              className="h-11 w-auto"
            />
            <span className="hidden flex-col leading-none sm:flex">
              <strong className="font-serif text-lg text-ink">ROUTE 22</strong>
              <em className="text-[0.68rem] uppercase not-italic tracking-[2px] text-bush">
                Elephant Coast
              </em>
            </span>
          </>
        )}
      </Link>

      {/* Route22 has 8 nav links, so it collapses to the menu below xl;
          ZAtours (3 links) only below md. Class strings are static so
          Tailwind keeps them. */}
      <nav
        className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-[60px] flex-col gap-4 border-b border-line bg-paper px-5 py-4 ${
          IS_ZATOURS
            ? "md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0"
            : "xl:static xl:flex xl:flex-row xl:items-center xl:gap-5 xl:border-0 xl:bg-transparent xl:p-0"
        }`}
      >
        {BRAND.nav.map((l) =>
          l.external ? (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-[0.92rem] font-medium text-ink-soft no-underline hover:text-clay"
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="whitespace-nowrap text-[0.92rem] font-medium text-ink-soft no-underline hover:text-clay"
            >
              {l.label}
            </Link>
          )
        )}
        <Link
          href="/list-your-business"
          onClick={() => setOpen(false)}
          className={
            IS_ZATOURS
              ? "whitespace-nowrap rounded-full border-2 border-bush px-4 py-1.5 text-[0.9rem] font-semibold text-bush no-underline hover:bg-bush hover:text-white"
              : "whitespace-nowrap rounded-full bg-bush px-4 py-2 font-semibold text-white no-underline hover:bg-bush-dk"
          }
        >
          List your business
        </Link>
      </nav>

      <button
        className={`cursor-pointer border-0 bg-transparent text-2xl text-ink ${IS_ZATOURS ? "md:hidden" : "xl:hidden"}`}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
    </header>
  );
}
