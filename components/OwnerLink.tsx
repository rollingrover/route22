"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

// Small, owner-facing "Claim or upgrade" link for FREE listings only
// (community/basic). Deliberately quiet — it's for business owners browsing
// their own entry, not a CTA aimed at travellers.
export function ownerUpgradeHref(slug: string): string {
  return `/list-your-business?listing=${encodeURIComponent(slug)}`;
}

export default function OwnerLink({
  slug,
  claimed,
  className = "",
}: {
  slug: string;
  claimed?: boolean;
  className?: string;
}) {
  const t = useTranslations("Card");
  return (
    <Link
      href={ownerUpgradeHref(slug)}
      rel="nofollow"
      className={`text-[0.75rem] text-ink-soft underline decoration-line underline-offset-2 hover:text-clay ${className}`}
    >
      {claimed ? t("ownerUpgrade") : t("ownerClaim")}
    </Link>
  );
}
