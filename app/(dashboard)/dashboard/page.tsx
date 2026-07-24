import { Inbox, MessageCircle, CalendarCheck, TrendingUp } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { StatCard } from "@/components/dashboard/stat-card";
import { LeadVolumeChart } from "@/components/dashboard/lead-volume-chart";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const channels = [
  { name: "WhatsApp", value: 312, pct: 38, color: "bg-success" },
  { name: "Instagram", value: 204, pct: 25, color: "bg-primary" },
  { name: "Email", value: 156, pct: 19, color: "bg-secondary" },
  { name: "Telegram", value: 98, pct: 12, color: "bg-warning" },
  { name: "Messenger", value: 48, pct: 6, color: "bg-text-muted" },
];

export default function DashboardPage() {
  return (
    <>
      <Topnav title="Dashboard" subtitle="Live telemetry across all channels" />

      <main className="space-y-6 p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="New Leads (30d)" value="818" delta={12.4} icon={Inbox} />
          <StatCard label="AI Reply Rate" value="94.2" suffix="%" delta={3.1} icon={MessageCircle} />
          <StatCard label="Meetings Booked" value="146" delta={8.7} icon={CalendarCheck} />
          <StatCard label="Avg. Intent Score" value="71" suffix="/100" delta={-2.3} icon={TrendingUp} />
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
              <LeadVolumeChart />
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
              {channels.map((c) => (
                <div key={c.name}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="font-medium text-text-primary">{c.name}</span>
                    <span className="text-text-secondary">{c.value}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
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
                <CardDescription>Real-time across your automations</CardDescription>
              </div>
              <Badge variant="success" dot>Live</Badge>
            </CardHeader>
            <CardContent>
              <ActivityTimeline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Queue</CardTitle>
              <CardDescription>Upcoming publishes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "3 signs your funnel is leaking", platform: "Instagram Reel", time: "Today, 5:00 PM", status: "Scheduled" },
                { title: "Client testimonial — Hamza Traders", platform: "Facebook", time: "Tomorrow, 9:00 AM", status: "Draft" },
                { title: "How AI qualifies leads in 30s", platform: "TikTok", time: "Fri, 2:00 PM", status: "Scheduled" },
              ].map((item, i) => (
                <div key={i} className="rounded-control border border-border p-3 transition-colors duration-200 hover:border-border-strong">
                  <p className="text-[13px] font-medium text-text-primary">{item.title}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[11.5px] text-text-muted">{item.platform} · {item.time}</span>
                    <Badge variant={item.status === "Scheduled" ? "primary" : "default"}>{item.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
