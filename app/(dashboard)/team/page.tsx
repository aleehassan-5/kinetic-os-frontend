"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberRow } from "@/components/team/member-row";
import { InviteModal } from "@/components/team/invite-modal";
import { members as initialMembers, type Member, type Role } from "@/components/team/data";

export default function TeamPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const activeCount = members.filter((m) => m.status === "Active").length;

  function handleInvited({ email, role }: { email: string; role: Role }) {
    const pendingColors = ["#C79A44", "#8B6F8E", "#6E82A6", "#4C7C79", "#C9793B"];
    const newMember: Member = {
      id: `pending-${Date.now()}`,
      name: email.split("@")[0],
      email,
      role,
      status: "Pending",
      lastActive: "Invited just now",
      avatarColor: pendingColors[members.length % pendingColors.length],
    };
    setMembers((prev) => [...prev, newMember]);
  }

  return (
    <>
      <Topnav title="Team" subtitle={`${activeCount} active members · ${members.length} total seats`} />

      <main className="p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-end">
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" /> Invite teammate
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
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
                  <MemberRow key={m.id} member={m} />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} onInvited={handleInvited} />}
    </>
  );
}
