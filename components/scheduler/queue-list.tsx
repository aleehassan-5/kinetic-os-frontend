"use client";

import { useState } from "react";
import { Mic, Image as ImageIcon, Video, Layers, CalendarX2, RotateCw, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { platformStyle, statusVariant, ScheduledPost } from "./data";
import { api } from "@/lib/api-client";

const typeIcon = { Reel: Video, "Static Graphic": ImageIcon, Carousel: Layers, Story: Video };

export function QueueList({
  day,
  month,
  year,
  posts,
  onChanged,
}: {
  day: number | null;
  month: number;
  year: number;
  posts: ScheduledPost[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const list: ScheduledPost[] = day ? posts.filter((p) => p.day === day && p.month === month && p.year === year) : posts;

  async function retry(id: string) {
    setBusyId(id);
    try {
      await api.post(`/social/posts/${id}/publish-now`);
      onChanged();
    } catch {
      // surfaced via the post's own error/status on refresh
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      await api.delete(`/social/posts/${id}`);
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05]">
          <CalendarX2 className="h-5 w-5 text-text-muted" />
        </div>
        <p className="text-[13px] font-medium text-text-primary">Nothing scheduled</p>
        <p className="text-[12px] text-text-secondary">Posts for this day will show up here.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {list.map((p) => {
        const s = platformStyle[p.platform];
        const Icon = typeIcon[p.type];
        const busy = busyId === p.id;
        return (
          <div key={p.id} className="flex items-start gap-3 p-3.5 transition-colors duration-200 hover:bg-white/[0.02]">
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-control", s.bg)}>
              <Icon className={cn("h-4 w-4", s.text)} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-text-primary">{p.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className={cn("rounded px-1.5 py-[1px] text-[10.5px] font-medium", s.bg, s.text)}>{p.platform}</span>
                <span className="text-[11px] text-text-muted">{p.type} · {p.time}</span>
                {p.voiceover && (
                  <span className="flex items-center gap-0.5 text-[10.5px] text-text-muted">
                    <Mic className="h-3 w-3" /> AI voiceover
                  </span>
                )}
              </div>
              {p.status === "Failed" && p.error && (
                <p className="mt-1 text-[11px] text-danger">{p.error}</p>
              )}
              {p.status === "Failed" && (
                <div className="mt-1.5 flex items-center gap-3">
                  <button
                    onClick={() => retry(p.id)}
                    disabled={busy}
                    className="flex items-center gap-1 text-[11.5px] font-medium text-primary hover:text-primary-hover disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCw className="h-3 w-3" />} Retry
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    disabled={busy}
                    className="flex items-center gap-1 text-[11.5px] font-medium text-text-muted hover:text-danger disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              )}
            </div>
            <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
          </div>
        );
      })}
    </div>
  );
}
