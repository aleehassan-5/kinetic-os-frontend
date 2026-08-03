"use client";

import * as React from "react";
import { Camera, Loader2 } from "lucide-react";
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
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const initials = (user?.name ?? "").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

  async function handleAvatarFile(file: File | undefined) {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setAvatarError("Please choose a JPG or PNG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image must be under 2MB.");
      return;
    }
    setAvatarError(null);
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await api.post("/auth/me/avatar", form, { isFormData: true });
      await refetchMe();
    } catch (err) {
      setAvatarError(err instanceof ApiError ? err.message : "Couldn't upload that photo. Please try again.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

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
          {avatarError && (
            <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
              {avatarError}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- user-uploaded photo served from our own backend, not a static asset Next can optimize at build time
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[18px] font-semibold text-white">
                  {initials}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => handleAvatarFile(e.target.files?.[0])}
              />
              <button
                type="button"
                title="Change photo"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary disabled:cursor-wait disabled:opacity-60"
                aria-label="Change photo"
              >
                {uploadingAvatar ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
              </button>
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">{user?.name ?? "—"}</p>
              <p className="text-[11.5px] text-text-muted">JPG or PNG, max 2MB</p>
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
