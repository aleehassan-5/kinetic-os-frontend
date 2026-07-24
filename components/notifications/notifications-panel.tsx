"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, BellOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { notificationTypeMeta, type NotificationType } from "./data";
import { api } from "@/lib/api-client";

interface ApiNotification {
  id: string;
  type: NotificationType | Uppercase<NotificationType>;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = React.useState<ApiNotification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [tab, setTab] = React.useState<"all" | "unread">("all");
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get<{ notifications: ApiNotification[] }>("/notifications")
      .then((data) => setItems(data.notifications))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const filtered = tab === "unread" ? items.filter((n) => !n.read) : items;
  const unreadCount = items.filter((n) => !n.read).length;

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.post("/notifications/read-all");
    } catch {
      // non-fatal — panel already reflects the optimistic state
    }
  }

  async function markOneRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.post(`/notifications/${id}/read`);
    } catch {
      // non-fatal
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          className="absolute right-0 top-[calc(100%+8px)] z-40 w-[360px] overflow-hidden rounded-card border border-border bg-card shadow-elevated"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-[13.5px] font-semibold text-text-primary">Notifications</h3>
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-[11.5px] font-medium text-text-secondary transition-colors duration-200 hover:text-primary"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          </div>

          <div className="flex gap-1 border-b border-border px-3 pt-2.5">
            {(["all", "unread"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative px-2.5 pb-2.5 text-[12.5px] font-medium capitalize transition-colors duration-200",
                  tab === t ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                )}
              >
                {t === "unread" ? `Unread${unreadCount ? ` (${unreadCount})` : ""}` : "All"}
                {tab === t && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05]">
                  <BellOff className="h-[18px] w-[18px] text-text-muted" />
                </div>
                <p className="text-[13px] font-medium text-text-primary">You&apos;re all caught up</p>
                <p className="text-[11.5px] text-text-muted">No unread notifications right now.</p>
              </div>
            ) : (
              <ul>
                {filtered.map((n) => {
                  const type = n.type.toLowerCase() as NotificationType;
                  const meta = notificationTypeMeta[type];
                  const Icon = meta.icon;
                  return (
                    <li key={n.id}>
                      <button
                        onClick={() => markOneRead(n.id)}
                        className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors duration-200 last:border-b-0 hover:bg-white/[0.03]"
                      >
                        <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control", meta.className)}>
                          <Icon className="h-[15px] w-[15px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12.5px] font-medium text-text-primary">{n.title}</p>
                            {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-text-secondary">{n.description}</p>
                          <p className="mt-1 text-[10.5px] text-text-muted">{timeAgo(n.createdAt)}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
