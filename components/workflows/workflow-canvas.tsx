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
import { EditorGraph, EditorNode, Position, nodeStyles, nodeIcon, visualKind } from "./graph-types";

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
const CLICK_THRESHOLD = 4;

function portOf(pos: Position, side: "left" | "right") {
  return {
    x: side === "left" ? pos.x : pos.x + NODE_W,
    y: pos.y + NODE_H / 2,
  };
}

function edgePath(from: Position, to: Position) {
  const p1 = portOf(from, "right");
  const p2 = portOf(to, "left");
  const dx = Math.max(60, (p2.x - p1.x) / 2);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

export function WorkflowCanvas({
  graph,
  selectedId,
  onSelect,
  onMoveNode,
  onConnect,
  onDeleteEdge,
}: {
  graph: EditorGraph;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMoveNode: (id: string, position: Position) => void;
  onConnect: (source: string, target: string) => void;
  onDeleteEdge: (index: number) => void;
}) {
  const width = 1200;
  const height = 540;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const userAdjustedRef = useRef(false);

  // Local, optimistic position overrides while a node is actively being
  // dragged — keeps dragging smooth without spamming the parent (and
  // therefore the backend-bound graph state) on every pointer move.
  const [livePositions, setLivePositions] = useState<Record<string, Position>>({});
  const dragRef = useRef<{ id: string; startClientX: number; startClientY: number; startPos: Position; moved: boolean } | null>(null);

  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [connectPoint, setConnectPoint] = useState<Position | null>(null);
  const [hoverTarget, setHoverTarget] = useState<string | null>(null);
  const connectingRef = useRef(false);

  function fitToScreen(el?: HTMLDivElement | null) {
    const wrapperWidth = (el ?? wrapperRef.current)?.clientWidth;
    if (!wrapperWidth) return;
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (wrapperWidth - 24) / width));
    setZoom(Number(next.toFixed(2)));
  }

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    fitToScreen(el);
    const observer = new ResizeObserver(() => {
      if (!userAdjustedRef.current) fitToScreen(el);
    });
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function adjustZoom(next: number) {
    userAdjustedRef.current = true;
    setZoom(next);
  }

  function localPointFromClient(clientX: number, clientY: number): Position {
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom };
  }

  function posOf(node: EditorNode): Position {
    return livePositions[node.id] ?? node.data.position;
  }

  // ---- Node drag (move) ----
  function handleNodePointerDown(e: React.PointerEvent, node: EditorNode) {
    if (connectingRef.current) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { id: node.id, startClientX: e.clientX, startClientY: e.clientY, startPos: node.data.position, moved: false };
  }

  function handleNodePointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = (e.clientX - drag.startClientX) / zoom;
    const dy = (e.clientY - drag.startClientY) / zoom;
    if (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD) drag.moved = true;
    if (drag.moved) {
      setLivePositions((prev) => ({ ...prev, [drag.id]: { x: Math.max(0, drag.startPos.x + dx), y: Math.max(0, drag.startPos.y + dy) } }));
    }
  }

  function handleNodePointerUp(e: React.PointerEvent, node: EditorNode) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    if (drag.moved) {
      const finalPos = livePositions[node.id] ?? node.data.position;
      onMoveNode(node.id, finalPos);
      setLivePositions((prev) => {
        const next = { ...prev };
        delete next[node.id];
        return next;
      });
    } else {
      onSelect(node.id);
    }
  }

  // ---- Connect (drag from output port to another node) ----
  function handlePortPointerDown(e: React.PointerEvent, node: EditorNode) {
    e.stopPropagation();
    connectingRef.current = true;
    setConnectFrom(node.id);
    setConnectPoint(localPointFromClient(e.clientX, e.clientY));
    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
  }

  function handleWindowPointerMove(e: PointerEvent) {
    setConnectPoint(localPointFromClient(e.clientX, e.clientY));
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const nodeEl = el?.closest("[data-node-id]") as HTMLElement | null;
    setHoverTarget(nodeEl?.dataset.nodeId ?? null);
  }

  function handleWindowPointerUp(e: PointerEvent) {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const nodeEl = el?.closest("[data-node-id]") as HTMLElement | null;
    const targetId = nodeEl?.dataset.nodeId;
    setConnectFrom((from) => {
      if (from && targetId && targetId !== from) onConnect(from, targetId);
      return null;
    });
    setConnectPoint(null);
    setHoverTarget(null);
    connectingRef.current = false;
    window.removeEventListener("pointermove", handleWindowPointerMove);
    window.removeEventListener("pointerup", handleWindowPointerUp);
  }

  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));

  return (
    <div ref={wrapperRef} className="relative w-full min-w-0">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-control border border-border bg-card/95 p-1 shadow-elevated backdrop-blur">
        <button
          onClick={() => adjustZoom(Math.max(MIN_ZOOM, Number((zoom - 0.1).toFixed(2))))}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-secondary transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
          title="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => adjustZoom(1)}
          className="min-w-[42px] rounded-[6px] px-1.5 py-1 text-center text-[11.5px] font-medium text-text-secondary transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
          title="Reset to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => adjustZoom(Math.min(MAX_ZOOM, Number((zoom + 0.1).toFixed(2))))}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-text-secondary transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
          title="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <button
          onClick={() => {
            userAdjustedRef.current = false;
            fitToScreen();
          }}
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
          <div ref={contentRef} style={{ width, height, transform: `scale(${zoom})`, transformOrigin: "top left" }}>
            <svg width={width} height={height} className="absolute left-0 top-0" style={{ pointerEvents: "none" }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.28)" />
                </marker>
              </defs>
              {graph.edges.map((e, i) => {
                const from = nodeById.get(e.source);
                const to = nodeById.get(e.target);
                if (!from || !to) return null;
                const fromPos = posOf(from);
                const toPos = posOf(to);
                const midX = (portOf(fromPos, "right").x + portOf(toPos, "left").x) / 2;
                const midY = (portOf(fromPos, "right").y + portOf(toPos, "left").y) / 2;
                return (
                  <g key={i} style={{ pointerEvents: "auto" }}>
                    <path
                      d={edgePath(fromPos, toPos)}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                      className="cursor-pointer"
                      onClick={() => onDeleteEdge(i)}
                    >
                      <title>Click to remove connection</title>
                    </path>
                    <path
                      d={edgePath(fromPos, toPos)}
                      fill="none"
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth={1.5}
                      markerEnd="url(#arrow)"
                      style={{ pointerEvents: "none" }}
                    />
                    {e.branch && (
                      <text x={midX} y={midY - 8} textAnchor="middle" fontSize="11" fill="#6C6A63" style={{ pointerEvents: "none" }}>
                        {e.branch === "true" ? "Yes" : "No"}
                      </text>
                    )}
                  </g>
                );
              })}
              {connectFrom && connectPoint && nodeById.get(connectFrom) && (
                <path
                  d={edgePath(posOf(nodeById.get(connectFrom)!), { x: connectPoint.x - NODE_W, y: connectPoint.y - NODE_H / 2 })}
                  fill="none"
                  stroke="rgba(124,138,255,0.6)"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )}
            </svg>

            <div className="relative" style={{ width, height }}>
              {graph.nodes.map((node) => {
                const Icon = iconMap[nodeIcon(node)];
                const style = nodeStyles[visualKind(node)];
                const active = selectedId === node.id;
                const pos = posOf(node);
                const isConnectTarget = hoverTarget === node.id && connectFrom !== null && connectFrom !== node.id;
                return (
                  <div
                    key={node.id}
                    data-node-id={node.id}
                    onPointerDown={(e) => handleNodePointerDown(e, node)}
                    onPointerMove={handleNodePointerMove}
                    onPointerUp={(e) => handleNodePointerUp(e, node)}
                    style={{ left: pos.x, top: pos.y, width: NODE_W }}
                    className={cn(
                      "absolute cursor-grab select-none rounded-card border bg-card p-3.5 text-left shadow-subtle transition-colors duration-150 active:cursor-grabbing",
                      active ? "border-primary ring-2 ring-primary/25" : "border-border hover:border-border-strong",
                      isConnectTarget && "border-primary ring-2 ring-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("flex h-7 w-7 items-center justify-center rounded-[7px]", style.badge)}>
                          <Icon className={cn("h-[15px] w-[15px]", style.text)} strokeWidth={2} />
                        </div>
                        <span className={cn("text-[10.5px] font-medium uppercase tracking-wide", style.text)}>{style.label}</span>
                      </div>
                      {/* Output port — drag from here to another node to connect them */}
                      <div
                        onPointerDown={(e) => handlePortPointerDown(e, node)}
                        title="Drag to connect"
                        className="h-3 w-3 shrink-0 cursor-crosshair rounded-full border-2 border-primary bg-card hover:bg-primary"
                      />
                    </div>
                    <p className="mt-2 truncate text-[13px] font-medium text-text-primary">{node.data.title || "Untitled step"}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-text-secondary">{node.data.subtitle || ""}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
