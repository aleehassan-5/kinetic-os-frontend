import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Lead, channelStyles } from "./data";

function intentColor(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 45) return "text-warning";
  return "text-danger";
}

const statusVariant: Record<Lead["status"], "default" | "primary" | "success" | "warning" | "danger"> = {
  New: "primary",
  Replied: "default",
  Qualified: "warning",
  Booked: "success",
  Lost: "danger",
};

export function LeadRow({ lead, active, onClick }: { lead: Lead; active?: boolean; onClick?: () => void }) {
  const cs = channelStyles[lead.channel];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors duration-200",
        active ? "bg-primary-muted/40" : "hover:bg-white/[0.025]"
      )}
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-semibold text-white", lead.avatarColor)}>
        {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[13.5px] font-medium text-text-primary">{lead.name}</span>
            <span className={cn("rounded px-1.5 py-[1px] text-[10.5px] font-medium shrink-0", cs.bg, cs.text)}>
              {lead.channel}
            </span>
          </div>
          <span className="shrink-0 text-[11px] text-text-muted">{lead.time}</span>
        </div>
        <p className="mt-1 truncate text-[12.5px] text-text-secondary">{lead.message}</p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant={statusVariant[lead.status]}>{lead.status}</Badge>
          <span className={cn("text-[11.5px] font-semibold", intentColor(lead.intent))}>
            {lead.intent} intent
          </span>
        </div>
      </div>
    </button>
  );
}

export function LeadRowSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b border-border px-4 py-3.5">
      <div className="skeleton h-10 w-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="skeleton h-3 w-32 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  );
}
