import { T } from "@/lib/tables";
import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

type Payload = {
  slug?: string;
  token?: string;
  description?: string;
  websiteUrl?: string;
  phone?: string;
  photoUrl?: string;
  lat?: string | number;
  lng?: string | number;
};

function isValidUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const slug = (body.slug ?? "").trim();
  const token = (body.token ?? "").trim();
  if (!slug || !token) {
    return NextResponse.json({ ok: false, error: "Missing link details." }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Editing isn't finished being set up yet." },
      { status: 503 }
    );
  }

  // The edit token is the credential — validate it server-side against the
  // billing table (which the anon key can never read) before touching
  // anything. This is authorization, not just lookup.
  const { data: billing, error: billingError } = await supabase
    .from(T.billing)
    .select("entity_id")
    .eq("entity_type", "listing")
    .eq("edit_token", token)
    .maybeSingle();

  if (billingError || !billing) {
    return NextResponse.json({ ok: false, error: "Invalid or expired link." }, { status: 403 });
  }

  const { data: listing, error: listingError } = await supabase
    .from(T.listings)
    .select("id, slug")
    .eq("id", billing.entity_id)
    .maybeSingle();

  if (listingError || !listing || listing.slug !== slug) {
    return NextResponse.json({ ok: false, error: "Invalid or expired link." }, { status: 403 });
  }

  // Whitelist: only fields an owner should be able to touch. Name, slug,
  // category, location, tier, published, claimed and partner_source stay
  // admin-only.
  const update: Record<string, unknown> = {};

  if (typeof body.description === "string") {
    update.description = body.description.trim().slice(0, 2000);
  }
  if (typeof body.websiteUrl === "string") {
    const v = body.websiteUrl.trim();
    if (v && !isValidUrl(v)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid website URL." }, { status: 422 });
    }
    update.website_url = v || null;
  }
  if (typeof body.phone === "string") {
    update.phone = body.phone.trim().slice(0, 40) || null;
  }
  if (typeof body.photoUrl === "string") {
    const v = body.photoUrl.trim();
    if (v && !isValidUrl(v)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid photo URL." }, { status: 422 });
    }
    update.photo_url = v || null;
  }
  if (body.lat !== undefined && body.lat !== "") {
    const lat = Number(body.lat);
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json({ ok: false, error: "Latitude must be between -90 and 90." }, { status: 422 });
    }
    update.lat = lat;
  }
  if (body.lng !== undefined && body.lng !== "") {
    const lng = Number(body.lng);
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      return NextResponse.json({ ok: false, error: "Longitude must be between -180 and 180." }, { status: 422 });
    }
    update.lng = lng;
  }

  const { error: updateError } = await supabase.from(T.listings).update(update).eq("id", listing.id);
  if (updateError) {
    return NextResponse.json({ ok: false, error: "Couldn't save your changes. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
