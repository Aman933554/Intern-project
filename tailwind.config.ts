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
        background: "#07090E",
        card: "#0E131F",
        "card-hover": "#141C2E",
        "card-border": "#1B2538",
        "electric-blue": {
          DEFAULT: "#6366F1",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        violet: {
          DEFAULT: "#06B6D4",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
        },
        surface: {
          50: "#0A0E17",
          100: "#0E131F",
          200: "#141C2E",
          300: "#1B2538",
          400: "#2B3852",
          500: "#475569",
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
        glow: "0 0 25px -5px rgba(99, 102, 241, 0.35)",
        "glow-violet": "0 0 25px -5px rgba(6, 182, 212, 0.35)",
        "glow-emerald": "0 0 20px -4px rgba(16, 185, 129, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
