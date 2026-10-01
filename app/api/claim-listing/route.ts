import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { getServiceSupabase } from "@/lib/supabase";
import { getListingForClaim } from "@/lib/listings";
import { T } from "@/lib/tables";

const VERIFICATION_META_NAME = "route22-site-verification";

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Basic SSRF guardrail: only allow http(s) URLs, block localhost/private ranges.
function isSafeExternalUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return null;
  }
  return url;
}

async function fetchHomepageHasTag(url: URL, token: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Route22-Zululand-Verifier/1.0" },
    });
    if (!res.ok) return false;
    const html = await res.text();
    const pattern = new RegExp(
      `<meta[^>]+name=["']${VERIFICATION_META_NAME}["'][^>]+content=["']${token}["']`,
      "i"
    );
    const patternReversed = new RegExp(
      `<meta[^>]+content=["']${token}["'][^>]+name=["']${VERIFICATION_META_NAME}["']`,
      "i"
    );
    return pattern.test(html) || patternReversed.test(html);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  let body: {
    action?: string;
    slug?: string;
    email?: string;
    websiteUrl?: string;
    token?: string;
    consent?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const slug = (body.slug ?? "").trim();
  const listingResult = slug ? await getListingForClaim(slug) : null;
  if (!listingResult) {
    return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404 });
  }

  if (listingResult.isExample) {
    return NextResponse.json(
      { ok: false, error: "This is an example listing and can't be claimed." },
      { status: 422 }
    );
  }
  const listingId = listingResult.listing.id;

  const supabase = getServiceSupabase();

  if (body.action === "start") {
    if (body.consent !== true) {
      return NextResponse.json(
        { ok: false, error: "Please accept the privacy notice to continue." },
        { status: 422 }
      );
    }
    const email = (body.email ?? "").trim();
    const websiteUrl = (body.websiteUrl ?? "").trim();
    const safeUrl = isSafeExternalUrl(websiteUrl);

    if (!isEmail(email) || !safeUrl) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email and website URL." },
        { status: 422 }
      );
    }

    const token = crypto.randomBytes(12).toString("hex");

    if (supabase) {
      const { error } = await supabase.from(T.claims).insert({
        listing_id: listingId,
        consent: true,
        business_email: email,
        website_url: safeUrl.toString(),
        verification_token: token,
        status: "pending",
      });
      if (error) {
        console.error("Supabase claim insert failed:", error.message);
        return NextResponse.json(
          { ok: false, error: "Could not start the claim right now. Please try again." },
          { status: 502 }
        );
      }
    } else {
      console.warn("Claim started but Supabase isn't configured — nothing persisted.");
    }

    return NextResponse.json({ ok: true, token });
  }

  if (body.action === "verify") {
    const token = (body.token ?? "").trim();
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing verification token." }, { status: 422 });
    }
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "The claim system isn't finished being set up yet." },
        { status: 503 }
      );
    }

    const { data: claim, error: claimError } = await supabase
      .from(T.claims)
      .select("id, business_email, website_url, status")
      .eq("listing_id", listingId)
      .eq("verification_token", token)
      .maybeSingle();

    if (claimError || !claim) {
      return NextResponse.json({ ok: false, error: "Claim not found." }, { status: 404 });
    }

    const safeUrl = isSafeExternalUrl(claim.website_url as string);
    const found = safeUrl ? await fetchHomepageHasTag(safeUrl, token) : false;

    if (!found) {
      return NextResponse.json({ ok: true, verified: false });
    }

    await supabase
      .from(T.claims)
      .update({ status: "verified", verified_at: new Date().toISOString() })
      .eq("id", claim.id);

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ENQUIRY_TO_EMAIL;
    const from = process.env.ENQUIRY_FROM_EMAIL;
    if (apiKey && to && from) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from,
          to,
          reply_to: claim.business_email as string,
          subject: `Listing claim verified — ${slug}`,
          text: [
            `Listing:  ${slug}`,
            `Claimed by: ${claim.business_email}`,
            `Website:  ${claim.website_url}`,
            "",
            "Ownership was verified automatically via the site-verification meta tag.",
            "Review this claim and set up/upgrade their listing from the admin panel or Supabase dashboard.",
          ].join("\n"),
        });
      } catch (e) {
        console.error("Resend send failed:", e);
      }
    }

    return NextResponse.json({ ok: true, verified: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
}
