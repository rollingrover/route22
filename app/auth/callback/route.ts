import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerAuth } from "@/lib/supabase-server-auth";
import { absoluteUrl } from "@/lib/site";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = getSupabaseServerAuth();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(absoluteUrl(next));
}
