import { cn } from "@/lib/utils";

/**
 * The Orbit AI mark: a body with a single tilted ring and one satellite
 * point riding it — literal, not a generic sparkle/bolt icon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <ellipse
        cx="16"
        cy="16"
        rx="13.25"
        ry="5.6"
        transform="rotate(-21 16 16)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="16" r="3.1" fill="currentColor" />
      <circle cx="27.1" cy="8.6" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function Logo({ size = "default", className }: { size?: "sm" | "default"; className?: string }) {
  const box = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const icon = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-[8px] bg-primary text-background", box, className)}>
      <LogoMark className={icon} />
    </div>
  );
}
