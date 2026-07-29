"use client";

import { useState } from "react";
import { X, Sparkles, Mic, Image as ImageIcon, Video, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { Platform, ContentType, platformToApi, contentTypeToApi } from "./data";

const platforms: Platform[] = ["Instagram", "Facebook", "TikTok", "LinkedIn"];
const types: { label: ContentType; icon: typeof Video }[] = [
  { label: "Reel", icon: Video },
  { label: "Static Graphic", icon: ImageIcon },
  { label: "Carousel", icon: Layers },
];

function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

export function PostComposer({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [contentType, setContentType] = useState<ContentType>("Reel");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [useVoiceover, setUseVoiceover] = useState(true);
  const [date, setDate] = useState(defaultDate());
  const [time, setTime] = useState("17:00");
  const [submitting, setSubmitting] = useState<"draft" | "generate" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isVideo = contentType === "Reel" || contentType === "Story";
  const linkedInVideoUnsupported = platform === "LinkedIn" && isVideo;

  async function submit(mode: "draft" | "generate_and_schedule") {
    if (!title.trim()) {
      setError("Give the post a title or hook first.");
      return;
    }
    if (linkedInVideoUnsupported) {
      setError("LinkedIn video posting isn't supported yet — pick Static Graphic, or choose a different platform.");
      return;
    }
    setError(null);
    setSubmitting(mode === "draft" ? "draft" : "generate");
    try {
      await api.post("/social/posts", {
        title,
        platform: platformToApi[platform],
        contentType: contentTypeToApi[contentType],
        prompt: prompt || undefined,
        useVoiceover: isVideo ? useVoiceover : false,
        scheduledAt: new Date(`${date}T${time}:00`).toISOString(),
        mode,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — try again.");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-card border border-border bg-card shadow-elevated animate-slide-up">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-[14.5px] font-semibold text-text-primary">New post</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
          <div className="space-y-1.5">
            <Label>Platform</Label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors duration-200",
                    p === platform ? "border-primary bg-primary-muted text-primary" : "border-border text-text-secondary hover:border-border-strong"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Content type</Label>
            <div className="grid grid-cols-3 gap-2">
              {types.map((t) => {
                const Icon = t.icon;
                const active = t.label === contentType;
                return (
                  <button
                    key={t.label}
                    onClick={() => setContentType(t.label)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-control border p-3 transition-colors duration-200",
                      active ? "border-primary bg-primary-muted" : "border-border hover:border-border-strong"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-text-secondary")} />
                    <span className="text-[11.5px] font-medium text-text-primary">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Title / hook</Label>
            <Input placeholder="e.g. 3 signs your funnel is leaking" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Script / caption prompt</Label>
            <textarea
              rows={3}
              placeholder="Describe what the reel should cover — Kinetic OS will draft the script, caption, and generate an AI voiceover."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full resize-none rounded-control border border-border bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {isVideo && (
            <label className="flex items-center gap-2 text-[12.5px] text-text-secondary">
              <input
                type="checkbox"
                checked={useVoiceover}
                onChange={(e) => setUseVoiceover(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-primary"
              />
              <Mic className="h-3.5 w-3.5" /> Generate AI voiceover automatically
            </label>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Publish date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          {linkedInVideoUnsupported && (
            <p className="rounded-control border border-warning/30 bg-warning-muted px-3 py-2 text-[12px] text-warning">
              LinkedIn doesn&apos;t support Reel/Story video posting yet — pick Static Graphic, or choose a different platform.
            </p>
          )}

          {error && <p className="text-[12.5px] text-danger">{error}</p>}
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={!!submitting}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => submit("draft")} disabled={!!submitting}>
              {submitting === "draft" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save as draft
            </Button>
            <Button size="sm" onClick={() => submit("generate_and_schedule")} disabled={!!submitting}>
              {submitting === "generate" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Generate &amp; schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
