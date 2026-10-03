import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClaimListingForm from "@/components/ClaimListingForm";
import { getListingForClaim } from "@/lib/listings";
import { categoryLabel } from "@/lib/data";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Claim your listing | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: { slug?: string };
}) {
  const slug = (searchParams.slug ?? "").trim();
  const result = slug ? await getListingForClaim(slug) : null;
  if (!result) notFound();
  const { listing } = result;

  return (
    <>
      <Header />
      <main>
        <section className="py-16">
          <div className="mx-auto max-w-[600px] px-5">
            <nav className="mb-5 text-[0.85rem] text-ink-soft">
              <Link href={BRAND.directoryHref} className="text-ink-soft no-underline hover:text-clay">
                Directory
              </Link>{" "}
              <span>/</span> <span>Claim listing</span>
            </nav>
            <h1 className="mb-1">{listing.name}</h1>
            <p className="mb-8 text-ink-soft">
              {categoryLabel[listing.category]} · {listing.location}
            </p>
            <ClaimListingForm slug={listing.slug} name={listing.name} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
