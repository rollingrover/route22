// Fixed points of interest for the ZAtours "Explore" map: national parks,
// major provincial reserves and UNESCO World Heritage Sites.
//
// Coordinates are approximate visitor-area points (not boundaries), compiled
// Oct 2026 from general knowledge — spot-check before relying on them. Each
// entry has a `country` so the map can grow beyond South Africa later by
// adding rows, not code.
//
// Not yet included (verify first): UNESCO's 2024 South African inscriptions
// (Nelson Mandela Legacy Sites; Pleistocene modern-human sites) — both are
// multi-location "serial" sites.

export type PlaceType = "national_park" | "reserve" | "heritage_site";

export type Place = {
  id: string;
  name: string;
  type: PlaceType;
  country: "ZA";
  province: string;
  lat: number;
  lng: number;
  blurb: string;
};

export const placeTypeLabel: Record<PlaceType, string> = {
  national_park: "National park",
  reserve: "Game reserve",
  heritage_site: "World Heritage Site",
};

export const places: Place[] = [
  // --- SANParks national parks ---
  { id: "kruger", name: "Kruger National Park", type: "national_park", country: "ZA", province: "Limpopo / Mpumalanga", lat: -23.99, lng: 31.55, blurb: "South Africa's flagship Big Five park — nearly 2 million hectares of bushveld." },
  { id: "addo", name: "Addo Elephant National Park", type: "national_park", country: "ZA", province: "Eastern Cape", lat: -33.48, lng: 25.75, blurb: "Elephants by the hundred, plus the Big Five and a marine section." },
  { id: "garden-route", name: "Garden Route National Park", type: "national_park", country: "ZA", province: "Western Cape", lat: -34.02, lng: 23.89, blurb: "Tsitsikamma's coastal cliffs, Knysna forests and Wilderness lakes." },
  { id: "table-mountain", name: "Table Mountain National Park", type: "national_park", country: "ZA", province: "Western Cape", lat: -33.96, lng: 18.40, blurb: "Table Mountain to Cape Point — fynbos, penguins and ocean views." },
  { id: "west-coast", name: "West Coast National Park", type: "national_park", country: "ZA", province: "Western Cape", lat: -33.17, lng: 18.13, blurb: "Langebaan lagoon, spring flowers and seabird colonies." },
  { id: "agulhas", name: "Agulhas National Park", type: "national_park", country: "ZA", province: "Western Cape", lat: -34.83, lng: 20.01, blurb: "Africa's southernmost tip, where two oceans meet." },
  { id: "bontebok", name: "Bontebok National Park", type: "national_park", country: "ZA", province: "Western Cape", lat: -34.07, lng: 20.45, blurb: "Small fynbos park that saved the bontebok from extinction." },
  { id: "tankwa", name: "Tankwa Karoo National Park", type: "national_park", country: "ZA", province: "Northern / Western Cape", lat: -32.25, lng: 19.90, blurb: "Vast, silent semi-desert under huge night skies." },
  { id: "namaqua", name: "Namaqua National Park", type: "national_park", country: "ZA", province: "Northern Cape", lat: -30.15, lng: 17.60, blurb: "Famous spring wildflower displays on the Namaqualand coast." },
  { id: "richtersveld-np", name: "|Ai-|Ais/Richtersveld Transfrontier Park", type: "national_park", country: "ZA", province: "Northern Cape", lat: -28.25, lng: 17.10, blurb: "Rugged mountain desert along the Orange River." },
  { id: "augrabies", name: "Augrabies Falls National Park", type: "national_park", country: "ZA", province: "Northern Cape", lat: -28.59, lng: 20.34, blurb: "The Orange River thunders into a granite gorge." },
  { id: "kgalagadi", name: "Kgalagadi Transfrontier Park", type: "national_park", country: "ZA", province: "Northern Cape", lat: -26.0, lng: 20.6, blurb: "Red dunes and black-maned Kalahari lions, shared with Botswana." },
  { id: "mokala", name: "Mokala National Park", type: "national_park", country: "ZA", province: "Northern Cape", lat: -29.17, lng: 24.32, blurb: "Camelthorn savanna and a key rhino and antelope sanctuary." },
  { id: "karoo", name: "Karoo National Park", type: "national_park", country: "ZA", province: "Western Cape", lat: -32.33, lng: 22.50, blurb: "Great Karoo plains and mountains near Beaufort West." },
  { id: "camdeboo", name: "Camdeboo National Park", type: "national_park", country: "ZA", province: "Eastern Cape", lat: -32.25, lng: 24.53, blurb: "The Valley of Desolation's dolerite pillars above Graaff-Reinet." },
  { id: "mountain-zebra", name: "Mountain Zebra National Park", type: "national_park", country: "ZA", province: "Eastern Cape", lat: -32.23, lng: 25.48, blurb: "Cape mountain zebra, cheetah and wide Karoo views." },
  { id: "golden-gate", name: "Golden Gate Highlands National Park", type: "national_park", country: "ZA", province: "Free State", lat: -28.51, lng: 28.62, blurb: "Golden sandstone cliffs in the Maluti foothills." },
  { id: "marakele", name: "Marakele National Park", type: "national_park", country: "ZA", province: "Limpopo", lat: -24.43, lng: 27.58, blurb: "Waterberg mountains, Big Five and a huge Cape vulture colony." },
  { id: "mapungubwe-np", name: "Mapungubwe National Park", type: "national_park", country: "ZA", province: "Limpopo", lat: -22.22, lng: 29.39, blurb: "Where South Africa, Botswana and Zimbabwe meet on the Limpopo." },

  // --- Major provincial / private-access reserves ---
  { id: "hluhluwe-imfolozi", name: "Hluhluwe-iMfolozi Park", type: "reserve", country: "ZA", province: "KwaZulu-Natal", lat: -28.22, lng: 31.95, blurb: "Africa's oldest proclaimed reserve and the home of rhino conservation." },
  { id: "mkhuze", name: "Mkhuze Game Reserve", type: "reserve", country: "ZA", province: "KwaZulu-Natal", lat: -27.65, lng: 32.25, blurb: "Legendary birding hides, fig forests and busy waterholes." },
  { id: "tembe", name: "Tembe Elephant Park", type: "reserve", country: "ZA", province: "KwaZulu-Natal", lat: -26.95, lng: 32.45, blurb: "Sand forest home to some of Africa's biggest tuskers." },
  { id: "ithala", name: "Ithala Game Reserve", type: "reserve", country: "ZA", province: "KwaZulu-Natal", lat: -27.53, lng: 31.25, blurb: "Steep valleys and big game in northern Zululand." },
  { id: "pilanesberg", name: "Pilanesberg National Park", type: "reserve", country: "ZA", province: "North West", lat: -25.25, lng: 27.10, blurb: "Big Five in an ancient volcanic crater, near Sun City." },
  { id: "madikwe", name: "Madikwe Game Reserve", type: "reserve", country: "ZA", province: "North West", lat: -24.75, lng: 26.25, blurb: "Malaria-free Big Five reserve on the Botswana border." },

  // --- UNESCO World Heritage Sites ---
  { id: "isimangaliso", name: "iSimangaliso Wetland Park", type: "heritage_site", country: "ZA", province: "KwaZulu-Natal", lat: -28.0, lng: 32.5, blurb: "South Africa's first World Heritage Site — lakes, dunes, reefs and wetlands." },
  { id: "drakensberg", name: "Maloti-Drakensberg Park", type: "heritage_site", country: "ZA", province: "KwaZulu-Natal", lat: -29.13, lng: 29.40, blurb: "Dramatic basalt peaks and thousands of San rock paintings." },
  { id: "cradle", name: "Cradle of Humankind", type: "heritage_site", country: "ZA", province: "Gauteng", lat: -25.92, lng: 27.78, blurb: "Fossil hominid caves — some of the world's richest early-human finds." },
  { id: "robben-island", name: "Robben Island", type: "heritage_site", country: "ZA", province: "Western Cape", lat: -33.81, lng: 18.37, blurb: "Former prison island where Nelson Mandela spent 18 years." },
  { id: "cape-floral", name: "Cape Floral Region Protected Areas", type: "heritage_site", country: "ZA", province: "Western Cape", lat: -33.95, lng: 19.25, blurb: "One of the world's richest plant kingdoms (serial site, many locations)." },
  { id: "mapungubwe", name: "Mapungubwe Cultural Landscape", type: "heritage_site", country: "ZA", province: "Limpopo", lat: -22.19, lng: 29.24, blurb: "Hilltop capital of a powerful southern African kingdom (c. 900–1300 AD)." },
  { id: "vredefort", name: "Vredefort Dome", type: "heritage_site", country: "ZA", province: "Free State / North West", lat: -26.86, lng: 27.26, blurb: "The world's oldest and largest visible meteorite impact structure." },
  { id: "richtersveld-wh", name: "Richtersveld Cultural and Botanical Landscape", type: "heritage_site", country: "ZA", province: "Northern Cape", lat: -28.10, lng: 17.25, blurb: "Semi-nomadic Nama pastoralism in a succulent-rich mountain desert." },
  { id: "khomani", name: "‡Khomani Cultural Landscape", type: "heritage_site", country: "ZA", province: "Northern Cape", lat: -26.40, lng: 20.30, blurb: "Ancestral land of the ‡Khomani San in the southern Kalahari." },
  { id: "barberton", name: "Barberton Makhonjwa Mountains", type: "heritage_site", country: "ZA", province: "Mpumalanga", lat: -25.85, lng: 31.0, blurb: "Some of Earth's oldest exposed rock — 3.6 billion years of geology." },
];
