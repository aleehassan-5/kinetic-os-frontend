import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * Builds a Tailwind color value backed by a "R G B" (space-separated,
 * no commas/rgb()) CSS variable, so opacity modifiers like `bg-primary/40`
 * work correctly — Tailwind swaps in the requested alpha via <alpha-value>.
 * When no modifier is given, `opacityVar` (a second CSS variable holding a
 * fixed fraction like 0.14) supplies the token's normal default look; pass
 * nothing for solid tokens that should just default to fully opaque.
 */
function withOpacity(rgbVar: string, opacityVar?: string): any {
  return ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue !== undefined) return `rgb(var(${rgbVar}) / ${opacityValue})`;
    return opacityVar ? `rgb(var(${rgbVar}) / var(${opacityVar}))` : `rgb(var(${rgbVar}))`;
  };
}

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  // The legacy bg-opacity-*/text-opacity-*/etc utilities make Tailwind always
  // wrap our color functions with its own --tw-{util}-opacity variable
  // (defaulting to 1) instead of calling them with opacityValue: undefined,
  // which would silently make every "-muted" token render fully opaque
  // instead of its intended soft translucent default. Nothing in this
  // codebase uses the legacy bg-opacity-40 style classes (only the modern
  // bg-x/40 modifier syntax), so disabling these is safe.
  corePlugins: {
    backgroundOpacity: false,
    textOpacity: false,
    borderOpacity: false,
    ringOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Values come from CSS variables (see globals.css) so the whole
        // palette can flip between the .dark and .light themes at runtime,
        // and each one supports Tailwind opacity modifiers (e.g. primary/40).
        background: withOpacity("--color-background"),
        surface: withOpacity("--color-surface"),
        card: withOpacity("--color-card"),
        border: {
          DEFAULT: withOpacity("--color-border", "--color-border-opacity"),
          strong: withOpacity("--color-border-strong", "--color-border-strong-opacity"),
        },
        // Brass / orbit-ring gold — the one accent this product spends its boldness on
        primary: {
          DEFAULT: withOpacity("--color-primary"),
          hover: withOpacity("--color-primary-hover"),
          muted: withOpacity("--color-primary-muted", "--color-primary-muted-opacity"),
        },
        // Muted slate-teal — quiet supporting color, never competes with primary
        secondary: {
          DEFAULT: withOpacity("--color-secondary"),
          muted: withOpacity("--color-secondary-muted", "--color-secondary-muted-opacity"),
        },
        success: {
          DEFAULT: withOpacity("--color-success"),
          muted: withOpacity("--color-success-muted", "--color-success-muted-opacity"),
        },
        warning: {
          DEFAULT: withOpacity("--color-warning"),
          muted: withOpacity("--color-warning-muted", "--color-warning-muted-opacity"),
        },
        danger: {
          DEFAULT: withOpacity("--color-danger"),
          muted: withOpacity("--color-danger-muted", "--color-danger-muted-opacity"),
        },
        text: {
          primary: withOpacity("--color-text-primary"),
          secondary: withOpacity("--color-text-secondary"),
          muted: withOpacity("--color-text-muted"),
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
