import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1c1a17",
        "ink-soft": "#4b463f",
        sand: "#f6f1e7",
        "sand-2": "#efe7d7",
        paper: "#fffdf9",
        bush: "#2f5e3a",
        "bush-dk": "#234a2c",
        clay: "#c1622d",
        "clay-dk": "#a44f22",
        ocean: "#1f6f7a",
        line: "#e2d9c7",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 8px 28px rgba(40, 30, 15, 0.12)",
      },
      borderRadius: {
        xl2: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
