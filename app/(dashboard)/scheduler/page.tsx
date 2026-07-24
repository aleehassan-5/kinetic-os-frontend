"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/scheduler/calendar-grid";
import { QueueList } from "@/components/scheduler/queue-list";
import { PostComposer } from "@/components/scheduler/post-composer";
import { ApiPost, mapApiPost, ScheduledPost } from "@/components/scheduler/data";
import { api } from "@/lib/api-client";

export default function SchedulerPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    api
      .get<{ posts: ApiPost[] }>("/social/posts")
      .then((data) => setPosts(data.posts.map(mapApiPost)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <Topnav title="Social Scheduler" subtitle="Static graphics & AI-voiceover reels, planned across channels" />

      <main className="p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="min-w-[140px] text-center text-[14px] font-semibold text-text-primary">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Button size="sm" onClick={() => setComposerOpen(true)}>
            <Plus className="h-4 w-4" /> New post
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-[13px] text-text-secondary">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading calendar…
              </div>
            ) : (
              <CalendarGrid selectedDay={selectedDay} onSelect={setSelectedDay} posts={posts} />
            )}
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <div>
                <CardTitle>{selectedDay ? `This month, day ${selectedDay}` : "All upcoming"}</CardTitle>
                <CardDescription>Queue for this day</CardDescription>
              </div>
              {selectedDay && (
                <button onClick={() => setSelectedDay(null)} className="text-[12px] font-medium text-primary hover:text-primary-hover">
                  View all
                </button>
              )}
            </CardHeader>
            <div className="max-h-[520px] overflow-y-auto">
              <QueueList day={selectedDay} posts={posts} />
            </div>
          </Card>
        </div>
      </main>

      {composerOpen && <PostComposer onClose={() => setComposerOpen(false)} onCreated={fetchPosts} />}
    </>
  );
}
