"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function WorkspaceSection() {
  const [saving, setSaving] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 900);
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
          <div className="space-y-1.5">
            <Label>Workspace name</Label>
            <Input defaultValue="Growth workspace" />
          </div>
          <div className="space-y-1.5">
            <Label>Workspace URL</Label>
            <Input defaultValue="orbitai.app/growth-workspace" disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Industry</Label>
            <select
              defaultValue="agency"
              className="flex h-10 w-full rounded-control border border-border bg-white/[0.03] px-3.5 text-[14px] text-text-primary transition-colors duration-200 hover:border-border-strong focus:border-primary focus:outline-none"
            >
              <option value="agency" className="bg-card">Marketing agency</option>
              <option value="ecommerce" className="bg-card">E-commerce</option>
              <option value="realestate" className="bg-card">Real estate</option>
              <option value="saas" className="bg-card">SaaS</option>
              <option value="other" className="bg-card">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <select
              defaultValue="pkt"
              className="flex h-10 w-full rounded-control border border-border bg-white/[0.03] px-3.5 text-[14px] text-text-primary transition-colors duration-200 hover:border-border-strong focus:border-primary focus:outline-none"
            >
              <option value="pkt" className="bg-card">(GMT+5:00) Pakistan Standard Time</option>
              <option value="gst" className="bg-card">(GMT+4:00) Gulf Standard Time</option>
              <option value="est" className="bg-card">(GMT-5:00) Eastern Time</option>
              <option value="gmt" className="bg-card">(GMT+0:00) London</option>
            </select>
          </div>
        </CardContent>
        <div className="flex items-center justify-end border-t border-border px-5 py-4">
          <Button type="submit" size="sm" loading={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
