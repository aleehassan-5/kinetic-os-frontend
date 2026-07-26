export type IntegrationStatus = "connected" | "not_connected" | "error";

export type IntegrationTypeId =
  | "WHATSAPP"
  | "TELEGRAM"
  | "INSTAGRAM"
  | "MESSENGER"
  | "EMAIL"
  | "CALENDLY"
  | "GOOGLE_CALENDAR"
  | "HUBSPOT"
  | "GOOGLE_SHEETS";

export interface IntegrationMeta {
  id: IntegrationTypeId;
  name: string;
  category: "Channels" | "Scheduling" | "CRM";
  logoInitial: string;
  logoClassName: string;
}

// Presentation-only metadata (name/icon/category) — not connection state.
// Real status comes from GET /integrations at runtime.
export const integrationMeta: IntegrationMeta[] = [
  { id: "WHATSAPP", name: "WhatsApp Business", category: "Channels", logoInitial: "W", logoClassName: "bg-success-muted text-success" },
  { id: "INSTAGRAM", name: "Instagram DMs", category: "Channels", logoInitial: "I", logoClassName: "bg-secondary-muted text-secondary" },
  { id: "TELEGRAM", name: "Telegram", category: "Channels", logoInitial: "T", logoClassName: "bg-white/[0.06] text-text-secondary" },
  { id: "MESSENGER", name: "Messenger", category: "Channels", logoInitial: "M", logoClassName: "bg-danger-muted text-danger" },
  { id: "EMAIL", name: "Email (SMTP)", category: "Channels", logoInitial: "E", logoClassName: "bg-primary-muted text-primary" },
  { id: "CALENDLY", name: "Calendly", category: "Scheduling", logoInitial: "C", logoClassName: "bg-primary-muted text-primary" },
  { id: "GOOGLE_CALENDAR", name: "Google Calendar", category: "Scheduling", logoInitial: "G", logoClassName: "bg-secondary-muted text-secondary" },
  { id: "HUBSPOT", name: "HubSpot CRM", category: "CRM", logoInitial: "H", logoClassName: "bg-white/[0.06] text-text-secondary" },
  { id: "GOOGLE_SHEETS", name: "Google Sheets", category: "CRM", logoInitial: "S", logoClassName: "bg-success-muted text-success" },
];

export interface ApiIntegration {
  id: string;
  type: IntegrationTypeId;
  status: "CONNECTED" | "NOT_CONNECTED" | "ERROR";
  detail: string | null;
  updatedAt: string;
}

export const integrationStatusMeta: Record<IntegrationStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  connected: { label: "Connected", variant: "success" },
  not_connected: { label: "Not connected", variant: "default" },
  error: { label: "Action needed", variant: "danger" },
};

export interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

export const notificationCategories: NotificationCategory[] = [
  { id: "new-leads", label: "New leads", description: "When a new conversation starts on any connected channel.", email: true, push: true },
  { id: "high-intent", label: "High-intent scores", description: "When a lead's intent score crosses 80.", email: true, push: true },
  { id: "workflow-failures", label: "Workflow failures", description: "When an automation run fails or needs review.", email: true, push: true },
  { id: "meetings", label: "Meetings booked", description: "When a lead books a call via Calendly or Google Calendar.", email: true, push: false },
  { id: "billing", label: "Billing & usage", description: "Invoices, payment failures, and usage-limit warnings.", email: true, push: false },
  { id: "team", label: "Team activity", description: "Invites accepted, role changes, member removals.", email: false, push: false },
  { id: "product", label: "Product updates", description: "New features and changes to Orbit AI.", email: false, push: false },
];

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  created: string;
  lastUsed: string;
  scope: "Full access" | "Read only";
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPreview: string;
  scope: "FULL" | "READ_ONLY";
  lastUsedAt: string | null;
  createdAt: string;
}

export function mapApiKey(k: ApiKeyRecord): ApiKey {
  return {
    id: k.id,
    name: k.name,
    keyPreview: k.keyPreview,
    created: new Date(k.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    lastUsed: k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Never",
    scope: k.scope === "FULL" ? "Full access" : "Read only",
  };
}
