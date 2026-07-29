export type Channel = "WhatsApp" | "Instagram" | "Telegram" | "Messenger" | "Email";

export interface Lead {
  id: string;
  name: string;
  handle: string;
  channel: Channel;
  message: string;
  intent: number;
  status: "New" | "Replied" | "Qualified" | "Booked" | "Customer" | "Lost";
  dealValueCents: number | null;
  time: string;
  avatarColor: string;
}

export const channelStyles: Record<Channel, { bg: string; text: string }> = {
  WhatsApp: { bg: "bg-success-muted", text: "text-success" },
  Instagram: { bg: "bg-danger-muted", text: "text-danger" },
  Telegram: { bg: "bg-primary-muted", text: "text-primary" },
  Messenger: { bg: "bg-secondary-muted", text: "text-secondary" },
  Email: { bg: "bg-warning-muted", text: "text-warning" },
};

// ---- Real backend integration ------------------------------------------

/** Shape returned by GET /leads and GET /leads/:id from the Kinetic OS API. */
export interface ApiLead {
  id: string;
  channel: "WHATSAPP" | "INSTAGRAM" | "TELEGRAM" | "MESSENGER" | "EMAIL";
  externalId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  intentScore: number;
  status: "NEW" | "ENGAGED" | "QUALIFIED" | "MEETING_BOOKED" | "CLOSED" | "LOST";
  dealValueCents: number | null;
  lastMessageAt: string | null;
  createdAt: string;
}

export interface ApiMessage {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  sender: "LEAD" | "AI" | "AGENT";
  content: string;
  createdAt: string;
}

export interface ApiConversation {
  id: string;
  messages: ApiMessage[];
}

export interface ApiLeadDetail extends ApiLead {
  conversations: ApiConversation[];
}

const channelMap: Record<ApiLead["channel"], Channel> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  TELEGRAM: "Telegram",
  MESSENGER: "Messenger",
  EMAIL: "Email",
};

const statusMap: Record<ApiLead["status"], Lead["status"]> = {
  NEW: "New",
  ENGAGED: "Replied",
  QUALIFIED: "Qualified",
  MEETING_BOOKED: "Booked",
  CLOSED: "Customer",
  LOST: "Lost",
};

export const statusToApi: Record<Lead["status"], ApiLead["status"]> = {
  New: "NEW",
  Replied: "ENGAGED",
  Qualified: "QUALIFIED",
  Booked: "MEETING_BOOKED",
  Customer: "CLOSED",
  Lost: "LOST",
};

const avatarPalette = [
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-indigo-500",
  "from-amber-500 to-orange-500",
  "from-slate-500 to-slate-600",
  "from-purple-500 to-fuchsia-500",
];

function avatarColorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % avatarPalette.length;
  return avatarPalette[Math.abs(hash)];
}

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function mapApiLead(lead: ApiLead): Lead {
  return {
    id: lead.id,
    name: lead.name ?? "Unknown lead",
    handle: lead.email ?? lead.phone ?? lead.externalId,
    channel: channelMap[lead.channel],
    message: "",
    intent: lead.intentScore,
    status: statusMap[lead.status],
    dealValueCents: lead.dealValueCents,
    time: timeAgo(lead.lastMessageAt ?? lead.createdAt),
    avatarColor: avatarColorFor(lead.id),
  };
}
