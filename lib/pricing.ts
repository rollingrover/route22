// Route22 — indicative ZAR pricing for paid tiers.
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
  // General listings directory (stay/wildlife/ocean/culture/eat/tours)
  listingsPremium: { amount: 249, period: "month", marketAverage: 275 },
  listingsFeatured: { amount: 399, period: "month", marketAverage: 450 },
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
