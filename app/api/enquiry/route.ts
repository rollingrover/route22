import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";
import { T } from "@/lib/tables";
import { SITE_ID } from "@/lib/site";

type Payload = {
  business?: string;
  contact?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  interest?: string;
  listing?: string;
  consent?: boolean;
};

const INTEREST_LABEL: Record<string, string> = {
  premium: "Premium listing",
  featured: "Featured listing",
  opdesk: "OpDesk bundle",
  free: "Free listing",
  unsure: "Not sure",
};

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const business = (body.business ?? "").trim();
  const contact = (body.contact ?? "").trim();
  const email = (body.email ?? "").trim();

  if (!business || !contact || !isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a business name, your name, and a valid email." },
      { status: 422 }
    );
  }

  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Please accept the privacy notice to continue." },
      { status: 422 }
    );
  }

  const phone = (body.phone ?? "").trim();
  const location = (body.location ?? "").trim();
  const message = (body.message ?? "").trim().slice(0, 5000);
  const interest = INTEREST_LABEL[String(body.interest ?? "")] ?? null;
  const listing = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(String(body.listing ?? ""))
    ? String(body.listing)
    : null;
  // No schema change: interest + the listing being upgraded are recorded as a
  // header on the stored message, so they show in /admin and the lead email.
  const header = [interest && `Interest: ${interest}`, listing && `Listing: ${listing}`]
    .filter(Boolean)
    .join(" · ");
  const storedMessage = header ? `[${header}]${message ? `\n${message}` : ""}` : message;

  // 1) Persist the enquiry to Supabase (best-effort — never blocks the response).
  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from(T.businessEnquiries).insert({
      site: SITE_ID,
      consent: true,
      business,
      contact,
      email,
      phone,
      location,
      message: storedMessage,
    });
    if (error) console.error("Supabase insert failed:", error.message);
  }

  // 2) Route the enquiry to the directory inbox via Resend.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  if (apiKey && to && from) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        reply_to: email,
        subject: `New ${SITE_ID === "zatours" ? "ZAtours" : "Route22"} listing lead${interest ? ` (${interest})` : ""} — ${business}`,
        text: [
          `Business: ${business}`,
          `Contact:  ${contact}`,
          `Email:    ${email}`,
          `Phone:    ${phone || "—"}`,
          `Location: ${location || "—"}`,
          `Interest: ${interest || "—"}`,
          `Listing:  ${listing || "—"}`,
          "",
          "Message:",
          message || "(none)",
        ].join("\n"),
      });
    } catch (e) {
      console.error("Resend send failed:", e);
      // If email fails but we stored it in Supabase, still report success to the user.
      if (!supabase) {
        return NextResponse.json(
          { ok: false, error: "Could not send right now. Please email us directly." },
          { status: 502 }
        );
      }
    }
  } else if (!supabase) {
    // Nothing configured at all — tell the operator, not the visitor.
    console.warn("Enquiry received but neither Resend nor Supabase is configured.");
    return NextResponse.json(
      { ok: false, error: "The enquiry system isn't finished being set up yet." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
