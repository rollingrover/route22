import { T } from "@/lib/tables";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

type Payload = {
  title?: string;
  type?: string;
  organisation?: string;
  location?: string;
  description?: string;
  requirements?: string;
  applyUrl?: string;
  applyEmail?: string;
  closesAt?: string;
};

const validTypes = ["job", "internship", "volunteer", "learnership", "tender", "other"];

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

  const title = (body.title ?? "").trim();
  const type = (body.type ?? "").trim();
  const organisation = (body.organisation ?? "").trim();
  const location = (body.location ?? "").trim();
  const description = (body.description ?? "").trim();
  const requirements = (body.requirements ?? "").trim();
  const applyUrl = (body.applyUrl ?? "").trim();
  const applyEmail = (body.applyEmail ?? "").trim();
  const closesAt = (body.closesAt ?? "").trim();

  if (
    !title ||
    !validTypes.includes(type) ||
    !organisation ||
    !location ||
    !description ||
    (!applyUrl && !applyEmail)
  ) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Please fill in the title, type, organisation, location, description, and an apply URL or email.",
      },
      { status: 422 }
    );
  }

  if (applyEmail && !isEmail(applyEmail)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid apply email." },
      { status: 422 }
    );
  }

  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from(T.opportunities).insert({
      slug: slugify(title),
      title,
      type,
      organisation,
      location,
      description,
      requirements: requirements || null,
      apply_url: applyUrl || null,
      apply_email: applyEmail || null,
      closes_at: closesAt || null,
      tier: "free",
      published: false,
    });
    if (error) console.error("Supabase insert failed:", error.message);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  if (apiKey && to && from) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        reply_to: applyEmail || undefined,
        subject: `New Route22 opportunity submission — ${title}`,
        text: [
          `Title:        ${title}`,
          `Type:         ${type}`,
          `Organisation: ${organisation}`,
          `Location:     ${location}`,
          `Apply URL:    ${applyUrl || "—"}`,
          `Apply email:  ${applyEmail || "—"}`,
          `Closes:       ${closesAt || "—"}`,
          "",
          "Description:",
          description,
          "",
          "Requirements:",
          requirements || "(none)",
        ].join("\n"),
      });
    } catch (e) {
      console.error("Resend send failed:", e);
      if (!supabase) {
        return NextResponse.json(
          { ok: false, error: "Could not send right now. Please email us directly." },
          { status: 502 }
        );
      }
    }
  } else if (!supabase) {
    console.warn("Opportunity submission received but neither Resend nor Supabase is configured.");
    return NextResponse.json(
      { ok: false, error: "The submission system isn't finished being set up yet." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
