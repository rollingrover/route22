// Map tiles. With NEXT_PUBLIC_MAPTILER_KEY set (origin-locked key in Vercel)
// maps use MapTiler's "outdoor" style, which shows parks and terrain well.
// Without it they fall back to OpenStreetMap's public tiles — fine for
// development, but OSM's servers aren't meant for production traffic.
const KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

export const TILES = KEY
  ? {
      url: `https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=${KEY}`,
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }
  : {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    };
