import { Inbox, Workflow, CreditCard, Users2, AlertTriangle, type LucideIcon } from "lucide-react";

export type NotificationType = "lead" | "workflow" | "billing" | "team" | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export const notificationTypeMeta: Record<NotificationType, { icon: LucideIcon; className: string }> = {
  lead: { icon: Inbox, className: "bg-primary-muted text-primary" },
  workflow: { icon: Workflow, className: "bg-secondary-muted text-secondary" },
  billing: { icon: CreditCard, className: "bg-warning-muted text-warning" },
  team: { icon: Users2, className: "bg-white/[0.06] text-text-secondary" },
  system: { icon: AlertTriangle, className: "bg-danger-muted text-danger" },
};

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    type: "lead",
    title: "New high-intent lead",
    description: "Fatima Noor (WhatsApp) scored 92 intent — asked about pricing for the Growth plan.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    type: "workflow",
    title: "Workflow run failed",
    description: "\"Instagram DM → CRM sync\" failed at the HubSpot sync step after 3 retries.",
    time: "18m ago",
    unread: true,
  },
  {
    id: "n3",
    type: "billing",
    title: "Usage nearing plan limit",
    description: "AI conversation credits are at 92% of your Growth plan's monthly quota.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n4",
    type: "team",
    title: "Hassan accepted invite",
    description: "Hassan Raza joined the workspace as an Editor.",
    time: "3h ago",
    unread: false,
  },
  {
    id: "n5",
    type: "lead",
    title: "Meeting booked via Calendly",
    description: "Ayesha Malik scheduled a discovery call for Jul 26, 3:00 PM.",
    time: "5h ago",
    unread: false,
  },
  {
    id: "n6",
    type: "system",
    title: "Instagram token expiring soon",
    description: "Reconnect your Instagram Business account before Aug 2 to avoid interruptions.",
    time: "1d ago",
    unread: false,
  },
  {
    id: "n7",
    type: "workflow",
    title: "Reel published successfully",
    description: "\"Ramadan offer teaser\" went live on Instagram and TikTok with AI voiceover.",
    time: "1d ago",
    unread: false,
  },
];
