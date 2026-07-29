import { cn } from "@/lib/utils";

/**
 * The Kinetic OS mark: three chevrons of increasing weight and reach,
 * reading as forward motion/acceleration — literal to "kinetic", not a
 * generic sparkle/bolt icon.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M6 22 L13 16 L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
      <path d="M13.5 24 L22 16 L13.5 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      <path d="M21 26 L31 16 L21 6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
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
