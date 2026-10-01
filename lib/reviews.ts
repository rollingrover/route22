import { getSupabase } from "./supabase";

export type Review = {
  id: string;
  listingSlug: string;
  userId: string;
  displayName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

function mapRow(r: Record<string, unknown>): Review {
  return {
    id: String(r.id),
    listingSlug: r.listing_slug as string,
    userId: r.user_id as string,
    displayName: r.display_name as string,
    rating: Number(r.rating),
    comment: r.comment as string,
    createdAt: r.created_at as string,
  };
}

// No example fallback here (unlike listings/guides/etc.) — inventing sample
// reviews would misrepresent real visitor feedback. An empty list is the
// correct, honest "no reviews yet" state.
// Reviews are off until they get their own auth: in the shared OpDesk project
// every Supabase Auth signup creates an OpDesk profile, so visitor sign-ins
// must not go through it. Flip NEXT_PUBLIC_REVIEWS_ENABLED once that's solved.
export const REVIEWS_ENABLED = process.env.NEXT_PUBLIC_REVIEWS_ENABLED === "true";

export async function getReviews(slug: string): Promise<Review[]> {
  if (!REVIEWS_ENABLED) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, listing_slug, user_id, display_name, rating, comment, created_at")
    .eq("listing_slug", slug)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapRow);
}
