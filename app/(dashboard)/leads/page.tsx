"use client";

import { useEffect, useMemo, useState } from "react";
import { Inbox as InboxIcon, SlidersHorizontal, Loader2 } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadRow, LeadRowSkeleton } from "@/components/leads/lead-row";
import { LeadDetail } from "@/components/leads/lead-detail";
import { Channel, mapApiLead, type ApiLead } from "@/components/leads/data";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

const filters: (Channel | "All")[] = ["All", "WhatsApp", "Instagram", "Telegram", "Messenger", "Email"];

const apiChannelFor: Record<Channel, string> = {
  WhatsApp: "WHATSAPP",
  Instagram: "INSTAGRAM",
  Telegram: "TELEGRAM",
  Messenger: "MESSENGER",
  Email: "EMAIL",
};

export default function LeadsPage() {
  const [apiLeads, setApiLeads] = useState<ApiLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Channel | "All">("All");

  useEffect(() => {
    setLoading(true);
    const params = filter === "All" ? "" : `?channel=${apiChannelFor[filter]}`;
    api
      .get<{ leads: ApiLead[] }>(`/leads${params}`)
      .then((data) => {
        setApiLeads(data.leads);
        setActiveId((prev) => prev ?? data.leads[0]?.id ?? null);
      })
      .catch(() => setApiLeads([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const leads = useMemo(() => apiLeads.map(mapApiLead), [apiLeads]);
  const active = leads.find((l) => l.id === activeId) ?? leads[0];

  return (
    <>
      <Topnav title="Lead Inbox" subtitle="Omni-channel — WhatsApp, Instagram, Telegram, Messenger, Email" />

      <main className="p-6 lg:p-8">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
            {/* List */}
            <div className="flex flex-col border-b border-border lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between border-b border-border p-3.5">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {filters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors duration-200",
                        filter === f ? "bg-primary text-white" : "text-text-secondary hover:bg-white/[0.05]"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="icon" className="shrink-0 ml-2">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="max-h-[640px] overflow-y-auto">
                {loading ? (
                  <>
                    <LeadRowSkeleton />
                    <LeadRowSkeleton />
                    <LeadRowSkeleton />
                  </>
                ) : leads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05]">
                      <InboxIcon className="h-5 w-5 text-text-muted" />
                    </div>
                    <p className="text-[13.5px] font-medium text-text-primary">No leads on this channel</p>
                    <p className="text-[12.5px] text-text-secondary">New conversations will show up here in real time.</p>
                  </div>
                ) : (
                  leads.map((lead) => (
                    <LeadRow key={lead.id} lead={lead} active={lead.id === active?.id} onClick={() => setActiveId(lead.id)} />
                  ))
                )}
              </div>
            </div>

            {/* Detail */}
            <div className="h-[640px]">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
                </div>
              ) : active ? (
                <LeadDetail key={active.id} lead={active} />
              ) : (
                <div className="flex h-full items-center justify-center text-[13px] text-text-muted">
                  Select a conversation to view details
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
