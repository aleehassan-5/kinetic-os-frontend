"use client";

import * as React from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { integrationMeta, type ApiIntegration, type IntegrationStatus } from "./data";
import { api, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type ChannelId = "WHATSAPP" | "TELEGRAM" | "INSTAGRAM" | "MESSENGER" | "EMAIL";

interface ApiConnection {
  channel: ChannelId;
  status: "CONNECTED" | "NOT_CONNECTED" | "ERROR";
  detail: string | null;
}

const channelMeta: Record<ChannelId, { name: string; logoInitial: string; logoClassName: string }> = {
  WHATSAPP: { name: "WhatsApp Business", logoInitial: "W", logoClassName: "bg-success-muted text-success" },
  INSTAGRAM: { name: "Instagram DMs", logoInitial: "I", logoClassName: "bg-secondary-muted text-secondary" },
  TELEGRAM: { name: "Telegram", logoInitial: "T", logoClassName: "bg-white/[0.06] text-text-secondary" },
  MESSENGER: { name: "Messenger", logoInitial: "M", logoClassName: "bg-danger-muted text-danger" },
  EMAIL: { name: "Email (SMTP)", logoInitial: "E", logoClassName: "bg-primary-muted text-primary" },
};

const statusMap: Record<ApiConnection["status"], IntegrationStatus> = {
  CONNECTED: "connected",
  NOT_CONNECTED: "not_connected",
  ERROR: "error",
};

const integrationStatusMeta: Record<IntegrationStatus, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  connected: { label: "Connected", variant: "success" },
  not_connected: { label: "Not connected", variant: "default" },
  error: { label: "Action needed", variant: "danger" },
};

const otherCategories = ["Scheduling", "CRM"] as const;

const setupInstructions: Record<ChannelId, React.ReactNode> = {
  WHATSAPP: (
    <>
      Go to <strong>developers.facebook.com</strong> → My Apps → your app → WhatsApp → API Setup. You&apos;ll see a
      &quot;Phone number ID&quot; and a temporary access token right there — copy both below.
    </>
  ),
  TELEGRAM: (
    <>
      Open Telegram, search for <strong>@BotFather</strong>, send <code>/newbot</code>, and follow the prompts.
      BotFather will reply with a token that looks like <code>123456:ABC-DEF...</code> — paste it below.
    </>
  ),
  INSTAGRAM: (
    <>
      Go to <strong>developers.facebook.com</strong> → My Apps → your app → Messenger → Settings, connect your
      Instagram-linked Facebook Page, then copy the Page ID and generate a Page Access Token there.
    </>
  ),
  MESSENGER: (
    <>
      Go to <strong>developers.facebook.com</strong> → My Apps → your app → Messenger → Settings, connect your
      Facebook Page, then copy the Page ID and generate a Page Access Token there.
    </>
  ),
  EMAIL: (
    <>
      Email sends through one shared mail account this deployment is already configured with (set up by whoever
      manages the server) — this just confirms it&apos;s working and records the address replies should appear to
      come from.
    </>
  ),
};

function hasRequiredFields(channel: ChannelId, fields: Record<string, string>): boolean {
  switch (channel) {
    case "WHATSAPP":
      return Boolean(fields.phoneNumberId && fields.accessToken);
    case "TELEGRAM":
      return Boolean(fields.botToken);
    case "INSTAGRAM":
    case "MESSENGER":
      return Boolean(fields.pageId && fields.pageAccessToken);
    case "EMAIL":
      return Boolean(fields.fromAddress);
  }
}

