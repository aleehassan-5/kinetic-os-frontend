"use client";

import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { roleDescriptions, Role } from "./data";

const roles: Role[] = ["Admin", "Editor", "Viewer"];

export function InviteModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-card border border-border bg-card shadow-elevated animate-slide-up">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-[14.5px] font-semibold text-text-primary">Invite teammate</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <Input type="email" placeholder="teammate@company.com" />
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <div className="space-y-2">
              {roles.map((r, i) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-start gap-2.5 rounded-control border border-border p-3 transition-colors duration-200 hover:border-border-strong"
                >
                  <input type="radio" name="role" defaultChecked={i === 1} className="mt-0.5 accent-primary" />
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{r}</p>
                    <p className="text-[11.5px] text-text-secondary">{roleDescriptions[r]}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm"><Send className="h-3.5 w-3.5" /> Send invite</Button>
        </div>
      </div>
    </div>
  );
}
