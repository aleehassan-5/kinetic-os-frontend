"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { integrations, integrationStatusMeta, type IntegrationStatus } from "./data";

const categories = ["Channels", "Scheduling", "CRM"] as const;

export function IntegrationsSection() {
  const [statuses, setStatuses] = React.useState<Record<string, IntegrationStatus>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.status]))
  );
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  function handleAction(id: string, next: IntegrationStatus) {
    setLoadingId(id);
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: next }));
      setLoadingId(null);
    }, 900);
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category} className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>{category}</CardTitle>
              <CardDescription>
                {category === "Channels" && "Where your AI listens and replies to leads"}
                {category === "Scheduling" && "Meeting booking sources for your calendar"}
                {category === "CRM" && "Where qualified leads get synced automatically"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {integrations
              .filter((i) => i.category === category)
              .map((integration) => {
                const status = statuses[integration.id];
                const meta = integrationStatusMeta[status];
                const isLoading = loadingId === integration.id;
                return (
                  <div
                    key={integration.id}
                    className="flex items-center gap-3 rounded-control border border-border p-3.5"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-[13px] font-semibold ${integration.logoClassName}`}>
                      {integration.logoInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13px] font-medium text-text-primary">{integration.name}</p>
                        <Badge variant={meta.variant} dot className="shrink-0">{meta.label}</Badge>
                      </div>
                      <p className="truncate text-[11.5px] text-text-muted">{integration.detail}</p>
                    </div>
                    {status === "connected" ? (
                      <Button variant="ghost" size="sm" loading={isLoading} onClick={() => handleAction(integration.id, "not_connected")}>
                        Disconnect
                      </Button>
                    ) : status === "error" ? (
                      <Button variant="outline" size="sm" loading={isLoading} onClick={() => handleAction(integration.id, "connected")}>
                        <RefreshCw className="h-3.5 w-3.5" /> Reconnect
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" loading={isLoading} onClick={() => handleAction(integration.id, "connected")}>
                        Connect
                      </Button>
                    )}
                  </div>
                );
              })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
