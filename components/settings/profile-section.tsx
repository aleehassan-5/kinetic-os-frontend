"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileSection() {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 900);
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[18px] font-semibold text-white">
                AR
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-text-secondary transition-colors duration-200 hover:text-text-primary"
                aria-label="Change photo"
              >
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">Are Khan</p>
              <p className="text-[11.5px] text-text-muted">JPG or PNG, max 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input defaultValue="Are Khan" />
            </div>
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input type="email" defaultValue="are.khan@orbitai.agency" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input defaultValue="Founder" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone number</Label>
              <Input defaultValue="+92 300 1234567" />
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          {saved && <span className="text-[12px] font-medium text-success">Saved</span>}
          <Button type="submit" size="sm" loading={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
