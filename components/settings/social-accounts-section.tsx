"use client";

import * as React from "react";
import { Share2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { api, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type SocialPlatformId = "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "LINKEDIN";

interface SocialAccountRow {
  platform: SocialPlatformId;
  status: "CONNECTED" | "NOT_CONNECTED" | "ERROR";
  displayName: string | null;
  fallbackConfigured: boolean;
}

const meta: Record<SocialPlatformId, { name: string; logoInitial: string; logoClassName: string }> = {
  INSTAGRAM: { name: "Instagram", logoInitial: "I", logoClassName: "bg-secondary-muted text-secondary" },
  FACEBOOK: { name: "Facebook Page", logoInitial: "F", logoClassName: "bg-primary-muted text-primary" },
  TIKTOK: { name: "TikTok", logoInitial: "T", logoClassName: "bg-white/[0.08] text-text-primary" },
  LINKEDIN: { name: "LinkedIn Page", logoInitial: "L", logoClassName: "bg-primary-muted text-primary" },
};

const setupInstructions: Record<SocialPlatformId, React.ReactNode> = {
  INSTAGRAM: (
    <>
      Go to <strong>developers.facebook.com</strong> → My Apps → your app → Instagram Graph API → generate a{" "}
      <strong>Page Access Token</strong> for the Facebook Page linked to your Instagram Business account, then copy the
      Instagram Business Account ID from the Page&apos;s settings.
    </>
  ),
  FACEBOOK: (
    <>
      Go to <strong>developers.facebook.com</strong> → My Apps → your app → Messenger → Settings, generate a{" "}
      <strong>Page Access Token</strong> for the Page you want to publish to, and copy its Page ID.
    </>
  ),
  TIKTOK: (
    <>
      Go to <strong>developers.tiktok.com</strong> → Manage apps → your app → and complete the OAuth flow with the{" "}
      <code>video.publish</code> scope to get an access token.
    </>
  ),
  LINKEDIN: (
    <>
      Go to <strong>developer.linkedin.com</strong> → your app → Auth, and generate an access token with the{" "}
      <code>w_organization_social</code> scope. You&apos;ll also need your organization&apos;s URN (looks like{" "}
      <code>urn:li:organization:12345</code>), found in your Page&apos;s admin settings URL.
    </>
  ),
};

export function SocialAccountsSection() {
  const [accounts, setAccounts] = React.useState<SocialAccountRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<SocialPlatformId | null>(null);
  const [fields, setFields] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [disconnectingId, setDisconnectingId] = React.useState<SocialPlatformId | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ valid: boolean; detail: string } | null>(null);

  function refresh() {
    setLoading(true);
    api
      .get<{ accounts: SocialAccountRow[] }>("/social-accounts")
      .then((data) => setAccounts(data.accounts))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }

  React.useEffect(refresh, []);

  function openConnect(platform: SocialPlatformId) {
    setEditing(platform);
    setFields({});
    setFormError(null);
    setTestResult(null);
  }

  function updateField(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setTestResult(null);
  }

  function hasRequiredFields(platform: SocialPlatformId): boolean {
    switch (platform) {
      case "INSTAGRAM":
        return Boolean(fields.pageAccessToken && fields.igBusinessAccountId);
      case "FACEBOOK":
        return Boolean(fields.pageAccessToken && fields.pageId);
      case "TIKTOK":
        return Boolean(fields.accessToken);
      case "LINKEDIN":
        return Boolean(fields.accessToken && fields.organizationUrn);
    }
  }

  async function disconnect(platform: SocialPlatformId) {
    setDisconnectingId(platform);
    try {
      await api.delete(`/social-accounts/${platform}`);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't disconnect this account.");
    } finally {
      setDisconnectingId(null);
    }
  }

  async function runTest() {
    if (!editing || testing) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await api.post<{ valid: boolean; detail: string }>("/social-accounts/test", { platform: editing, ...fields });
      setTestResult(result);
    } catch (err) {
      setTestResult({ valid: false, detail: err instanceof ApiError ? err.message : "Couldn't run the test." });
    } finally {
      setTesting(false);
    }
  }

  async function save() {
    if (!editing || !testResult?.valid) return;
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/social-accounts", { platform: editing, ...fields });
      setEditing(null);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this — double-check the values.");
    } finally {
      setSaving(false);
    }
  }

  const platformIds: SocialPlatformId[] = ["INSTAGRAM", "FACEBOOK", "TIKTOK", "LINKEDIN"];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>Social Accounts</CardTitle>
          <CardDescription>Where the Social Scheduler publishes reels &amp; graphics — your own accounts</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center gap-2 py-6 text-[13px] text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading accounts…
          </div>
        ) : (
          platformIds.map((platform) => {
            const row = accounts.find((a) => a.platform === platform);
            const info = meta[platform];
            const isConnected = row?.status === "CONNECTED";
            const isDisconnecting = disconnectingId === platform;
            return (
              <div key={platform} className="flex items-center gap-3 rounded-control border border-border p-3.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-[13px] font-semibold ${info.logoClassName}`}>
                  {info.logoInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-medium text-text-primary">{info.name}</p>
                    {isConnected ? (
                      <Badge variant="success" dot className="shrink-0">Connected</Badge>
                    ) : row?.fallbackConfigured ? (
                      <Badge variant="default" dot className="shrink-0">Using deployment default</Badge>
                    ) : (
                      <Badge variant="default" dot className="shrink-0">Not connected</Badge>
                    )}
                  </div>
                  <p className="truncate text-[11.5px] text-text-muted">{row?.displayName ?? "Not connected"}</p>
                </div>
                {isConnected ? (
                  <Button variant="ghost" size="sm" loading={isDisconnecting} onClick={() => disconnect(platform)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => openConnect(platform)}>
                    <Share2 className="h-3.5 w-3.5" /> Connect
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>

      <Modal
        open={!!editing}
        onClose={() => !saving && setEditing(null)}
        title={`Connect ${editing ? meta[editing].name : ""}`}
        description="Fill in your credentials, then verify before saving"
      >
        {editing && (
          <div className="space-y-4">
            <div className="rounded-control border border-primary/20 bg-primary-muted px-3.5 py-3 text-[12.5px] leading-relaxed text-text-secondary">
              {setupInstructions[editing]}
            </div>

            <div className="space-y-3">
              {editing === "INSTAGRAM" && (
                <>
                  <Field label="Page Access Token" value={fields.pageAccessToken} onChange={(v) => updateField("pageAccessToken", v)} placeholder="EAAG..." type="password" />
                  <Field label="Instagram Business Account ID" value={fields.igBusinessAccountId} onChange={(v) => updateField("igBusinessAccountId", v)} placeholder="17841400..." />
                </>
              )}
              {editing === "FACEBOOK" && (
                <>
                  <Field label="Page Access Token" value={fields.pageAccessToken} onChange={(v) => updateField("pageAccessToken", v)} placeholder="EAAG..." type="password" />
                  <Field label="Page ID" value={fields.pageId} onChange={(v) => updateField("pageId", v)} placeholder="102938475610293" />
                </>
              )}
              {editing === "TIKTOK" && (
                <Field label="Access Token" value={fields.accessToken} onChange={(v) => updateField("accessToken", v)} placeholder="act.example..." type="password" />
              )}
              {editing === "LINKEDIN" && (
                <>
                  <Field label="Access Token" value={fields.accessToken} onChange={(v) => updateField("accessToken", v)} placeholder="AQV..." type="password" />
                  <Field label="Organization URN" value={fields.organizationUrn} onChange={(v) => updateField("organizationUrn", v)} placeholder="urn:li:organization:12345" />
                </>
              )}
            </div>

            <div className="rounded-control border border-border p-3.5">
              <p className="text-[12.5px] text-text-secondary">
                We&apos;ll make a real call to {meta[editing].name}&apos;s API with what you entered — this catches a typo&apos;d
                or expired value immediately instead of it silently failing later.
              </p>
              <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={runTest} loading={testing} disabled={!hasRequiredFields(editing)}>
                Test connection
              </Button>
            </div>

            {testResult && (
              <div
                className={cn(
                  "rounded-control border px-3.5 py-2.5 text-[12.5px]",
                  testResult.valid ? "border-success/30 bg-success-muted text-success" : "border-danger/30 bg-danger-muted text-danger"
                )}
              >
                {testResult.valid ? "✓ " : "✕ "}
                {testResult.detail}
              </div>
            )}

            {formError && <p className="text-[12.5px] text-danger">{formError}</p>}

            <Button className="w-full" onClick={save} loading={saving} disabled={!testResult?.valid}>
              Save &amp; connect
            </Button>
          </div>
        )}
      </Modal>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
