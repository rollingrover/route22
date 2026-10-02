"use client";

import { useState } from "react";
import TierCards, { pricingNote, type Interest } from "./TierCards";
import BusinessLeadForm from "./BusinessLeadForm";

// Route22 home page "for business" section. The full pricing page lives at
// /list-your-business (shared by Route22 and ZAtours).
export default function Partner() {
  const [interest, setInterest] = useState<Interest | undefined>();

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
        <div className="mb-10 max-w-[720px]">
          <h2 className="text-white">Put your business on the route</h2>
          <p className="text-white/90">
            Route22 reaches travellers actively planning to spend time — and money — in Zululand.
            Get in front of them.
          </p>
        </div>

        <TierCards siteName="Route22" onPick={setInterest} ctaHref="#lead" />

        <p className="mx-auto mb-10 mt-6 max-w-[60ch] text-center text-[0.85rem] text-white/80">
          {pricingNote()} Flat monthly prices in ZAR — no commission, no per-booking or
          per-enquiry fees. Listings on Route22 also appear on ZAtours, South Africa&apos;s
          national tourism directory.{" "}
          <a href="/list-your-business" className="font-semibold text-white">
            Compare plans →
          </a>
        </p>

        <BusinessLeadForm
          interest={interest}
          locationLabel="Where on the route are you? (town / nearest reserve)"
        />
      </div>
    </section>
  );
}
