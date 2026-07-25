"use client";

import { useState } from "react";
import { Sparkles, Send, Paperclip, BookOpen, Plus, MessageSquare } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

const initialMessages: Msg[] = [
  { role: "assistant", text: "Hi — I'm grounded on your Knowledge Base. Ask me anything about leads, pricing, or how a workflow is configured." },
];

const conversations = [{ title: "Current session", time: "now", active: true }];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sourceCount, setSourceCount] = useState(0);

  async function send() {
    if (!input.trim() || sending) return;
    const next = [...messages, { role: "user" as const, text: input }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const history = next.map((m) => ({ role: m.role, content: m.text }));
      const result = await api.post<{ reply: string; sources: { documentTitle: string; snippet: string }[] }>(
        "/chat",
        { history }
      );
      setMessages([...next, { role: "assistant", text: result.reply }]);
      setSourceCount(result.sources.length);
    } catch {
      setMessages([...next, { role: "assistant", text: "Sorry, I couldn't reach the assistant just now — please try again." }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Topnav title="AI Chat" subtitle="Grounded on your Knowledge Base" />

      <main className="p-6 lg:p-8">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
            {/* Conversation list */}
            <div className="border-b border-border lg:border-b-0 lg:border-r">
              <div className="p-3.5">
                <Button variant="secondary" size="sm" className="w-full">
                  <Plus className="h-3.5 w-3.5" /> New chat
                </Button>
              </div>
              <div className="max-h-[560px] overflow-y-auto px-2 pb-3">
                {conversations.map((c, i) => (
                  <button
                    key={i}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-control px-2.5 py-2.5 text-left transition-colors duration-200",
                      c.active ? "bg-primary-muted/40" : "hover:bg-white/[0.04]"
                    )}
                  >
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-text-primary">{c.title}</p>
                      <p className="text-[11px] text-text-muted">{c.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex h-[640px] flex-col">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-primary">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[13.5px] font-medium text-text-primary">Orbit Assistant</span>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11.5px] text-text-secondary">
                  <BookOpen className="h-3 w-3" /> {sourceCount} source{sourceCount === 1 ? "" : "s"} last used
                </span>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[75%] rounded-card px-4 py-3 text-[13.5px] leading-relaxed",
                      m.role === "user" ? "bg-primary text-background" : "border border-border bg-white/[0.03] text-text-primary"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-card border border-border bg-white/[0.03] px-4 py-3">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-text-muted" style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border p-4">
                <div className="flex items-end gap-2 rounded-control border border-border bg-white/[0.03] p-2 focus-within:border-primary">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    rows={1}
                    placeholder="Ask about leads, workflows, or pricing…"
                    className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-[13.5px] text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                  <Button size="icon" onClick={send} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
