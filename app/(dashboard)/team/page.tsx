"use client";

import { useEffect, useState, useCallback } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberRow } from "@/components/team/member-row";
import { InviteModal } from "@/components/team/invite-modal";
import { mapApiMember, type ApiMember, type Member, type Role } from "@/components/team/data";
import { api, ApiError } from "@/lib/api-client";

const roleToBackend: Record<Role, "OWNER" | "ADMIN" | "EDITOR" | "VIEWER"> = {
  Owner: "OWNER",
  Admin: "ADMIN",
  Editor: "EDITOR",
  Viewer: "VIEWER",
};

export default function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);
  const activeCount = members.filter((m) => m.status === "Active").length;

  const loadMembers = useCallback(() => {
    setLoading(true);
    api
      .get<{ members: ApiMember[] }>("/team")
      .then((data) => setMembers(data.members.map(mapApiMember)))
      .catch((err) => setBanner(err instanceof ApiError ? err.message : "Couldn't load team members."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function handleRoleChange(memberId: string, role: Role) {
    const prev = members;
    setMembers((cur) => cur.map((m) => (m.id === memberId ? { ...m, role } : m)));
    try {
      await api.patch(`/team/${memberId}/role`, { role: roleToBackend[role] });
    } catch (err) {
      setMembers(prev); // roll back on failure
      setBanner(err instanceof ApiError ? err.message : "Couldn't update that member's role.");
    }
  }

  async function handleRemove(memberId: string) {
    const prev = members;
    setMembers((cur) => cur.filter((m) => m.id !== memberId));
    try {
      await api.delete(`/team/${memberId}`);
    } catch (err) {
      setMembers(prev); // roll back on failure
      setBanner(err instanceof ApiError ? err.message : "Couldn't remove that member.");
    }
  }

  return (
    <>
      <Topnav title="Team" subtitle={`${activeCount} active members · ${members.length} total seats`} />

      <main className="p-6 lg:p-8">
        {banner && (
          <div className="mb-4 rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
            {banner}
          </div>
        )}

        <div className="mb-4 flex items-center justify-end">
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" /> Invite teammate
          </Button>
        </div>

        <Card className="overflow-visible">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-10 text-[13px] text-text-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading team…
              </div>
            ) : members.length === 0 ? (
              <div className="p-10 text-center text-[13px] text-text-muted">No team members yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    <th className="px-5 py-3">Member</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Last active</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <MemberRow key={m.id} member={m} onRoleChange={handleRoleChange} onRemove={handleRemove} />
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>

      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onInvited={() => loadMembers()}
        />
      )}
    </>
  );
}
