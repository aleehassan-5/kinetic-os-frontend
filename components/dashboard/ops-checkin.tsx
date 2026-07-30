"use client";

import * as React from "react";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface CheckinSignals {
  highIntentUnattendedLeads: { id: string; name: string | null; intentScore: number }[];
  failedWorkflowRuns: { workflowName: string; count: number }[];
  brokenIntegrations: { type: string; detail: string | null }[];
  meetingsToday: number;
  customersThisWeek: number;
}

interface CheckinResponse {
  message: string;
  signals: CheckinSignals;
}

export function OpsCheckin() {
  const [data, setData] = React.useState<CheckinResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  function load() {
    setLoading(true);
    setError(false);
    api
      .get<CheckinResponse>("/dashboard/checkin")
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  React.useEffect(load, []);

  const needsAttention =
    data &&
    (data.signals.highIntentUnattendedLeads.length > 0 ||
      data.signals.failedWorkflowRuns.length > 0 ||
      data.signals.brokenIntegrations.length > 0);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary-muted/40 to-transparent">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
          <Sparkles className="h-[18px] w-[18px] text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-text-muted">Your ops check-in</p>
          {loading ? (
            <div className="mt-1.5 flex items-center gap-2 text-[13px] text-text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking on things…
            </div>
          ) : error ? (
            <p className="mt-1.5 text-[13px] text-text-muted">Couldn&apos;t load your check-in right now.</p>
          ) : (
            <p className="mt-1 text-[13.5px] leading-relaxed text-text-primary">{data?.message}</p>
          )}

          {needsAttention && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {data!.signals.highIntentUnattendedLeads.length > 0 && (
                <span className="rounded-full bg-warning-muted px-2 py-0.5 text-[11px] font-medium text-warning">
                  {data!.signals.highIntentUnattendedLeads.length} hot lead(s) waiting
                </span>
              )}
              {data!.signals.failedWorkflowRuns.length > 0 && (
                <span className="rounded-full bg-danger-muted px-2 py-0.5 text-[11px] font-medium text-danger">
                  Some auto-replies didn&apos;t send
                </span>
              )}
              {data!.signals.brokenIntegrations.length > 0 && (
                <span className="rounded-full bg-danger-muted px-2 py-0.5 text-[11px] font-medium text-danger">
                  Reconnect: {data!.signals.brokenIntegrations.map((i) => i.type).join(", ")}
                </span>
              )}
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading} aria-label="Refresh check-in">
          <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
        </Button>
      </CardContent>
    </Card>
  );
}
