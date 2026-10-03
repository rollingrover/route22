// Per-site branding and copy. Anything that differs between Route22 and
// ZAtours (names, nav, metadata, directory wording) lives here so pages and
// components stay shared.
import { SITE_ID, ROUTE22_URL } from "./site";

type NavLink = { href: string; label: string; external?: boolean; key?: string };

type Brand = {
  name: string; // short display name
  fullName: string; // used in titles / legal line
  tagline: string;
  title: string; // default <title>
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
  logoAlt: string;
  regionLine: string; // footer right-hand line
  footerBlurb: string;
  nav: NavLink[];
  footerExplore: NavLink[];
  directoryHref: string; // where "back to directory" goes
  // Shown under a listing name, e.g. "Hluhluwe · on the Route22 Elephant Coast route"
  listingContext: (l: { location: string; province?: string }) => string;
  moreHeading: string;
  icon: string;
  appleIcon?: string;
  themeColor: string;
};

const route22: Brand = {
  name: "Route22",
  fullName: "Route22 Zululand",
  tagline: "The Elephant Coast tourism route",
  title: "Route22 Zululand — The Elephant Coast Tourism Route",
  description:
    "Your guide to the R22 Elephant Coast route — from St Lucia and Hluhluwe-iMfolozi up through Sodwana, Kosi Bay and the great game reserves of Maputaland. Plan your journey, find lodges, tours and experiences.",
  ogTitle: "Route22 Zululand",
  ogDescription:
    "Drive the wildest road in South Africa — the R22 Elephant Coast route through Zululand's great game reserves and coastline.",
  keywords: [
    "Elephant Coast",
    "R22 route",
    "Zululand tourism",
    "Hluhluwe iMfolozi",
    "iSimangaliso Wetland Park",
    "Sodwana Bay diving",
    "Kosi Bay",
    "KwaZulu-Natal safari",
    "Maputaland",
  ],
  logoAlt: "Route22 Elephant Coast logo",
  regionLine: "Elephant Coast · KwaZulu-Natal · South Africa",
  footerBlurb:
    "Route22 Zululand — a guide to the Elephant Coast tourism route, from St Lucia to Kosi Bay.",
  nav: [
    { href: "/#tours", label: "Tours", key: "r22Tours" },
    { href: "/#route", label: "The Route", key: "r22Route" },
    { href: "/#highlights", label: "Parks", key: "r22Parks" },
    { href: "/#itineraries", label: "Itineraries", key: "r22Itins" },
    { href: "/#listings", label: "Where to Stay & Do", key: "r22Stay" },
    // Guides, Industry Info and Opportunities (English-only) live in the
    // footer and "More from Route22" — keeps the bar short in every language.
  ],
  footerExplore: [
    { href: "/#route", label: "The Route", key: "r22Route" },
    { href: "/#highlights", label: "Parks", key: "r22Parks" },
    { href: "/#itineraries", label: "Itineraries", key: "r22Itins" },
    { href: "/#listings", label: "Stay & Do", key: "r22StayShort" },
    { href: "/guides", label: "Guides & Drivers", key: "r22Guides" },
    { href: "/industry", label: "Industry Info", key: "r22Industry" },
    { href: "/opportunities", label: "Opportunities", key: "r22Opps" },
  ],
  directoryHref: "/#listings",
  listingContext: (l) => `${l.location} · on the Route22 Elephant Coast route`,
  moreHeading: "More along the route",
  icon: "/route22-icon.png",
  appleIcon: "/route22-icon.png",
  themeColor: "#2f5e3a",
};

const zatours: Brand = {
  name: "ZAtours",
  fullName: "ZAtours",
  tagline: "Tourism directory · Southern & East Africa",
  title: "ZAtours — Tourism Directory for South Africa, Southern & East Africa | Stays, Tours & Experiences",
  description:
    "Find places to stay, tours, safaris and experiences across South Africa, Southern and East Africa — listed by the businesses that run them. Enquire directly with lodges, guesthouses, tour and transfer operators.",
  ogTitle: "ZAtours — tourism directory for Southern & East Africa",
  ogDescription:
    "Stays, safaris, tours and experiences across South Africa, Southern and East Africa. Enquire directly with the businesses that run them.",
  keywords: [
    "South Africa tourism directory",
    "South Africa accommodation",
    "safari tours South Africa",
    "lodges and guesthouses",
    "tour operators South Africa",
    "shuttle and transfer services",
    "KwaZulu-Natal",
    "things to do in South Africa",
  ],
  logoAlt: "ZAtours logo",
  regionLine: "South Africa · Southern & East Africa",
  footerBlurb:
    "ZAtours is a directory of tourism businesses in South Africa, Southern and East Africa. We don't sell tours — you book directly with the businesses listed.",
  nav: [
    { href: "/#directory", label: "Browse the directory", key: "browse" },
    { href: "/#featured", label: "Featured", key: "featured" },
    { href: "/#map", label: "Map", key: "map" },
    { href: "/routes", label: "Routes", key: "routes" },
    { href: ROUTE22_URL, label: "Elephant Coast route", external: true, key: "elephantCoast" },
  ],
  footerExplore: [
    { href: "/#directory", label: "Browse the directory", key: "browse" },
    { href: "/#featured", label: "Featured businesses", key: "featuredBusinesses" },
    { href: ROUTE22_URL, label: "Route22 — Elephant Coast", external: true, key: "route22Link" },
  ],
  directoryHref: "/#directory",
  listingContext: (l) =>
    [l.location, l.province && l.province !== l.location ? l.province : null]
      .filter(Boolean)
      .join(" · ") + " · South Africa",
  moreHeading: "More nearby",
  icon: "/zatours-icon.svg",
  themeColor: "#1f2a44",
};

export const BRAND: Brand = SITE_ID === "zatours" ? zatours : route22;
