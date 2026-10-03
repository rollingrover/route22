// Central content for the Route22 site.
// Listings here are clearly-marked EXAMPLES for layout/demo purposes.
// Real, verified partner listings live in Supabase (see lib/listings.ts + supabase/schema.sql).

export type Stop = {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lng: number;
  blurb: string;
};

// Ordered roughly south -> north along the R22 / Elephant Coast corridor,
// with the western Pongola arm. Coordinates are approximate anchors.
export const stops: Stop[] = [
  {
    id: "st-lucia",
    name: "St Lucia",
    kind: "Gateway town",
    lat: -28.376,
    lng: 32.415,
    blurb:
      "Southern anchor of the route on the edge of iSimangaliso. Hippos and crocs in the estuary, boat cruises, and the turn-off toward Cape Vidal.",
  },
  {
    id: "hluhluwe-imfolozi",
    name: "Hluhluwe-iMfolozi Park",
    kind: "Game reserve",
    lat: -28.22,
    lng: 32.03,
    blurb:
      "Africa's oldest proclaimed game reserve and the home of rhino conservation. Big Five, self-drive and guided safaris.",
  },
  {
    id: "hluhluwe-town",
    name: "Hluhluwe",
    kind: "N2 junction",
    lat: -28.023,
    lng: 32.269,
    blurb:
      "Where the route meets the N2 and the R22 begins its run north. Lodges, supplies and the springboard for the reserves.",
  },
  {
    id: "mkuze",
    name: "Mkhuze Game Reserve",
    kind: "Game reserve",
    lat: -27.62,
    lng: 32.24,
    blurb:
      "One of the finest birding reserves in Africa, with famous hides, fig forests and pans full of game.",
  },
  {
    id: "sodwana",
    name: "Sodwana Bay",
    kind: "Diving & ocean",
    lat: -27.545,
    lng: 32.68,
    blurb:
      "World-class scuba diving on the southernmost coral reefs, deep-sea fishing and the iSimangaliso marine section.",
  },
  {
    id: "mbazwana",
    name: "Mbazwana",
    kind: "Route town",
    lat: -27.48,
    lng: 32.6,
    blurb:
      "Main service town on the northern R22 — fuel, shops and the crossroads for Sodwana and Lake Sibaya.",
  },
  {
    id: "sibaya",
    name: "Lake Sibaya",
    kind: "Wetland",
    lat: -27.35,
    lng: 32.68,
    blurb:
      "South Africa's largest freshwater lake, ringed by forested dunes — hippos, crocs and prolific birdlife.",
  },
  {
    id: "rocktail",
    name: "Rocktail Bay",
    kind: "Coast",
    lat: -27.18,
    lng: 32.83,
    blurb:
      "Remote beaches and turtle-nesting shores — loggerhead and leatherback turtles come ashore in summer.",
  },
  {
    id: "tembe",
    name: "Tembe Elephant Park",
    kind: "Game reserve",
    lat: -27.03,
    lng: 32.42,
    blurb:
      "Home to some of Africa's biggest tuskers, in sand-forest wilderness on the Mozambique border.",
  },
  {
    id: "ndumo",
    name: "Ndumo Game Reserve",
    kind: "Birding reserve",
    lat: -26.9,
    lng: 32.3,
    blurb:
      "A birder's holy grail on the Pongola floodplain — over 400 species and pans crowded with wildlife.",
  },
  {
    id: "kosi-bay",
    name: "Kosi Bay",
    kind: "Estuary",
    lat: -26.9,
    lng: 32.83,
    blurb:
      "Northern terminus near the border — interlinked lakes, snorkelling, and 400-year-old traditional fish traps still in use.",
  },
  {
    id: "pongola",
    name: "Pongola",
    kind: "Western arm",
    lat: -27.37,
    lng: 31.61,
    blurb:
      "The western gateway — Pongolapoort Dam, tiger-fishing and Big Five reserves along the Lebombo mountains.",
  },
];

