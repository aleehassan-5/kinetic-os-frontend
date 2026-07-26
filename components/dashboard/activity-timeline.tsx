"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { notificationTypeMeta, type NotificationType } from "@/components/notifications/data";
import { api } from "@/lib/api-client";

interface ApiNotification {
  id: string;
  type: "LEAD" | "WORKFLOW" | "BILLING" | "TEAM" | "SYSTEM";
  title: string;
  description: string;
  createdAt: string;
}

const typeFromBackend: Record<ApiNotification["type"], NotificationType> = {
  LEAD: "lead",
  WORKFLOW: "workflow",
  BILLING: "billing",
  TEAM: "team",
  SYSTEM: "system",
};

function relativeTime(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ActivityTimeline() {
  const [events, setEvents] = useState<ApiNotification[] | null>(null);

  useEffect(() => {
    api
      .get<{ notifications: ApiNotification[] }>("/notifications")
      .then((data) => setEvents(data.notifications.slice(0, 6)))
      .catch(() => setEvents([]));
  }, []);

  if (events === null) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-[13px] text-text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading activity…
      </div>
    );
  }

  if (events.length === 0) {
    return <p className="py-8 text-center text-[13px] text-text-muted">No recent activity yet.</p>;
  }

  return (
    <div className="space-y-0">
      {events.map((e, i) => {
        const meta = notificationTypeMeta[typeFromBackend[e.type]];
        const Icon = meta.icon;
        return (
          <div key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
            {i !== events.length - 1 && (
              <span className="absolute left-[15px] top-8 h-full w-px bg-border" />
            )}
            <div className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", meta.className)}>
              <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[13.5px] font-medium text-text-primary">{e.title}</p>
              <p className="mt-0.5 text-[12.5px] text-text-secondary">{e.description}</p>
              <p className="mt-1 text-[11.5px] text-text-muted">{relativeTime(e.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
