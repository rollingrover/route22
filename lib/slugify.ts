// Turns a display name/title into a URL-safe slug, with a short random
// suffix to avoid collisions between two submissions with the same name.
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "entry"}-${suffix}`;
}
