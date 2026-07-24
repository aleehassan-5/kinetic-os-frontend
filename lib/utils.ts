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
  const map: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [7, "d"],
  ];
  let value = seconds;
  let unit = "s";
  const divisors = [60, 60, 24, 7];
  const units = ["s", "m", "h", "d"];
  let i = 0;
  let remaining = seconds;
  if (remaining < 60) return `${remaining}s ago`;
  remaining = Math.floor(remaining / 60);
  if (remaining < 60) return `${remaining}m ago`;
  remaining = Math.floor(remaining / 60);
  if (remaining < 24) return `${remaining}h ago`;
  remaining = Math.floor(remaining / 24);
  return `${remaining}d ago`;
}
