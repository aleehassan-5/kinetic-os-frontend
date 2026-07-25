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
  { id: "u1", name: "Are Khan", email: "are@orbitai.com", role: "Owner", status: "Active", lastActive: "Active now", avatarColor: "#C79A44" },
  { id: "u2", name: "Zainab Malik", email: "zainab@orbitai.com", role: "Admin", status: "Active", lastActive: "12m ago", avatarColor: "#8B6F8E" },
  { id: "u3", name: "Bilal Ahmed", email: "bilal@orbitai.com", role: "Editor", status: "Active", lastActive: "1h ago", avatarColor: "#6E82A6" },
  { id: "u4", name: "Noor Fatima", email: "noor@orbitai.com", role: "Editor", status: "Active", lastActive: "3h ago", avatarColor: "#4C7C79" },
  { id: "u5", name: "Hassan Raza", email: "hassan@orbitai.com", role: "Viewer", status: "Pending", lastActive: "Invited 2d ago", avatarColor: "#C9793B" },
  { id: "u6", name: "Ayesha Siddiqui", email: "ayesha@orbitai.com", role: "Editor", status: "Suspended", lastActive: "Suspended", avatarColor: "#5B5B58" },
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
