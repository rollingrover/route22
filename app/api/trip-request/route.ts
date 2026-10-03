import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";
import { SITE_ID } from "@/lib/site";

// Trip requests ("plan my trip"): stored, then offered to up to 3 paying
// OpDesk members, who claim them in OpDesk (contact details only go to
// claimants — enforced in the database). The traveller explicitly consents
// to that sharing on the form.
const CATS = ["stay", "tours", "wildlife", "ocean", "culture", "eat", "transport", "volunteer"];
const BUDGETS = ["budget", "mid", "luxury", "unsure"];
const LOCALES = ["en", "de", "nl", "fr", "it", "af", "zu"];
const OPDESK_URL = (process.env.NEXT_PUBLIC_OPDESK_URL || "https://opdesk.app").replace(/\/+$/, "");

const s = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const date = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
const int = (v: unknown, lo: number, hi: number, d: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= lo && n <= hi ? n : d;
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }

  // Spam traps: hidden field must stay empty; humans take > 3 s to fill the form.
  if (s(body.website, 200)) return NextResponse.json({ ok: true });
  if (typeof body.startedAt === "number" && Date.now() - body.startedAt < 3000) return NextResponse.json({ ok: true });

  const name = s(body.name, 120);
  const email = s(body.email, 200);
  const phone = s(body.phone, 40) || null;
  const consent = body.consent === true;
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter your name and a valid email." }, { status: 400 });
  }
  if (!consent) return NextResponse.json({ ok: false, error: "Please tick the consent box." }, { status: 400 });

  const row = {
    site: SITE_ID,
    locale: LOCALES.includes(String(body.locale)) ? String(body.locale) : "en",
    name, email, phone,
    date_from: date(body.dateFrom),
    date_to: date(body.dateTo),
    flexible: body.flexible === true,
    adults: int(body.adults, 1, 99, 2),
    children: int(body.children, 0, 99, 0),
    area: s(body.area, 160) || null,
    categories: Array.isArray(body.categories) ? (body.categories as unknown[]).map(String).filter((c) => CATS.includes(c)).slice(0, 8) : [],
    budget: BUDGETS.includes(String(body.budget)) ? String(body.budget) : null,
    message: s(body.message, 3000) || null,
    consent: true,
  };

  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  const { data: inserted, error } = await supabase.from("dir_trip_requests").insert(row).select("id").single();
  if (error) {
    console.error("[trip-request] insert failed", error);
    return NextResponse.json({ ok: false, error: "Could not save your request. Please try again." }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const adminInbox = process.env.ENQUIRY_TO_EMAIL;
  if (apiKey && from) {
    const resend = new Resend(apiKey);
    const when = row.date_from ? `${row.date_from}${row.date_to ? ` → ${row.date_to}` : ""}${row.flexible ? " (flexible)" : ""}` : row.flexible ? "Flexible dates" : "Dates not set";
    const who = `${row.adults} adult${row.adults === 1 ? "" : "s"}${row.children ? `, ${row.children} child${row.children === 1 ? "" : "ren"}` : ""}`;
    const summary = [
      `When: ${when}`,
      `Who: ${who}`,
      `Where: ${row.area || "—"}`,
      `Interested in: ${row.categories.length ? row.categories.join(", ") : "—"}`,
      `Budget: ${row.budget || "—"}`,
      row.message ? `\n"${row.message}"` : "",
    ].join("\n");

    // 1) Members who can claim (paying / comped, active). No traveller contact details here.
    const { data: companies } = await supabase.from("companies").select("id, name, email").eq("active", true).eq("account_status", "active").neq("subscription_tier", "free").eq("is_internal", false);
    const members: { name: string; email: string }[] = [];
    for (const c of companies || []) {
      if (!c.email) continue;
      const { data: ok } = await supabase.rpc("dir_company_can_claim", { p_company: c.id });
      if (ok) members.push({ name: c.name as string, email: c.email as string });
    }
    const memberText = (company: string) => [
      `Hi ${company},`,
      "",
      `A traveller has sent a new trip request on ${SITE_ID === "zatours" ? "ZAtours" : "Route22"}:`,
      "",
      summary,
      "",
      `Up to 3 members can take it — first come, first served. Claim it to see their contact details:`,
      `${OPDESK_URL}/trip-requests`,
      "",
      "Included in your plan — no commission, no per-lead fees.",
    ].join("\n");
    await Promise.allSettled(members.slice(0, 50).map((m) =>
      resend.emails.send({ from, to: m.email, subject: `New trip request — ${row.area || "Southern Africa"} · ${who}`, text: memberText(m.name) })
    ));

    // 2) Admin copy (with contact details) + 3) traveller confirmation.
    const tasks: Promise<unknown>[] = [];
    if (adminInbox) {
      tasks.push(resend.emails.send({ from, to: adminInbox, reply_to: email, subject: `Trip request — ${name} (${members.length} members notified)`,
        text: `${name} · ${email}${phone ? ` · ${phone}` : ""}\nSite: ${SITE_ID} · language: ${row.locale}\nID: ${inserted.id}\n\n${summary}` }));
    }
    tasks.push(resend.emails.send({ from, to: email, subject: "We’ve received your trip request",
      text: [
        `Hi ${name.split(" ")[0]},`,
        "",
        "Thanks — we’ve shared your trip request with up to 3 suitable local businesses. They’ll contact you directly with ideas and quotes, usually within a day or two.",
        "",
        summary,
        "",
        "You book directly with them — we never add commission. If you change your mind, just reply to this email and we’ll withdraw your request.",
      ].join("\n") }));
    await Promise.allSettled(tasks);
  }

  return NextResponse.json({ ok: true });
}
