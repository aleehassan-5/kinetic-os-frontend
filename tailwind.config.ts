import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#0B0F14",
        surface: "#111827",
        card: "#161F2C",
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
          muted: "rgba(59,130,246,0.12)",
        },
        secondary: {
          DEFAULT: "#14B8A6",
          muted: "rgba(20,184,166,0.12)",
        },
        success: { DEFAULT: "#22C55E", muted: "rgba(34,197,94,0.12)" },
        warning: { DEFAULT: "#F59E0B", muted: "rgba(245,158,11,0.12)" },
        danger: { DEFAULT: "#EF4444", muted: "rgba(239,68,68,0.12)" },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
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
        ring: "0 0 0 3px rgba(59,130,246,0.25)",
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
