"use client";

import { useState } from "react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IntegrationCard } from "@/components/calendar/integration-card";
import { MeetingList } from "@/components/calendar/meeting-list";
import { meetings, MeetingStatus } from "@/components/calendar/data";
import { cn } from "@/lib/utils";

const filters: (MeetingStatus | "All")[] = ["All", "Confirmed", "Pending", "Cancelled", "Completed"];

export default function CalendarPage() {
  const [filter, setFilter] = useState<MeetingStatus | "All">("All");
  const filtered = filter === "All" ? meetings : meetings.filter((m) => m.status === filter);

  const confirmedCount = meetings.filter((m) => m.status === "Confirmed").length;

  return (
    <>
      <Topnav title="Calendar" subtitle="Meetings synced from Calendly & Google Calendar" />

      <main className="space-y-6 p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <IntegrationCard
            name="Calendly"
            account="hello@orbitai.com"
            connected
            syncedCount={meetings.filter((m) => m.source === "Calendly").length}
            colorFrom="#C79A44"
            colorTo="#4C7C79"
            manageUrl="https://calendly.com/app/"
          />
          <IntegrationCard
            name="Google Calendar"
            account="hello@orbitai.com"
            connected
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
              <CardDescription>{confirmedCount} confirmed this week, auto-booked from lead conversations</CardDescription>
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
          <MeetingList meetings={filtered} />
        </Card>
      </main>
    </>
  );
}