// Draw order for the route polyline (the R22 spine + arms).
export const routeLine: [number, number][] = [
  [-28.376, 32.415], // St Lucia
  [-28.023, 32.269], // Hluhluwe (N2)
  [-27.62, 32.24], // Mkhuze
  [-27.48, 32.6], // Mbazwana
  [-27.545, 32.68], // Sodwana
  [-27.48, 32.6], // back to Mbazwana
  [-27.35, 32.68], // Sibaya
  [-27.18, 32.83], // Rocktail
  [-26.9, 32.83], // Kosi Bay
];

export type Highlight = {
  kind: string;
  title: string;
  desc: string;
  hue: string;
};

export const highlights: Highlight[] = [
  {
    kind: "World Heritage",
    title: "iSimangaliso Wetland Park",
    desc: "South Africa's first World Heritage Site — 21 ecosystems and 220 km of protected coastline, from Lake St Lucia to Kosi Bay.",
    hue: "from-ocean/80 to-bush/80",
  },
  {
    kind: "Big Five",
    title: "Hluhluwe-iMfolozi",
    desc: "The oldest game park in Africa and the birthplace of white-rhino conservation. Big Five country.",
    hue: "from-bush/80 to-bush-dk/90",
  },
  {
    kind: "Underwater",
    title: "Sodwana Bay reefs",
    desc: "The planet's southernmost coral reefs — legendary scuba diving, ragged-tooth sharks and summer whale sharks.",
    hue: "from-ocean/80 to-ocean/60",
  },
  {
    kind: "Giants",
    title: "Tembe's great tuskers",
    desc: "Sand-forest wilderness sheltering some of the largest elephants left on the continent.",
    hue: "from-clay/80 to-clay-dk/90",
  },
  {
    kind: "Living heritage",
    title: "Kosi Bay fish traps",
    desc: "A 400-year-old traditional fishing system still worked by hand in the estuary lakes.",
    hue: "from-clay/70 to-bush/80",
  },
  {
    kind: "Birding",
    title: "Ndumo & Mkhuze",
    desc: "Two of Africa's premier birding reserves, with 400+ species between them.",
    hue: "from-bush/70 to-ocean/70",
  },
];

export type Itinerary = {
  days: string;
  title: string;
  stops: string[];
  // Optional: slug of a published "tours" (or any) listing sponsoring this
  // itinerary. Resolved against real listings at render time — if the slug
  // doesn't match a published listing, no sponsor strip is shown. This is a
  // paid placement, distinct from the listing tier badges.
  sponsorSlug?: string;
};

export const itineraries: Itinerary[] = [
  {
    days: "3 days",
    title: "Big Five & the estuary",
    stops: [
      "St Lucia — estuary cruise & Cape Vidal",
      "Hluhluwe-iMfolozi — full-day safari",
      "Mkhuze — hides & pans on the way out",
    ],
    // Example sponsorship — resolves against the example "tours" listing
    // seeded in exampleListings below. Replace with a real listing's slug,
    // or remove, once this is a paid placement.
    sponsorSlug: "example-rhino-safaris",
  },
  {
    days: "5 days",
    title: "Up the Elephant Coast",
    stops: [
      "St Lucia & iSimangaliso",
      "Hluhluwe-iMfolozi safari",
      "Sodwana Bay — dive or snorkel",
      "Lake Sibaya & Rocktail beaches",
      "Kosi Bay — fish traps & estuary",
    ],
  },
  {
    days: "7+ days",
    title: "The full corridor",
    stops: [
      "St Lucia → Hluhluwe-iMfolozi",
      "Mkhuze & Sodwana",
      "Sibaya, Rocktail & Kosi Bay",
      "Tembe & Ndumo in the far north",
      "West to Pongola & the dam",
    ],
  },
];

export type Category =
  | "stay"
  | "wildlife"
  | "ocean"
  | "culture"
  | "eat"
  | "tours"
  | "transport"
  | "volunteer";

