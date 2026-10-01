import { T } from "@/lib/tables";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

type Payload = {
  name?: string;
  specialty?: string;
  area?: string;
  email?: string;
  bio?: string;
  phone?: string;
  whatsapp?: string;
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

  const name = (body.name ?? "").trim();
  const specialty = (body.specialty ?? "").trim();
  const area = (body.area ?? "").trim();
  const email = (body.email ?? "").trim();
  const bio = (body.bio ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const whatsapp = (body.whatsapp ?? "").trim();

  if (!name || !specialty || !area || !isEmail(email) || !bio) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, specialty, area, email and bio." },
      { status: 422 }
    );
  }

  const supabase = getServiceSupabase();
  if (supabase) {
    const { error } = await supabase.from(T.guides).insert({
      slug: slugify(name),
      name,
      specialty,
      area,
      bio,
      email,
      phone: phone || null,
      whatsapp: whatsapp || null,
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
        reply_to: email,
        subject: `New Route22 guide submission — ${name}`,
        text: [
          `Name:       ${name}`,
          `Specialty:  ${specialty}`,
          `Area:       ${area}`,
          `Email:      ${email}`,
          `Phone:      ${phone || "—"}`,
          `WhatsApp:   ${whatsapp || "—"}`,
          "",
          "Bio:",
          bio,
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
    console.warn("Guide submission received but neither Resend nor Supabase is configured.");
    return NextResponse.json(
      { ok: false, error: "The submission system isn't finished being set up yet." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
