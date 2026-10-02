import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_TO_CURRENCY } from "@/lib/currency";

// Visitor region from Vercel's geo header — a sensible default for which
// currency to show, never a determination of anything billed.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") || null;
  const currency = (country && COUNTRY_TO_CURRENCY[country]) || "ZAR";
  return NextResponse.json({ country, currency });
}
