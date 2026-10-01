"use client";

import { useState } from "react";
import TierCards, { type Interest } from "./TierCards";
import BusinessLeadForm from "./BusinessLeadForm";

// Tier cards + lead form sharing one "interest" selection: clicking a tier's
// button scrolls to the form with that tier preselected.
export default function PricingPicker({
  siteName,
  listingSlug,
  listingName,
  initialInterest,
}: {
  siteName: string;
  listingSlug?: string;
  listingName?: string;
  initialInterest?: Interest;
}) {
  const [interest, setInterest] = useState<Interest | undefined>(initialInterest);
  return (
    <>
      <TierCards siteName={siteName} onPick={setInterest} ctaHref="#lead" />
      <div className="mt-14">
        <BusinessLeadForm interest={interest} listingSlug={listingSlug} listingName={listingName} />
      </div>
    </>
  );
}
