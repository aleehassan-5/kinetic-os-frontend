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

// ---- Real backend integration ------------------------------------------
// The canvas above is an illustrative preview of the automation. What actually
// gets saved to and executed by the backend is the graph below, expressed in
// the shape the workflow engine understands (trigger / condition / action
// nodes only — see workflow.types.ts on the backend).

export interface BackendWorkflowGraph {
  nodes: { id: string; type: "trigger" | "condition" | "action"; data: Record<string, unknown> }[];
  edges: { source: string; target: string; branch?: "true" | "false" }[];
}

export const DEFAULT_BACKEND_GRAPH: BackendWorkflowGraph = {
  nodes: [
    { id: "trigger-1", type: "trigger", data: { event: "message_received", channel: "ANY" } },
    { id: "condition-1", type: "condition", data: { field: "intentScore", operator: "gte", value: 60 } },
    { id: "action-book", type: "action", data: { actionType: "calendar_book", provider: "GOOGLE_CALENDAR" } },
    { id: "action-reply", type: "action", data: { actionType: "ai_reply" } },
    { id: "action-crm", type: "action", data: { actionType: "crm_sync", integration: "HUBSPOT" } },
    { id: "action-notify", type: "action", data: { actionType: "notify", template: "No reply in 10 minutes" } },
  ],
  edges: [
    { source: "trigger-1", target: "condition-1" },
    { source: "condition-1", target: "action-book", branch: "true" },
    { source: "condition-1", target: "action-reply", branch: "false" },
    { source: "action-book", target: "action-crm" },
    { source: "action-reply", target: "action-crm" },
    { source: "action-reply", target: "action-notify" },
  ],
};
