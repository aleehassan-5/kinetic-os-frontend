export type MeetingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";
export type MeetingSource = "Calendly" | "Google Calendar";

export interface Meeting {
  id: string;
  leadName: string;
  leadHandle: string;
  channel: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  status: MeetingStatus;
  source: MeetingSource;
  avatarColor: string;
}

// Shape returned by GET /meetings — a Prisma Meeting row with its Lead relation included.
export interface ApiMeeting {
  id: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
  source: "CALENDLY" | "GOOGLE_CALENDAR";
  topic: string | null;
  startTime: string;
  endTime: string;
  lead: { id: string; name: string; email: string | null; channel: string };
}

const statusFromBackend: Record<ApiMeeting["status"], MeetingStatus> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const sourceFromBackend: Record<ApiMeeting["source"], MeetingSource> = {
  CALENDLY: "Calendly",
  GOOGLE_CALENDAR: "Google Calendar",
};

const CHANNEL_LABEL: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  EMAIL: "Email",
  TELEGRAM: "Telegram",
  MESSENGER: "Messenger",
};

const AVATAR_GRADIENTS = [
  "from-purple-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
  "from-cyan-500 to-blue-500",
];

function gradientForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, tomorrow)) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function durationLabel(startIso: string, endIso: string): string {
  const mins = Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
  return mins >= 60 ? `${Math.round(mins / 60)} hr` : `${mins} min`;
}

export function mapApiMeeting(m: ApiMeeting): Meeting {
  return {
    id: m.id,
    leadName: m.lead.name || "Unknown lead",
    leadHandle: m.lead.email ?? "",
    channel: CHANNEL_LABEL[m.lead.channel] ?? m.lead.channel,
    topic: m.topic ?? "Meeting",
    date: formatDate(m.startTime),
    time: new Date(m.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    duration: durationLabel(m.startTime, m.endTime),
    status: statusFromBackend[m.status],
    source: sourceFromBackend[m.source],
    avatarColor: gradientForId(m.id),
  };
}

export const statusVariant: Record<MeetingStatus, "default" | "primary" | "success" | "warning" | "danger"> = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
  Completed: "default",
};
