"use client";

import * as React from "react";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileNav } from "./mobile-nav-context";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { api } from "@/lib/api-client";

export function Topnav({ title, subtitle }: { title: string; subtitle?: string }) {
  const { toggle } = useMobileNav();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    api
      .get<{ notifications: { read: boolean }[] }>("/notifications")
      .then((data) => setUnreadCount(data.notifications.filter((n) => !n.read).length))
      .catch(() => setUnreadCount(0));
  }, [notifOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:pl-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={toggle}
          aria-label="Open menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-[17px] font-semibold tracking-tight text-text-primary">{title}</h1>
          {subtitle && <p className="hidden truncate text-[12.5px] text-text-secondary sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
          <input
            placeholder="Search leads, workflows, docs…"
            className="h-9 w-72 rounded-control border border-border bg-white/[0.03] pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-control border border-border text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary"
          >
            <Bell className="h-[17px] w-[17px]" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
            )}
          </button>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <Button size="sm" className="hidden sm:inline-flex">
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>
    </header>
  );
}
