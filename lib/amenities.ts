import { T } from "@/lib/tables";
import { getSupabase } from "./supabase";

export type AmenityCategory = "atm" | "bank" | "clinic" | "fastfood" | "fuel" | "other";

export type Amenity = {
  id: string;
  name: string;
  category: AmenityCategory;
  lat: number;
  lng: number;
};

export const amenityCategoryLabel: Record<AmenityCategory, string> = {
  atm: "ATM",
  bank: "Bank",
  clinic: "Clinic",
  fastfood: "Fast food",
  fuel: "Fuel",
  other: "Other",
};

// EXAMPLE amenities — a couple of clearly-fictional placeholders showing how
// the map toggle works. These are NOT real businesses or real coordinates —
// add verified real ones via Supabase (or the admin panel) once you have them.
// This layer is meant to reference big franchise restaurants/takeaways, ATMs,
// clinics and banks lightly (small muted pins, toggled on/off) without
// cluttering the main route markers.
export const exampleAmenities: Amenity[] = [
  { id: "ea1", name: "Example ATM — Hluhluwe", category: "atm", lat: -28.014, lng: 32.293 },
  { id: "ea2", name: "Example Clinic — Mtubatuba", category: "clinic", lat: -28.415, lng: 32.185 },
  { id: "ea3", name: "Example Fast Food — St Lucia", category: "fastfood", lat: -28.383, lng: 32.418 },
];

function mapRow(r: Record<string, unknown>): Amenity {
  return {
    id: String(r.id),
    name: r.name as string,
    category: r.category as AmenityCategory,
    lat: r.lat as number,
    lng: r.lng as number,
  };
}

export async function getAmenities(): Promise<{ amenities: Amenity[]; isExample: boolean }> {
  const supabase = getSupabase();
  if (!supabase) return { amenities: exampleAmenities, isExample: true };

  const { data, error } = await supabase
    .from(T.amenities)
    .select("id, name, category, lat, lng")
    .eq("published", true);

  if (error || !data || data.length === 0) {
    return { amenities: exampleAmenities, isExample: true };
  }

  return { amenities: data.map(mapRow), isExample: false };
}
