// Fixed points of interest for the ZAtours "Explore" map: national parks,
// major provincial reserves and UNESCO World Heritage Sites.
//
// Coordinates are approximate visitor-area points (not boundaries), compiled
// Oct 2026 from general knowledge — spot-check before relying on them.
// South Africa is covered in depth; Southern & East Africa has the headline
// parks and World Heritage Sites (OpDesk's wider market). Add rows to grow.
//
// Not yet included (verify first): UNESCO's 2024 South African inscriptions
// (Nelson Mandela Legacy Sites; Pleistocene modern-human sites) — both are
// multi-location "serial" sites.

export type PlaceType = "national_park" | "reserve" | "heritage_site";

export const COUNTRIES = {
  ZA: "South Africa", BW: "Botswana", NA: "Namibia", ZW: "Zimbabwe", ZM: "Zambia", MZ: "Mozambique",
  MW: "Malawi", SZ: "Eswatini", LS: "Lesotho", KE: "Kenya", TZ: "Tanzania", UG: "Uganda", RW: "Rwanda",
} as const;
export type CountryCode = keyof typeof COUNTRIES;

export type Place = {
  id: string;
  name: string;
  type: PlaceType;
  country: CountryCode;
  province: string; // province / region shown in the popup
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

  // ===== Southern Africa (headline parks & World Heritage Sites) =====
  { id: "okavango", name: "Okavango Delta", type: "heritage_site", country: "BW", province: "Ngamiland", lat: -19.3, lng: 22.9, blurb: "The world's largest inland delta — a seasonal flood in the Kalahari." },
  { id: "chobe", name: "Chobe National Park", type: "national_park", country: "BW", province: "Chobe", lat: -18.6, lng: 24.5, blurb: "Huge elephant herds and river safaris on the Chobe." },
  { id: "tsodilo", name: "Tsodilo Hills", type: "heritage_site", country: "BW", province: "Ngamiland", lat: -18.75, lng: 21.73, blurb: "“Mountains of the Gods” — over 4,500 rock paintings in the Kalahari." },
  { id: "moremi", name: "Moremi Game Reserve", type: "reserve", country: "BW", province: "Ngamiland", lat: -19.2, lng: 23.4, blurb: "The wildlife heart of the Okavango Delta — big cats, wild dogs and mokoro trips." },
  { id: "central-kalahari", name: "Central Kalahari Game Reserve", type: "reserve", country: "BW", province: "Ghanzi / Central", lat: -21.5, lng: 23.8, blurb: "One of the largest protected areas on Earth — black-maned lions and vast fossil valleys." },
  { id: "khutse", name: "Khutse Game Reserve", type: "reserve", country: "BW", province: "Kweneng", lat: -23.35, lng: 24.6, blurb: "Remote Kalahari pans on the southern edge of the Central Kalahari." },
  { id: "makgadikgadi", name: "Makgadikgadi Pans National Park", type: "national_park", country: "BW", province: "Central", lat: -20.4, lng: 25.1, blurb: "Vast salt pans, zebra migrations and the Boteti River." },
  { id: "nxai-pan", name: "Nxai Pan National Park", type: "national_park", country: "BW", province: "Central", lat: -19.9, lng: 24.8, blurb: "Ancient pans and Baines’ Baobabs; summer zebra and springbok herds." },
  { id: "khama-rhino", name: "Khama Rhino Sanctuary", type: "reserve", country: "BW", province: "Central (Serowe)", lat: -22.4, lng: 26.65, blurb: "Community-run sanctuary protecting white and black rhino." },
  { id: "tuli", name: "Northern Tuli Game Reserve (Mashatu)", type: "reserve", country: "BW", province: "Central (Tuli Block)", lat: -22.2, lng: 29.0, blurb: "Rocky “land of giants” where Botswana, South Africa and Zimbabwe meet." },
  { id: "mabuasehube", name: "Kgalagadi — Mabuasehube section", type: "national_park", country: "BW", province: "Kgalagadi", lat: -24.9, lng: 21.9, blurb: "Botswana’s remote side of the Kgalagadi Transfrontier Park — red dunes and pans." },
  { id: "etosha", name: "Etosha National Park", type: "national_park", country: "NA", province: "Kunene / Oshana", lat: -18.85, lng: 16.33, blurb: "A vast salt pan ringed by busy waterholes." },
  { id: "namib", name: "Namib Sand Sea", type: "heritage_site", country: "NA", province: "Hardap / Erongo", lat: -24.75, lng: 15.3, blurb: "Coastal fog desert with the towering dunes of Sossusvlei." },
  { id: "twyfelfontein", name: "Twyfelfontein", type: "heritage_site", country: "NA", province: "Kunene", lat: -20.59, lng: 14.37, blurb: "One of Africa's largest collections of rock engravings." },
  { id: "victoria-falls", name: "Mosi-oa-Tunya / Victoria Falls", type: "heritage_site", country: "ZW", province: "Zimbabwe–Zambia border", lat: -17.92, lng: 25.86, blurb: "\"The smoke that thunders\" — one of the world's great waterfalls." },
  { id: "hwange", name: "Hwange National Park", type: "national_park", country: "ZW", province: "Matabeleland North", lat: -18.75, lng: 26.5, blurb: "Zimbabwe's largest park, famous for elephants and painted dogs." },
  { id: "mana-pools", name: "Mana Pools National Park", type: "heritage_site", country: "ZW", province: "Mashonaland West", lat: -15.75, lng: 29.4, blurb: "Zambezi floodplain famed for walking and canoe safaris." },
  { id: "great-zimbabwe", name: "Great Zimbabwe", type: "heritage_site", country: "ZW", province: "Masvingo", lat: -20.27, lng: 30.93, blurb: "Stone city of a medieval southern African kingdom." },
  { id: "south-luangwa", name: "South Luangwa National Park", type: "national_park", country: "ZM", province: "Eastern Province", lat: -13.08, lng: 31.6, blurb: "Birthplace of the walking safari; leopard country." },
  { id: "lower-zambezi", name: "Lower Zambezi National Park", type: "national_park", country: "ZM", province: "Lusaka Province", lat: -15.4, lng: 29.6, blurb: "Canoe safaris beneath the Zambezi escarpment." },
  { id: "gorongosa", name: "Gorongosa National Park", type: "national_park", country: "MZ", province: "Sofala", lat: -18.97, lng: 34.35, blurb: "A celebrated wildlife restoration story in central Mozambique." },
  { id: "bazaruto", name: "Bazaruto Archipelago National Park", type: "national_park", country: "MZ", province: "Inhambane", lat: -21.7, lng: 35.47, blurb: "Islands, dugongs and coral reefs off the Mozambique coast." },
  { id: "ilha-mocambique", name: "Island of Mozambique", type: "heritage_site", country: "MZ", province: "Nampula", lat: -15.03, lng: 40.73, blurb: "Historic trading-port island, former colonial capital." },
  { id: "lake-malawi", name: "Lake Malawi National Park", type: "heritage_site", country: "MW", province: "Southern Region", lat: -14.03, lng: 34.85, blurb: "Crystal-clear lake waters with hundreds of cichlid fish species." },
  { id: "hlane", name: "Hlane Royal National Park", type: "national_park", country: "SZ", province: "Lubombo", lat: -26.27, lng: 31.88, blurb: "Eswatini's largest protected area, with lion and rhino." },
  { id: "sehlabathebe", name: "Sehlabathebe National Park", type: "national_park", country: "LS", province: "Qacha's Nek", lat: -29.87, lng: 29.12, blurb: "Remote highland park, part of the Maloti-Drakensberg World Heritage Site." },

  // ===== East Africa =====
  { id: "maasai-mara", name: "Maasai Mara National Reserve", type: "reserve", country: "KE", province: "Narok", lat: -1.49, lng: 35.14, blurb: "Big cats and the Great Migration's river crossings." },
  { id: "amboseli", name: "Amboseli National Park", type: "national_park", country: "KE", province: "Kajiado", lat: -2.65, lng: 37.26, blurb: "Elephants beneath Kilimanjaro." },
  { id: "tsavo-east", name: "Tsavo East National Park", type: "national_park", country: "KE", province: "Taita-Taveta", lat: -2.98, lng: 38.47, blurb: "One of Kenya's largest parks — red elephants and open plains." },
  { id: "lake-nakuru", name: "Lake Nakuru National Park", type: "national_park", country: "KE", province: "Nakuru", lat: -0.37, lng: 36.08, blurb: "Rift Valley lake known for flamingos and rhino." },
  { id: "mount-kenya", name: "Mount Kenya", type: "heritage_site", country: "KE", province: "Central Kenya", lat: -0.15, lng: 37.31, blurb: "Africa's second-highest peak and its forests." },
  { id: "lamu", name: "Lamu Old Town", type: "heritage_site", country: "KE", province: "Lamu", lat: -2.27, lng: 40.9, blurb: "East Africa's oldest continuously inhabited Swahili town." },
  { id: "serengeti", name: "Serengeti National Park", type: "heritage_site", country: "TZ", province: "Mara / Simiyu", lat: -2.33, lng: 34.83, blurb: "Endless plains and the Great Migration." },
  { id: "ngorongoro", name: "Ngorongoro Conservation Area", type: "heritage_site", country: "TZ", province: "Arusha", lat: -3.17, lng: 35.58, blurb: "A wildlife-packed volcanic crater." },
  { id: "kilimanjaro", name: "Kilimanjaro National Park", type: "heritage_site", country: "TZ", province: "Kilimanjaro", lat: -3.07, lng: 37.35, blurb: "Africa's highest mountain." },
  { id: "tarangire", name: "Tarangire National Park", type: "national_park", country: "TZ", province: "Manyara", lat: -3.83, lng: 36.0, blurb: "Baobabs and big elephant herds in the dry season." },
  { id: "ruaha", name: "Ruaha National Park", type: "national_park", country: "TZ", province: "Iringa", lat: -7.6, lng: 34.9, blurb: "Remote, wild and big — lions and kudu by the Great Ruaha River." },
  { id: "nyerere", name: "Nyerere National Park (Selous)", type: "heritage_site", country: "TZ", province: "Southern Tanzania", lat: -8.5, lng: 37.5, blurb: "Vast wilderness with boat safaris on the Rufiji." },
  { id: "stone-town", name: "Stone Town of Zanzibar", type: "heritage_site", country: "TZ", province: "Zanzibar", lat: -6.16, lng: 39.19, blurb: "Swahili trading town of carved doors and spice markets." },
  { id: "bwindi", name: "Bwindi Impenetrable National Park", type: "heritage_site", country: "UG", province: "South-western Uganda", lat: -1.05, lng: 29.67, blurb: "Rainforest home to about half the world's mountain gorillas." },
  { id: "queen-elizabeth", name: "Queen Elizabeth National Park", type: "national_park", country: "UG", province: "Western Uganda", lat: -0.2, lng: 30.0, blurb: "Tree-climbing lions and the Kazinga Channel." },
  { id: "murchison", name: "Murchison Falls National Park", type: "national_park", country: "UG", province: "Northern Uganda", lat: 2.2, lng: 31.7, blurb: "The Nile forced through a 7-metre gorge." },
  { id: "volcanoes", name: "Volcanoes National Park", type: "national_park", country: "RW", province: "Northern Province", lat: -1.47, lng: 29.53, blurb: "Mountain gorilla trekking in the Virunga volcanoes." },
  { id: "nyungwe", name: "Nyungwe National Park", type: "heritage_site", country: "RW", province: "South-western Rwanda", lat: -2.48, lng: 29.2, blurb: "Ancient montane rainforest with chimpanzees and a canopy walk." },
  { id: "akagera", name: "Akagera National Park", type: "national_park", country: "RW", province: "Eastern Province", lat: -1.88, lng: 30.7, blurb: "Rwanda's savanna Big Five park." },
];
