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
        background: "#030712", // Ultra-deep obsidian midnight
        card: "#090D16", // Rich glass slate
        "card-hover": "#0E1524", // Clean luminous elevation
        "card-border": "#172033", // Crystal-cut border
        "electric-blue": {
          DEFAULT: "#0EA5E9", // Luminous Cyan-Azure
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
        violet: {
          DEFAULT: "#8B5CF6", // Royal Amethyst
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
        surface: {
          50: "#050811",
          100: "#0A0F1D",
          200: "#0F172A",
          300: "#1A2438",
          400: "#2A3854",
          500: "#415375",
          600: "#5D7399",
          700: "#7E94BC",
        },
        emerald: {
          DEFAULT: "#10B981",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px -4px rgba(14, 165, 233, 0.4), 0 0 10px -2px rgba(14, 165, 233, 0.25)",
        "glow-violet": "0 0 30px -4px rgba(139, 92, 246, 0.4), 0 0 10px -2px rgba(139, 92, 246, 0.25)",
        "glow-emerald": "0 0 25px -4px rgba(16, 185, 129, 0.35)",
        "premium-card": "0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "neon-cyan": "0 0 15px rgba(14, 165, 233, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-dark":
          "radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.12) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;
