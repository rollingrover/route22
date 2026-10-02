// Route22 + ZAtours — ZAR pricing for paid directory tiers (shared by both sites).
//
// Benchmarked against comparable South African directories/boards (Sept 2026
// research): general business-directory featured/priority placements ran
// roughly R200–R390/month (Ananzi map+featured ~R200/mo, Sayellow Priority
// Placement ~R313.50/mo, niche local-directory annual plans equivalent to
// ~R235–390/mo); SA-Venues.com uses a once-off R450 setup + booking
// commission instead of a subscription. National job boards (Careers24,
// CareerJunction, PNet) charge R1,200–R2,700 per single posting, but those
// are large national platforms selling the base post itself — Route22's
// Opportunities board posts for free and only charges for the Featured
// boost, so that boost is benchmarked as a fraction of those figures, in
// line with the smaller/regional directory comparables instead.
//
// Each `marketAverage` below is Route22's own blended estimate from that
// research, and `amount` is that figure less 10%, per instruction. These are
// a starting point, not a locked-in price — revisit once there's real demand
// signal (and note VAT, if applicable, isn't included).

export type PriceEntry = {
  amount: number; // ZAR, the actual Route22 price (market average − 10%)
  period: "month" | "posting";
  marketAverage: number; // ZAR, the blended benchmark this was discounted from
};

export const pricing = {
  // Listing plans (Premium / Featured / extra categories) live in
  // LISTING_PLANS below — founding vs standard pricing.
  // Guides & drivers — individual/freelancer tier, priced below the
  // business-listing tiers in line with typical freelancer-vs-business
  // directory pricing gaps
  guidesPremium: { amount: 129, period: "month", marketAverage: 150 },
  // Opportunities board — the board itself is always free to post on; this
  // is only the Featured (top-of-board + badge) boost, per posting
  opportunitiesFeatured: { amount: 269, period: "posting", marketAverage: 300 },
} as const satisfies Record<string, PriceEntry>;

export function formatZAR(amount: number): string {
  return `R${amount.toLocaleString("en-ZA")}`;
}

// OpDesk bundle: any paid (or comped) OpDesk subscription linked to a listing
// makes it "Verified & bookable" live (dir_public_listings.verified) with a
// featured placement. Bundle pricing is still undecided, so the pricing page
// shows "With any paid OpDesk plan" and links out rather than inventing a
// number. Set `amount` once decided and the page shows it.
export const opdeskBundle: { amount: number | null; url: string } = {
  amount: null,
  url: "https://opdesk.app",
};

// ---------------------------------------------------------------------------
// Listing plans — founding-member pricing (decided Oct 2026).
// Businesses that sign up by 31 March 2027 pay the founding price, locked for
// 3 years from their own sign-up date. After the deadline the site switches
// to standard pricing automatically (no redeploy). Keep in step with
// lib/directory.js in the OpDesk repo, which bills these amounts.
// ---------------------------------------------------------------------------
export const FOUNDING = {
  deadline: "2027-03-31T23:59:59+02:00",
  deadlineLabel: "31 March 2027",
  lockYears: 3,
};

export const LISTING_PLANS = {
  founding: { premium: 99, featured: 199, extraCategory: 29 },
  standard: { premium: 149, featured: 249, extraCategory: 39 },
} as const;

// Categories included per tier; paid plans can add extra categories.
export const INCLUDED_CATEGORIES = { community: 1, basic: 1, premium: 2, featured: 3 } as const;

export function isFoundingOpen(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(FOUNDING.deadline).getTime();
}

export function listingPrices(now: Date = new Date()) {
  const founding = isFoundingOpen(now);
  return { founding, ...(founding ? LISTING_PLANS.founding : LISTING_PLANS.standard), standard: LISTING_PLANS.standard };
}
