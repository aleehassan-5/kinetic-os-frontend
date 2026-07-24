import { Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { nodes, nodeStyles } from "./data";

export function NodeInspector({ selectedId }: { selectedId: string | null }) {
  const node = nodes.find((n) => n.id === selectedId);

  if (!node) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-[13px] font-medium text-text-primary">No node selected</p>
        <p className="text-[12px] text-text-secondary">Click a node on the canvas to configure it.</p>
      </div>
    );
  }

  const style = nodeStyles[node.kind];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${style.badge} ${style.text}`}>
          {style.label}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon"><Copy className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon"><Trash2 className="h-3.5 w-3.5 text-danger" /></Button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div className="space-y-1.5">
          <Label>Step name</Label>
          <Input defaultValue={node.title} />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Input defaultValue={node.subtitle} />
        </div>

        {node.kind === "condition" && (
          <div className="space-y-1.5">
            <Label>Condition</Label>
            <div className="flex items-center gap-2">
              <Input defaultValue="intent_score" className="flex-1" />
              <select className="h-10 rounded-control border border-border bg-white/[0.03] px-2 text-[13px] text-text-primary focus:border-primary focus:outline-none">
                <option>≥</option>
                <option>≤</option>
                <option>=</option>
              </select>
              <Input defaultValue="60" className="w-20" />
            </div>
          </div>
        )}

        {node.kind === "action" && (
          <div className="space-y-1.5">
            <Label>Model / template</Label>
            <select className="h-10 w-full rounded-control border border-border bg-white/[0.03] px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none">
              <option>Knowledge-Base grounded reply</option>
              <option>Custom template</option>
              <option>Escalate to human</option>
            </select>
          </div>
        )}

        {node.kind === "integration" && (
          <div className="space-y-1.5">
            <Label>Connected account</Label>
            <select className="h-10 w-full rounded-control border border-border bg-white/[0.03] px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none">
              <option>hello@orbitai.com (Google)</option>
              <option>Orbit AI workspace (HubSpot)</option>
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Timeout</Label>
          <div className="flex items-center gap-2">
            <Input defaultValue="10" className="w-20" />
            <span className="text-[12.5px] text-text-secondary">minutes before fallback</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <Button className="w-full" size="sm">Save changes</Button>
      </div>
    </div>
  );
}
