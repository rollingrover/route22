// Route22 — Industry Info: owner-authored, SEO-first editorial content for the
// tourism industry and travellers. Each entry powers a card on /industry and
// its own page at /industry/[slug]. To add a post, append an object below —
// the index and page appear automatically. Keep copy to well-established
// general facts; do not invent statistics, prices, dates or quotes.

export type IndustrySection = { heading: string; body: string };

export type IndustryPost = {
  slug: string;
  title: string;
  category: string; // small badge, e.g. "Travel tips", "Conservation"
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  intro: string;
  sections: IndustrySection[];
  publishedDate: string; // ISO date, e.g. "2026-02-01"
};

export const industryPosts: IndustryPost[] = [
  {
    slug: "how-the-route22-elephant-coast-route-works",
    title: "How the Route22 Elephant Coast route works",
    category: "Trip planning",
    seoTitle: "How the R22 Elephant Coast Route Works — Planning Guide | Route22",
    seoDescription:
      "A practical guide to planning a trip along the R22 Elephant Coast route in KwaZulu-Natal: gateway towns, how the reserves connect, self-drive vs guided touring, and how to structure your itinerary.",
    keywords: [
      "R22 route KwaZulu-Natal",
      "Elephant Coast route planning",
      "Zululand self-drive itinerary",
      "how to plan a Zululand trip",
    ],
    intro:
      "The Elephant Coast is best understood as a corridor rather than a single destination: a string of reserves, lakes and coastal towns linked by the R22 and its feeder roads, running from St Lucia in the south to Kosi Bay in the north, with a western arm out to Pongola.",
    sections: [
      {
        heading: "The corridor, south to north",
        body: "Most itineraries start at St Lucia, at the southern edge of iSimangaliso Wetland Park, then head inland to Hluhluwe-iMfolozi for Big Five game viewing before rejoining the coast at Sodwana Bay, Lake Sibaya and Rocktail Bay, finishing at Kosi Bay near the Mozambique border. A western loop from Hluhluwe town reaches Mkhuze, Tembe and Ndumo, and further west, Pongola.",
      },
      {
        heading: "Self-drive vs guided touring",
        body: "The route is well suited to self-drive travel on tarred and well-maintained gravel roads, with fuel, shops and lodges concentrated in a handful of hub towns such as Hluhluwe and Mbazwana. Travellers who prefer not to drive themselves, or who want specialist access, can book guided transfers and tours through local operators and guides rather than self-driving the full loop.",
      },
      {
        heading: "How to structure an itinerary",
        body: "A short trip typically pairs one reserve stop with one coastal stop — for example Hluhluwe-iMfolozi and St Lucia. Longer trips can string together three or more anchors, allowing two nights at each so there's time to explore rather than just pass through. Booking accommodation and any guided activities ahead of time is advisable in peak season.",
      },
      {
        heading: "Getting oriented before you go",
        body: "Route22 lists each major stop as its own page with quick facts and things to do, plus a directory of accommodation, tours and guides at each anchor point — a useful starting point for building a day-by-day plan before you set off.",
      },
    ],
    publishedDate: "2026-02-01",
  },
  {
    slug: "best-time-to-visit-the-elephant-coast",
    title: "Best time to visit the Elephant Coast",
    category: "Seasonal tips",
    seoTitle: "Best Time to Visit the Elephant Coast, KwaZulu-Natal | Route22",
    seoDescription:
      "When to visit the Elephant Coast: seasonal guide to game viewing, diving conditions at Sodwana Bay, turtle nesting, whale watching and weather along the R22 route in KwaZulu-Natal.",
    keywords: [
      "best time to visit KwaZulu-Natal",
      "Sodwana Bay diving season",
      "turtle nesting South Africa",
      "whale watching KwaZulu-Natal",
    ],
    intro:
      "The Elephant Coast is a year-round destination, but different seasons favour different activities — game viewing, diving, turtle tours and whale watching each have their own rhythm.",
    sections: [
      {
        heading: "Winter (roughly May to September)",
        body: "Cooler, drier weather thins out vegetation and concentrates animals around water sources, making winter a strong season for game viewing in Hluhluwe-iMfolozi, Mkhuze, Tembe and Ndumo. It's also a good time for comfortable diving conditions at Sodwana Bay and for spotting ragged-tooth sharks on the reefs.",
      },
      {
        heading: "Summer (roughly November to March)",
        body: "Summer brings warmer, wetter weather, lush green scenery and newborn animals, along with the best birding as migrant species arrive. It is also nesting season for loggerhead and leatherback turtles along the northern beaches, with guided turtle tours running on summer nights.",
      },
      {
        heading: "Whale watching and shoulder seasons",
        body: "Whale watching along this stretch of coast is best in the cooler months into early spring, as humpback whales migrate along the KwaZulu-Natal coastline. The shoulder seasons (April and October) often combine reasonable weather with fewer crowds.",
      },
      {
        heading: "Booking around school holidays",
        body: "South African school holidays, particularly December to January and around Easter, bring higher demand for accommodation and activities across the route. Booking well ahead for these periods is recommended, especially for popular camps inside the reserves.",
      },
    ],
    publishedDate: "2026-02-08",
  },
  {
    slug: "conservation-and-community-tourism-in-maputaland",
    title: "Conservation and community tourism in Maputaland",
    category: "Conservation",
    seoTitle: "Conservation & Community Tourism in Maputaland | Route22",
    seoDescription:
      "How conservation and community tourism work together in Maputaland and the Elephant Coast: rhino conservation history, protected area status, and how visitors and local guides support the region.",
    keywords: [
      "rhino conservation KwaZulu-Natal",
      "Maputaland conservation",
      "community tourism Zululand",
      "iSimangaliso conservation",
    ],
    intro:
      "The Elephant Coast's reserves are not just scenic backdrops — the region has a long conservation history, and tourism plays a direct role in funding protection and supporting neighbouring communities.",
    sections: [
      {
        heading: "A conservation heartland",
        body: "Hluhluwe-iMfolozi Park is widely recognised as the birthplace of modern white-rhino conservation, having played a central role in bringing the species back from the brink of extinction in the twentieth century. iSimangaliso Wetland Park, South Africa's first UNESCO World Heritage Site, protects a chain of linked ecosystems from wetlands to coral reef along the same corridor.",
      },
      {
        heading: "Community-linked conservation areas",
        body: "Several reserves in the region, including areas around Tembe and Ndumo, border community-owned or community-linked land, and tourism revenue and employment from lodges, guiding and craft sales form part of the economic case for keeping this land under conservation rather than converting it to other uses.",
      },
      {
        heading: "How visitors and operators can support this",
        body: "Choosing registered guides and operators, respecting park rules and rest-camp regulations, and favouring accommodation and tours that are transparent about their community and conservation involvement all help ensure tourism spending supports both wildlife protection and local livelihoods. The Route22 directory and guides section point travellers toward operators working directly in these areas.",
      },
    ],
    publishedDate: "2026-02-15",
  },
  {
    slug: "self-drive-safari-tips-for-zululand-reserves",
    title: "Self-drive safari tips for Zululand's reserves",
    category: "Travel tips",
    seoTitle: "Self-Drive Safari Tips for Zululand's Game Reserves | Route22",
    seoDescription:
      "Practical self-drive safari tips for Hluhluwe-iMfolozi, Mkhuze and other Zululand reserves: gate times, vehicle advice, wildlife etiquette and what to pack for a self-guided game drive.",
    keywords: [
      "self-drive safari tips",
      "Hluhluwe iMfolozi self-drive",
      "game reserve etiquette",
      "Zululand safari packing list",
    ],
    intro:
      "Several of the Elephant Coast's reserves, including Hluhluwe-iMfolozi and Mkhuze, are well suited to self-drive game viewing in an ordinary vehicle, provided you plan around a few basics.",
    sections: [
      {
        heading: "Before you enter",
        body: "Reserve gate times change between summer and winter, so check current opening and closing times before you travel and plan to be back at the gate before it closes. Fill up with fuel beforehand, as options inside reserves are limited, and carry the conservation fee payment method accepted at that reserve's gate.",
      },
      {
        heading: "On the road",
        body: "Keep to the reserve's speed limit at all times — it exists for both animal and visitor safety. Stay inside your vehicle except at designated hides, picnic sites or viewpoints, and give animals, especially elephant and buffalo, plenty of space and a clear route to move away.",
      },
      {
        heading: "Best times for game viewing",
        body: "Early morning and late afternoon, close to gate opening and before closing, are generally the most productive times for sightings, as animals are more active in cooler light and often move to water sources. Midday heat tends to push game into shade and cover.",
      },
      {
        heading: "What to pack",
        body: "Binoculars, a reserve map, sun protection, drinking water and snacks are the essentials, along with a fully charged phone or camera. Reserves inside iSimangaliso and Ezemvelo KZN Wildlife land publish current rules and fees on their own websites — worth checking shortly before you travel.",
      },
    ],
    publishedDate: "2026-02-22",
  },
];

export function getIndustryPost(slug: string): IndustryPost | undefined {
  return industryPosts.find((p) => p.slug === slug);
}
