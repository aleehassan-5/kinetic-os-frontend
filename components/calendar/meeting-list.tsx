import { Clock, Video, CalendarX2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Meeting, statusVariant } from "./data";

export function MeetingList({ meetings }: { meetings: Meeting[] }) {
  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05]">
          <CalendarX2 className="h-5 w-5 text-text-muted" />
        </div>
        <p className="text-[13.5px] font-medium text-text-primary">No meetings match this filter</p>
        <p className="text-[12.5px] text-text-secondary">Meetings booked via Calendly or Google Calendar will appear here.</p>
      </div>
    );
  }

  const grouped = meetings.reduce<Record<string, Meeting[]>>((acc, m) => {
    (acc[m.date] ||= []).push(m);
    return acc;
  }, {});

  return (
    <div className="divide-y divide-border">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <div className="bg-white/[0.015] px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {date}
          </div>
          {items.map((m) => (
            <div key={m.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors duration-200 hover:bg-white/[0.02]">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white", m.avatarColor)}>
                {m.leadName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-medium text-text-primary">{m.leadName}</p>
                  <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                </div>
                <p className="mt-0.5 truncate text-[12.5px] text-text-secondary">{m.topic}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.time} · {m.duration}</span>
                  <span>via {m.source}</span>
                  <span>{m.channel} lead</span>
                </div>
              </div>
              {m.status === "Confirmed" && (
                <button
                  onClick={() => window.open("https://meet.google.com/new", "_blank", "noopener,noreferrer")}
                  className="flex shrink-0 items-center gap-1 rounded-control border border-border px-2.5 py-1.5 text-[11.5px] font-medium text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary"
                >
                  <Video className="h-3 w-3" /> Join
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
