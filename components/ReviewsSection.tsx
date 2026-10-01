"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Review } from "@/lib/reviews";

export default function ReviewsSection({
  slug,
  initialReviews,
}: {
  slug: string;
  initialReviews: Review[];
}) {
  const supabase = getSupabaseBrowser();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoadingSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoadingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const ownReview = user ? reviews.find((r) => r.userId === user.id) : undefined;

  useEffect(() => {
    if (ownReview) {
      setRating(ownReview.rating);
      setComment(ownReview.comment);
    }
  }, [ownReview?.id]);

  async function refreshReviews() {
    if (!supabase) return;
    const { data } = await supabase
      .from("reviews")
      .select("id, listing_slug, user_id, display_name, rating, comment, created_at")
      .eq("listing_slug", slug)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data) {
      setReviews(
        data.map((r) => ({
          id: String(r.id),
          listingSlug: r.listing_slug,
          userId: r.user_id,
          displayName: r.display_name,
          rating: Number(r.rating),
          comment: r.comment,
          createdAt: r.created_at,
        }))
      );
    }
  }

  async function signIn(provider: "google" | "facebook") {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}` },
    });
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !user) return;
    setBusy(true);
    setMsg("");
    const displayName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      user.email ||
      "Visitor";

    const { error } = await supabase.from("reviews").upsert(
      {
        listing_slug: slug,
        user_id: user.id,
        display_name: displayName,
        rating,
        comment,
      },
      { onConflict: "listing_slug,user_id" }
    );

    if (error) {
      setMsg("Couldn't save your review — please try again.");
    } else {
      setMsg(ownReview ? "Your review was updated." : "Thanks for your review!");
      await refreshReviews();
    }
    setBusy(false);
  }

  async function deleteOwnReview() {
    if (!supabase || !user || !ownReview) return;
    setBusy(true);
    await supabase.from("reviews").delete().eq("id", ownReview.id);
    await refreshReviews();
    setComment("");
    setRating(5);
    setBusy(false);
  }

  const avg =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="m-0 text-[1.1rem]">Reviews</h2>
        {avg !== null && (
          <span className="text-[0.9rem] text-ink-soft">
            {avg.toFixed(1)} ★ · {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {reviews.length === 0 && (
        <p className="mb-5 text-[0.9rem] text-ink-soft">No reviews yet — be the first.</p>
      )}

      <div className="mb-6 flex flex-col gap-3">
        {reviews
          .filter((r) => r.id !== ownReview?.id)
          .map((r) => (
            <div key={r.id} className="rounded-xl border border-line bg-paper p-4">
              <div className="mb-1 flex items-center gap-2">
                <Stars rating={r.rating} />
                <span className="text-[0.85rem] font-semibold text-ink">{r.displayName}</span>
              </div>
              <p className="m-0 text-[0.9rem] text-ink-soft">{r.comment}</p>
            </div>
          ))}
      </div>

      {!supabase ? (
        <p className="text-[0.85rem] text-ink-soft">Reviews aren&apos;t set up yet.</p>
      ) : loadingSession ? null : !user ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[0.88rem] text-ink-soft">Sign in to leave a review:</span>
          <button
            onClick={() => signIn("google")}
            className="rounded-full border-2 border-bush px-4 py-2 text-[0.85rem] font-semibold text-bush hover:bg-bush hover:text-white"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => signIn("facebook")}
            className="rounded-full border-2 border-bush px-4 py-2 text-[0.85rem] font-semibold text-bush hover:bg-bush hover:text-white"
          >
            Sign in with Facebook
          </button>
        </div>
      ) : (
        <form
          onSubmit={submitReview}
          className="rounded-xl2 border border-line bg-sand p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="m-0 text-[1rem]">{ownReview ? "Edit your review" : "Leave a review"}</h3>
            <button
              type="button"
              onClick={signOut}
              className="text-[0.8rem] font-semibold text-ink-soft underline"
            >
              Sign out
            </button>
          </div>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                className={`text-[1.4rem] leading-none ${n <= rating ? "text-clay" : "text-line"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
            placeholder="What was your experience like?"
            className="mb-3 w-full rounded-[10px] border border-line bg-paper p-2.5 font-sans text-ink focus:border-clay focus:outline focus:outline-2 focus:outline-clay"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-clay px-5 py-2 text-[0.85rem] font-semibold text-white hover:bg-clay-dk disabled:opacity-60"
            >
              {busy ? "Saving…" : ownReview ? "Update review" : "Post review"}
            </button>
            {ownReview && (
              <button
                type="button"
                onClick={deleteOwnReview}
                disabled={busy}
                className="text-[0.82rem] font-semibold text-clay-dk underline disabled:opacity-60"
              >
                Delete my review
              </button>
            )}
          </div>
          {msg && <p className="mt-3 text-[0.85rem] font-semibold text-bush">{msg}</p>}
        </form>
      )}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-clay" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-line">{"★".repeat(5 - rating)}</span>
    </span>
  );
}
