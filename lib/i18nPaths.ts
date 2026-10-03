// Paths that are English-only (business-facing, legal, Route22 long-form,
// admin, APIs). Shared by middleware and the language switcher.
export const NON_LOCALIZED = [
  "/api", "/admin", "/auth", "/claim", "/listings/edit", "/list-your-business", "/privacy",
  "/parks", "/industry", "/guides", "/opportunities",
  "/sitemap.xml", "/robots.txt", "/opengraph-image",
];
export function isLocalizedPath(pathname: string): boolean {
  return !NON_LOCALIZED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
