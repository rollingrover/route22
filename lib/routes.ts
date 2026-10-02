// Routes & tourism associations (Route Hubs) — dir_public_routes /
// dir_public_route_members views. Empty lists (never throws) if Supabase
// isn't configured.
import { getSupabase } from "./supabase";
import { SITE_ID } from "./site";

export type Route = {
  id: string;
  slug: string;
  name: string;
  kind: "route" | "association";
  summary: string | null;
  description: string | null;
  region: string | null;
  country: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  path: [number, number][];
  packageKey: string | null;
  memberCount: number;
};

export type RouteRef = { slug: string; name: string; kind: "route" | "association" };

function mapRoute(r: Record<string, unknown>): Route {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    kind: (r.kind as Route["kind"]) ?? "route",
    summary: (r.summary as string) ?? null,
    description: (r.description as string) ?? null,
    region: (r.region as string) ?? null,
    country: (r.country as string) ?? "ZA",
    websiteUrl: (r.website_url as string) ?? null,
    logoUrl: (r.logo_url as string) ?? null,
    path: Array.isArray(r.path) ? (r.path as [number, number][]) : [],
    packageKey: (r.package_key as string) ?? null,
    memberCount: Number(r.member_count) || 0,
  };
}

const COLS = "id, slug, name, kind, summary, description, region, country, website_url, logo_url, path, package_key, sites, member_count";

export async function getRoutes(): Promise<Route[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from("dir_public_routes").select(COLS).contains("sites", [SITE_ID]).order("name");
  if (error || !data) return [];
  return data.map(mapRoute);
}

export async function getRoute(slug: string): Promise<Route | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from("dir_public_routes").select(COLS).eq("slug", slug).contains("sites", [SITE_ID]).maybeSingle();
  return data ? mapRoute(data) : null;
}

// listing slug -> routes it belongs to
export async function getRouteMemberships(): Promise<Map<string, RouteRef[]>> {
  const out = new Map<string, RouteRef[]>();
  const supabase = getSupabase();
  if (!supabase) return out;
  const { data, error } = await supabase.from("dir_public_route_members").select("route_slug, route_name, route_kind, listing_slug");
  if (error || !data) return out;
  for (const r of data) {
    const list = out.get(r.listing_slug as string) ?? [];
    list.push({ slug: r.route_slug as string, name: r.route_name as string, kind: r.route_kind as RouteRef["kind"] });
    out.set(r.listing_slug as string, list);
  }
  return out;
}
