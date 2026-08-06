import { Inbox, Gauge, GitBranch, Plug, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaletteKind } from "./graph-types";

const palette: { kind: PaletteKind; label: string; desc: string; icon: typeof Inbox; style: string }[] = [
  { kind: "trigger", label: "Trigger", desc: "Starts the workflow", icon: Inbox, style: "bg-primary-muted text-primary" },
  { kind: "action", label: "Action", desc: "Do something", icon: Gauge, style: "bg-secondary-muted text-secondary" },
  { kind: "condition", label: "Condition", desc: "Branch the flow", icon: GitBranch, style: "bg-warning-muted text-warning" },
  { kind: "integration", label: "Integration", desc: "CRM, calendar, Slack", icon: Plug, style: "bg-success-muted text-success" },
];

export function NodePalette({ onAdd }: { onAdd: (kind: PaletteKind) => void }) {
  return (
    <div className="space-y-2">
      <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Add node</p>
      {palette.map((p) => {
        const Icon = p.icon;
        return (
          <button
            key={p.kind}
            onClick={() => onAdd(p.kind)}
            className="flex w-full items-center gap-2.5 rounded-control border border-border p-2.5 text-left transition-colors duration-200 hover:border-border-strong hover:bg-white/[0.03]"
          >
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]", p.style)}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-medium text-text-primary">{p.label}</p>
              <p className="truncate text-[11px] text-text-muted">{p.desc}</p>
            </div>
            <Plus className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          </button>
        );
      })}
    </div>
  );
}
