import { CalendarDays, CheckCircle2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntegrationCardProps {
  name: string;
  account: string;
  connected: boolean;
  syncedCount: number;
  colorFrom: string;
  colorTo: string;
}

export function IntegrationCard({ name, account, connected, syncedCount, colorFrom, colorTo }: IntegrationCardProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-card border border-border bg-card p-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
        style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
      >
        <CalendarDays className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[13.5px] font-medium text-text-primary">{name}</p>
          {connected && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
        </div>
        <p className="truncate text-[12px] text-text-secondary">
          {connected ? `${account} · ${syncedCount} events synced` : "Not connected"}
        </p>
      </div>
      <Button variant={connected ? "outline" : "primary"} size="sm">
        {connected ? <Settings2 className="h-3.5 w-3.5" /> : null}
        {connected ? "Manage" : "Connect"}
      </Button>
    </div>
  );
}
