"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { notificationCategories as initial } from "./data";

export function NotificationsSection() {
  const [categories, setCategories] = React.useState(initial);

  function toggle(id: string, channel: "email" | "push") {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, [channel]: !c[channel] } : c)));
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Notification preferences</CardTitle>
          <CardDescription>Choose what you get notified about, and where</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[1fr_60px_60px] items-center gap-2 border-b border-border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          <span>Category</span>
          <span className="text-center">Email</span>
          <span className="text-center">Push</span>
        </div>
        {categories.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[1fr_60px_60px] items-center gap-2 border-b border-border px-5 py-3.5 last:border-b-0"
          >
            <div className="pr-4">
              <p className="text-[13px] font-medium text-text-primary">{c.label}</p>
              <p className="text-[11.5px] text-text-secondary">{c.description}</p>
            </div>
            <div className="flex justify-center">
              <Switch checked={c.email} onCheckedChange={() => toggle(c.id, "email")} aria-label={`Email notifications for ${c.label}`} />
            </div>
            <div className="flex justify-center">
              <Switch checked={c.push} onCheckedChange={() => toggle(c.id, "push")} aria-label={`Push notifications for ${c.label}`} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
