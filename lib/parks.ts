// Route22 — parks & reserves along the Elephant Coast route.
// Each entry powers (1) a clickable card in the Highlights section and
// (2) its own SEO page at /parks/[slug]. Copy is written to read naturally
// while working in the phrases travellers actually search for each place.

export type ParkSection = { heading: string; body: string };

export type QuickFact = { label: string; value: string };

export type Park = {
  slug: string;
  name: string; // full title used on the page
  shortName: string; // card title
  kind: string; // small badge, e.g. "Big Five reserve"
  region: string; // where on the route
  hue: string; // tailwind gradient for the card banner
  tagline: string; // one line under the card title
  cardDesc: string; // card paragraph
  seoTitle: string; // <title>
  seoDescription: string; // meta description
  keywords: string[];
  heroBlurb: string; // opening paragraph on the page
  sections: ParkSection[];
  quickFacts: QuickFact[];
};

export const parks: Park[] = [
  {
    slug: "hluhluwe-imfolozi",
    name: "Hluhluwe-iMfolozi Park",
    shortName: "Hluhluwe-iMfolozi Park",
    kind: "Big Five reserve",
    region: "Southern gateway",
    hue: "from-bush/85 to-bush-dk/90",
    tagline: "Africa's oldest game reserve — and the home of rhino conservation.",
    cardDesc:
      "Big Five safaris in the oldest proclaimed game reserve in Africa, birthplace of white-rhino conservation.",
    seoTitle: "Hluhluwe-iMfolozi Park — Big Five Safari & Accommodation | Route22",
    seoDescription:
      "Plan a Hluhluwe-iMfolozi safari on the Elephant Coast route: Big Five game viewing, self-drive and guided game drives, accommodation, gate times and the best time to visit Africa's oldest game reserve.",
    keywords: [
      "Hluhluwe iMfolozi safari",
      "Hluhluwe iMfolozi accommodation",
      "Big Five safari KwaZulu-Natal",
      "rhino conservation",
      "self-drive safari South Africa",
      "Hilltop Camp",
    ],
    heroBlurb:
      "Hluhluwe-iMfolozi Park is the oldest proclaimed game reserve in Africa and the flagship stop on the Route22 Elephant Coast journey. It is world-famous as the birthplace of white-rhino conservation and one of the best places in KwaZulu-Natal to see the Big Five — lion, leopard, elephant, buffalo and rhino — on a single self-drive or guided safari.",
    sections: [
      {
        heading: "Big Five game viewing & safaris",
        body: "Hluhluwe-iMfolozi is Big Five country. You can explore it on a self-drive safari in your own vehicle or join a guided game drive and night drive run from the park's camps. The hilly, thickly-wooded Hluhluwe section in the north and the open savanna of the iMfolozi section in the south together support lion, leopard, elephant, buffalo, both black and white rhino, wild dog, cheetah, giraffe and huge herds of plains game.",
      },
      {
        heading: "Accommodation in Hluhluwe-iMfolozi",
        body: "Accommodation inside the park ranges from the well-known Hilltop Camp in the Hluhluwe section to Mpila Camp in iMfolozi, plus smaller bush camps and lodges. Many visitors also stay in the town of Hluhluwe or at private lodges just outside the gates — all listed in the Route22 directory so you can compare stays right along the route.",
      },
      {
        heading: "Gate times, fees & self-drive tips",
        body: "The park charges a daily conservation fee and opens its gates at set times that change between summer and winter, so check the current Ezemvelo KZN Wildlife information before you travel. For self-drive safaris, arrive at gate opening for the best game viewing, keep to the speed limit, and never leave your vehicle except at designated points.",
      },
      {
        heading: "Best time to visit",
        body: "Game viewing is rewarding year-round, but the cooler, drier winter months (May to September) concentrate animals around water and thin out the bush, making wildlife easier to spot. Summer brings lush scenery, newborn animals and excellent birding, with warmer, wetter days.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Big Five game reserve" },
      { label: "Best for", value: "Rhino, lion, self-drive safari" },
      { label: "On the route", value: "Southern gateway, off the N2 / R22" },
    ],
  },
  {
    slug: "isimangaliso-wetland-park",
    name: "iSimangaliso Wetland Park",
    shortName: "iSimangaliso Wetland Park",
    kind: "World Heritage Site",
    region: "The coastal spine",
    hue: "from-ocean/85 to-bush/80",
    tagline: "South Africa's first World Heritage Site — 220 km of protected coast.",
    cardDesc:
      "South Africa's first World Heritage Site — 21 ecosystems, from Lake St Lucia to Kosi Bay.",
    seoTitle: "iSimangaliso Wetland Park — Activities, Map & Things to Do | Route22",
    seoDescription:
      "iSimangaliso Wetland Park travel guide: things to do, activities, accommodation and map of South Africa's first World Heritage Site, from Lake St Lucia and Cape Vidal to Sodwana Bay and Kosi Bay.",
    keywords: [
      "iSimangaliso Wetland Park",
      "iSimangaliso activities",
      "iSimangaliso things to do",
      "World Heritage Site South Africa",
      "Lake St Lucia",
      "Cape Vidal",
    ],
    heroBlurb:
      "iSimangaliso Wetland Park was South Africa's first UNESCO World Heritage Site and is the natural backbone of the Elephant Coast. Stretching more than 220 km along the coast, it protects 21 linked ecosystems — lake, wetland, dune forest, beach, coral reef and offshore ocean — from Lake St Lucia in the south all the way to the Kosi Bay lakes on the Mozambique border.",
    sections: [
      {
        heading: "Things to do in iSimangaliso",
        body: "The park packs in an extraordinary range of activities: hippo and crocodile boat cruises on the St Lucia estuary, snorkelling and scuba diving at Sodwana Bay, whale watching in season, turtle tours to see nesting loggerhead and leatherback turtles, game drives past elephant, rhino and buffalo, and endless birding across the wetlands.",
      },
      {
        heading: "Key sections & how they connect",
        body: "iSimangaliso is best understood as a string of destinations along the Route22 corridor — St Lucia and Cape Vidal in the south, the Eastern Shores game area, Sodwana Bay's dive reefs, Lake Sibaya, and the Kosi Bay lake system in the far north. Each has its own gate and character, and the route links them into one journey.",
      },
      {
        heading: "Accommodation & where to base yourself",
        body: "Most travellers base themselves in St Lucia town for the southern park, and in Sodwana or Mbazwana for the diving and northern beaches. Route22 lists lodges, self-catering and camps at each anchor so you can plan multi-stop trips without backtracking.",
      },
      {
        heading: "Best time to visit",
        body: "iSimangaliso is a year-round destination. Turtle-nesting tours run in summer (November to February), whale watching peaks in winter and spring, and the dry winter months are ideal for game viewing and comfortable diving conditions.",
      },
    ],
    quickFacts: [
      { label: "Status", value: "UNESCO World Heritage Site" },
      { label: "Best for", value: "Coast, wetlands, diving, turtles" },
      { label: "On the route", value: "Runs the length of the corridor" },
    ],
  },
  {
    slug: "st-lucia",
    name: "St Lucia",
    shortName: "St Lucia",
    kind: "Gateway town",
    region: "Southern anchor",
    hue: "from-ocean/80 to-ocean/60",
    tagline: "Hippos in the estuary, boat cruises and the gateway to iSimangaliso.",
    cardDesc:
      "The gateway town on the St Lucia estuary — hippo & croc boat cruises and the road to Cape Vidal.",
    seoTitle: "St Lucia South Africa — Hippo Boat Cruises & Things to Do | Route22",
    seoDescription:
      "St Lucia travel guide on the Elephant Coast: hippo and crocodile estuary boat cruises, things to do, accommodation, Cape Vidal beaches and how St Lucia opens the gateway to iSimangaliso Wetland Park.",
    keywords: [
      "St Lucia South Africa",
      "St Lucia boat cruise",
      "St Lucia hippo tour",
      "St Lucia things to do",
      "St Lucia accommodation",
      "Cape Vidal",
    ],
    heroBlurb:
      "St Lucia is the buzzing gateway town at the southern end of the Route22 Elephant Coast route, sitting right on the edge of the St Lucia estuary inside iSimangaliso Wetland Park. It is famous for the hippos and crocodiles in its waterways — you'll often see hippos wandering the streets at night — and for being the launch point for boat cruises, beaches and safaris.",
    sections: [
      {
        heading: "Hippo & crocodile boat cruises",
        body: "The classic thing to do in St Lucia is an estuary boat cruise to see hippos and Nile crocodiles up close, along with pelicans, fish eagles and other waterbirds. Cruises run daily and are one of the most popular and family-friendly activities on the whole Elephant Coast.",
      },
      {
        heading: "Beaches, Cape Vidal & things to do",
        body: "Beyond the estuary, St Lucia is the springboard for Cape Vidal's swimming and snorkelling beaches, the iSimangaliso Eastern Shores game drive (with elephant, rhino, buffalo and zebra), whale watching in season, turtle tours in summer and coastal walks. The town itself has restaurants, shops and tour operators.",
      },
      {
        heading: "Accommodation in St Lucia",
        body: "St Lucia offers the widest choice of accommodation on the southern route — guesthouses, self-catering, B&Bs and lodges to suit every budget. Book a base here for at least two nights to cover both the estuary and Cape Vidal; compare stays in the Route22 directory.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Estuary gateway town" },
      { label: "Best for", value: "Boat cruises, beaches, families" },
      { label: "On the route", value: "Southern anchor, near the N2" },
    ],
  },
  {
    slug: "sodwana-bay",
    name: "Sodwana Bay",
    shortName: "Sodwana Bay",
    kind: "Diving & ocean",
    region: "Northern coast",
    hue: "from-ocean/85 to-ocean/55",
    tagline: "The planet's southernmost coral reefs — world-class scuba diving.",
    cardDesc:
      "World-class scuba diving on the southernmost coral reefs, plus deep-sea fishing and beaches.",
    seoTitle: "Sodwana Bay Diving — Scuba, Reefs & Accommodation Guide | Route22",
    seoDescription:
      "Sodwana Bay diving guide: scuba dive the southernmost coral reefs in the world (Two-Mile, Five-Mile, Seven-Mile Reef), PADI courses, snorkelling, deep-sea fishing, accommodation and the best time to dive.",
    keywords: [
      "Sodwana Bay diving",
      "Sodwana Bay scuba",
      "Two Mile Reef Sodwana",
      "Sodwana Bay accommodation",
      "PADI courses Sodwana",
      "snorkelling Sodwana",
    ],
    heroBlurb:
      "Sodwana Bay is South Africa's premier scuba-diving destination and one of the top stops on the Route22 Elephant Coast route. It protects the southernmost coral reefs on Earth, inside the iSimangaliso marine reserve, drawing divers from around the world to reefs teeming with tropical fish, turtles, rays and — in summer — whale sharks.",
    sections: [
      {
        heading: "Scuba diving the reefs",
        body: "Sodwana's dive sites are named for their distance from the launch: Two-Mile, Five-Mile, Seven-Mile and Nine-Mile Reef. Two-Mile Reef is the busiest and best for beginners and snorkellers, while the deeper reefs reward experienced divers with pristine coral, ragged-tooth sharks and the chance of whale sharks and manta rays. Several dive schools offer PADI courses from Open Water up.",
      },
      {
        heading: "Snorkelling, fishing & beach time",
        body: "Non-divers aren't left out — there's excellent snorkelling on the shallow reef, launch-based deep-sea fishing, and a broad swimming beach. Turtle tours to watch nesting loggerheads and leatherbacks run on summer nights.",
      },
      {
        heading: "Accommodation in Sodwana Bay",
        body: "Stay options run from the national-park campsite and self-catering chalets to dive lodges and guesthouses in nearby Mbazwana. Most dive packages bundle accommodation with launches — browse the Route22 directory to compare dive operators and stays.",
      },
      {
        heading: "Best time to dive",
        body: "Diving is good all year. Water is warmest and visibility often best from around March to June; whale sharks and manta rays are more common in the warmer summer months, while ragged-tooth sharks aggregate in winter.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Marine reserve & dive site" },
      { label: "Best for", value: "Scuba diving, snorkelling, fishing" },
      { label: "On the route", value: "Northern coast, off the R22" },
    ],
  },
  {
    slug: "mkhuze-game-reserve",
    name: "Mkhuze Game Reserve",
    shortName: "Mkhuze Game Reserve",
    kind: "Birding & game reserve",
    region: "Central route",
    hue: "from-bush/75 to-ocean/70",
    tagline: "One of Africa's finest birding reserves — hides, fig forests and pans.",
    cardDesc:
      "A legendary birding reserve with famous hides, fig forests and pans full of game.",
    seoTitle: "Mkhuze Game Reserve — Birding, Hides & Safari Guide | Route22",
    seoDescription:
      "Mkhuze Game Reserve guide: world-class birding, the famous kuMasinga hide, Nsumo Pan, fig forest walks, Big Five game viewing, accommodation and the best time to visit on the Elephant Coast route.",
    keywords: [
      "Mkhuze Game Reserve",
      "Mkuze birding",
      "kuMasinga hide",
      "Nsumo Pan",
      "Mkhuze accommodation",
      "birdwatching KwaZulu-Natal",
    ],
    heroBlurb:
      "Mkhuze (Mkuze) Game Reserve is one of the finest birding destinations in Africa and a rewarding wildlife stop on the Route22 corridor. Part of the greater iSimangaliso Wetland Park, it combines game-filled pans, sand-forest, acacia savanna and a spectacular fig forest, with a bird list topping 400 species.",
    sections: [
      {
        heading: "Birding & the famous hides",
        body: "Mkhuze is renowned for its photographic hides — the kuMasinga hide is one of the most famous wildlife hides in Africa, drawing a steady stream of game and birds to water. With over 400 recorded species, from raptors to waterbirds, it is a bucket-list reserve for birdwatchers.",
      },
      {
        heading: "Game viewing, Nsumo Pan & fig forest",
        body: "Beyond birds, Mkhuze holds rhino, elephant, giraffe, zebra, nyala and a wealth of antelope. Nsumo Pan is a scenic spot for hippo, crocodile and waterfowl, and the guided fig-forest walk beneath giant sycamore figs is a highlight found almost nowhere else.",
      },
      {
        heading: "Accommodation & getting there",
        body: "The reserve offers rest-camp chalets, tented camps and a campsite, with private lodges nearby. It lies just off the route between the N2 and the coast — compare stays and guided-walk operators in the Route22 directory.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Birding & game reserve" },
      { label: "Best for", value: "Birdwatching, hides, photography" },
      { label: "On the route", value: "Central corridor, part of iSimangaliso" },
    ],
  },
  {
    slug: "tembe-elephant-park",
    name: "Tembe Elephant Park",
    shortName: "Tembe Elephant Park",
    kind: "Big tuskers",
    region: "Far north",
    hue: "from-clay/80 to-clay-dk/90",
    tagline: "Home to some of Africa's biggest tuskers, on the Mozambique border.",
    cardDesc:
      "Sand-forest wilderness sheltering some of the largest elephants left in Africa.",
    seoTitle: "Tembe Elephant Park — Big Tuskers & Safari Guide | Route22",
    seoDescription:
      "Tembe Elephant Park guide: see Africa's biggest tuskers in remote sand-forest wilderness on the Mozambique border — Big Five game drives, the Tembe lodge, accommodation and how to visit on the Elephant Coast route.",
    keywords: [
      "Tembe Elephant Park",
      "big tuskers South Africa",
      "Tembe safari",
      "Tembe accommodation",
      "Maputaland elephants",
      "Big Five reserve",
    ],
    heroBlurb:
      "Tembe Elephant Park protects one of the last herds of Africa's giant tuskers in a remote sand-forest wilderness on the Mozambique border, in the far north of the Route22 route. It's a raw, uncrowded Big Five reserve famous for enormous bull elephants and a genuine sense of wild Maputaland.",
    sections: [
      {
        heading: "Africa's big tuskers",
        body: "Tembe is best known for its elephants — including some of the biggest tuskers left on the continent, animals carrying huge ivory rarely seen elsewhere. The reserve is also Big Five, with lion, leopard, rhino and buffalo moving through rare sand-forest and wetland habitats.",
      },
      {
        heading: "Game drives & access",
        body: "Access is by 4x4, and most visitors explore on guided game drives run from the park, which reach areas ordinary vehicles can't. This keeps Tembe wild and quiet compared with busier reserves.",
      },
      {
        heading: "Accommodation at Tembe",
        body: "Accommodation centres on the park's tented lodge, offering full-board safari stays deep in the bush. Because places are limited and access is guided, booking ahead is essential — see the Route22 directory for options along the northern route.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Big Five & elephant reserve" },
      { label: "Best for", value: "Giant tuskers, wilderness, 4x4 safari" },
      { label: "On the route", value: "Far north, near the border" },
    ],
  },
  {
    slug: "ndumo-game-reserve",
    name: "Ndumo Game Reserve",
    shortName: "Ndumo Game Reserve",
    kind: "Birding reserve",
    region: "Far north",
    hue: "from-bush/70 to-ocean/70",
    tagline: "A birder's holy grail on the Pongola floodplain — 400+ species.",
    cardDesc:
      "A birding paradise on the Pongola floodplain, with pans crowded with wildlife.",
    seoTitle: "Ndumo Game Reserve — Birding & Pans Safari Guide | Route22",
    seoDescription:
      "Ndumo Game Reserve guide: one of Africa's top birdwatching reserves on the Pongola floodplain, with 430+ species, pan boat and guided walks, crocodiles, hippos and accommodation on the Elephant Coast route.",
    keywords: [
      "Ndumo Game Reserve",
      "Ndumo birding",
      "birdwatching South Africa",
      "Pongola floodplain",
      "Ndumo accommodation",
      "Nyamithi Pan",
    ],
    heroBlurb:
      "Ndumo Game Reserve is a birder's holy grail in the far north of the Route22 route, set where the Pongola and Usuthu rivers spread into a maze of pans and floodplain. With more than 430 recorded bird species, tropical specials found almost nowhere else in South Africa draw birdwatchers from across the world.",
    sections: [
      {
        heading: "World-class birdwatching",
        body: "Ndumo's fever-tree forests and pans — including the beautiful Nyamithi Pan — host an astonishing bird list of 430+ species, including many tropical and East African species at the southern edge of their range. Guided walks and drives get you to the best hides and viewpoints.",
      },
      {
        heading: "Wildlife & the pans",
        body: "The reserve teems with hippos and crocodiles, and holds rhino, nyala, giraffe and plenty of plains game. The reflective pans ringed by fever trees are among the most photogenic scenes in Zululand.",
      },
      {
        heading: "Accommodation & visiting",
        body: "Ndumo has a modest rest camp and guided-tour options; many visitors combine it with Tembe nearby. Access can involve gravel roads, so plan ahead — the Route22 directory lists stays and guides for the northern reserves.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Birding & floodplain reserve" },
      { label: "Best for", value: "Birdwatching, pans, photography" },
      { label: "On the route", value: "Far north, near Tembe" },
    ],
  },
  {
    slug: "kosi-bay",
    name: "Kosi Bay",
    shortName: "Kosi Bay",
    kind: "Estuary & lakes",
    region: "Northern terminus",
    hue: "from-ocean/80 to-bush/75",
    tagline: "Four linked lakes, snorkelling and 400-year-old fish traps.",
    cardDesc:
      "Interlinked lakes, snorkelling at the mouth, and 400-year-old traditional fish traps still in use.",
    seoTitle: "Kosi Bay — Snorkelling, Fish Traps & Things to Do | Route22",
    seoDescription:
      "Kosi Bay travel guide: snorkel the Kosi Mouth aquarium, see the 400-year-old traditional fish traps, explore the four lakes, turtle tours and accommodation at the northern end of the Elephant Coast route.",
    keywords: [
      "Kosi Bay",
      "Kosi Bay snorkelling",
      "Kosi Bay fish traps",
      "Kosi Mouth",
      "Kosi Bay accommodation",
      "Kosi Bay lakes",
    ],
    heroBlurb:
      "Kosi Bay marks the northern terminus of the Route22 route, a short drive from the Mozambique border. It's a magical system of four interlinked lakes running down to a crystal-clear estuary mouth, famous for snorkelling and for the 400-year-old traditional fish traps still worked by hand today.",
    sections: [
      {
        heading: "Snorkelling the Kosi Mouth",
        body: "The Kosi Mouth is often called a natural aquarium — snorkelling in the clear, shallow estuary where the lakes meet the sea lets you drift among tropical reef fish, all within the protection of iSimangaliso. It's one of the most memorable things to do on the whole Elephant Coast.",
      },
      {
        heading: "The traditional fish traps",
        body: "Kosi Bay's iconic fish traps are a 400-year-old system of hand-built kraals in the estuary, still used by local Thonga families under traditional rights. Guided tours explain this living heritage and make for extraordinary photographs at sunrise and sunset.",
      },
      {
        heading: "The four lakes, turtles & getting there",
        body: "Beyond the mouth, the four lakes offer boating, birding and fishing, and summer nights bring turtle tours to see nesting loggerheads and leatherbacks. Access to the mouth is 4x4-only, so many visitors book a guided transfer — compare lodges, camps and guides in the Route22 directory.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Estuary, lakes & marine" },
      { label: "Best for", value: "Snorkelling, fish traps, turtles" },
      { label: "On the route", value: "Northern terminus" },
    ],
  },
  {
    slug: "lake-sibaya",
    name: "Lake Sibaya",
    shortName: "Lake Sibaya",
    kind: "Freshwater lake",
    region: "Northern coast",
    hue: "from-ocean/75 to-bush/70",
    tagline: "South Africa's largest freshwater lake, ringed by forested dunes.",
    cardDesc:
      "The largest natural freshwater lake in South Africa — hippos, crocs and prolific birdlife.",
    seoTitle: "Lake Sibaya — South Africa's Largest Freshwater Lake | Route22",
    seoDescription:
      "Lake Sibaya guide: visit South Africa's largest natural freshwater lake on the Elephant Coast, ringed by forested dunes with hippos, crocodiles and prolific birdlife, near Sodwana Bay and Mbazwana.",
    keywords: [
      "Lake Sibaya",
      "largest freshwater lake South Africa",
      "Lake Sibaya birding",
      "Sibaya accommodation",
      "Maputaland lakes",
    ],
    heroBlurb:
      "Lake Sibaya is the largest natural freshwater lake in South Africa, a serene expanse ringed by high forested dunes near the northern coast of the Route22 route. Part of iSimangaliso, it's a peaceful counterpoint to the ocean, home to hippos, crocodiles and a rich variety of birds.",
    sections: [
      {
        heading: "A wild freshwater lake",
        body: "Fringed by dune forest and rarely crowded, Lake Sibaya offers tranquil views, resident hippo and crocodile populations, and superb birding across its shores and reed beds. It pairs naturally with a Sodwana Bay diving trip just over the dunes.",
      },
      {
        heading: "Where to stay & getting there",
        body: "A handful of eco-lodges and community camps overlook the lake, most reached via Mbazwana on the R22. It's an easy add-on to the northern coast — see the Route22 directory for stays and guided birding.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Freshwater lake" },
      { label: "Best for", value: "Birding, hippos, quiet scenery" },
      { label: "On the route", value: "Northern coast, near Sodwana" },
    ],
  },
  {
    slug: "pongola",
    name: "Pongola & Pongolapoort",
    shortName: "Pongola",
    kind: "Western gateway",
    region: "Western arm",
    hue: "from-bush/80 to-clay/70",
    tagline: "Pongolapoort Dam, tiger-fishing and Big Five along the Lebombo mountains.",
    cardDesc:
      "The western gateway — Pongolapoort Dam, tiger-fishing and Big Five reserves under the Lebombo range.",
    seoTitle: "Pongola & Pongolapoort Dam — Tiger Fishing & Safari | Route22",
    seoDescription:
      "Pongola travel guide: explore Pongolapoort (Jozini) Dam for tiger fishing and houseboat safaris, Big Five reserves along the Lebombo mountains, game drives and accommodation on the western arm of the Elephant Coast route.",
    keywords: [
      "Pongola",
      "Pongolapoort Dam",
      "Jozini Dam tiger fishing",
      "Pongola game reserve",
      "houseboat safari",
      "Lebombo mountains",
    ],
    heroBlurb:
      "Pongola anchors the western arm of the Route22 route, where the Lebombo mountains rise above the vast Pongolapoort (Jozini) Dam. It's a landscape of Big Five reserves, water-based safaris and some of the best freshwater tiger-fishing in South Africa.",
    sections: [
      {
        heading: "Pongolapoort Dam & tiger fishing",
        body: "The huge Pongolapoort (Jozini) Dam is the region's centrepiece — famous for tiger-fishing, houseboat safaris and boat-based game viewing where you can watch elephant and hippo from the water against a mountain backdrop.",
      },
      {
        heading: "Big Five reserves & game drives",
        body: "Several private Big Five reserves flank the dam and the Lebombo range, offering game drives, guided walks and lodge stays. Pongola makes a natural western loop from the coastal route, adding mountains and water to the Elephant Coast's wildlife and beaches.",
      },
      {
        heading: "Accommodation on the western arm",
        body: "From houseboats on the dam to mountain lodges and riverside camps, the Pongola area has a distinctive range of stays. Compare options and fishing or safari operators in the Route22 directory.",
      },
    ],
    quickFacts: [
      { label: "Type", value: "Dam, mountains & Big Five reserves" },
      { label: "Best for", value: "Tiger fishing, houseboats, safaris" },
      { label: "On the route", value: "Western arm / loop" },
    ],
  },
];

export function getPark(slug: string): Park | undefined {
  return parks.find((p) => p.slug === slug);
}
