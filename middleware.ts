import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { isLocalizedPath } from "./lib/i18nPaths";

const intl = createMiddleware(routing);


export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // English-only sections (and business-facing pages) are never rewritten.
  if (!isLocalizedPath(pathname)) return NextResponse.next();
  try {
    return intl(req);
  } catch (e) {
    // Fail open: a middleware error must never take the site down.
    console.error("[middleware] i18n failed, serving unmodified", e);
    return NextResponse.next();
  }
}

export const config = {
  // Skip Next internals and static files (anything with a file extension).
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
