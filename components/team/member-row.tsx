import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Member, statusVariant } from "./data";

export function MemberRow({ member }: { member: Member }) {
  return (
    <tr className="border-b border-border transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white", member.avatarColor)}>
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
          <button className="flex items-center gap-1 rounded-control border border-border px-2.5 py-1 text-[12.5px] font-medium text-text-primary transition-colors duration-200 hover:border-border-strong">
            {member.role} <ChevronDown className="h-3 w-3 text-text-muted" />
          </button>
        )}
      </td>
      <td className="px-3 py-3.5">
        <Badge variant={statusVariant[member.status]} dot>{member.status}</Badge>
      </td>
      <td className="px-3 py-3.5 text-[12.5px] text-text-muted">{member.lastActive}</td>
      <td className="px-3 py-3.5">
        <div className="flex justify-end">
          <button className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
