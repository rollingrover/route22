// ZAtours artwork (from the original zatours-next brand set), resized for web.
// Images are served as-is (next.config images.unoptimized), so they're
// pre-sized here rather than at request time.
import type { Category } from "./data";

export const ZA_HERO = "/za/hero-savanna.webp";
export const ZA_MARK = "/za/mark.webp";

export const ZA_CATEGORY_ICON: Partial<Record<Category, string>> = {
  stay: "/za/cat-stay.svg",
  tours: "/za/cat-tours.svg",
  wildlife: "/za/cat-wildlife.svg",
  ocean: "/za/cat-ocean.svg",
  culture: "/za/cat-culture.svg",
  eat: "/za/cat-eat.svg",
  transport: "/za/cat-transport.svg",
  volunteer: "/za/cat-volunteer.svg",
};
