export type Platform = "Instagram" | "Facebook" | "TikTok" | "LinkedIn";
export type PostStatus = "Scheduled" | "Draft" | "Generating" | "Published" | "Failed";
export type ContentType = "Reel" | "Static Graphic" | "Carousel" | "Story";

export interface ScheduledPost {
  id: string;
  title: string;
  platform: Platform;
  type: ContentType;
  status: PostStatus;
  date: string;
  time: string;
  day: number;
  voiceover?: boolean;
}

export const posts: ScheduledPost[] = [
  { id: "p1", title: "3 signs your funnel is leaking", platform: "Instagram", type: "Reel", status: "Scheduled", date: "2026-07-24", time: "5:00 PM", day: 24, voiceover: true },
  { id: "p2", title: "Client testimonial — Hamza Traders", platform: "Facebook", type: "Static Graphic", status: "Draft", date: "2026-07-25", time: "9:00 AM", day: 25 },
  { id: "p3", title: "How AI qualifies leads in 30s", platform: "TikTok", type: "Reel", status: "Scheduled", date: "2026-07-26", time: "2:00 PM", day: 26, voiceover: true },
  { id: "p4", title: "Behind the scenes: automation setup", platform: "Instagram", type: "Story", status: "Generating", date: "2026-07-26", time: "6:30 PM", day: 26, voiceover: true },
  { id: "p5", title: "5 automation myths debunked", platform: "LinkedIn", type: "Carousel", status: "Scheduled", date: "2026-07-28", time: "11:00 AM", day: 28 },
  { id: "p6", title: "Weekly automation tip #12", platform: "Instagram", type: "Reel", status: "Published", date: "2026-07-21", time: "4:00 PM", day: 21, voiceover: true },
  { id: "p7", title: "Case study teaser", platform: "Facebook", type: "Static Graphic", status: "Failed", date: "2026-07-22", time: "10:00 AM", day: 22 },
];

export const platformStyle: Record<Platform, { bg: string; text: string }> = {
  Instagram: { bg: "bg-danger-muted", text: "text-danger" },
  Facebook: { bg: "bg-primary-muted", text: "text-primary" },
  TikTok: { bg: "bg-secondary-muted", text: "text-secondary" },
  LinkedIn: { bg: "bg-warning-muted", text: "text-warning" },
};

export const statusVariant: Record<PostStatus, "default" | "primary" | "success" | "warning" | "danger"> = {
  Scheduled: "primary",
  Draft: "default",
  Generating: "warning",
  Published: "success",
  Failed: "danger",
};

// ---- Real backend integration ------------------------------------------

/** Shape returned by GET /social/posts and POST /social/posts from the Orbit AI API. */
export interface ApiPost {
  id: string;
  platform: "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "LINKEDIN";
  contentType: "REEL" | "STATIC_GRAPHIC" | "CAROUSEL" | "STORY";
  status: "DRAFT" | "GENERATING" | "SCHEDULED" | "PUBLISHED" | "FAILED";
  title: string;
  caption: string | null;
  mediaUrl: string | null;
  voiceoverUrl: string | null;
  useVoiceover: boolean;
  scheduledAt: string | null;
  publishedAt: string | null;
  error: string | null;
  createdAt: string;
}

const platformMap: Record<ApiPost["platform"], Platform> = {
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  TIKTOK: "TikTok",
  LINKEDIN: "LinkedIn",
};

export const platformToApi: Record<Platform, ApiPost["platform"]> = {
  Instagram: "INSTAGRAM",
  Facebook: "FACEBOOK",
  TikTok: "TIKTOK",
  LinkedIn: "LINKEDIN",
};

const contentTypeMap: Record<ApiPost["contentType"], ContentType> = {
  REEL: "Reel",
  STATIC_GRAPHIC: "Static Graphic",
  CAROUSEL: "Carousel",
  STORY: "Story",
};

export const contentTypeToApi: Record<ContentType, ApiPost["contentType"]> = {
  Reel: "REEL",
  "Static Graphic": "STATIC_GRAPHIC",
  Carousel: "CAROUSEL",
  Story: "STORY",
};

const statusMap: Record<ApiPost["status"], PostStatus> = {
  DRAFT: "Draft",
  GENERATING: "Generating",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  FAILED: "Failed",
};

export function mapApiPost(post: ApiPost): ScheduledPost {
  const when = post.scheduledAt ?? post.publishedAt ?? post.createdAt;
  const date = new Date(when);
  return {
    id: post.id,
    title: post.title,
    platform: platformMap[post.platform],
    type: contentTypeMap[post.contentType],
    status: statusMap[post.status],
    date: date.toISOString().slice(0, 10),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    day: date.getDate(),
    voiceover: post.useVoiceover,
  };
}
