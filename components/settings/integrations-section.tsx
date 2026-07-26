"use client";

import * as React from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { integrations as staticIntegrations, integrationStatusMeta, type IntegrationStatus } from "./data";
import { api, ApiError } from "@/lib/api-client";

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

const otherCategories = ["Scheduling", "CRM"] as const;

export function IntegrationsSection() {
  const [connections, setConnections] = React.useState<ApiConnection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingChannel, setEditingChannel] = React.useState<ChannelId | null>(null);
  const [fields, setFields] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [disconnectingId, setDisconnectingId] = React.useState<ChannelId | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  function refresh() {
    setLoading(true);
    api
      .get<{ connections: ApiConnection[] }>("/channel-connections")
      .then((data) => setConnections(data.connections))
      .catch(() => setConnections([]))
      .finally(() => setLoading(false));
  }

  React.useEffect(refresh, []);

  function openConnect(channel: ChannelId) {
    setEditingChannel(channel);
    setFields({});
    setFormError(null);
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

  async function save() {
    if (!editingChannel) return;
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
            {staticIntegrations
              .filter((i) => i.category === category)
              .map((integration) => {
                const meta = integrationStatusMeta[integration.status];
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
                      <p className="truncate text-[11.5px] text-text-muted">{integration.detail}</p>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      ))}

      <Modal
        open={!!editingChannel}
        onClose={() => !saving && setEditingChannel(null)}
        title={`Connect ${editingChannel ? channelMeta[editingChannel].name : ""}`}
        description="Paste in the credentials from your own business account below."
      >
        <div className="space-y-3">
          {editingChannel === "WHATSAPP" && (
            <>
              <Field label="Phone Number ID" value={fields.phoneNumberId} onChange={(v) => setFields((f) => ({ ...f, phoneNumberId: v }))} placeholder="109876543210987" />
              <Field label="Access Token" value={fields.accessToken} onChange={(v) => setFields((f) => ({ ...f, accessToken: v }))} placeholder="EAAG..." type="password" />
            </>
          )}
          {editingChannel === "TELEGRAM" && (
            <Field label="Bot Token (from @BotFather)" value={fields.botToken} onChange={(v) => setFields((f) => ({ ...f, botToken: v }))} placeholder="123456:ABC-DEF..." type="password" />
          )}
          {(editingChannel === "INSTAGRAM" || editingChannel === "MESSENGER") && (
            <>
              <Field label="Page ID" value={fields.pageId} onChange={(v) => setFields((f) => ({ ...f, pageId: v }))} placeholder="102938475610293" />
              <Field label="Page Access Token" value={fields.pageAccessToken} onChange={(v) => setFields((f) => ({ ...f, pageAccessToken: v }))} placeholder="EAAG..." type="password" />
            </>
          )}
          {editingChannel === "EMAIL" && (
            <Field label="From address" value={fields.fromAddress} onChange={(v) => setFields((f) => ({ ...f, fromAddress: v }))} placeholder="hello@yourbusiness.com" />
          )}

          {formError && <p className="text-[12.5px] text-danger">{formError}</p>}
          <Button className="w-full" onClick={save} loading={saving}>
            Save connection
          </Button>
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
