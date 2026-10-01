import { T } from "@/lib/tables";
import { getSupabase } from "./supabase";

export type OpportunityType =
  | "job"
  | "internship"
  | "volunteer"
  | "learnership"
  | "tender"
  | "other";

export type OpportunityTier = "free" | "featured";

export type Opportunity = {
  id: string;
  slug: string;
  title: string;
  type: OpportunityType;
  organisation: string;
  location: string;
  description: string;
  requirements: string;
  applyUrl?: string;
  applyEmail?: string;
  closesAt?: string; // ISO date
  tier: OpportunityTier;
  createdAt?: string;
};

export const typeLabel: Record<OpportunityType, string> = {
  job: "Job",
  internship: "Internship",
  volunteer: "Volunteer",
  learnership: "Learnership",
  tender: "Tender",
  other: "Other",
};

// EXAMPLE opportunities — clearly fictional placeholders. Replace with real
// submissions once published from the Supabase dashboard.
export const exampleOpportunities: Opportunity[] = [
  {
    id: "eo1",
    slug: "example-lodge-manager-hluhluwe",
    title: "Lodge Manager (example listing)",
    type: "job",
    organisation: "Example Bush Lodge",
    location: "Hluhluwe",
    description:
      "Sample featured listing — a bush lodge is seeking an experienced lodge manager to oversee guest operations, staff and hospitality standards.",
    requirements: "Sample requirements — hospitality management experience, valid driver's licence.",
    applyEmail: "example@route22zululand.co.za",
    tier: "featured",
  },
  {
    id: "eo2",
    slug: "example-field-guide-internship-mkhuze",
    title: "Field Guide Internship (example listing)",
    type: "internship",
    organisation: "Example Guiding Academy",
    location: "Mkhuze",
    description:
      "Sample listing — a structured internship for aspiring field guides, combining practical trails experience with FGASA-aligned training.",
    requirements: "Sample requirements — matric certificate, physically fit, passion for wildlife.",
    applyEmail: "example@route22zululand.co.za",
    tier: "free",
  },
  {
    id: "eo3",
    slug: "example-marine-conservation-volunteer-sodwana",
    title: "Marine Conservation Volunteer (example listing)",
    type: "volunteer",
    organisation: "Example Marine Trust",
    location: "Sodwana Bay",
    description:
      "Sample listing — volunteers assist with reef monitoring, turtle nesting patrols and community education programmes.",
    requirements: "Sample requirements — open water dive certification preferred, minimum 4-week commitment.",
    applyUrl: "https://example.org/volunteer",
    tier: "free",
  },
];

function mapRow(r: Record<string, unknown>): Opportunity {
  return {
    id: String(r.id),
    slug: r.slug as string,
    title: r.title as string,
    type: r.type as OpportunityType,
    organisation: r.organisation as string,
    location: r.location as string,
    description: (r.description as string) ?? "",
    requirements: (r.requirements as string) ?? "",
    applyUrl: (r.apply_url as string) ?? undefined,
    applyEmail: (r.apply_email as string) ?? undefined,
    closesAt: (r.closes_at as string) ?? undefined,
    tier: (r.tier as OpportunityTier) ?? "free",
    createdAt: (r.created_at as string) ?? undefined,
  };
}

const tierRank: Record<OpportunityTier, number> = { featured: 0, free: 1 };

export async function getOpportunities(): Promise<{
  opportunities: Opportunity[];
  isExample: boolean;
}> {
  const supabase = getSupabase();
  if (!supabase) return { opportunities: exampleOpportunities, isExample: true };

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from(T.opportunities)
    .select(
      "id, slug, title, type, organisation, location, description, requirements, apply_url, apply_email, closes_at, tier, created_at"
    )
    .eq("published", true)
    .or(`closes_at.is.null,closes_at.gte.${today}`);

  if (error || !data || data.length === 0) {
    return { opportunities: exampleOpportunities, isExample: true };
  }

  const opportunities = data.map(mapRow).sort((a, b) => tierRank[a.tier] - tierRank[b.tier]);
  return { opportunities, isExample: false };
}

export async function getOpportunity(
  slug: string
): Promise<{ opportunity: Opportunity; isExample: boolean } | null> {
  const supabase = getSupabase();
  if (!supabase) {
    const opportunity = exampleOpportunities.find((o) => o.slug === slug);
    return opportunity ? { opportunity, isExample: true } : null;
  }

  const { data, error } = await supabase
    .from(T.opportunities)
    .select(
      "id, slug, title, type, organisation, location, description, requirements, apply_url, apply_email, closes_at, tier, created_at"
    )
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    const opportunity = exampleOpportunities.find((o) => o.slug === slug);
    return opportunity ? { opportunity, isExample: true } : null;
  }

  return { opportunity: mapRow(data), isExample: false };
}

export async function getAllOpportunitySlugs(): Promise<string[]> {
  const { opportunities } = await getOpportunities();
  return opportunities.map((o) => o.slug);
}
