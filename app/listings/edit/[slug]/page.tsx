import { T } from "@/lib/tables";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditListingForm from "@/components/EditListingForm";
import { getListingForClaim } from "@/lib/listings";
import { getServiceSupabase } from "@/lib/supabase";
import OwnerLink from "@/components/OwnerLink";
import { BRAND } from "@/lib/brand";
import { isFreeTier } from "@/lib/data";

export const metadata: Metadata = {
  title: `Edit your listing | ${BRAND.name}`,
  robots: { index: false, follow: false },
};

export default async function EditListingPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { token?: string };
}) {
  const token = (searchParams.token ?? "").trim();
  const result = await getListingForClaim(params.slug);

  const invalid = () => (
    <>
      <Header />
      <main>
        <section className="py-20">
          <div className="mx-auto max-w-[520px] px-5 text-center">
            <h1 className="mb-2">Invalid or expired link</h1>
            <p className="text-ink-soft">
              This edit link doesn&apos;t match a listing, or has expired. If you need a new one,
              get in touch and we&apos;ll send a fresh link.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );

  if (!result || !token) return invalid();

  // Validate the token server-side against the billing table (never readable
  // by the anon key) before showing anything editable — the token is the
  // credential, checked here, not trusted from the URL alone.
  const supabase = getServiceSupabase();
  if (!supabase) return invalid();

  const { data: billing } = await supabase
    .from(T.billing)
    .select("entity_id")
    .eq("entity_type", "listing")
    .eq("edit_token", token)
    .maybeSingle();

  if (!billing) return invalid();

  const { data: listingRow } = await supabase
    .from(T.listings)
    .select("id, slug")
    .eq("id", billing.entity_id)
    .maybeSingle();

  if (!listingRow || listingRow.slug !== params.slug) return invalid();

  const { listing } = result;

  return (
    <>
      <Header />
      <main>
        <section className="py-16">
          <div className="mx-auto max-w-[640px] px-5">
            <h1 className="mb-1">Edit {listing.name}</h1>
            <p className="mb-8 text-ink-soft">
              Update your description, contact details, photo and map location. Changes save
              immediately.
            </p>
            {isFreeTier(listing.tier) && (
              <p className="-mt-5 mb-8 text-[0.9rem] text-ink-soft">
                You&apos;re on a free listing.{" "}
                <OwnerLink slug={listing.slug} claimed className="text-[0.9rem]" />
              </p>
            )}
            <EditListingForm slug={listing.slug} token={token} listing={listing} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
