"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Zap, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowSummary {
  id: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED";
}

export function WorkflowSwitcher({
  workflows,
  activeId,
  onSelect,
  onCreateNew,
  onRequestDelete,
}: {
  workflows: WorkflowSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onRequestDelete: (workflow: WorkflowSummary) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = workflows.find((w) => w.id === activeId);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-control border border-border px-3 py-1.5 text-[13px] font-medium text-text-primary hover:border-border-strong"
      >
        <Zap className="h-3.5 w-3.5 text-primary" />
        {active?.name ?? "Select a workflow"}
        <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-30 w-64 rounded-card border border-border bg-card p-1.5 shadow-2xl">
          {workflows.map((w) => (
            <div
              key={w.id}
              className={cn(
                "group/row flex w-full items-center gap-1 rounded-control pr-1 text-left text-[13px] transition-colors duration-200",
                w.id === activeId ? "bg-primary-muted/40 text-text-primary" : "text-text-secondary hover:bg-white/[0.05]"
              )}
            >
              <button
                onClick={() => {
                  onSelect(w.id);
                  setOpen(false);
                }}
                className="flex min-w-0 flex-1 items-center justify-between px-3 py-2 text-left"
              >
                <span className="truncate">{w.name}</span>
                <span
                  className={cn(
                    "ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
                    w.status === "ACTIVE" && "bg-success-muted text-success",
                    w.status === "DRAFT" && "bg-white/[0.06] text-text-muted",
                    w.status === "PAUSED" && "bg-warning-muted text-warning"
                  )}
                >
                  {w.status}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDelete(w);
                  setOpen(false);
                }}
                title="Delete workflow"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] text-text-muted opacity-0 transition-opacity duration-150 hover:bg-danger-muted hover:text-danger group-hover/row:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {workflows.length > 0 && <div className="my-1 border-t border-border" />}
          <button
            onClick={() => {
              onCreateNew();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-left text-[13px] font-medium text-primary hover:bg-primary-muted/30"
          >
            <Plus className="h-3.5 w-3.5" /> New workflow
          </button>
        </div>
      )}
    </div>
  );
}
