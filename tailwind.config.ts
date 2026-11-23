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
        background: "#0A0714",
        card: "#120D24",
        "card-hover": "#1A1333",
        "card-border": "#251B47",
        "electric-blue": {
          DEFAULT: "#8B5CF6",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        violet: {
          DEFAULT: "#EC4899",
          400: "#F472B6",
          500: "#EC4899",
          600: "#DB2777",
          700: "#BE185D",
        },
        surface: {
          50: "#0D0A1A",
          100: "#120D24",
          200: "#1A1333",
          300: "#251B47",
          400: "#3B2E68",
          500: "#58488F",
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
        glow: "0 0 25px -5px rgba(139, 92, 246, 0.35)",
        "glow-violet": "0 0 25px -5px rgba(236, 72, 153, 0.35)",
        "glow-emerald": "0 0 20px -4px rgba(16, 185, 129, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
