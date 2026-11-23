import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#060907",
        card: "#0D1410",
        "card-hover": "#131F18",
        "card-border": "#192A20",
        "electric-blue": {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        violet: {
          DEFAULT: "#14B8A6",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
        },
        surface: {
          50: "#080D0A",
          100: "#0D1410",
          200: "#131F18",
          300: "#192A20",
          400: "#263B2E",
          500: "#3D5E4A",
        },
        emerald: {
          DEFAULT: "#10B981",
          400: "#34D399",
          500: "#10B981",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "'Courier New'",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(16, 185, 129, 0.35)",
        "glow-violet": "0 0 25px -5px rgba(20, 184, 166, 0.35)",
        "glow-emerald": "0 0 20px -4px rgba(16, 185, 129, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
