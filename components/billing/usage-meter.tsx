import { cn } from "@/lib/utils";
import { UsageMetric } from "./data";

export function UsageMeter({ metric }: { metric: UsageMetric }) {
  const pct = Math.min(100, Math.round((metric.used / metric.limit) * 100));
  const nearLimit = pct >= 85;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
        <span className="font-medium text-text-primary">{metric.label}</span>
        <span className="text-text-secondary">
          {metric.used.toLocaleString()} <span className="text-text-muted">/ {metric.limit.toLocaleString()} {metric.unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={cn("h-full rounded-full transition-all duration-200", nearLimit ? "bg-warning" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
