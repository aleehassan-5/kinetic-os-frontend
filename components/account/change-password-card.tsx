"use client";

import * as React from "react";
import { KeyRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, ApiError, setTokens } from "@/lib/api-client";

interface ChangePasswordResult {
  success: true;
  accessToken?: string;
  refreshToken?: string;
}

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setSaved(false);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      const result = await api.post<ChangePasswordResult>("/auth/change-password", { currentPassword, newPassword });
      // The backend revokes every other session and hands this one a fresh
      // token pair so changing your own password doesn't also log you out.
      if (result.accessToken && result.refreshToken) {
        setTokens(result.accessToken, result.refreshToken);
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't change your password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change the password you use to sign in</CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Current password</Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm new password</Label>
              <Input
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          {saved && <span className="text-[12px] font-medium text-success">Password changed</span>}
          <Button type="submit" size="sm" loading={saving} disabled={!currentPassword || !newPassword || !confirmPassword}>
            <KeyRound className="h-3.5 w-3.5" /> {saving ? "Changing…" : "Change password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
