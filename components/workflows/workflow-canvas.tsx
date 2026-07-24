"use client";

import {
  Inbox,
  Gauge,
  GitBranch,
  MessageCircle,
  CalendarPlus,
  Database,
  Bell,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nodes, edges, nodeStyles, FlowNode } from "./data";

const iconMap: Record<string, LucideIcon> = {
  inbox: Inbox,
  gauge: Gauge,
  split: GitBranch,
  message: MessageCircle,
  calendar: CalendarPlus,
  database: Database,
  bell: Bell,
};

const NODE_W = 220;
const NODE_H = 84;

function portOf(node: FlowNode, side: "left" | "right") {
  return {
    x: side === "left" ? node.x : node.x + NODE_W,
    y: node.y + NODE_H / 2,
  };
}

function edgePath(from: FlowNode, to: FlowNode) {
  const p1 = portOf(from, "right");
  const p2 = portOf(to, "left");
  const dx = Math.max(60, (p2.x - p1.x) / 2);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

export function WorkflowCanvas({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const width = 1200;
  const height = 540;

  return (
    <div className="relative overflow-auto rounded-card bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:20px_20px]" style={{ minHeight: 560 }}>
      <svg width={width} height={height} className="absolute left-0 top-0" style={{ pointerEvents: "none" }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.28)" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const from = nodes.find((n) => n.id === e.from)!;
          const to = nodes.find((n) => n.id === e.to)!;
          const midX = (portOf(from, "right").x + portOf(to, "left").x) / 2;
          const midY = (portOf(from, "right").y + portOf(to, "left").y) / 2;
          return (
            <g key={i}>
              <path
                d={edgePath(from, to)}
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth={1.5}
                markerEnd="url(#arrow)"
              />
              {e.label && (
                <text x={midX} y={midY - 8} textAnchor="middle" fontSize="11" fill="#64748B">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="relative" style={{ width, height }}>
        {nodes.map((node) => {
          const Icon = iconMap[node.icon];
          const style = nodeStyles[node.kind];
          const active = selectedId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => onSelect(node.id)}
              style={{ left: node.x, top: node.y, width: NODE_W }}
              className={cn(
                "absolute rounded-card border bg-card p-3.5 text-left shadow-subtle transition-all duration-200",
                active ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-border-strong"
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-[7px]", style.badge)}>
                  <Icon className={cn("h-[15px] w-[15px]", style.text)} strokeWidth={2} />
                </div>
                <span className={cn("text-[10.5px] font-medium uppercase tracking-wide", style.text)}>
                  {style.label}
                </span>
              </div>
              <p className="mt-2 text-[13px] font-medium text-text-primary">{node.title}</p>
              <p className="mt-0.5 text-[11.5px] text-text-secondary">{node.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
