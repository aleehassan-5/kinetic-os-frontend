"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Calendar, Sparkles, Send, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Lead, channelStyles, statusToApi, type ApiLead, type ApiLeadDetail, type ApiMessage } from "./data";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

const statusVariant: Record<Lead["status"], "default" | "primary" | "success" | "warning" | "danger"> = {
  New: "primary",
  Replied: "default",
  Qualified: "warning",
  Booked: "warning",
  Customer: "success",
  Lost: "danger",
};

const STATUS_OPTIONS: Lead["status"][] = ["New", "Replied", "Qualified", "Booked", "Customer", "Lost"];

export function LeadDetail({ lead, onUpdated }: { lead: Lead; onUpdated?: (updated: ApiLead) => void }) {
  const cs = channelStyles[lead.channel];
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [dealValueDraft, setDealValueDraft] = useState(
    lead.dealValueCents != null ? String(lead.dealValueCents / 100) : ""
  );
  const [savingDealValue, setSavingDealValue] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [savingMeeting, setSavingMeeting] = useState(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [savingCall, setSavingCall] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);

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

  async function changeStatus(newStatus: Lead["status"]) {
    if (newStatus === lead.status || savingStatus) return;
    setSavingStatus(true);
    try {
      const updated = await api.patch<ApiLead>(`/leads/${lead.id}`, { status: statusToApi[newStatus] });
      onUpdated?.(updated);
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveDealValue() {
    if (savingDealValue) return;
    const trimmed = dealValueDraft.trim();
    const parsed = trimmed === "" ? null : Number(trimmed);
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0)) return;
    setSavingDealValue(true);
    try {
      const updated = await api.patch<ApiLead>(`/leads/${lead.id}`, { dealValue: parsed });
      onUpdated?.(updated);
    } finally {
      setSavingDealValue(false);
    }
  }

  async function submitMeeting() {
    if (savingMeeting) return;
    if (!meetingDate || !meetingTime) {
      setMeetingError("Pick a date and time.");
      return;
    }
    const startTime = new Date(`${meetingDate}T${meetingTime}`);
    if (Number.isNaN(startTime.getTime())) {
      setMeetingError("That date/time doesn't look right.");
      return;
    }
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // default 30 min slot

    setSavingMeeting(true);
    setMeetingError(null);
    try {
      await api.post(`/leads/${lead.id}/meetings`, {
        topic: meetingTopic.trim() || undefined,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      setMeetingModalOpen(false);
      setMeetingTopic("");
      setMeetingDate("");
      setMeetingTime("");
      onUpdated?.({ ...lead, status: "Booked" } as unknown as ApiLead);
    } catch {
      setMeetingError("Couldn't schedule the meeting — try again.");
    } finally {
      setSavingMeeting(false);
    }
  }

  async function submitCallLog() {
    if (savingCall) return;
    const notes = callNotes.trim();
    if (!notes) {
      setCallError("Add a quick note about the call.");
      return;
    }
    setSavingCall(true);
    setCallError(null);
    try {
      const message = await api.post<ApiMessage>(`/leads/${lead.id}/log-call`, { notes });
      setMessages((prev) => [...prev, message]);
      setCallModalOpen(false);
      setCallNotes("");
    } catch {
      setCallError("Couldn't log the call — try again.");
    } finally {
      setSavingCall(false);
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
          <div className="relative mt-1 inline-block">
            <select
              value={lead.status}
              disabled={savingStatus}
              onChange={(e) => changeStatus(e.target.value as Lead["status"])}
              className="appearance-none rounded bg-transparent pr-4 text-[11px] font-medium focus:outline-none"
              style={{ color: "transparent" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-card text-text-primary">
                  {s}
                </option>
              ))}
            </select>
            <Badge variant={statusVariant[lead.status]} className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {savingStatus ? <Loader2 className="h-3 w-3 animate-spin" /> : lead.status}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-[11px] text-text-muted">Assigned</p>
          <p className="mt-0.5 text-[13px] font-medium text-text-primary">AI Agent</p>
        </div>
      </div>

      {lead.status === "Customer" && (
        <div className="border-b border-border px-5 py-3">
          <label className="text-[11px] text-text-muted">
            Deal value (USD) — feeds the &quot;Expected Revenue&quot; dashboard metric
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[13px] text-text-muted">$</span>
            <input
              type="number"
              min="0"
              step="1"
              value={dealValueDraft}
              onChange={(e) => setDealValueDraft(e.target.value)}
              onBlur={saveDealValue}
              onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
              placeholder="e.g. 1500"
              className="h-8 w-28 rounded-control border border-border bg-white/[0.03] px-2 text-[13px] text-text-primary focus:border-primary focus:outline-none"
            />
            {savingDealValue && <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" />}
          </div>
        </div>
      )}

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
          <Button variant="secondary" size="sm" onClick={() => setMeetingModalOpen(true)}>
            <Calendar className="h-3.5 w-3.5" /> Schedule Meeting
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setCallModalOpen(true)}>
            <Phone className="h-3.5 w-3.5" /> Log Call
          </Button>
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

      <Modal
        open={meetingModalOpen}
        onClose={() => setMeetingModalOpen(false)}
        title="Schedule meeting"
        description={`With ${lead.name ?? "this lead"} — 30 min slot`}
      >
        <div className="space-y-3">
          <div>
            <Label>Topic (optional)</Label>
            <Input value={meetingTopic} onChange={(e) => setMeetingTopic(e.target.value)} placeholder="Intro call" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
            </div>
          </div>
          {meetingError && <p className="text-[12px] text-danger">{meetingError}</p>}
          <Button className="w-full" onClick={submitMeeting} disabled={savingMeeting}>
            {savingMeeting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Schedule"}
          </Button>
        </div>
      </Modal>

      <Modal
        open={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        title="Log a call"
        description={`With ${lead.name ?? "this lead"}`}
      >
        <div className="space-y-3">
          <div>
            <Label>What happened on the call?</Label>
            <textarea
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="e.g. Discussed pricing, follow up next week"
              rows={4}
              className="w-full rounded-control border border-border bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>
          {callError && <p className="text-[12px] text-danger">{callError}</p>}
          <Button className="w-full" onClick={submitCallLog} disabled={savingCall}>
            {savingCall ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save call log"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
