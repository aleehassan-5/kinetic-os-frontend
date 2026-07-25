"use client";

import { useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { roleDescriptions, Role } from "./data";
import { api, ApiError } from "@/lib/api-client";

const roles: Role[] = ["Admin", "Editor", "Viewer"];

const roleToBackend: Record<Role, "ADMIN" | "EDITOR" | "VIEWER"> = {
  Owner: "ADMIN", // not selectable in this modal, kept for type completeness
  Admin: "ADMIN",
  Editor: "EDITOR",
  Viewer: "VIEWER",
};

export function InviteModal({
  onClose,
  onInvited,
}: {
  onClose: () => void;
  onInvited?: (input: { email: string; role: Role }) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Editor");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (sending || !email.trim()) return;
    setError(null);
    setSending(true);
    try {
      await api.post("/team/invite", { email: email.trim(), role: roleToBackend[role] });
      onInvited?.({ email: email.trim(), role });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't send the invite. Please try again.");
    } finally {
      setSending(false);
    }
  }

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
          {error && (
            <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Email address</Label>
            <Input
              type="email"
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <div className="space-y-2">
              {roles.map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-start gap-2.5 rounded-control border border-border p-3 transition-colors duration-200 hover:border-border-strong"
                >
                  <input
                    type="radio"
                    name="role"
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="mt-0.5 accent-primary"
                  />
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
          <Button variant="ghost" size="sm" onClick={onClose} disabled={sending}>Cancel</Button>
          <Button size="sm" onClick={handleSend} disabled={!email.trim() || sending}>
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {sending ? "Sending…" : "Send invite"}
          </Button>
        </div>
      </div>
    </div>
  );
}
