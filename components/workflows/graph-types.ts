// Shared types for the workflow editor. The shape here matches what the
// backend actually persists (WorkflowNode/WorkflowGraph in
// workflow.types.ts) — `data` is validated as z.record(z.any()) on the
// backend, so we piggyback the canvas position and user-editable
// title/subtitle straight onto each node's `data` object. No backend
// schema change needed.

export type NodeType = "trigger" | "condition" | "action";
export type PaletteKind = "trigger" | "condition" | "action" | "integration";

export interface Position {
  x: number;
  y: number;
}

export interface EditorNodeData {
  position: Position;
  title?: string;
  subtitle?: string;
  [key: string]: unknown;
}

export interface EditorNode {
  id: string;
  type: NodeType;
  data: EditorNodeData;
}

export interface EditorEdge {
  source: string;
  target: string;
  branch?: "true" | "false";
}

export interface EditorGraph {
  nodes: EditorNode[];
  edges: EditorEdge[];
}

export type VisualKind = "trigger" | "condition" | "action" | "integration";

export const nodeStyles: Record<VisualKind, { badge: string; text: string; label: string }> = {
  trigger: { badge: "bg-primary-muted", text: "text-primary", label: "Trigger" },
  condition: { badge: "bg-warning-muted", text: "text-warning", label: "Condition" },
  action: { badge: "bg-secondary-muted", text: "text-secondary", label: "Action" },
  integration: { badge: "bg-success-muted", text: "text-success", label: "Integration" },
};

export function visualKind(node: EditorNode): VisualKind {
  if (node.type === "trigger") return "trigger";
  if (node.type === "condition") return "condition";
  const actionType = node.data.actionType as string | undefined;
  if (actionType === "crm_sync" || actionType === "calendar_book") return "integration";
  return "action";
}

export function nodeIcon(node: EditorNode): string {
  if (node.type === "trigger") return "inbox";
  if (node.type === "condition") return "split";
  const actionType = node.data.actionType as string | undefined;
  switch (actionType) {
    case "calendar_book":
      return "calendar";
    case "crm_sync":
      return "database";
    case "notify":
      return "bell";
    default:
      return "message";
  }
}

let idCounter = 0;
function genId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}${idCounter}`;
}

export function makeNode(kind: PaletteKind, position: Position): EditorNode {
  switch (kind) {
    case "trigger":
      return {
        id: genId("trigger"),
        type: "trigger",
        data: {
          position,
          title: "New trigger",
          subtitle: "New message received",
          event: "message_received",
          channel: "ANY",
        },
      };
    case "condition":
      return {
        id: genId("condition"),
        type: "condition",
        data: {
          position,
          title: "New condition",
          subtitle: "Branch on score",
          field: "intentScore",
          operator: "gte",
          value: 60,
        },
      };
    case "integration":
      return {
        id: genId("action"),
        type: "action",
        data: {
          position,
          title: "Sync to CRM",
          subtitle: "HubSpot / Google Sheets",
          actionType: "crm_sync",
          integration: "HUBSPOT",
        },
      };
    case "action":
    default:
      return {
        id: genId("action"),
        type: "action",
        data: {
          position,
          title: "Send AI reply",
          subtitle: "Grounded on Knowledge Base",
          actionType: "ai_reply",
        },
      };
  }
}

export const DEFAULT_GRAPH: EditorGraph = {
  nodes: [
    {
      id: "trigger-1",
      type: "trigger",
      data: { position: { x: 40, y: 60 }, title: "New message received", subtitle: "WhatsApp · Instagram · Telegram", event: "message_received", channel: "ANY" },
    },
    {
      id: "condition-1",
      type: "condition",
      data: { position: { x: 340, y: 60 }, title: "Intent ≥ 60?", subtitle: "Branch on score", field: "intentScore", operator: "gte", value: 60 },
    },
    {
      id: "action-book",
      type: "action",
      data: { position: { x: 640, y: 60 }, title: "Create calendar hold", subtitle: "Google Calendar / Calendly", actionType: "calendar_book", provider: "GOOGLE_CALENDAR" },
    },
    {
      id: "action-reply",
      type: "action",
      data: { position: { x: 640, y: 240 }, title: "Send AI reply", subtitle: "Grounded on Knowledge Base", actionType: "ai_reply" },
    },
    {
      id: "action-crm",
      type: "action",
      data: { position: { x: 940, y: 150 }, title: "Sync to CRM", subtitle: "HubSpot / Google Sheets", actionType: "crm_sync", integration: "HUBSPOT" },
    },
    {
      id: "action-notify",
      type: "action",
      data: { position: { x: 640, y: 420 }, title: "Notify sales rep", subtitle: "Slack DM if unresolved", actionType: "notify", template: "No reply in 10 minutes" },
    },
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

/** Guards against graphs saved without positions (or malformed data) so the canvas never crashes. */
export function ensurePositions(graph: EditorGraph | null | undefined): EditorGraph {
  if (!graph || !Array.isArray(graph.nodes)) return { nodes: [], edges: [] };
  const nodes = graph.nodes.map((n, i) => {
    const data = (n.data ?? {}) as EditorNodeData;
    if (data.position && typeof data.position.x === "number" && typeof data.position.y === "number") {
      return { ...n, data };
    }
    const col = i % 3;
    const row = Math.floor(i / 3);
    return { ...n, data: { ...data, position: { x: 40 + col * 300, y: 60 + row * 180 } } };
  });
  return { nodes, edges: Array.isArray(graph.edges) ? graph.edges : [] };
}
