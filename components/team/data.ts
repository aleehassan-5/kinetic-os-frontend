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

export const members: Member[] = [
  { id: "u1", name: "Are Khan", email: "are@orbitai.com", role: "Owner", status: "Active", lastActive: "Active now", avatarColor: "from-primary to-secondary" },
  { id: "u2", name: "Zainab Malik", email: "zainab@orbitai.com", role: "Admin", status: "Active", lastActive: "12m ago", avatarColor: "from-purple-500 to-fuchsia-500" },
  { id: "u3", name: "Bilal Ahmed", email: "bilal@orbitai.com", role: "Editor", status: "Active", lastActive: "1h ago", avatarColor: "from-blue-500 to-indigo-500" },
  { id: "u4", name: "Noor Fatima", email: "noor@orbitai.com", role: "Editor", status: "Active", lastActive: "3h ago", avatarColor: "from-emerald-500 to-teal-500" },
  { id: "u5", name: "Hassan Raza", email: "hassan@orbitai.com", role: "Viewer", status: "Pending", lastActive: "Invited 2d ago", avatarColor: "from-amber-500 to-orange-500" },
  { id: "u6", name: "Ayesha Siddiqui", email: "ayesha@orbitai.com", role: "Editor", status: "Suspended", lastActive: "Suspended", avatarColor: "from-slate-500 to-slate-600" },
];

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
