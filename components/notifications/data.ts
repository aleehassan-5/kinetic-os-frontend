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
