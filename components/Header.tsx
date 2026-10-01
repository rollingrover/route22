"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/#tours", label: "Tours" },
  { href: "/#route", label: "The Route" },
  { href: "/#highlights", label: "Parks" },
  { href: "/#itineraries", label: "Itineraries" },
  { href: "/#listings", label: "Where to Stay & Do" },
  { href: "/guides", label: "Guides & Drivers" },
  { href: "/industry", label: "Industry Info" },
  { href: "/opportunities", label: "Opportunities" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-5 py-2 backdrop-blur">
      <Link href="/" className="flex items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
        <Image
          src="/logo-mark.png"
          alt="Route22 Elephant Coast logo"
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
      </Link>

      <nav
        className={`${
          open ? "flex" : "hidden"
        } absolute left-0 right-0 top-[60px] flex-col gap-4 border-b border-line bg-paper px-5 py-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-[0.92rem] font-medium text-ink-soft no-underline hover:text-clay"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/#partner"
          onClick={() => setOpen(false)}
          className="rounded-full bg-bush px-4 py-2 font-semibold text-white no-underline hover:bg-bush-dk"
        >
          List your business
        </Link>
      </nav>

      <button
        className="cursor-pointer border-0 bg-transparent text-2xl md:hidden"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        ☰
      </button>
    </header>
  );
}
