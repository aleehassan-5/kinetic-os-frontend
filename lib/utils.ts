import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US", { notation: n > 9999 ? "compact" : "standard" }).format(n);
}

export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  let remaining = seconds;
  if (remaining < 60) return `${remaining}s ago`;
  remaining = Math.floor(remaining / 60);
  if (remaining < 60) return `${remaining}m ago`;
  remaining = Math.floor(remaining / 60);
  if (remaining < 24) return `${remaining}h ago`;
  remaining = Math.floor(remaining / 24);
  return `${remaining}d ago`;
}
