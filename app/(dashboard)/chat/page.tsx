"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Paperclip, BookOpen, Plus, MessageSquare, Trash2 } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

interface Session {
  id: string;
  title: string;
  messages: Msg[];
  sourceCount: number;
  createdAt: number;
}

const welcomeMessage: Msg = {
  role: "assistant",
  text: "Hi — I'm grounded on your Knowledge Base. Ask me anything about leads, pricing, or how a workflow is configured.",
};

function newSession(): Session {
  return {
    id: `s-${Date.now()}`,
    title: "New chat",
    messages: [welcomeMessage],
    sourceCount: 0,
    createdAt: Date.now(),
  };
}

function timeLabel(ts: number) {
  const diffMin = Math.floor((Date.now() - ts) / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

const STORAGE_KEY = "kinetic-os-chat-sessions";

function loadSessions(): Session[] {
  if (typeof window === "undefined") return [newSession()];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Session[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore corrupt storage and fall back to a fresh session
  }
  return [newSession()];
}

export default function ChatPage() {
  // Start with a plain in-memory session so the server-rendered HTML and the
  // client's first render match exactly (localStorage doesn't exist on the
  // server). The real, saved sessions are loaded right after mount below.
  const [sessions, setSessions] = useState<Session[]>(() => [newSession()]);
  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0].id);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const hydrated = useRef(false);

  const active = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load any previously saved chats once we're safely in the browser.
  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);
    setActiveSessionId(loaded[0].id);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active.messages.length, sending, activeSessionId]);

  // Persist chats so they survive a page refresh. Skip runs before the
  // initial load above finishes, so we don't overwrite saved data with the
  // placeholder session.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // storage full or unavailable — chat still works for this session
    }
  }, [sessions]);

  function updateActive(updater: (s: Session) => Session) {
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? updater(s) : s)));
  }

  function handleNewChat() {
    const session = newSession();
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    setInput("");
  }

  function handleDeleteChat(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== id);
    const finalSessions = remaining.length > 0 ? remaining : [newSession()];
    setSessions(finalSessions);
    if (id === activeSessionId) {
      setActiveSessionId(finalSessions[0].id);
    }
  }

  async function send() {
    if (!input.trim() || sending) return;
    const userText = input;
    const next = [...active.messages, { role: "user" as const, text: userText }];
    updateActive((s) => ({
      ...s,
      messages: next,
      title: s.title === "New chat" ? userText.slice(0, 40) : s.title,
    }));
    setInput("");
    setSending(true);
    try {
      const history = next.map((m) => ({ role: m.role, content: m.text }));
      const result = await api.post<{ reply: string; sources: { documentTitle: string; snippet: string }[] }>(
        "/chat",
        { history }
      );
      updateActive((s) => ({
        ...s,
        messages: [...next, { role: "assistant", text: result.reply }],
        sourceCount: result.sources.length,
      }));
    } catch {
      updateActive((s) => ({
        ...s,
        messages: [...next, { role: "assistant", text: "Sorry, I couldn't reach the assistant just now — please try again." }],
      }));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Topnav title="AI Chat" subtitle="Grounded on your Knowledge Base" />

      <main className="p-6 lg:h-[calc(100vh-4rem)] lg:overflow-hidden lg:p-8">
        <Card className="flex flex-col overflow-hidden lg:h-full">
          <div className="grid grid-cols-1 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_1fr]">
            {/* Conversation list */}
            <div className="flex flex-col border-b border-border lg:border-b-0 lg:border-r">
              <div className="p-3.5">
                <Button variant="secondary" size="sm" className="w-full" onClick={handleNewChat}>
                  <Plus className="h-3.5 w-3.5" /> New chat
                </Button>
              </div>
              <div className="max-h-[280px] overflow-y-auto px-2 pb-3 lg:min-h-0 lg:max-h-none lg:flex-1">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "group relative flex w-full items-start gap-2.5 rounded-control px-2.5 py-2.5 text-left transition-colors duration-200",
                      s.id === activeSessionId ? "bg-primary-muted/40" : "hover:bg-white/[0.04]"
                    )}
                  >
                    <button
                      onClick={() => setActiveSessionId(s.id)}
                      className="flex min-w-0 flex-1 items-start gap-2.5 pr-6 text-left"
                    >
                      <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-text-primary">{s.title}</p>
                        <p className="text-[11px] text-text-muted">{s.id === activeSessionId ? "now" : timeLabel(s.createdAt)}</p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(s.id, e)}
                      aria-label="Delete chat"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted opacity-0 transition-opacity duration-150 hover:bg-white/[0.08] hover:text-danger group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex h-[560px] flex-col lg:h-auto lg:min-h-0">
              <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-primary">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[13.5px] font-medium text-text-primary">Orbit Assistant</span>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11.5px] text-text-secondary">
                  <BookOpen className="h-3 w-3" /> {active.sourceCount} source{active.sourceCount === 1 ? "" : "s"} last used
                </span>
              </div>

              <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
                {active.messages.map((m, i) => (
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

              <div className="shrink-0 border-t border-border p-4">
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
