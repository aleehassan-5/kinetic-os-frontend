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
  month: number; // 0-indexed
  year: number;
  voiceover?: boolean;
  error?: string | null;
}

// NOTE: mock data removed — the Scheduler page fetches real posts from /social/posts.

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

/** Shape returned by GET /social/posts and POST /social/posts from the Kinetic OS API. */
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
  // Build the date string from local parts (not toISOString, which is UTC) —
  // otherwise a post scheduled late at night can show as the wrong calendar
  // day for anyone in a timezone ahead of UTC (e.g. PKT, UTC+5).
  const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return {
    id: post.id,
    title: post.title,
    platform: platformMap[post.platform],
    type: contentTypeMap[post.contentType],
    status: statusMap[post.status],
    date: localDateStr,
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    voiceover: post.useVoiceover,
    error: post.error,
  };
}
