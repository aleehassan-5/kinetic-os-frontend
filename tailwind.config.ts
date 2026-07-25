import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Warm graphite instrument panel — not pure black, slight warmth
        background: "#0F0F12",
        surface: "#17181C",
        card: "#1C1D22",
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          strong: "rgba(255,255,255,0.14)",
        },
        // Brass / orbit-ring gold — the one accent this product spends its boldness on
        primary: {
          DEFAULT: "#C79A44",
          hover: "#AF8636",
          muted: "rgba(199,154,68,0.14)",
        },
        // Muted slate-teal — quiet supporting color, never competes with primary
        secondary: {
          DEFAULT: "#4C7C79",
          muted: "rgba(76,124,121,0.16)",
        },
        success: { DEFAULT: "#6FA37E", muted: "rgba(111,163,126,0.14)" },
        warning: { DEFAULT: "#C9793B", muted: "rgba(201,121,59,0.14)" },
        danger: { DEFAULT: "#B7503E", muted: "rgba(183,80,62,0.14)" },
        text: {
          primary: "#EEEDE6",
          secondary: "#A2A099",
          muted: "#6C6A63",
        },
      },
      borderRadius: {
        card: "14px",
        control: "10px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.24), 0 1px 0 rgba(255,255,255,0.03) inset",
        elevated: "0 8px 24px rgba(0,0,0,0.35)",
        ring: "0 0 0 3px rgba(199,154,68,0.28)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 220ms ease-out",
        shimmer: "shimmer 1.6s infinite linear",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
