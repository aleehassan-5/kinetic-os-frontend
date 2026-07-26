import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta: number | null;
  icon: LucideIcon;
  suffix?: string;
}

export function StatCard({ label, value, delta, icon: Icon, suffix }: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="p-5 transition-colors duration-200 hover:border-border-strong">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12.5px] font-medium text-text-secondary">{label}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[24px] font-semibold tracking-tight text-text-primary">{value}</span>
            {suffix && <span className="text-[13px] text-text-muted">{suffix}</span>}
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-control bg-white/[0.04]">
          <Icon className="h-[17px] w-[17px] text-text-secondary" strokeWidth={2} />
        </div>
      </div>
      {/* Only show a trend when we actually have a real prior-period number to compare against —
          showing a fabricated delta would be as misleading as the old hardcoded stats. */}
      {delta !== null ? (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              "flex items-center gap-0.5 text-[12.5px] font-medium",
              positive ? "text-success" : "text-danger"
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta)}%
          </span>
          <span className="text-[12.5px] text-text-muted">vs last 30 days</span>
        </div>
      ) : (
        <div className="mt-3 text-[12.5px] text-text-muted">last 30 days</div>
      )}
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton mt-3 h-7 w-20 rounded" />
      <div className="skeleton mt-4 h-3 w-28 rounded" />
    </Card>
  );
}