export const categoryLabel: Record<Category, string> = {
  stay: "Stay",
  wildlife: "Wildlife & parks",
  ocean: "Diving & ocean",
  culture: "Culture",
  eat: "Eat & drink",
  tours: "Tours & safaris",
  transport: "Transfers & shuttles",
  volunteer: "Volunteer",
};

// Hero-gradient hue per category — reused on listing detail pages and the
// Tours section so cards/heroes stay visually consistent across the site.
export const categoryHue: Record<Category, string> = {
  stay: "from-clay/80 to-clay-dk/90",
  wildlife: "from-bush/85 to-bush-dk/90",
  ocean: "from-ocean/85 to-ocean/55",
  culture: "from-clay/70 to-bush/80",
  eat: "from-bush/70 to-ocean/70",
  tours: "from-bush-dk/85 to-clay-dk/85",
  transport: "from-ocean/70 to-bush-dk/80",
  volunteer: "from-clay/75 to-bush/75",
};

// Display label for the co-marketing "Partner" badge, keyed by partnerSource.
// Falls back to "<value> Partner" for sources not listed here.
export const partnerSourceLabel: Record<string, string> = {
  opdesk: "OpDesk Partner",
};

// Single source of truth for the blue badge. "Verified & bookable" is live:
// it disappears automatically if the operator's OpDesk subscription lapses,
// so an "opdesk" partner tag alone never shows a badge.
export function partnerBadge(l: { verified?: boolean; partnerSource?: string }): string | null {
  if (l.verified) return "Verified & bookable";
  if (l.partnerSource && l.partnerSource !== "opdesk") {
    return partnerSourceLabel[l.partnerSource] ?? `${l.partnerSource} Partner`;
  }
  return null;
}

// Free tiers: "community" (card only, no page) and "basic" (free page, e.g.
// after a claim is approved). These get the small owner-facing
// "Claim or upgrade" link; paying tiers never do.
export function isFreeTier(tier: string): boolean {
  return tier === "community" || tier === "basic";
}

// A listing can sit in several categories (dir_listings.categories); the
// primary `category` is always first. Older/example rows only have `category`.
export function listingCategories(l: { category: Category; categories?: Category[] }): Category[] {
  return l.categories && l.categories.length ? l.categories : [l.category];
}
export function hasCategory(l: { category: Category; categories?: Category[] }, c: Category): boolean {
  return listingCategories(l).includes(c);
}
export function categoryLabels(
  l: { category: Category; categories?: Category[] },
  max = 3,
  label: (c: Category) => string = (c) => categoryLabel[c]
): string {
  return listingCategories(l).slice(0, max).map(label).join(" · ");
}

export type Listing = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  location: string;
  categories?: Category[];
  country?: string; // ISO code, default ZA
  // Route Hubs this listing belongs to ("Member of …").
  routes?: { slug: string; name: string; kind: "route" | "association" }[];
  province?: string;
  // Which directory front ends show this listing (dir_listings.sites).
  sites?: string[];
  desc: string;
  tier: "community" | "basic" | "premium" | "featured";
  photoUrl?: string;
  websiteUrl?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  claimed?: boolean;
  // Free-text attribution for co-marketing deals (e.g. "opdesk") — set by an
  // admin, never by the public. Drives the "Partner" badge; null/undefined
  // means a direct Route22 customer.
  partnerSource?: string;
  // Public business email (shown on the page; also where guest enquiries go
  // when the listing isn't linked to an OpDesk account).
  email?: string;
  // Live from the dir_public_listings view: linked to an active, paying (or
  // comped) OpDesk account. Drives the "Verified & bookable" badge.
  verified?: boolean;
  // Operator opted in to showing live availability from OpDesk.
  hasLiveAvailability?: boolean;
};

