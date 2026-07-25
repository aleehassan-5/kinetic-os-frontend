"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Calendar, Sparkles, Send, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lead, channelStyles, type ApiLeadDetail, type ApiMessage } from "./data";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

const statusVariant: Record<Lead["status"], "default" | "primary" | "success" | "warning" | "danger"> = {
  New: "primary",
  Replied: "default",
  Qualified: "warning",
  Booked: "success",
  Lost: "danger",
};

export function LeadDetail({ lead }: { lead: Lead }) {
  const cs = channelStyles[lead.channel];
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiLeadDetail>(`/leads/${lead.id}`)
      .then((data) => setMessages(data.conversations[0]?.messages ?? []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [lead.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    try {
      const result = await api.post<{ message: ApiMessage; delivered: boolean }>(`/leads/${lead.id}/reply`, { text });
      setMessages((prev) => [...prev, result.message]);
    } catch {
      setDraft(text); // restore on failure so the user doesn't lose the draft
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-semibold text-white", lead.avatarColor)}>
            {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-text-primary">{lead.name}</p>
            <p className="text-[12px] text-text-muted">{lead.handle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("rounded px-2 py-1 text-[11px] font-medium", cs.bg, cs.text)}>{lead.channel}</span>
          <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-[11px] text-text-muted">Intent score</p>
          <p className="mt-0.5 text-[15px] font-semibold text-success">{lead.intent}/100</p>
        </div>
        <div>
          <p className="text-[11px] text-text-muted">Status</p>
          <Badge variant={statusVariant[lead.status]} className="mt-1">{lead.status}</Badge>
        </div>
        <div>
          <p className="text-[11px] text-text-muted">Assigned</p>
          <p className="mt-0.5 text-[13px] font-medium text-text-primary">AI Agent</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-[12.5px] text-text-muted">No messages yet in this conversation.</p>
        ) : (
          messages.map((m) => {
            const isOutbound = m.direction === "OUTBOUND";
            return (
              <div key={m.id} className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[78%] rounded-card px-3.5 py-2.5 text-[13px] leading-relaxed",
                    isOutbound ? "bg-primary text-background" : "bg-white/[0.05] text-text-primary border border-border"
                  )}
                >
                  {isOutbound && (
                    <div className="mb-1 flex items-center gap-1 text-[10.5px] font-medium text-white/70">
                      <Sparkles className="h-3 w-3" /> {m.sender === "AI" ? "AI Agent" : "You"}
                    </div>
                  )}
                  {m.content}
                  <div className={cn("mt-1 text-[10.5px]", isOutbound ? "text-white/60" : "text-text-muted")}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-2 flex gap-2">
          <Button variant="secondary" size="sm"><Calendar className="h-3.5 w-3.5" /> Schedule Meeting</Button>
          <Button variant="secondary" size="sm"><Phone className="h-3.5 w-3.5" /> Log Call</Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendReply();
              }
            }}
            placeholder="Write a reply, or let AI handle it…"
            className="h-10 flex-1 rounded-control border border-border bg-white/[0.03] px-3.5 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <Button size="icon" onClick={sendReply} disabled={sending || !draft.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
