export type NodeKind = "trigger" | "condition" | "action" | "integration";

export interface FlowNode {
  id: string;
  kind: NodeKind;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  icon: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export const nodes: FlowNode[] = [
  { id: "n1", kind: "trigger", title: "New message received", subtitle: "WhatsApp · Instagram · Telegram", x: 40, y: 60, icon: "inbox" },
  { id: "n2", kind: "action", title: "Score intent", subtitle: "AI model · 0–100 scale", x: 340, y: 60, icon: "gauge" },
  { id: "n3", kind: "condition", title: "Intent ≥ 60?", subtitle: "Branch on score", x: 640, y: 60, icon: "split" },
  { id: "n4", kind: "action", title: "Send AI reply", subtitle: "Grounded on Knowledge Base", x: 640, y: 240, icon: "message" },
  { id: "n5", kind: "integration", title: "Create calendar hold", subtitle: "Google Calendar / Calendly", x: 940, y: 60, icon: "calendar" },
  { id: "n6", kind: "integration", title: "Sync to CRM", subtitle: "HubSpot / Google Sheets", x: 940, y: 240, icon: "database" },
  { id: "n7", kind: "action", title: "Notify sales rep", subtitle: "Slack DM if unresolved", x: 640, y: 420, icon: "bell" },
];

export const edges: FlowEdge[] = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n5", label: "Yes" },
  { from: "n3", to: "n4", label: "No" },
  { from: "n5", to: "n6" },
  { from: "n4", to: "n6" },
  { from: "n4", to: "n7", label: "No reply in 10m" },
];

export const nodeStyles: Record<NodeKind, { badge: string; text: string; label: string }> = {
  trigger: { badge: "bg-primary-muted", text: "text-primary", label: "Trigger" },
  condition: { badge: "bg-warning-muted", text: "text-warning", label: "Condition" },
  action: { badge: "bg-secondary-muted", text: "text-secondary", label: "Action" },
  integration: { badge: "bg-success-muted", text: "text-success", label: "Integration" },
};