// EXAMPLE listings — placeholders that demonstrate the tiers and layout.
// Replace with real partner records from Supabase before launch.
//
// "community" tier: a free, no-page directory entry (name/category/location only,
// no individual URL) with an upgrade prompt — for businesses that haven't yet
// taken a full Route22 listing. "basic" and above get their own page at
// /listings/<slug>, and can show a small map of their exact location if lat/lng
// is set.
export const exampleListings: Listing[] = [
  { id: "e1", slug: "example-safari-lodge", name: "Example Safari Lodge", category: "stay", location: "Hluhluwe", desc: "Sample premium listing — bush lodge with guided game drives.", tier: "featured", lat: -28.03, lng: 32.15 },
  { id: "e2", slug: "example-dive-centre", name: "Example Dive Centre", category: "ocean", location: "Sodwana Bay", desc: "Sample premium listing — PADI courses & reef dives.", tier: "premium", lat: -27.535, lng: 32.685 },
  { id: "e3", slug: "example-estuary-tours", name: "Example Estuary Tours", category: "culture", location: "Kosi Bay", desc: "Sample premium listing — fish-trap & snorkel tours.", tier: "premium" },
  { id: "e4", slug: "example-beach-cabanas", name: "Example Beach Cabanas", category: "stay", location: "Rocktail Bay", desc: "Sample basic listing — self-catering near the beach.", tier: "basic" },
  { id: "e5", slug: "example-bush-bistro", name: "Example Bush Bistro", category: "eat", location: "St Lucia", desc: "Sample basic listing — seafood & grills on the estuary.", tier: "basic" },
  { id: "e6", slug: "example-rhino-safaris", name: "Example Rhino Safaris", category: "tours", location: "iMfolozi", desc: "Sample premium listing — full-day Big Five safaris.", tier: "premium", lat: -28.35, lng: 31.83, partnerSource: "opdesk" },
  { id: "e6b", slug: "example-game-reserve-lodge", name: "Example Game Reserve Lodge", category: "wildlife", location: "Mkhuze", desc: "Sample premium listing — big-game viewing lodge bordering the reserve.", tier: "premium" },
  { id: "e7", slug: "example-cultural-village", name: "Example Cultural Village", category: "culture", location: "Mbazwana", desc: "Sample basic listing — Tsonga cultural experiences.", tier: "basic" },
  { id: "e8", slug: "example-tiger-fishing-camp", name: "Example Tiger-Fishing Camp", category: "stay", location: "Pongola", desc: "Sample basic listing — riverside camp on the dam.", tier: "basic" },
  { id: "e9", slug: "example-day-tour-operator", name: "Example Day Tours", category: "tours", location: "St Lucia", desc: "Sample community listing — free entry, no page yet.", tier: "community" },
  { id: "e10", slug: "example-curio-studio", name: "Example Curio Studio", category: "culture", location: "Hluhluwe", desc: "Sample community listing — free entry, no page yet.", tier: "community" },
  { id: "e11", slug: "example-craft-brewery", name: "Example Craft Brewery", category: "eat", location: "Hluhluwe", desc: "Sample community listing — free entry, no page yet.", tier: "community" },
  { id: "e12", slug: "example-guesthouse-1", name: "Example Guesthouse — Hluhluwe", category: "stay", location: "Hluhluwe", desc: "Sample free community listing, claimable by its owner.", tier: "community" },
  { id: "e13", slug: "example-guesthouse-2", name: "Example B&B — St Lucia", category: "stay", location: "St Lucia", desc: "Sample free community listing, claimable by its owner.", tier: "community" },
  { id: "e14", slug: "example-guesthouse-3", name: "Example Self-Catering — Mtubatuba", category: "stay", location: "Mtubatuba", desc: "Sample free community listing, claimable by its owner.", tier: "community" },
  { id: "e15", slug: "example-guesthouse-4", name: "Example Cottages — Mbazwana", category: "stay", location: "Mbazwana", desc: "Sample free community listing, claimable by its owner.", tier: "community" },
  { id: "e16", slug: "example-guesthouse-5", name: "Example Backpackers — Sodwana Bay", category: "stay", location: "Sodwana Bay", desc: "Sample free community listing, claimable by its owner.", tier: "community" },
];
