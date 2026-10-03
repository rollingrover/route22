import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link / router for TRANSLATED pages only. Links to English-only
// pages (/list-your-business, /privacy, /parks, …) must use a plain <a>/next
// Link, otherwise a /de visitor would be sent to a /de/… URL that doesn't exist.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
