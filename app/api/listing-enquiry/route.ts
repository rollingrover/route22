import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";
import { T } from "@/lib/tables";
import { SITE_ID, absoluteUrl } from "@/lib/site";

// Guest -> operator enquiry about a specific listing.
// Stored in dir_enquiries (a DB trigger sets company_id from the listing, so
// OpDesk-linked operators see it in their dashboard inbox) and emailed to the
// business's public email, or to our own inbox if the listing has none.

type Payload = {
  slug?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  dateFrom?: string;
  dateTo?: string;
  guests?: string | number;
  consent?: boolean;
  website?: string; // honeypot — real visitors never see or fill this
  startedAt?: number; // ms timestamp when the form was rendered
};

const SITE_NAME = SITE_ID === "zatours" ? "ZAtours" : "Route22";

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isDate(v: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bot traps: filled honeypot, or submitted faster than a human could type.
  // Pretend success so bots don't learn anything.
  const tooFast = typeof body.startedAt === "number" && Date.now() - body.startedAt < 3000;
  if ((body.website ?? "").trim() || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const slug = (body.slug ?? "").trim();
  const name = (body.name ?? "").trim().slice(0, 120);
  const email = (body.email ?? "").trim().slice(0, 200);
  const phone = (body.phone ?? "").trim().slice(0, 40);
  const message = (body.message ?? "").trim().slice(0, 3000);
  const dateFrom = (body.dateFrom ?? "").trim();
  const dateTo = (body.dateTo ?? "").trim();
  const guestsNum = Number(body.guests);
  const guests = Number.isInteger(guestsNum) && guestsNum > 0 && guestsNum <= 500 ? guestsNum : null;

  if (!slug || !name || !isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please give your name and a valid email." },
      { status: 422 }
    );
  }
  if ((dateFrom && !isDate(dateFrom)) || (dateTo && !isDate(dateTo)) || (dateFrom && dateTo && dateTo < dateFrom)) {
    return NextResponse.json({ ok: false, error: "Please check your dates." }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Please accept the privacy notice to continue." },
      { status: 422 }
    );
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Enquiries aren't available right now. Please try again later." },
      { status: 503 }
    );
  }

  const { data: listing } = await supabase
    .from(T.publicListings)
    .select("id, slug, name, email, verified")
    .eq("slug", slug)
    .contains("sites", [SITE_ID])
    .maybeSingle();

  if (!listing) {
    return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404 });
  }

  const { error: insertError } = await supabase.from(T.enquiries).insert({
    listing_id: listing.id,
    site: SITE_ID,
    name,
    email,
    phone: phone || null,
    message,
    date_from: dateFrom || null,
    date_to: dateTo || null,
    guests,
    consent: true,
  });
  if (insertError) {
    console.error("Enquiry insert failed:", insertError.message);
    return NextResponse.json(
      { ok: false, error: "Couldn't send your enquiry. Please try again." },
      { status: 502 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const adminInbox = process.env.ENQUIRY_TO_EMAIL;
  const operatorEmail = (listing.email as string | null) || null;
  const to = operatorEmail || adminInbox;

  if (apiKey && from && to) {
    const lines = [
      `New enquiry for ${listing.name} via ${SITE_NAME}`,
      "",
      `Name:   ${name}`,
      `Email:  ${email}`,
      `Phone:  ${phone || "—"}`,
      `Dates:  ${dateFrom ? `${dateFrom} to ${dateTo || "?"}` : "—"}`,
      `Guests: ${guests ?? "—"}`,
      "",
      "Message:",
      message || "(none)",
      "",
      "Reply to this email to answer the guest directly.",
    ];
    if (!listing.verified) {
      lines.push(
        "",
        "—",
        `Get enquiries like this straight into a bookings dashboard, with live availability on your ${SITE_NAME} listing: https://opdesk.app`,
        `Manage your listing: ${absoluteUrl(`/claim?slug=${listing.slug}`)}`
      );
    }
    if (!operatorEmail) {
      lines.unshift("[No business email on file — forward or phone the operator]", "");
    }
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        bcc: operatorEmail && adminInbox ? adminInbox : undefined,
        reply_to: email,
        subject: `Enquiry for ${listing.name} — ${name}`,
        text: lines.join("\n"),
      });
    } catch (e) {
      // Stored already; the operator still sees it in OpDesk / admin.
      console.error("Resend send failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
