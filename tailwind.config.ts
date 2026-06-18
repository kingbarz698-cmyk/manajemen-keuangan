import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Static Neo Brutalism ink + accent colors (same in light & dark per DESIGN.md)
        ink: "#111111",
        "accent-green": "#27D17F",
        "accent-green-light": "#63fea7",
        "accent-green-dim": "#40e18d",
        "accent-yellow": "#FFD84D",
        "accent-yellow-light": "#ffe07e",
        "accent-orange": "#FFB547",
        "accent-purple": "#9E7BFF",
        "accent-purple-light": "#c1abff",
        "accent-purple-pastel": "#e8ddff",
        "accent-purple-pastel-dark": "#26215C",
        "accent-blue": "#9ED9FF",
        "accent-red": "#FF6B6B",

        // Light mode surface/text tokens
        "bg-mint": "#DFF8EE",
        "surface-light": "#FFFFFF",
        "surface-container-light": "#f0edec",
        "text-primary-light": "#1c1b1b",
        "text-secondary-light": "#3c4a3f",
        "border-track-light": "#e5e2e1",
        "red-light-bg": "#ffdad6",
        "inverse-light": "#313030",

        // Dark mode surface/text tokens
        "bg-dark": "#121212",
        "surface-dark": "#1A1A1A",
        "surface-container-dark": "#242424",
        "text-primary-dark": "#FFFFFF",
        "text-secondary-dark": "#bbcbbc",
        "red-dark-bg": "#93000a",
        "inverse-dark": "#e5e2e1",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        input: "20px",
        card: "24px",
        "card-lg": "32px",
        pill: "999px",
      },
      boxShadow: {
        hard: "6px 6px 0px #111111",
        "hard-sm": "3px 3px 0px #111111",
        "hard-md": "4px 4px 0px #111111",
        "hard-pressed": "2px 2px 0px #111111",
        "hard-lg": "5px 5px 0px #111111",
      },
      borderWidth: {
        3: "3px",
      },
      spacing: {
        "safe-area": "24px",
      },
    },
  },
  plugins: [],
} satisfies Config;
