import { MessageCircle, Send, UserPlus, CalendarCheck, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  {
    icon: UserPlus,
    color: "text-primary bg-primary-muted",
    title: "New lead captured from Instagram DM",
    detail: "@sara.designs — intent score 82",
    time: "2m ago",
  },
  {
    icon: MessageCircle,
    color: "text-secondary bg-secondary-muted",
    title: "AI replied to WhatsApp inquiry",
    detail: "Pricing question answered using Knowledge Base",
    time: "6m ago",
  },
  {
    icon: CalendarCheck,
    color: "text-success bg-success-muted",
    title: "Meeting booked via Calendly",
    detail: "Discovery call with Hamza Traders — Fri 3:00 PM",
    time: "18m ago",
  },
  {
    icon: Wand2,
    color: "text-warning bg-warning-muted",
    title: "Reel generated and queued",
    detail: "\"5 signs you need automation\" — voiceover ready",
    time: "41m ago",
  },
  {
    icon: Send,
    color: "text-primary bg-primary-muted",
    title: "Follow-up sequence sent",
    detail: "14 contacts on Telegram re-engaged",
    time: "1h ago",
  },
];

export function ActivityTimeline() {
  return (
    <div className="space-y-0">
      {events.map((e, i) => {
        const Icon = e.icon;
        return (
          <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
            {i !== events.length - 1 && (
              <span className="absolute left-[15px] top-8 h-full w-px bg-border" />
            )}
            <div className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", e.color)}>
              <Icon className="h-[15px] w-[15px]" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[13.5px] font-medium text-text-primary">{e.title}</p>
              <p className="mt-0.5 text-[12.5px] text-text-secondary">{e.detail}</p>
              <p className="mt-1 text-[11.5px] text-text-muted">{e.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
