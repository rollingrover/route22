import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Called by the OpDesk superadmin after it edits directory data, so changes
// show immediately instead of after the 5-minute ISR window.
// POST { slugs?: string[] } with header `x-revalidate-secret`.
// Fails closed: if REVALIDATE_SECRET isn't set, nothing can trigger it.
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let slugs: string[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.slugs)) {
      slugs = body.slugs
        .filter((s: unknown) => typeof s === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s))
        .slice(0, 200);
    }
  } catch {
    // empty body is fine — just refresh the shared pages
  }

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/listings/[slug]", "page");
  for (const slug of slugs) revalidatePath(`/listings/${slug}`);

  return NextResponse.json({ ok: true, revalidated: slugs.length });
}
