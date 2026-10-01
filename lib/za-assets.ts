// ZAtours artwork (from the original zatours-next brand set), resized for web.
// Images are served as-is (next.config images.unoptimized), so they're
// pre-sized here rather than at request time.
import type { Category } from "./data";

export const ZA_HERO = "/za/hero-savanna.webp";
export const ZA_MARK = "/za/mark.webp";

export const ZA_CATEGORY_ICON: Partial<Record<Category, string>> = {
  stay: "/za/cat-stay.webp",
  tours: "/za/cat-tours.webp",
  wildlife: "/za/cat-wildlife.webp",
  ocean: "/za/cat-ocean.webp",
  culture: "/za/cat-culture.webp",
  eat: "/za/cat-eat.webp",
  transport: "/za/cat-transport.webp",
  volunteer: "/za/cat-volunteer.webp",
};
