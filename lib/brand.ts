// Per-site branding and copy. Anything that differs between Route22 and
// ZAtours (names, nav, metadata, directory wording) lives here so pages and
// components stay shared.
import { SITE_ID, ROUTE22_URL } from "./site";

type NavLink = { href: string; label: string; external?: boolean };

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
    { href: "/#tours", label: "Tours" },
    { href: "/#route", label: "The Route" },
    { href: "/#highlights", label: "Parks" },
    { href: "/#itineraries", label: "Itineraries" },
    { href: "/#listings", label: "Where to Stay & Do" },
    { href: "/guides", label: "Guides & Drivers" },
    { href: "/industry", label: "Industry Info" },
    { href: "/opportunities", label: "Opportunities" },
  ],
  footerExplore: [
    { href: "/#route", label: "The Route" },
    { href: "/#highlights", label: "Parks" },
    { href: "/#itineraries", label: "Itineraries" },
    { href: "/#listings", label: "Stay & Do" },
    { href: "/guides", label: "Guides & Drivers" },
    { href: "/industry", label: "Industry Info" },
    { href: "/opportunities", label: "Opportunities" },
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
  tagline: "South Africa's tourism directory",
  title: "ZAtours — South Africa's Tourism Directory | Stays, Tours & Experiences",
  description:
    "Find places to stay, tours, safaris and experiences across South Africa — listed by the businesses that run them. Enquire directly with lodges, guesthouses, tour and transfer operators.",
  ogTitle: "ZAtours — South Africa's tourism directory",
  ogDescription:
    "Stays, safaris, tours and experiences across South Africa. Enquire directly with the businesses that run them.",
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
  regionLine: "South Africa",
  footerBlurb:
    "ZAtours is a directory of South African tourism businesses. We don't sell tours — you book directly with the businesses listed.",
  nav: [
    { href: "/#directory", label: "Browse the directory" },
    { href: "/#featured", label: "Featured" },
    { href: ROUTE22_URL, label: "Elephant Coast route", external: true },
  ],
  footerExplore: [
    { href: "/#directory", label: "Browse the directory" },
    { href: "/#featured", label: "Featured businesses" },
    { href: ROUTE22_URL, label: "Route22 — Elephant Coast", external: true },
  ],
  directoryHref: "/#directory",
  listingContext: (l) =>
    [l.location, l.province && l.province !== l.location ? l.province : null]
      .filter(Boolean)
      .join(" · ") + " · South Africa",
  moreHeading: "More nearby",
  icon: "/zatours-icon.png",
  appleIcon: "/zatours-apple-icon.png",
  themeColor: "#1f2a44",
};

export const BRAND: Brand = SITE_ID === "zatours" ? zatours : route22;
