"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface LeadFilters {
  minIntentScore: number;
  sortBy: "recent" | "intentScore";
}

export function FilterPopover({
  filters,
  onChange,
}: {
  filters: LeadFilters;
  onChange: (next: LeadFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const isActive = filters.minIntentScore > 0 || filters.sortBy !== "recent";

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="icon"
        className={cn("shrink-0 ml-2", isActive && "border-primary text-primary")}
        onClick={() => setOpen((v) => !v)}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
      </Button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-64 rounded-card border border-border bg-card p-4 shadow-2xl">
          <p className="mb-3 text-[13px] font-semibold text-text-primary">Advanced filters</p>

          <div className="space-y-1.5">
            <Label>Minimum intent score: {filters.minIntentScore}</Label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={filters.minIntentScore}
              onChange={(e) => onChange({ ...filters, minIntentScore: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div className="mt-4 space-y-1.5">
            <Label>Sort by</Label>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as LeadFilters["sortBy"] })}
              className="h-9 w-full rounded-control border border-border bg-white/[0.03] px-2.5 text-[13px] text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="recent">Most recent activity</option>
              <option value="intentScore">Highest intent score</option>
            </select>
          </div>

          <button
            onClick={() => onChange({ minIntentScore: 0, sortBy: "recent" })}
            className="mt-4 w-full text-center text-[12.5px] text-text-secondary hover:text-text-primary"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
