import type { Config } from "tailwindcss";

// Colours are CSS variables (RGB triplets) set per site in app/globals.css via
// <html data-site="route22|zatours">. Same class names on both sites — Route22
// renders earthy bush/clay, ZAtours renders its national navy/green palette.
// The `/ <alpha-value>` form keeps opacity modifiers (from-clay/80) working.
const v = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  // lib/ is included because lib/data.ts holds the categoryHue gradient classes
  // (from-clay/70 …); without it some card/hero gradients were purged.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: v("ink"),
        "ink-soft": v("ink-soft"),
        sand: v("sand"),
        "sand-2": v("sand-2"),
        paper: v("paper"),
        bush: v("bush"),
        "bush-dk": v("bush-dk"),
        clay: v("clay"),
        "clay-dk": v("clay-dk"),
        ocean: v("ocean"),
        line: v("line"),
        gold: v("gold"),
        foot: v("foot"),
        "foot-text": v("foot-text"),
        "foot-line": v("foot-line"),
      },
      fontFamily: {
        // `font-serif` is the heading face: Georgia on Route22, a heavy
        // system sans on ZAtours (no web-font download, no build-time fetch).
        serif: ["var(--font-heading)"],
      },
      boxShadow: {
        card: "0 8px 28px rgba(var(--shadow-rgb), 0.12)",
      },
      borderRadius: {
        xl2: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
