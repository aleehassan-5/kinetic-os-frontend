export type IntegrationStatus = "connected" | "not_connected" | "error";

export interface Integration {
  id: string;
  name: string;
  category: "Channels" | "Scheduling" | "CRM";
  status: IntegrationStatus;
  detail: string;
  logoInitial: string;
  logoClassName: string;
}

export const integrations: Integration[] = [
  { id: "whatsapp", name: "WhatsApp Business", category: "Channels", status: "connected", detail: "+92 300 1234567", logoInitial: "W", logoClassName: "bg-success-muted text-success" },
  { id: "instagram", name: "Instagram DMs", category: "Channels", status: "connected", detail: "@orbitai.agency", logoInitial: "I", logoClassName: "bg-secondary-muted text-secondary" },
  { id: "telegram", name: "Telegram", category: "Channels", status: "not_connected", detail: "Not connected", logoInitial: "T", logoClassName: "bg-white/[0.06] text-text-secondary" },
  { id: "messenger", name: "Messenger", category: "Channels", status: "error", detail: "Token expired — reconnect required", logoInitial: "M", logoClassName: "bg-danger-muted text-danger" },
  { id: "email", name: "Email (SMTP)", category: "Channels", status: "connected", detail: "hello@orbitai.agency", logoInitial: "E", logoClassName: "bg-primary-muted text-primary" },
  { id: "calendly", name: "Calendly", category: "Scheduling", status: "connected", detail: "Synced 2 event types", logoInitial: "C", logoClassName: "bg-primary-muted text-primary" },
  { id: "google-cal", name: "Google Calendar", category: "Scheduling", status: "connected", detail: "are.khan@orbitai.agency", logoInitial: "G", logoClassName: "bg-secondary-muted text-secondary" },
  { id: "hubspot", name: "HubSpot CRM", category: "CRM", status: "not_connected", detail: "Not connected", logoInitial: "H", logoClassName: "bg-white/[0.06] text-text-secondary" },
  { id: "sheets", name: "Google Sheets", category: "CRM", status: "connected", detail: "Lead tracker — Q3 2026.xlsx", logoInitial: "S", logoClassName: "bg-success-muted text-success" },
];

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

export const apiKeys: ApiKey[] = [
  { id: "k1", name: "Production backend", keyPreview: "sk_live_••••••••••••8a2f", created: "Mar 12, 2026", lastUsed: "2h ago", scope: "Full access" },
  { id: "k2", name: "Zapier integration", keyPreview: "sk_live_••••••••••••c710", created: "May 3, 2026", lastUsed: "1d ago", scope: "Read only" },
  { id: "k3", name: "Staging environment", keyPreview: "sk_test_••••••••••••44b1", created: "Jun 20, 2026", lastUsed: "Never", scope: "Full access" },
];
