"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api-client";

const industries = [
  { value: "agency", label: "Marketing agency" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "realestate", label: "Real estate" },
  { value: "saas", label: "SaaS" },
  { value: "other", label: "Other" },
];

const timezones = [
  { value: "Asia/Karachi", label: "(GMT+5:00) Pakistan Standard Time" },
  { value: "Asia/Dubai", label: "(GMT+4:00) Gulf Standard Time" },
  { value: "America/New_York", label: "(GMT-5:00) Eastern Time" },
  { value: "Europe/London", label: "(GMT+0:00) London" },
];

export function WorkspaceSection() {
  const { workspace, refetchMe } = useAuth();
  const [name, setName] = React.useState(workspace?.name ?? "");
  const [industry, setIndustry] = React.useState(workspace?.industry ?? "agency");
  const [timezone, setTimezone] = React.useState(workspace?.timezone ?? "Asia/Karachi");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setIndustry(workspace.industry ?? "agency");
      setTimezone(workspace.timezone ?? "Asia/Karachi");
    }
  }, [workspace]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !name.trim()) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await api.patch("/workspace", { name: name.trim(), industry, timezone });
      await refetchMe();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save workspace settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>General information about your organization</CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {error && (
            <div className="sm:col-span-2 rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Workspace name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Workspace URL</Label>
            <Input value={`orbitai.app/${workspace?.slug ?? ""}`} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Industry</Label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="flex h-10 w-full rounded-control border border-border bg-white/[0.03] px-3.5 text-[14px] text-text-primary transition-colors duration-200 hover:border-border-strong focus:border-primary focus:outline-none"
            >
              {industries.map((i) => (
                <option key={i.value} value={i.value} className="bg-card">{i.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="flex h-10 w-full rounded-control border border-border bg-white/[0.03] px-3.5 text-[14px] text-text-primary transition-colors duration-200 hover:border-border-strong focus:border-primary focus:outline-none"
            >
              {timezones.map((t) => (
                <option key={t.value} value={t.value} className="bg-card">{t.label}</option>
              ))}
            </select>
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
