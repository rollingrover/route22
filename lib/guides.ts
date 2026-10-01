import { T } from "@/lib/tables";
import { getSupabase } from "./supabase";

export type GuideTier = "free" | "premium";

export type Guide = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  area: string;
  bio: string;
  languages: string[];
  certifications: string;
  photoUrls: string[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  websiteUrl?: string;
  tier: GuideTier;
};

// EXAMPLE guides — clearly fictional placeholders demonstrating the free and
// premium profile layouts. Replace with real submissions from Supabase.
export const exampleGuides: Guide[] = [
  {
    id: "eg1",
    slug: "example-thabo-sodwana-dive-guide",
    name: "Thabo N. (example profile)",
    specialty: "Dive guide",
    area: "Sodwana Bay",
    bio: "Sample premium profile — a PADI-certified dive guide leading reef trips to Two-Mile and Five-Mile Reef, with a focus on ragged-tooth shark and turtle encounters. This is placeholder text demonstrating the longer premium bio.",
    languages: ["English", "Zulu"],
    certifications: "PADI Divemaster (example)",
    photoUrls: [],
    phone: "+27 00 000 0000",
    whatsapp: "+27 00 000 0000",
    email: "example@route22zululand.co.za",
    websiteUrl: undefined,
    tier: "premium",
  },
  {
    id: "eg2",
    slug: "example-nomvula-hluhluwe-safari-guide",
    name: "Nomvula K. (example profile)",
    specialty: "Safari guide",
    area: "Hluhluwe-iMfolozi",
    bio: "Sample premium profile — a FGASA-qualified safari guide running Big Five game drives and rhino-tracking walks in Hluhluwe-iMfolozi Park.",
    languages: ["English", "Zulu", "Afrikaans"],
    certifications: "FGASA Level 2, Trails Guide (example)",
    photoUrls: [],
    phone: "+27 00 000 0000",
    whatsapp: "+27 00 000 0000",
    email: "example@route22zululand.co.za",
    websiteUrl: undefined,
    tier: "premium",
  },
  {
    id: "eg3",
    slug: "example-sipho-kosi-bay-fishing-guide",
    name: "Sipho M. (example profile)",
    specialty: "Fishing guide",
    area: "Kosi Bay",
    bio: "Sample basic profile — a local fishing guide offering estuary and deep-sea trips out of Kosi Bay.",
    languages: ["English", "Zulu"],
    certifications: "",
    photoUrls: [],
    email: "example@route22zululand.co.za",
    tier: "free",
  },
  {
    id: "eg4",
    slug: "example-lindiwe-mkhuze-birding-guide",
    name: "Lindiwe P. (example profile)",
    specialty: "Birding guide",
    area: "Mkhuze Game Reserve",
    bio: "Sample basic profile — a birding specialist leading hide walks and fig-forest tours around Mkhuze.",
    languages: ["English", "Zulu"],
    certifications: "",
    photoUrls: [],
    email: "example@route22zululand.co.za",
    tier: "free",
  },
  {
    id: "eg5",
    slug: "example-bongani-elephant-coast-transfer-driver",
    name: "Bongani D. (example profile)",
    specialty: "Transfer driver",
    area: "Elephant Coast (Richards Bay to Kosi Bay)",
    bio: "Sample basic profile — a private driver offering airport transfers and point-to-point trips along the route.",
    languages: ["English", "Zulu"],
    certifications: "",
    photoUrls: [],
    email: "example@route22zululand.co.za",
    tier: "free",
  },
];

function mapRow(r: Record<string, unknown>): Guide {
  return {
    id: String(r.id),
    slug: r.slug as string,
    name: r.name as string,
    specialty: r.specialty as string,
    area: r.area as string,
    bio: (r.bio as string) ?? "",
    languages: (r.languages as string[]) ?? [],
    certifications: (r.certifications as string) ?? "",
    photoUrls: (r.photo_urls as string[]) ?? [],
    phone: (r.phone as string) ?? undefined,
    whatsapp: (r.whatsapp as string) ?? undefined,
    email: (r.email as string) ?? undefined,
    websiteUrl: (r.website_url as string) ?? undefined,
    tier: (r.tier as GuideTier) ?? "free",
  };
}

const tierRank: Record<GuideTier, number> = { premium: 0, free: 1 };

export async function getGuides(): Promise<{ guides: Guide[]; isExample: boolean }> {
  const supabase = getSupabase();
  if (!supabase) return { guides: exampleGuides, isExample: true };

  const { data, error } = await supabase
    .from(T.guides)
    .select(
      "id, slug, name, specialty, area, bio, languages, certifications, photo_urls, phone, whatsapp, email, website_url, tier"
    )
    .eq("published", true);

  if (error || !data || data.length === 0) {
    return { guides: exampleGuides, isExample: true };
  }

  const guides = data.map(mapRow).sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);
  return { guides, isExample: false };
}

export async function getGuide(
  slug: string
): Promise<{ guide: Guide; isExample: boolean } | null> {
  const supabase = getSupabase();
  if (!supabase) {
    const guide = exampleGuides.find((g) => g.slug === slug);
    return guide ? { guide, isExample: true } : null;
  }

  const { data, error } = await supabase
    .from(T.guides)
    .select(
      "id, slug, name, specialty, area, bio, languages, certifications, photo_urls, phone, whatsapp, email, website_url, tier"
    )
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    const guide = exampleGuides.find((g) => g.slug === slug);
    return guide ? { guide, isExample: true } : null;
  }

  return { guide: mapRow(data), isExample: false };
}

export async function getAllGuideSlugs(): Promise<string[]> {
  const { guides } = await getGuides();
  return guides.map((g) => g.slug);
}
