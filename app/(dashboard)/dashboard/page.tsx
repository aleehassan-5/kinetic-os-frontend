"use client";

import { useEffect, useState } from "react";
import { Inbox, Clock, CalendarCheck, TrendingUp, Users, Banknote } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { LeadVolumeChart, type LeadVolumePoint } from "@/components/dashboard/lead-volume-chart";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { OpsCheckin } from "@/components/dashboard/ops-checkin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { mapApiPost, type ApiPost, type ScheduledPost } from "@/components/scheduler/data";

interface DashboardSummary {
  customersAddedThisWeek: { value: number; deltaPct: number | null };
  expectedRevenueThisWeek: { valueCents: number; deltaPct: number | null; customersWithValueSet: number };
  newLeads: { value: number; deltaPct: number | null };
  aiReplyRate: { value: number; deltaPct: number | null };
  hoursReclaimed: { value: number; deltaPct: number | null };
  meetingsBooked: { value: number; deltaPct: number | null };
  avgIntentScore: { value: number; deltaPct: number | null };
  channelBreakdown: { channel: string; count: number; pct: number }[];
  leadVolume7d: { date: string; leads: number; replies: number }[];
}

const CHANNEL_LABEL: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  EMAIL: "Email",
  TELEGRAM: "Telegram",
  MESSENGER: "Messenger",
};

const CHANNEL_COLOR: Record<string, string> = {
  WHATSAPP: "bg-success",
  INSTAGRAM: "bg-primary",
  EMAIL: "bg-secondary",
  TELEGRAM: "bg-warning",
  MESSENGER: "bg-text-muted",
};

const DAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    cents / 100
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [queue, setQueue] = useState<ScheduledPost[] | null>(null);

  useEffect(() => {
    setLoading(true);
    setFailed(false);
    api
      .get<DashboardSummary>("/dashboard/summary")
      .then((data) => setSummary(data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api
      .get<{ posts: ApiPost[] }>("/social/posts?status=SCHEDULED")
      .then((data) => setQueue(data.posts.slice(0, 3).map(mapApiPost)))
      .catch(() => setQueue([]));
  }, []);

  const chartData: LeadVolumePoint[] | undefined = summary?.leadVolume7d.map((d: DashboardSummary["leadVolume7d"][number]) => ({
    day: DAY_LABEL[new Date(d.date).getDay()],
    leads: d.leads,
    replies: d.replies,
  }));

  return (
    <>
      <Topnav title="Dashboard" subtitle="What changed in your business this month" />

      <main className="space-y-6 p-6 lg:p-8">
        <OpsCheckin />

        {failed && (
          <div className="rounded-control border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] text-danger">
            Couldn't load dashboard metrics from the backend. Showing nothing rather than made-up numbers —
            check that the API is reachable and try refreshing.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Customers Added This Week"
                value={String(summary?.customersAddedThisWeek.value ?? 0)}
                delta={summary?.customersAddedThisWeek.deltaPct ?? null}
                icon={Users}
              />
              <StatCard
                label="Expected Revenue This Week"
                value={formatCurrency(summary?.expectedRevenueThisWeek.valueCents ?? 0)}
                delta={summary?.expectedRevenueThisWeek.deltaPct ?? null}
                icon={Banknote}
              />
              <StatCard
                label="Hours Reclaimed (30d)"
                value={String(summary?.hoursReclaimed.value ?? 0)}
                suffix=" hrs"
                delta={summary?.hoursReclaimed.deltaPct ?? null}
                icon={Clock}
              />
            </>
          )}
        </div>

        {!loading &&
          summary &&
          summary.customersAddedThisWeek.value > 0 &&
          summary.expectedRevenueThisWeek.customersWithValueSet < summary.customersAddedThisWeek.value && (
            <p className="text-[12px] text-text-muted">
              {summary.customersAddedThisWeek.value - summary.expectedRevenueThisWeek.customersWithValueSet} of this
              week&apos;s new customers don&apos;t have a deal value set yet — expected revenue above is a partial
              total. Set it from a lead&apos;s detail panel.
            </p>
          )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="New Inquiries (30d)"
                value={String(summary?.newLeads.value ?? 0)}
                delta={summary?.newLeads.deltaPct ?? null}
                icon={Inbox}
              />
              <StatCard
                label="AI Reply Rate"
                value={String(summary?.aiReplyRate.value ?? 0)}
                suffix="%"
                delta={summary?.aiReplyRate.deltaPct ?? null}
                icon={TrendingUp}
              />
              <StatCard
                label="Meetings Booked"
                value={String(summary?.meetingsBooked.value ?? 0)}
                delta={summary?.meetingsBooked.deltaPct ?? null}
                icon={CalendarCheck}
              />
              <StatCard
                label="Buying Intent (avg)"
                value={String(summary?.avgIntentScore.value ?? 0)}
                suffix="/100"
                delta={summary?.avgIntentScore.deltaPct ?? null}
                icon={TrendingUp}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Lead Volume &amp; AI Response</CardTitle>
                <CardDescription>Captured vs. replied, last 7 days</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Leads</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Replies</span>
              </div>
            </CardHeader>
            <CardContent>
              <LeadVolumeChart data={chartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Channel Breakdown</CardTitle>
                <CardDescription>Where leads are coming from</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!loading && (summary?.channelBreakdown.length ?? 0) === 0 && (
                <p className="text-[12.5px] text-text-muted">No leads captured in the last 30 days yet.</p>
              )}
              {(summary?.channelBreakdown ?? []).map((c: DashboardSummary["channelBreakdown"][number]) => (
                <div key={c.channel}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-text-primary">{CHANNEL_LABEL[c.channel] ?? c.channel}</span>
                    <span className="text-text-secondary">{c.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className={`h-full rounded-full ${CHANNEL_COLOR[c.channel] ?? "bg-text-muted"}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest events across your workspace</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityTimeline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Queue</CardTitle>
              <CardDescription>Upcoming scheduled posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {queue === null ? (
                <p className="text-[12.5px] text-text-muted">Loading…</p>
              ) : queue.length === 0 ? (
                <p className="text-[12.5px] text-text-muted">Nothing scheduled yet.</p>
              ) : (
                queue.map((post) => (
                  <div key={post.id} className="rounded-control border border-border p-3 transition-colors duration-200 hover:border-border-strong">
                    <p className="text-[13px] font-medium text-text-primary">{post.title}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11.5px] text-text-muted">{post.platform} · {post.date}, {post.time}</span>
                      <Badge variant="primary">{post.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
