"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IntegrationCard } from "@/components/calendar/integration-card";
import { MeetingList } from "@/components/calendar/meeting-list";
import { mapApiMeeting, type ApiMeeting, type Meeting, type MeetingStatus } from "@/components/calendar/data";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const filters: (MeetingStatus | "All")[] = ["All", "Confirmed", "Pending", "Cancelled", "Completed"];

export default function CalendarPage() {
  const [filter, setFilter] = useState<MeetingStatus | "All">("All");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ meetings: ApiMeeting[] }>("/meetings")
      .then((data) => setMeetings(data.meetings.map(mapApiMeeting)))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? meetings : meetings.filter((m) => m.status === filter);
  const confirmedCount = meetings.filter((m) => m.status === "Confirmed").length;

  return (
    <>
      <Topnav title="Calendar" subtitle="Meetings booked through your lead conversations" />

      <main className="space-y-6 p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {/* No real OAuth connect flow exists yet for Calendly/Google Calendar — showing
              "Not connected" honestly rather than a fake connected state. Meetings above
              are still real rows from the database (created via the API/webhooks), just
              not synced from a live third-party calendar yet. */}
          <IntegrationCard
            name="Calendly"
            account="Not connected"
            connected={false}
            syncedCount={meetings.filter((m) => m.source === "Calendly").length}
            colorFrom="#C79A44"
            colorTo="#4C7C79"
            manageUrl="https://calendly.com/app/"
          />
          <IntegrationCard
            name="Google Calendar"
            account="Not connected"
            connected={false}
            syncedCount={meetings.filter((m) => m.source === "Google Calendar").length}
            colorFrom="#8A8FBF"
            colorTo="#4C7C79"
            manageUrl="https://calendar.google.com/calendar/u/0/r"
          />
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>Upcoming &amp; recent meetings</CardTitle>
              <CardDescription>{confirmedCount} confirmed this week</CardDescription>
            </div>
          </CardHeader>
          <div className="flex items-center gap-1.5 border-b border-border px-3.5 py-2.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors duration-200",
                  filter === f ? "bg-primary text-background" : "text-text-secondary hover:bg-white/[0.05]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading meetings…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-text-muted">No meetings yet.</div>
          ) : (
            <MeetingList meetings={filtered} />
          )}
        </Card>
      </main>
    </>
  );
}
