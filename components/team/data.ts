export type Role = "Owner" | "Admin" | "Editor" | "Viewer";
export type MemberStatus = "Active" | "Pending" | "Suspended";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  lastActive: string;
  avatarColor: string;
}

// Shape returned by GET /team — a Prisma Membership row with its User relation included.
export interface ApiMember {
  id: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  invitedAt: string;
  joinedAt: string | null;
  lastActiveAt: string | null;
  user: { id: string; name: string; email: string; avatarUrl: string | null };
}

const roleFromBackend: Record<ApiMember["role"], Role> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

const statusFromBackend: Record<ApiMember["status"], MemberStatus> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SUSPENDED: "Suspended",
};

const AVATAR_COLORS = ["#C79A44", "#8B6F8E", "#6E82A6", "#4C7C79", "#C9793B", "#5B5B58"];

function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function relativeTime(iso: string | null): string {
  if (!iso) return "Never";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Active now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function mapApiMember(m: ApiMember): Member {
  return {
    id: m.id,
    name: m.user.name || m.user.email.split("@")[0],
    email: m.user.email,
    role: roleFromBackend[m.role],
    status: statusFromBackend[m.status],
    lastActive: m.status === "PENDING" ? `Invited ${relativeTime(m.invitedAt)}` : relativeTime(m.lastActiveAt),
    avatarColor: colorForId(m.id),
  };
}

export const roleDescriptions: Record<Role, string> = {
  Owner: "Full access, billing & workspace deletion",
  Admin: "Full access except billing",
  Editor: "Manage leads, workflows & content",
  Viewer: "Read-only access to dashboards",
};

export const statusVariant: Record<MemberStatus, "default" | "success" | "warning" | "danger"> = {
  Active: "success",
  Pending: "warning",
  Suspended: "danger",
};
