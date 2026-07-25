"use client";

import * as React from "react";
import { ChevronDown, MoreHorizontal, Loader2, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Member, Role, statusVariant } from "./data";

const assignableRoles: Role[] = ["Admin", "Editor", "Viewer"];

export function MemberRow({
  member,
  onRoleChange,
  onRemove,
}: {
  member: Member;
  onRoleChange?: (memberId: string, role: Role) => Promise<void> | void;
  onRemove?: (memberId: string) => Promise<void> | void;
}) {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const roleRef = React.useRef<HTMLDivElement>(null);
  const moreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleMenuOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function handlePickRole(role: Role) {
    setRoleMenuOpen(false);
    if (role === member.role) return;
    setBusy(true);
    try {
      await onRoleChange?.(member.id, role);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    setMoreMenuOpen(false);
    setBusy(true);
    try {
      await onRemove?.(member.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr className="border-b border-border transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-background"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-text-primary">{member.name}</p>
            <p className="truncate text-[11.5px] text-text-muted">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5">
        {member.role === "Owner" ? (
          <span className="text-[12.5px] font-medium text-text-secondary">Owner</span>
        ) : (
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setRoleMenuOpen((v) => !v)}
              disabled={busy}
              className="flex items-center gap-1 rounded-control border border-border px-2.5 py-1 text-[12.5px] font-medium text-text-primary transition-colors duration-200 hover:border-border-strong disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : member.role} <ChevronDown className="h-3 w-3 text-text-muted" />
            </button>
            {roleMenuOpen && (
              <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-36 overflow-hidden rounded-control border border-border bg-card shadow-elevated">
                {assignableRoles.map((r) => (
                  <button
                    key={r}
                    onClick={() => handlePickRole(r)}
                    className="block w-full px-3 py-2 text-left text-[12.5px] text-text-primary transition-colors duration-200 hover:bg-white/[0.05]"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-3 py-3.5">
        <Badge variant={statusVariant[member.status]} dot>{member.status}</Badge>
      </td>
      <td className="px-3 py-3.5 text-[12.5px] text-text-muted">{member.lastActive}</td>
      <td className="px-3 py-3.5">
        <div className="flex justify-end">
          {member.role !== "Owner" && (
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreMenuOpen((v) => !v)}
                disabled={busy}
                className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary disabled:opacity-50"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
              {moreMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-44 overflow-hidden rounded-control border border-border bg-card shadow-elevated">
                  <button
                    onClick={handleRemove}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] text-danger transition-colors duration-200 hover:bg-danger-muted"
                  >
                    <UserMinus className="h-3.5 w-3.5" /> Remove from workspace
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
