"use client";

import { useEffect, useRef, useState } from "react";
import {
  Inbox,
  Gauge,
  GitBranch,
  MessageCircle,
  CalendarPlus,
  Database,
  Bell,
  ZoomIn,
  ZoomOut,
  Maximize,
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
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.5;

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  function fitToScreen() {
    const wrapperWidth = wrapperRef.current?.clientWidth ?? width;
    // Leave a little breathing room instead of an edge-to-edge fit.
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (wrapperWidth - 24) / width));
    setZoom(Number(next.toFixed(2)));
  }

  // Auto-fit once on mount so every node is visible without an extra click,
  // then leave it under manual control (zoom buttons / reset to 100%).
  useEffect(() => {
    fitToScreen();
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-control border border-border bg-card/95 p-1 shadow-elevated backdrop-blur">
        <button
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, Number((z - 0.1).toFixed(2))))}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-secondary transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
          title="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="min-w-[42px] rounded-[6px] px-1.5 py-1 text-center text-[11.5px] font-medium text-text-secondary transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
          title="Reset to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, Number((z + 0.1).toFixed(2))))}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-secondary transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
          title="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <button
          onClick={fitToScreen}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-secondary transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
          title="Fit to screen"
        >
          <Maximize className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        className="overflow-auto rounded-card bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:20px_20px]"
        style={{ minHeight: 560 }}
      >
        <div style={{ width: width * zoom, height: height * zoom }}>
          <div style={{ width, height, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
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
                      <text x={midX} y={midY - 8} textAnchor="middle" fontSize="11" fill="#6C6A63">
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
        </div>
      </div>
    </div>
  );
}