export function IntegrationsSection() {
  const [connections, setConnections] = React.useState<ApiConnection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingChannel, setEditingChannel] = React.useState<ChannelId | null>(null);
  const [fields, setFields] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [disconnectingId, setDisconnectingId] = React.useState<ChannelId | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Guided setup: two explicit steps (fill in → test) instead of one blind
  // "paste and save" form. testResult is cleared whenever a field changes,
  // so a stale "Verified" can't linger after the user edits a value.
  const [wizardStep, setWizardStep] = React.useState<1 | 2>(1);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ valid: boolean; detail: string } | null>(null);

  // Scheduling/CRM providers (Calendly, Google Calendar, HubSpot, Google Sheets) — read-only
  // real status via GET /integrations. No connect UI for these yet since there's no OAuth
  // flow wired up on the backend, unlike the channels above.
  const [otherByType, setOtherByType] = React.useState<Record<string, ApiIntegration> | null>(null);

  function refresh() {
    setLoading(true);
    api
      .get<{ connections: ApiConnection[] }>("/channel-connections")
      .then((data) => setConnections(data.connections))
      .catch(() => setConnections([]))
      .finally(() => setLoading(false));
  }

  React.useEffect(refresh, []);

  React.useEffect(() => {
    api
      .get<{ integrations: ApiIntegration[] }>("/integrations")
      .then((data) => setOtherByType(Object.fromEntries(data.integrations.map((i) => [i.type, i]))))
      .catch(() => setOtherByType({}));
  }, []);

  function openConnect(channel: ChannelId) {
    setEditingChannel(channel);
    setFields({});
    setFormError(null);
    setWizardStep(1);
    setTestResult(null);
  }

  function updateField(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setTestResult(null); // any edit invalidates the last test — must re-verify before saving
  }

  async function disconnect(channel: ChannelId) {
    setDisconnectingId(channel);
    try {
      await api.delete(`/channel-connections/${channel}`);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't disconnect this channel.");
    } finally {
      setDisconnectingId(null);
    }
  }

  async function runTest() {
    if (!editingChannel || testing) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await api.post<{ valid: boolean; detail: string }>("/channel-connections/test", {
        channel: editingChannel,
        ...fields,
      });
      setTestResult(result);
    } catch (err) {
      setTestResult({ valid: false, detail: err instanceof ApiError ? err.message : "Couldn't run the test." });
    } finally {
      setTesting(false);
    }
  }

  async function save() {
    if (!editingChannel || !testResult?.valid) return;
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/channel-connections", { channel: editingChannel, ...fields });
      setEditingChannel(null);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this connection — double-check the values.");
    } finally {
      setSaving(false);
    }
  }

  const channelIds: ChannelId[] = ["WHATSAPP", "INSTAGRAM", "MESSENGER", "TELEGRAM", "EMAIL"];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Channels</CardTitle>
            <CardDescription>Where your AI listens and replies to leads — your own accounts, not a shared one</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center gap-2 py-6 text-[13px] text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading connections…
            </div>
          ) : (
            channelIds.map((channel) => {
              const connection = connections.find((c) => c.channel === channel);
              const status = statusMap[connection?.status ?? "NOT_CONNECTED"];
              const meta = integrationStatusMeta[status];
              const info = channelMeta[channel];
              const isDisconnecting = disconnectingId === channel;
              return (
                <div key={channel} className="flex items-center gap-3 rounded-control border border-border p-3.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-[13px] font-semibold ${info.logoClassName}`}>
                    {info.logoInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-text-primary">{info.name}</p>
                      <Badge variant={meta.variant} dot className="shrink-0">{meta.label}</Badge>
                    </div>
                    <p className="truncate text-[11.5px] text-text-muted">{connection?.detail ?? "Not connected"}</p>
                  </div>
                  {status === "connected" ? (
                    <Button variant="ghost" size="sm" loading={isDisconnecting} onClick={() => disconnect(channel)}>
                      Disconnect
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => openConnect(channel)}>
                      <RefreshCw className="h-3.5 w-3.5" /> Connect
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {otherCategories.map((category) => (
        <Card key={category} className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>{category}</CardTitle>
              <CardDescription>
                {category === "Scheduling" ? "Meeting booking sources for your calendar" : "Where qualified leads get synced automatically"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {otherByType === null ? (
              <div className="col-span-2 flex items-center justify-center gap-2 py-6 text-[13px] text-text-secondary">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : (
              integrationMeta
                .filter((i) => i.category === category)
                .map((integration) => {
                  const record = otherByType[integration.id];
                  const status: IntegrationStatus = record
                    ? record.status === "CONNECTED"
                      ? "connected"
                      : record.status === "ERROR"
                        ? "error"
                        : "not_connected"
                    : "not_connected";
                  const meta = integrationStatusMeta[status];
                  return (
                    <div key={integration.id} className="flex items-center gap-3 rounded-control border border-border p-3.5">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-control text-[13px] font-semibold ${integration.logoClassName}`}>
                        {integration.logoInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[13px] font-medium text-text-primary">{integration.name}</p>
                          <Badge variant={meta.variant} dot className="shrink-0">{meta.label}</Badge>
                        </div>
                        <p className="truncate text-[11.5px] text-text-muted">{record?.detail ?? "Not connected"}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-text-muted">Setup via API</span>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>
      ))}

      <Modal
        open={!!editingChannel}
        onClose={() => !saving && setEditingChannel(null)}
        title={`Connect ${editingChannel ? channelMeta[editingChannel].name : ""}`}
        description={wizardStep === 1 ? "Step 1 of 2 — where to find your credentials" : "Step 2 of 2 — verify, then connect"}
      >
        <div className="space-y-4">
          {wizardStep === 1 && editingChannel && (
            <>
              <div className="rounded-control border border-primary/20 bg-primary-muted px-3.5 py-3 text-[12.5px] leading-relaxed text-text-secondary">
                {setupInstructions[editingChannel]}
              </div>

              <div className="space-y-3">
                {editingChannel === "WHATSAPP" && (
                  <>
                    <Field label="Phone Number ID" value={fields.phoneNumberId} onChange={(v) => updateField("phoneNumberId", v)} placeholder="109876543210987" />
                    <Field label="Access Token" value={fields.accessToken} onChange={(v) => updateField("accessToken", v)} placeholder="EAAG..." type="password" />
                  </>
                )}
                {editingChannel === "TELEGRAM" && (
                  <Field label="Bot Token (from @BotFather)" value={fields.botToken} onChange={(v) => updateField("botToken", v)} placeholder="123456:ABC-DEF..." type="password" />
                )}
                {(editingChannel === "INSTAGRAM" || editingChannel === "MESSENGER") && (
                  <>
                    <Field label="Page ID" value={fields.pageId} onChange={(v) => updateField("pageId", v)} placeholder="102938475610293" />
                    <Field label="Page Access Token" value={fields.pageAccessToken} onChange={(v) => updateField("pageAccessToken", v)} placeholder="EAAG..." type="password" />
                  </>
                )}
                {editingChannel === "EMAIL" && (
                  <Field label="From address" value={fields.fromAddress} onChange={(v) => updateField("fromAddress", v)} placeholder="hello@yourbusiness.com" />
                )}
              </div>

              <Button className="w-full" onClick={() => setWizardStep(2)} disabled={!hasRequiredFields(editingChannel, fields)}>
                Next: Verify connection
              </Button>
            </>
          )}

          {wizardStep === 2 && (
            <>
              <div className="rounded-control border border-border p-3.5">
                <p className="text-[12.5px] text-text-secondary">
                  We&apos;ll make a real call to {editingChannel === "TELEGRAM" ? "Telegram" : "Meta"}&apos;s API with what you entered — this catches a typo&apos;d token immediately instead of it silently failing later.
                </p>
                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={runTest} loading={testing}>
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

              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setWizardStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" onClick={save} loading={saving} disabled={!testResult?.valid}>
                  Save &amp; connect
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
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
