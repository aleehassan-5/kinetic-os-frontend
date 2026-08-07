"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus, Menu, Sun, Moon, FileText, Workflow as WorkflowIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileNav } from "./mobile-nav-context";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { api } from "@/lib/api-client";
import { useTheme } from "@/lib/theme-context";

interface SearchResults {
  leads: { id: string; name: string | null; email: string | null; phone: string | null; channel: string; status: string }[];
  workflows: { id: string; name: string; status: string }[];
  documents: { id: string; title: string; sourceType: string; status: string }[];
}

const EMPTY_RESULTS: SearchResults = { leads: [], workflows: [], documents: [] };

export function Topnav({
  title,
  subtitle,
  onNewWorkflow,
}: {
  title: string;
  subtitle?: string;
  /** Called instead of navigating when the "New Workflow" button is clicked (e.g. the Workflow Builder page creates one in place). */
  onNewWorkflow?: () => void;
}) {
  const router = useRouter();
  const { toggle } = useMobileNav();
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    api
      .get<{ notifications: { read: boolean }[] }>("/notifications")
      .then((data) => setUnreadCount(data.notifications.filter((n) => !n.read).length))
      .catch(() => setUnreadCount(0));
  }, [notifOpen]);

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>(EMPTY_RESULTS);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searching, setSearching] = React.useState(false);
  const searchBoxRef = React.useRef<HTMLDivElement>(null);

  // Debounced global search — waits for a pause in typing before hitting the
  // API, and ignores results that come back for a since-changed query.
  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults(EMPTY_RESULTS);
      setSearching(false);
      return;
    }
    setSearching(true);
    let cancelled = false;
    const timer = setTimeout(() => {
      api
        .get<SearchResults>(`/search?q=${encodeURIComponent(q)}`)
        .then((data) => {
          if (!cancelled) setResults(data);
        })
        .catch(() => {
          if (!cancelled) setResults(EMPTY_RESULTS);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  React.useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);

  function goToLead(id: string) {
    setSearchOpen(false);
    setQuery("");
    router.push(`/leads?id=${id}`);
  }

  function goToWorkflow(id: string) {
    setSearchOpen(false);
    setQuery("");
    router.push(`/workflows?open=${id}`);
  }

  function goToDocument() {
    setSearchOpen(false);
    setQuery("");
    router.push(`/knowledge`);
  }

  const hasResults = results.leads.length > 0 || results.workflows.length > 0 || results.documents.length > 0;
  const showDropdown = searchOpen && query.trim().length >= 2;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:pl-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={toggle}
          aria-label="Open menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-[17px] font-semibold tracking-tight text-text-primary">{title}</h1>
          {subtitle && <p className="hidden truncate text-[12.5px] text-text-secondary sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div ref={searchBoxRef} className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search leads, workflows, docs…"
            className="h-9 w-72 rounded-control border border-border bg-white/[0.03] pl-9 pr-3 text-[13px] text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-primary focus:outline-none"
          />

          {showDropdown && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-80 overflow-hidden rounded-control border border-border bg-card shadow-lg">
              {searching ? (
                <div className="px-4 py-6 text-center text-[12.5px] text-text-muted">Searching…</div>
              ) : !hasResults ? (
                <div className="px-4 py-6 text-center text-[12.5px] text-text-muted">No results for “{query.trim()}”</div>
              ) : (
                <div className="max-h-96 overflow-y-auto py-1.5">
                  {results.leads.length > 0 && (
                    <div className="px-1.5 pb-1">
                      <p className="px-2.5 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Leads</p>
                      {results.leads.map((lead) => (
                        <button
                          key={lead.id}
                          onClick={() => goToLead(lead.id)}
                          className="flex w-full items-center gap-2.5 rounded-control px-2.5 py-2 text-left transition-colors duration-200 hover:bg-white/[0.05]"
                        >
                          <User className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-text-primary">{lead.name || lead.email || lead.phone || "Unnamed lead"}</p>
                            <p className="truncate text-[11px] text-text-muted">{lead.channel} · {lead.status}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.workflows.length > 0 && (
                    <div className="border-t border-border px-1.5 py-1">
                      <p className="px-2.5 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Workflows</p>
                      {results.workflows.map((wf) => (
                        <button
                          key={wf.id}
                          onClick={() => goToWorkflow(wf.id)}
                          className="flex w-full items-center gap-2.5 rounded-control px-2.5 py-2 text-left transition-colors duration-200 hover:bg-white/[0.05]"
                        >
                          <WorkflowIcon className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-text-primary">{wf.name}</p>
                            <p className="truncate text-[11px] text-text-muted">{wf.status}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.documents.length > 0 && (
                    <div className="border-t border-border px-1.5 py-1">
                      <p className="px-2.5 pb-1 pt-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-text-muted">Documents</p>
                      {results.documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => goToDocument()}
                          className="flex w-full items-center gap-2.5 rounded-control px-2.5 py-2 text-left transition-colors duration-200 hover:bg-white/[0.05]"
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-text-primary">{doc.title}</p>
                            <p className="truncate text-[11px] text-text-muted">{doc.sourceType} · {doc.status}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary"
        >
          {theme === "dark" ? <Sun className="h-[17px] w-[17px]" /> : <Moon className="h-[17px] w-[17px]" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-control border border-border text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary"
          >
            <Bell className="h-[17px] w-[17px]" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
            )}
          </button>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <Button
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => (onNewWorkflow ? onNewWorkflow() : router.push("/workflows?new=1"))}
        >
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>
    </header>
  );
}
