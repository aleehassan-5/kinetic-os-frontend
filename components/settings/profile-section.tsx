"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api-client";

export function ProfileSection() {
  const { user, refetchMe } = useAuth();
  const [name, setName] = React.useState(user?.name ?? "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const initials = (user?.name ?? "").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !name.trim()) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await api.patch("/auth/me", { name: name.trim() });
      await refetchMe();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information visible to your team</CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-5">
          {error && (
            <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[18px] font-semibold text-white">
                {initials}
              </div>
              <button
                type="button"
                title="Photo uploads aren't available yet"
                disabled
                className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-not-allowed items-center justify-center rounded-full border border-border bg-card text-text-muted opacity-60"
                aria-label="Change photo"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">{user?.name ?? "—"}</p>
              <p className="text-[11.5px] text-text-muted">JPG or PNG, max 2MB — photo uploads coming soon</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input type="email" value={user?.email ?? ""} disabled title="Contact support to change your email" />
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          {saved && <span className="text-[12px] font-medium text-success">Saved</span>}
          <Button type="submit" size="sm" loading={saving} disabled={!name.trim()}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
