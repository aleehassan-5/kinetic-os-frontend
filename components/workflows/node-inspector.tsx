import { Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { EditorNode, EditorNodeData, nodeStyles, visualKind } from "./graph-types";

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-control border border-border bg-white/[0.03] px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function NodeInspector({
  node,
  onChange,
  onDelete,
  onDuplicate,
  onSave,
  saving,
}: {
  node: EditorNode | null;
  onChange: (patch: Partial<EditorNodeData>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSave: () => void;
  saving?: boolean;
}) {
  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-[13px] font-medium text-text-primary">No node selected</p>
        <p className="text-[12px] text-text-secondary">Click a node on the canvas to configure it.</p>
      </div>
    );
  }

  const style = nodeStyles[visualKind(node)];
  const data = node.data;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${style.badge} ${style.text}`}>
          {style.label}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate step">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Delete step">
            <Trash2 className="h-3.5 w-3.5 text-danger" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div className="space-y-1.5">
          <Label>Step name</Label>
          <Input value={data.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Input value={data.subtitle ?? ""} onChange={(e) => onChange({ subtitle: e.target.value })} />
        </div>

        {node.type === "trigger" && (
          <>
            <div className="space-y-1.5">
              <Label>Event</Label>
              <Select
                value={String(data.event ?? "message_received")}
                onChange={(v) => onChange({ event: v })}
                options={[
                  { value: "message_received", label: "Message received" },
                  { value: "new_lead", label: "New lead" },
                  { value: "intent_threshold", label: "Intent threshold crossed" },
                  { value: "keyword_match", label: "Keyword match" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Channel</Label>
              <Select
                value={String(data.channel ?? "ANY")}
                onChange={(v) => onChange({ channel: v })}
                options={[
                  { value: "ANY", label: "Any channel" },
                  { value: "WHATSAPP", label: "WhatsApp" },
                  { value: "INSTAGRAM", label: "Instagram" },
                  { value: "TELEGRAM", label: "Telegram" },
                  { value: "MESSENGER", label: "Messenger" },
                  { value: "EMAIL", label: "Email" },
                ]}
              />
            </div>
          </>
        )}

        {node.type === "condition" && (
          <div className="space-y-1.5">
            <Label>Condition</Label>
            <div className="flex items-center gap-2">
              <Select
                value={String(data.field ?? "intentScore")}
                onChange={(v) => onChange({ field: v })}
                options={[
                  { value: "intentScore", label: "Intent score" },
                  { value: "channel", label: "Channel" },
                  { value: "status", label: "Status" },
                ]}
              />
              <select
                value={String(data.operator ?? "gte")}
                onChange={(e) => onChange({ operator: e.target.value })}
                className="h-10 rounded-control border border-border bg-white/[0.03] px-2 text-[13px] text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="gte">≥</option>
                <option value="lte">≤</option>
                <option value="eq">=</option>
                <option value="gt">&gt;</option>
                <option value="lt">&lt;</option>
                <option value="neq">≠</option>
              </select>
              <Input
                className="w-20"
                value={String(data.value ?? "")}
                onChange={(e) => onChange({ value: e.target.value })}
              />
            </div>
          </div>
        )}

        {node.type === "action" && visualKind(node) === "action" && (
          <>
            <div className="space-y-1.5">
              <Label>Action type</Label>
              <Select
                value={String(data.actionType ?? "ai_reply")}
                onChange={(v) => onChange({ actionType: v })}
                options={[
                  { value: "ai_reply", label: "AI reply (Knowledge Base grounded)" },
                  { value: "notify", label: "Notify sales rep" },
                ]}
              />
            </div>
            {data.actionType === "notify" && (
              <div className="space-y-1.5">
                <Label>Message template</Label>
                <Input value={String(data.template ?? "")} onChange={(e) => onChange({ template: e.target.value })} />
              </div>
            )}
          </>
        )}

        {node.type === "action" && visualKind(node) === "integration" && (
          <>
            <div className="space-y-1.5">
              <Label>Integration type</Label>
              <Select
                value={String(data.actionType ?? "crm_sync")}
                onChange={(v) => onChange({ actionType: v })}
                options={[
                  { value: "crm_sync", label: "Sync to CRM" },
                  { value: "calendar_book", label: "Create calendar hold" },
                ]}
              />
            </div>
            {data.actionType === "crm_sync" && (
              <div className="space-y-1.5">
                <Label>Connected account</Label>
                <Select
                  value={String(data.integration ?? "HUBSPOT")}
                  onChange={(v) => onChange({ integration: v })}
                  options={[
                    { value: "HUBSPOT", label: "Kinetic OS workspace (HubSpot)" },
                    { value: "GOOGLE_SHEETS", label: "hello@kineticos.com (Google Sheets)" },
                  ]}
                />
              </div>
            )}
            {data.actionType === "calendar_book" && (
              <div className="space-y-1.5">
                <Label>Connected account</Label>
                <Select
                  value={String(data.provider ?? "GOOGLE_CALENDAR")}
                  onChange={(v) => onChange({ provider: v })}
                  options={[
                    { value: "GOOGLE_CALENDAR", label: "hello@kineticos.com (Google Calendar)" },
                    { value: "CALENDLY", label: "Calendly" },
                  ]}
                />
              </div>
            )}
          </>
        )}

        <div className="space-y-1.5">
          <Label>Timeout</Label>
          <div className="flex items-center gap-2">
            <Input
              className="w-20"
              type="number"
              min={0}
              value={String(data.timeoutMinutes ?? 10)}
              onChange={(e) => onChange({ timeoutMinutes: Number(e.target.value) || 0 })}
            />
            <span className="text-[12.5px] text-text-secondary">minutes before fallback</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <Button className="w-full" size="sm" onClick={onSave} loading={saving}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
