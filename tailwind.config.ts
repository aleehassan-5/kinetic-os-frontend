import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
        // Values come from CSS variables (see globals.css) so the whole
        // palette can flip between the .dark and .light themes at runtime.
        // Channel-based vars (rgb(var(--x) / <alpha-value>)) let Tailwind's
        // opacity modifiers (e.g. bg-primary/40) keep working with them.
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        // Brass / orbit-ring gold — the one accent this product spends its boldness on
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
          muted: "var(--color-primary-muted)",
        },
        // Muted slate-teal — quiet supporting color, never competes with primary
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          muted: "var(--color-secondary-muted)",
        },
        success: { DEFAULT: "rgb(var(--color-success) / <alpha-value>)", muted: "var(--color-success-muted)" },
        warning: { DEFAULT: "rgb(var(--color-warning) / <alpha-value>)", muted: "var(--color-warning-muted)" },
        danger: { DEFAULT: "rgb(var(--color-danger) / <alpha-value>)", muted: "var(--color-danger-muted)" },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
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
  plugins: [tailwindcssAnimate],
};

export default config;
