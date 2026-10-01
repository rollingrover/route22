"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";
import { ADMIN_COOKIE_NAME, createSessionToken, isAdminAuthenticated } from "@/lib/admin-auth";
import { generateToken } from "@/lib/tokens";
import { absoluteUrl, SITE_ID } from "@/lib/site";
import { T } from "@/lib/tables";
import { baseSlug, parseCsv, parseListing, type ListingInsert } from "@/lib/listing-input";

// Logical names used in the admin forms -> physical dir_* tables.
const TABLE_MAP = {
  listings: T.listings,
  guides: T.guides,
  opportunities: T.opportunities,
  amenities: T.amenities,
} as const;
type Table = keyof typeof TABLE_MAP;

function isTable(v: FormDataEntryValue | null): v is Table {
  return typeof v === "string" && v in TABLE_MAP;
}

const SITE_NAME = SITE_ID === "zatours" ? "ZAtours" : "Route22";

function requireAdmin() {
  if (!isAdminAuthenticated()) redirect("/admin/login");
}

async function sendMail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from) return;
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({ from, to, subject, text });
  } catch (e) {
    console.error("Resend send failed:", e);
  }
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.ADMIN_SESSION_SECRET || password !== expected) {
    redirect("/admin/login?error=1");
  }
  cookies().set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logoutAction() {
  cookies().delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

// Generic publish/unpublish toggle for listings, guides, opportunities, amenities.
export async function setPublished(formData: FormData) {
  requireAdmin();
  const table = formData.get("table");
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (!isTable(table) || !id) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(TABLE_MAP[table]).update({ published }).eq("id", id);
  revalidatePath("/admin");
}

// Change a listing's tier (community / basic / premium / featured).
export async function setListingTier(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const tier = String(formData.get("tier") ?? "");
  if (!id || !["community", "basic", "premium", "featured"].includes(tier)) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(T.listings).update({ tier }).eq("id", id);
  revalidatePath("/admin");
}

// Set (or clear) a listing's co-marketing partner attribution, e.g. "opdesk".
// This is the manual-roster mechanism for the OpDesk free-tier partnership:
// find/create the listing, set its tier, then tag partner_source here so the
// "Partner" badge shows and you can report on the relationship later.
export async function setPartnerSource(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const partnerSource = String(formData.get("partnerSource") ?? "").trim();
  if (!id) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase
    .from(T.listings)
    .update({ partner_source: partnerSource || null })
    .eq("id", id);
  revalidatePath("/admin");
}

// Change a guide's tier (free / premium).
export async function setGuideTier(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const tier = String(formData.get("tier") ?? "");
  if (!id || !["free", "premium"].includes(tier)) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(T.guides).update({ tier }).eq("id", id);
  revalidatePath("/admin");
}

// Change an opportunity's tier (free / featured).
export async function setOpportunityTier(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const tier = String(formData.get("tier") ?? "");
  if (!id || !["free", "featured"].includes(tier)) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(T.opportunities).update({ tier }).eq("id", id);
  revalidatePath("/admin");
}

export async function deleteRow(formData: FormData) {
  requireAdmin();
  const table = formData.get("table");
  const id = String(formData.get("id") ?? "");
  if (!isTable(table) || !id) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(TABLE_MAP[table]).delete().eq("id", id);
  revalidatePath("/admin");
}

// Set whether an entity is actually paying, comped, or on trial — separate
// from its tier, so a listing can sit on tier='premium' while
// billing_status='comped' (e.g. an early pro-bono partner). Upserts, since a
// billing row may not exist yet for an entity created before this feature.
export async function setBillingStatus(formData: FormData) {
  requireAdmin();
  const entityType = String(formData.get("entityType") ?? "");
  const entityId = String(formData.get("entityId") ?? "");
  const billingStatus = String(formData.get("billingStatus") ?? "");
  if (
    !entityId ||
    !["listing", "guide", "opportunity"].includes(entityType) ||
    !["free", "paid", "comped", "trial", "lapsed"].includes(billingStatus)
  ) {
    return;
  }

  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase
    .from(T.billing)
    .upsert(
      {
        entity_type: entityType,
        entity_id: entityId,
        billing_status: billingStatus,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "entity_type,entity_id" }
    );
  revalidatePath("/admin");
}

// Set/replace the owner's email for a listing and (re)send them a
// self-service edit link — this is how a pro-bono/early-adopter business
// you contacted directly gets edit access without going through /claim.
export async function sendEditLink(formData: FormData) {
  requireAdmin();
  const entityId = String(formData.get("entityId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();
  if (!entityId || !slug || !ownerEmail) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;

  const token = generateToken();
  await supabase.from(T.billing).upsert(
    {
      entity_type: "listing",
      entity_id: entityId,
      owner_email: ownerEmail,
      edit_token: token,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "entity_type,entity_id" }
  );

  const editUrl = absoluteUrl(`/listings/edit/${slug}?token=${token}`);
  await sendMail(
    ownerEmail,
    `Manage your ${SITE_NAME} listing`,
    [
      "Hi,",
      "",
      `Here's your link to edit your ${SITE_NAME} listing at any time — no account or password needed:`,
      editUrl,
      "",
      "Keep this link private; anyone with it can edit the listing.",
    ].join("\n")
  );
  revalidatePath("/admin");
}

// Approve a claim: marks the claim resolved and flips `claimed = true` (and
// bumps tier to "basic" if it was "community", so the business gets a page)
// on the matching listing.
export async function approveClaim(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const listingSlug = String(formData.get("listingSlug") ?? "");
  if (!id) return;

  const supabase = getServiceSupabase();
  if (!supabase) return;

  const { data: claim } = await supabase
    .from(T.claims)
    .select("business_email")
    .eq("id", id)
    .maybeSingle();

  await supabase.from(T.claims).update({ status: "approved" }).eq("id", id);

  if (listingSlug) {
    const { data: listing } = await supabase
      .from(T.listings)
      .select("id, tier")
      .eq("slug", listingSlug)
      .maybeSingle();
    if (listing) {
      const nextTier = listing.tier === "community" ? "basic" : listing.tier;
      await supabase
        .from(T.listings)
        .update({ claimed: true, tier: nextTier, published: true })
        .eq("id", listing.id);

      if (claim?.business_email) {
        const token = generateToken();
        await supabase.from(T.billing).upsert(
          {
            entity_type: "listing",
            entity_id: listing.id,
            owner_email: claim.business_email,
            edit_token: token,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "entity_type,entity_id" }
        );
        const editUrl = absoluteUrl(`/listings/edit/${listingSlug}?token=${token}`);
        await sendMail(
          claim.business_email,
          `Your ${SITE_NAME} listing claim was approved`,
          [
            "Hi,",
            "",
            `Your claim on ${listingSlug} has been approved.`,
            "",
            "Here's your link to edit your listing at any time — no account or password needed:",
            editUrl,
            "",
            "Keep this link private; anyone with it can edit the listing.",
          ].join("\n")
        );
      }
    }
  }
  revalidatePath("/admin");
}

export async function rejectClaim(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(T.claims).update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin");
}

// Which directory front ends show a listing (ZAtours, Route22, or both).
export async function setListingSites(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const value = String(formData.get("sites") ?? "");
  const map: Record<string, string[]> = {
    both: ["zatours", "route22"],
    zatours: ["zatours"],
    route22: ["route22"],
  };
  if (!id || !map[value]) return;
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(T.listings).update({ sites: map[value] }).eq("id", id);
  revalidatePath("/admin");
}

// Link a listing to an OpDesk company. Verified badge, live availability and
// the operator's OpDesk enquiry inbox all key off this link.
export async function setListingCompany(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const companyId = String(formData.get("companyId") ?? "");
  if (!id) return;
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase
    .from(T.listings)
    .update({ company_id: companyId || null, partner_source: companyId ? "opdesk" : null })
    .eq("id", id);
  revalidatePath("/admin");
}

// Sales-pipeline status for "list your business" leads.
export async function setLeadStatus(formData: FormData) {
  requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "won", "lost"].includes(status)) return;
  const supabase = getServiceSupabase();
  if (!supabase) return;
  await supabase.from(T.businessEnquiries).update({ status }).eq("id", id);
  revalidatePath("/admin");
}

// ---------- Adding listings ----------

function back(kind: "msg" | "err", text: string): never {
  redirect(`/admin?${kind}=${encodeURIComponent(text)}#add-listing`);
}

// Add one listing by hand. If the slug is taken, a numeric suffix is added
// rather than overwriting the existing listing.
export async function createListing(formData: FormData) {
  requireAdmin();
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
  // An unticked checkbox sends nothing, so read it explicitly.
  raw.published = formData.get("published") ? "yes" : "no";
  const parsed = parseListing(raw);
  if (!parsed.ok) back("err", `Not saved: ${parsed.error}.`);

  const supabase = getServiceSupabase();
  if (!supabase) back("err", "Supabase isn't configured.");

  const row = parsed.row;
  const { data: taken } = await supabase
    .from(T.listings)
    .select("slug")
    .like("slug", `${row.slug}%`);
  const used = new Set((taken ?? []).map((t) => t.slug as string));
  let slug = row.slug;
  for (let n = 2; used.has(slug); n++) slug = `${row.slug}-${n}`;

  const { error } = await supabase.from(T.listings).insert({ ...row, slug });
  if (error) back("err", `Not saved: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/");
  back("msg", `Added "${row.name}" (/listings/${slug}).`);
}

// Bulk import from CSV. Rows are matched on slug (derived from the name when
// the slug column is empty), so re-importing an edited sheet updates those
// listings instead of duplicating them. OpDesk links, claims and billing are
// never touched by an import.
export async function importListings(formData: FormData) {
  requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) back("err", "Choose a CSV file first.");
  if (file.size > 2_000_000) back("err", "That file is over 2 MB; split it into smaller files.");

  const rows = parseCsv(await file.text());
  if (rows.length < 2) back("err", "The CSV has no data rows.");

  const header = rows[0].map((h) => h.trim().toLowerCase());
  if (!header.includes("name") || !header.includes("category")) {
    back("err", "The first row must be the header, including name and category columns.");
  }
  if (rows.length - 1 > 1000) back("err", "Max 1000 listings per import; split the file.");

  const good: ListingInsert[] = [];
  const problems: string[] = [];
  const seen = new Map<string, number>();

  rows.slice(1).forEach((cells, i) => {
    const rec: Record<string, string> = {};
    header.forEach((h, j) => (rec[h] = cells[j] ?? ""));
    const parsed = parseListing(rec);
    if (!parsed.ok) {
      problems.push(`row ${i + 2}: ${parsed.error}`);
      return;
    }
    // Two different businesses with the same name in one sheet: tell them
    // apart by town so the second doesn't overwrite the first.
    let slug = parsed.row.slug;
    if (seen.has(slug) && !rec.slug?.trim()) {
      slug = baseSlug(`${parsed.row.name} ${parsed.row.town ?? ""}`);
      for (let n = 2; seen.has(slug); n++) slug = `${baseSlug(parsed.row.name)}-${n}`;
    }
    if (seen.has(slug)) {
      problems.push(`row ${i + 2}: duplicate slug "${slug}" (same as row ${seen.get(slug)})`);
      return;
    }
    seen.set(slug, i + 2);
    good.push({ ...parsed.row, slug });
  });

  if (good.length === 0) back("err", `Nothing imported. ${problems.slice(0, 5).join("; ")}`);

  const supabase = getServiceSupabase();
  if (!supabase) back("err", "Supabase isn't configured.");

  const { error } = await supabase.from(T.listings).upsert(good, { onConflict: "slug" });
  if (error) back("err", `Import failed, nothing saved: ${error.message}`);

  revalidatePath("/admin");
  revalidatePath("/");
  const skipped = problems.length
    ? ` Skipped ${problems.length}: ${problems.slice(0, 5).join("; ")}${problems.length > 5 ? "…" : ""}`
    : "";
  back("msg", `Imported ${good.length} listing${good.length === 1 ? "" : "s"}.${skipped}`);
}
