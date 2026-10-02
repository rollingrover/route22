import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getServiceSupabase } from "@/lib/supabase";
import {
  approveClaim,
  deleteRow,
  logoutAction,
  rejectClaim,
  sendEditLink,
  setBillingStatus,
  setGuideTier,
  setListingTier,
  setOpportunityTier,
  setPartnerSource,
  setPublished,
  setListingSites,
  setListingCompany,
  setLeadStatus,
  createListing,
  importListings,
} from "./actions";
import { LISTING_CATEGORIES, LISTING_TIERS } from "@/lib/listing-input";
import { categoryLabel } from "@/lib/data";
import { T } from "@/lib/tables";
import { SITE_ID } from "@/lib/site";

const SITE_NAME = SITE_ID === "zatours" ? "ZAtours" : "Route22";
type Company = { id: string; name: string };

export const metadata: Metadata = {
  title: `Admin | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

type ClaimRow = {
  id: string;
  listing_slug: string;
  business_email: string;
  website_url: string;
  status: string;
};

async function fetchAll(table: string, orderCol = "created_at") {
  const supabase = getServiceSupabase();
  if (!supabase) return [] as Row[];
  const { data } = await supabase.from(table).select("*").order(orderCol, { ascending: false });
  return (data ?? []) as Row[];
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { msg?: string; err?: string };
}) {
  if (!isAdminAuthenticated()) redirect("/admin/login");

  const supabase = getServiceSupabase();
  const configured = Boolean(supabase);

  const [listings, guides, opportunities, amenities, rawClaims, leads, guestEnquiries, billing] = configured
    ? await Promise.all([
        fetchAll(T.listings),
        fetchAll(T.guides),
        fetchAll(T.opportunities),
        fetchAll(T.amenities),
        fetchAll(T.claims),
        fetchAll(T.businessEnquiries),
        fetchAll(T.enquiries),
        fetchAll(T.billing),
      ])
    : [[], [], [], [], [], [], [], []];

  // External OpDesk companies a listing can be linked to (verified badge).
  let companies: Company[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("companies")
      .select("id, name")
      .eq("is_internal", false)
      .order("name");
    companies = (data ?? []) as Company[];
  }

  const slugById = new Map(listings.map((l) => [String(l.id), String(l.slug)]));
  const nameById = new Map(listings.map((l) => [String(l.id), String(l.name)]));
  const claims = rawClaims.map((c) => ({ ...c, listing_slug: slugById.get(String(c.listing_id)) ?? "?" }));
  const listingRows = listings.map((l) => ({
    ...l,
    sites: Array.isArray(l.sites) ? (l.sites as string[]).join(" + ") : "",
    opdesk: companies.find((c) => c.id === l.company_id)?.name ?? "—",
  }));
  const guestRows = guestEnquiries.map((e) => ({
    ...e,
    listing: nameById.get(String(e.listing_id)) ?? "?",
    dates: e.date_from ? `${e.date_from} → ${e.date_to ?? ""}` : "—",
  }));

  const pendingListings = listings.filter((r) => r.published !== true);
  const pendingGuides = guides.filter((r) => r.published !== true);
  const pendingOpportunities = opportunities.filter((r) => r.published !== true);
  const typedClaims = claims as unknown as ClaimRow[];
  const openClaims = typedClaims.filter((c) => c.status !== "approved" && c.status !== "rejected");

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-10">
      <div className="mb-6 rounded-xl border border-dashed border-clay bg-sand-2 px-4 py-3 text-[0.9rem] text-ink-soft">
        Directory admin is moving to the OpDesk superadmin:{" "}
        <a href="https://opdesk.app/admin/directory" className="font-semibold text-clay">
          opdesk.app/admin/directory
        </a>{" "}
        (listings, claims, leads and payment links for both sites). This panel keeps working
        until that&apos;s proven; CSV import still lives here for now.
      </div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-1">{SITE_NAME} admin</h1>
          <p className="m-0 text-[0.9rem] text-ink-soft">
            Publish submissions, adjust tiers, and resolve listing claims.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border-2 border-bush px-4 py-2 text-[0.85rem] font-semibold text-bush hover:bg-bush hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      {(searchParams.msg || searchParams.err) && (
        <div
          role="status"
          className={`mb-6 rounded-xl border px-4 py-3 text-[0.9rem] font-semibold ${
            searchParams.err
              ? "border-clay-dk bg-[#fff1ec] text-clay-dk"
              : "border-bush bg-[#eef6ee] text-bush"
          }`}
        >
          {searchParams.err ?? searchParams.msg}
        </div>
      )}

      {!configured && (
        <div className="mb-8 rounded-xl border border-dashed border-clay bg-[#fff6e9] px-4 py-3 text-[0.9rem] text-ink-soft">
          Supabase isn&apos;t configured yet (no <code>NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>), so there&apos;s nothing to administer. Once you
          run <code>supabase/schema.sql</code> and add the env vars, real submissions will show up
          here.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Pending listings" value={pendingListings.length} />
        <StatCard label="Pending guides" value={pendingGuides.length} />
        <StatCard label="Pending opportunities" value={pendingOpportunities.length} />
        <StatCard label="Open claims" value={openClaims.length} />
        <StatCard label="Amenities" value={amenities.length} />
      </div>

      <Section
        title="Billing"
        subtitle="Every listing, guide and opportunity in one place — package, billing status, and (for listings) their self-edit access."
      >
        <BillingPanel listings={listings} guides={guides} opportunities={opportunities} billing={billing} />
      </Section>

      <Section title="Claims awaiting review" subtitle="Ownership auto-verified via meta tag — approve to mark the listing claimed and publish it.">
        {openClaims.length === 0 && <Empty text="No open claims." />}
        <div className="flex flex-col gap-3">
          {openClaims.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 rounded-xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="m-0 font-semibold text-ink">{c.listing_slug}</p>
                <p className="m-0 text-[0.85rem] text-ink-soft">
                  {c.business_email} · {c.website_url} ·{" "}
                  <span className="capitalize">{c.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <form action={approveClaim}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="listingSlug" value={c.listing_slug} />
                  <button
                    type="submit"
                    disabled={c.status !== "verified"}
                    className="rounded-full bg-bush px-4 py-1.5 text-[0.82rem] font-semibold text-white disabled:opacity-40"
                    title={c.status !== "verified" ? "Waiting on automatic verification" : ""}
                  >
                    Approve &amp; claim
                  </button>
                </form>
                <form action={rejectClaim}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-line px-4 py-1.5 text-[0.82rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                  >
                    Dismiss
                  </button>
                </form>
              </div>            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Add listings"
        subtitle="Add one business by hand, or import many from a spreadsheet saved as CSV. Only use public business details."
      >
        <div id="add-listing" className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <AddListingForm />
          <ImportListingsForm />
        </div>
      </Section>

      <Section title="Listings" subtitle="Publish, change tier, set which sites show it, link to OpDesk, or remove.">
        {listings.length === 0 && <Empty text="No listings yet." />}
        <RowTable
          rows={listingRows}
          columns={["name", "category", "town", "sites", "opdesk", "tier", "published"]}
          tierOptions={["community", "basic", "premium", "featured"]}
          table="listings"
          setTier={setListingTier}
          setPartnerSourceAction={setPartnerSource}
          companies={companies}
        />
      </Section>

      <Section title="Guides & drivers" subtitle="Publish, change tier, or remove.">
        {guides.length === 0 && <Empty text="No guide submissions yet." />}
        <RowTable
          rows={guides}
          columns={["name", "specialty", "area", "tier", "published"]}
          tierOptions={["free", "premium"]}
          table="guides"
          setTier={setGuideTier}
        />
      </Section>

      <Section title="Opportunities" subtitle="Publish, change tier, or remove.">
        {opportunities.length === 0 && <Empty text="No opportunity submissions yet." />}
        <RowTable
          rows={opportunities}
          columns={["title", "type", "organisation", "tier", "published"]}
          tierOptions={["free", "featured"]}
          table="opportunities"
          setTier={setOpportunityTier}
        />
      </Section>

      <Section title="Amenities" subtitle="ATMs, banks, clinics, fast food — the light map layer.">
        {amenities.length === 0 && <Empty text="No amenities yet. Add rows from the Supabase table editor." />}
        <RowTable
          rows={amenities}
          columns={["name", "category", "lat", "lng", "published"]}
          tierOptions={null}
          table="amenities"
          setTier={null}
        />
      </Section>

      <Section
        title="Business leads"
        subtitle="'List your business' form submissions — your sales pipeline."
      >
        {leads.length === 0 && <Empty text="No leads yet." />}
        <LeadTable rows={leads} />
      </Section>

      <Section
        title="Guest enquiries"
        subtitle="Visitors enquiring with listed businesses. OpDesk-linked operators also see these in their dashboard."
      >
        {guestRows.length === 0 && <Empty text="No guest enquiries yet." />}
        <SimpleTable
          rows={guestRows}
          columns={["created_at", "site", "listing", "name", "email", "dates", "guests", "status"]}
        />
      </Section>
    </main>
  );
}

type BillingInfo = { billing_status: string; owner_email: string | null };

// With no billing record yet, free tiers show "Free"; a paid tier with no
// record shows "Trial" so it stands out as needing an invoice.
function defaultBilling(tier: string): string {
  return tier === "community" || tier === "free" ? "free" : "trial";
}

function BillingPanel({
  listings,
  guides,
  opportunities,
  billing,
}: {
  listings: Row[];
  guides: Row[];
  opportunities: Row[];
  billing: Row[];
}) {
  const billingMap = new Map<string, BillingInfo>();
  for (const b of billing) {
    billingMap.set(`${String(b.entity_type)}:${String(b.entity_id)}`, {
      billing_status: String(b.billing_status ?? "free"),
      owner_email: (b.owner_email as string) ?? null,
    });
  }

  type Merged = { entityType: "listing" | "guide" | "opportunity"; id: string; name: string; tier: string; slug?: string };
  const merged: Merged[] = [
    ...listings.map((l) => ({ entityType: "listing" as const, id: String(l.id), name: String(l.name), tier: String(l.tier), slug: String(l.slug) })),
    ...guides.map((g) => ({ entityType: "guide" as const, id: String(g.id), name: String(g.name), tier: String(g.tier) })),
    ...opportunities.map((o) => ({ entityType: "opportunity" as const, id: String(o.id), name: String(o.title), tier: String(o.tier) })),
  ];

  if (merged.length === 0) return <Empty text="Nothing to bill yet." />;

  return (
    <div className="overflow-x-auto rounded-xl2 border border-line">
      <table className="w-full min-w-[820px] border-collapse text-[0.85rem]">
        <thead>
          <tr className="bg-sand text-left">
            <th className="border-b border-line px-3 py-2 font-semibold text-ink-soft">Type</th>
            <th className="border-b border-line px-3 py-2 font-semibold text-ink-soft">Name</th>
            <th className="border-b border-line px-3 py-2 font-semibold text-ink-soft">Package</th>
            <th className="border-b border-line px-3 py-2 font-semibold text-ink-soft">Billing status</th>
            <th className="border-b border-line px-3 py-2 font-semibold text-ink-soft">Owner email / edit link</th>
          </tr>
        </thead>
        <tbody>
          {merged.map((m) => {
            const info = billingMap.get(`${m.entityType}:${m.id}`);
            return (
              <tr key={`${m.entityType}-${m.id}`} className="border-b border-line last:border-0">
                <td className="px-3 py-2 capitalize text-ink">{m.entityType}</td>
                <td className="px-3 py-2 text-ink">{m.name}</td>
                <td className="px-3 py-2 capitalize text-ink">{m.tier}</td>
                <td className="px-3 py-2">
                  <form action={setBillingStatus} className="flex items-center gap-1">
                    <input type="hidden" name="entityType" value={m.entityType} />
                    <input type="hidden" name="entityId" value={m.id} />
                    <select
                      name="billingStatus"
                      defaultValue={info?.billing_status ?? defaultBilling(m.tier)}
                      className="rounded-full border border-line bg-paper px-2 py-1 text-[0.75rem]"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="comped">Comped</option>
                      <option value="trial">Trial</option>
                      <option value="lapsed">Lapsed</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                    >
                      Set
                    </button>
                  </form>
                </td>
                <td className="px-3 py-2">
                  {m.entityType === "listing" ? (
                    <form action={sendEditLink} className="flex items-center gap-1">
                      <input type="hidden" name="entityId" value={m.id} />
                      <input type="hidden" name="slug" value={m.slug} />
                      <input
                        name="ownerEmail"
                        placeholder="owner@business.com"
                        defaultValue={info?.owner_email ?? ""}
                        className="w-[180px] rounded-full border border-line bg-paper px-2 py-1 text-[0.75rem]"
                      />
                      <button
                        type="submit"
                        className="whitespace-nowrap rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                      >
                        Send edit link
                      </button>
                    </form>
                  ) : (
                    <span className="text-ink-soft">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl2 border border-line bg-paper p-4 text-center shadow-card">
      <p className="m-0 font-serif text-[1.8rem] text-clay">{value}</p>
      <p className="m-0 text-[0.75rem] uppercase tracking-wide text-ink-soft">{label}</p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="mb-1 text-[1.25rem]">{title}</h2>
      <p className="mb-4 text-[0.85rem] text-ink-soft">{subtitle}</p>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-[0.88rem] text-ink-soft">{text}</p>;
}

function RowTable({
  rows,
  columns,
  tierOptions,
  table,
  setTier,
  setPartnerSourceAction,
  companies,
}: {
  rows: Row[];
  columns: string[];
  tierOptions: string[] | null;
  table: "listings" | "guides" | "opportunities" | "amenities";
  setTier: ((formData: FormData) => Promise<void>) | null;
  setPartnerSourceAction?: (formData: FormData) => Promise<void>;
  companies?: Company[];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl2 border border-line">
      <table className="w-full min-w-[720px] border-collapse text-[0.85rem]">
        <thead>
          <tr className="bg-sand text-left">
            {columns.map((c) => (
              <th key={c} className="border-b border-line px-3 py-2 font-semibold capitalize text-ink-soft">
                {c.replace("_", " ")}
              </th>
            ))}
            <th className="border-b border-line px-3 py-2 font-semibold text-ink-soft">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r.id)} className="border-b border-line last:border-0">
              {columns.map((c) => (
                <td key={c} className="px-3 py-2 text-ink">
                  {c === "published" ? (r[c] ? "Yes" : "No") : String(r[c] ?? "—")}
                </td>
              ))}
              <td className="whitespace-nowrap px-3 py-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <form action={setPublished}>
                    <input type="hidden" name="table" value={table} />
                    <input type="hidden" name="id" value={String(r.id)} />
                    <input type="hidden" name="published" value={String(!r.published)} />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                    >
                      {r.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  {tierOptions && setTier && (
                    <form action={setTier} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={String(r.id)} />
                      <select
                        name="tier"
                        defaultValue={String(r.tier ?? "")}
                        className="rounded-full border border-line bg-paper px-2 py-1 text-[0.75rem]"
                      >
                        {tierOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                      >
                        Set
                      </button>
                    </form>
                  )}
                  {setPartnerSourceAction && (
                    <form action={setPartnerSourceAction} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={String(r.id)} />
                      <input
                        name="partnerSource"
                        placeholder="partner (e.g. opdesk)"
                        defaultValue={String(r.partner_source ?? "")}
                        className="w-[150px] rounded-full border border-line bg-paper px-2 py-1 text-[0.75rem]"
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                      >
                        Set
                      </button>
                    </form>
                  )}
                  {table === "listings" && (
                    <form action={setListingSites} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={String(r.id)} />
                      <select
                        name="sites"
                        defaultValue={
                          String(r.sites).includes("+")
                            ? "both"
                            : String(r.sites).trim() || "zatours"
                        }
                        className="rounded-full border border-line bg-paper px-2 py-1 text-[0.75rem]"
                      >
                        <option value="both">Both sites</option>
                        <option value="zatours">ZAtours only</option>
                        <option value="route22">Route22 only</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                      >
                        Set
                      </button>
                    </form>
                  )}
                  {table === "listings" && companies && (
                    <form action={setListingCompany} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={String(r.id)} />
                      <select
                        name="companyId"
                        defaultValue={String(r.company_id ?? "")}
                        className="max-w-[160px] rounded-full border border-line bg-paper px-2 py-1 text-[0.75rem]"
                      >
                        <option value="">No OpDesk link</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                      >
                        Link
                      </button>
                    </form>
                  )}
                  <form action={deleteRow}>
                    <input type="hidden" name="table" value={table} />
                    <input type="hidden" name="id" value={String(r.id)} />
                    <button
                      type="submit"
                      className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-clay-dk hover:border-clay-dk"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTable({ rows, columns }: { rows: Row[]; columns: string[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl2 border border-line">
      <table className="w-full min-w-[720px] border-collapse text-[0.85rem]">
        <thead>
          <tr className="bg-sand text-left">
            {columns.map((c) => (
              <th key={c} className="border-b border-line px-3 py-2 font-semibold capitalize text-ink-soft">
                {c.replace("_", " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r.id)} className="border-b border-line last:border-0">
              {columns.map((c) => (
                <td key={c} className="px-3 py-2 text-ink">
                  {c === "created_at" ? String(r[c] ?? "").slice(0, 10) : String(r[c] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeadTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;
  const cols = ["created_at", "site", "business", "contact", "email", "phone", "location", "message"];
  return (
    <div className="overflow-x-auto rounded-xl2 border border-line">
      <table className="w-full min-w-[900px] border-collapse text-[0.85rem]">
        <thead>
          <tr className="bg-sand text-left">
            {cols.map((c) => (
              <th key={c} className="border-b border-line px-3 py-2 font-semibold capitalize text-ink-soft">
                {c.replace("_", " ")}
              </th>
            ))}
            <th className="border-b border-line px-3 py-2 font-semibold text-ink-soft">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r.id)} className="border-b border-line align-top last:border-0">
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 text-ink">
                  {c === "created_at" ? String(r[c] ?? "").slice(0, 10) : String(r[c] ?? "—")}
                </td>
              ))}
              <td className="px-3 py-2">
                <form action={setLeadStatus} className="flex items-center gap-1">
                  <input type="hidden" name="id" value={String(r.id)} />
                  <select
                    name="status"
                    defaultValue={String(r.status ?? "new")}
                    className="rounded-full border border-line bg-paper px-2 py-1 text-[0.75rem]"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] font-semibold text-ink-soft hover:border-clay hover:text-clay"
                  >
                    Set
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputCls =
  "rounded-[10px] border border-line bg-paper px-2.5 py-2 font-sans text-[0.88rem] text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay";
const labelCls = "flex flex-col gap-1 text-[0.8rem] font-semibold text-ink-soft";

function AddListingForm() {
  return (
    <form action={createListing} className="rounded-xl2 border border-line bg-paper p-5">
      <h3 className="mb-3 text-[1.05rem]">Add one listing</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelCls}>
          Business name *
          <input name="name" required maxLength={150} className={inputCls} />
        </label>
        <label className={labelCls}>
          Category *
          <select name="category" required defaultValue="stay" className={inputCls}>
            {LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel[c]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Town
          <input name="town" placeholder="Hluhluwe" className={inputCls} />
        </label>
        <label className={labelCls}>
          Province
          <input name="province" defaultValue="KwaZulu-Natal" className={inputCls} />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          Short summary (one line for cards)
          <input name="summary" maxLength={300} className={inputCls} />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          Description
          <textarea name="description" rows={3} maxLength={4000} className={inputCls} />
        </label>
        <label className={labelCls}>
          Phone
          <input name="phone" className={inputCls} />
        </label>
        <label className={labelCls}>
          WhatsApp
          <input name="whatsapp" className={inputCls} />
        </label>
        <label className={labelCls}>
          Business email (gets guest enquiries)
          <input name="email" type="email" className={inputCls} />
        </label>
        <label className={labelCls}>
          Website
          <input name="website_url" placeholder="www.example.co.za" className={inputCls} />
        </label>
        <label className={labelCls}>
          Photo URL
          <input name="photo_url" placeholder="https://…" className={inputCls} />
        </label>
        <label className={labelCls}>
          Price from (R)
          <input name="price_from" inputMode="decimal" className={inputCls} />
        </label>
        <label className={labelCls}>
          Latitude
          <input name="lat" inputMode="decimal" placeholder="-28.03" className={inputCls} />
        </label>
        <label className={labelCls}>
          Longitude
          <input name="lng" inputMode="decimal" placeholder="32.27" className={inputCls} />
        </label>
        <label className={labelCls}>
          Tier
          <select name="tier" defaultValue="community" className={inputCls}>
            {LISTING_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          Show on
          <select name="sites" defaultValue="both" className={inputCls}>
            <option value="both">Both sites</option>
            <option value="zatours">ZAtours only</option>
            <option value="route22">Route22 only</option>
          </select>
        </label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-[0.85rem] text-ink-soft">
        <input type="checkbox" name="published" value="yes" defaultChecked className="h-4 w-4 accent-clay" />
        Publish immediately
      </label>
      <button
        type="submit"
        className="mt-4 rounded-full bg-clay px-5 py-2.5 font-semibold text-white hover:bg-clay-dk"
      >
        Add listing
      </button>
    </form>
  );
}

function ImportListingsForm() {
  return (
    <form action={importListings} className="rounded-xl2 border border-line bg-sand p-5">
      <h3 className="mb-2 text-[1.05rem]">Import from CSV</h3>
      <ol className="mb-4 list-decimal pl-5 text-[0.85rem] leading-relaxed text-ink-soft">
        <li>
          Download the{" "}
          <a href="/listing-import-template.csv" download className="font-semibold text-clay underline">
            CSV template
          </a>{" "}
          and fill it in (Excel or Google Sheets).
        </li>
        <li>Only name and category are required. Category is one of: {LISTING_CATEGORIES.join(", ")}.</li>
        <li>Sites: both, zatours or route22. Tier defaults to community. Published defaults to yes.</li>
        <li>Save as CSV and upload. Re-uploading the same sheet updates those listings rather than duplicating them.</li>
      </ol>
      <input
        type="file"
        name="file"
        accept=".csv,text/csv"
        required
        className="mb-4 block w-full text-[0.85rem] text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-bush file:px-4 file:py-2 file:font-semibold file:text-white"
      />
      <button
        type="submit"
        className="rounded-full bg-bush px-5 py-2.5 font-semibold text-white hover:bg-bush-dk"
      >
        Import listings
      </button>
    </form>
  );
}
