"use client";

import * as React from "react";
import { Link2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { api, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type SchedulingCrmId = "CALENDLY" | "HUBSPOT" | "GOOGLE_CALENDAR" | "GOOGLE_SHEETS";

interface SchedulingCrmRow {
  type: SchedulingCrmId;
  status: "CONNECTED" | "NOT_CONNECTED" | "ERROR";
  detail: string | null;
  fallbackConfigured: boolean;
}

const meta: Record<SchedulingCrmId, { name: string; category: "Scheduling" | "CRM"; logoInitial: string; logoClassName: string }> = {
  CALENDLY: { name: "Calendly", category: "Scheduling", logoInitial: "C", logoClassName: "bg-secondary-muted text-secondary" },
  GOOGLE_CALENDAR: { name: "Google Calendar", category: "Scheduling", logoInitial: "G", logoClassName: "bg-primary-muted text-primary" },
  HUBSPOT: { name: "HubSpot", category: "CRM", logoInitial: "H", logoClassName: "bg-danger-muted text-danger" },
  GOOGLE_SHEETS: { name: "Google Sheets", category: "CRM", logoInitial: "S", logoClassName: "bg-success-muted text-success" },
};

const setupInstructions: Record<SchedulingCrmId, React.ReactNode> = {
  CALENDLY: (
    <>
      In Calendly, go to <strong>Integrations &amp; apps → API &amp; Webhooks → Personal access tokens</strong> and generate one.
      Then open the event type you want to use and copy its <strong>API URI</strong> (visible under Edit → Share via API, looks
      like <code>https://api.calendly.com/event_types/AAAA...</code>).
    </>
  ),
  HUBSPOT: (
    <>
      In HubSpot, go to <strong>Settings → Integrations → Private Apps → Create a private app</strong>, grant it{" "}
      <code>crm.objects.contacts.write</code> scope, then copy the generated access token.
    </>
  ),
  GOOGLE_CALENDAR: (
    <>
      In Google Cloud Console, create a <strong>Service Account</strong> (IAM &amp; Admin → Service Accounts), enable the{" "}
      <strong>Calendar API</strong>, then create &amp; download a JSON key. Share your calendar with the service account&apos;s
      email as an <strong>editor</strong>, then paste the full JSON file below along with the Calendar ID (found in Calendar
      settings → &quot;Integrate calendar&quot;).
    </>
  ),
  GOOGLE_SHEETS: (
    <>
      Same service account as Google Calendar works here too (or create a new one) — just enable the{" "}
      <strong>Sheets API</strong> as well. Share your spreadsheet with the service account&apos;s email as an{" "}
      <strong>editor</strong>, then paste the JSON key and the Spreadsheet ID (the long string in the sheet&apos;s URL).
    </>
  ),
};

export function SchedulingCrmSection() {
  const [items, setItems] = React.useState<SchedulingCrmRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<SchedulingCrmId | null>(null);
  const [fields, setFields] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [disconnectingId, setDisconnectingId] = React.useState<SchedulingCrmId | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ valid: boolean; detail: string } | null>(null);

  function refresh() {
    setLoading(true);
    api
      .get<{ items: SchedulingCrmRow[] }>("/scheduling-crm")
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }

  React.useEffect(refresh, []);

  function openConnect(id: SchedulingCrmId) {
    setEditing(id);
    setFields({});
    setFormError(null);
    setTestResult(null);
  }

  function updateField(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setTestResult(null);
  }

  function hasRequiredFields(id: SchedulingCrmId): boolean {
    switch (id) {
      case "CALENDLY":
        return Boolean(fields.accessToken && fields.eventTypeUri);
      case "HUBSPOT":
        return Boolean(fields.accessToken);
      case "GOOGLE_CALENDAR":
        return Boolean(fields.serviceAccountJson && fields.calendarId);
      case "GOOGLE_SHEETS":
        return Boolean(fields.serviceAccountJson && fields.spreadsheetId);
    }
  }

  async function disconnect(id: SchedulingCrmId) {
    setDisconnectingId(id);
    try {
      await api.delete(`/scheduling-crm/${id}`);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't disconnect this.");
    } finally {
      setDisconnectingId(null);
    }
  }

  async function runTest() {
    if (!editing || testing) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await api.post<{ valid: boolean; detail: string }>("/scheduling-crm/test", { type: editing, ...fields });
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
      await api.post("/scheduling-crm", { type: editing, ...fields });
      setEditing(null);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this — double-check the values.");
    } finally {
      setSaving(false);
    }
  }

  const categories: Array<{ label: "Scheduling" | "CRM"; description: string; ids: SchedulingCrmId[] }> = [
    { label: "Scheduling", description: "Meeting booking sources for your calendar — your own accounts", ids: ["CALENDLY", "GOOGLE_CALENDAR"] },
    { label: "CRM", description: "Where qualified leads get synced automatically — your own accounts", ids: ["HUBSPOT", "GOOGLE_SHEETS"] },
  ];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category.label} className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>{category.label}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {loading ? (
              <div className="col-span-2 flex items-center justify-center gap-2 py-6 text-[13px] text-text-secondary">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : (
              category.ids.map((id) => {
                const row = items.find((i) => i.type === id);
                const info = meta[id];
                const isConnected = row?.status === "CONNECTED";
                const isDisconnecting = disconnectingId === id;
                return (
                  <div key={id} className="flex items-center gap-3 rounded-control border border-border p-3.5">
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
                      <p className="truncate text-[11.5px] text-text-muted">{row?.detail ?? "Not connected"}</p>
                    </div>
                    {isConnected ? (
                      <Button variant="ghost" size="sm" loading={isDisconnecting} onClick={() => disconnect(id)}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => openConnect(id)}>
                        <Link2 className="h-3.5 w-3.5" /> Connect
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      ))}

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
              {editing === "CALENDLY" && (
                <>
                  <Field label="Personal Access Token" value={fields.accessToken} onChange={(v) => updateField("accessToken", v)} placeholder="eyJraWQ..." type="password" />
                  <Field label="Event Type API URI" value={fields.eventTypeUri} onChange={(v) => updateField("eventTypeUri", v)} placeholder="https://api.calendly.com/event_types/..." />
                </>
              )}
              {editing === "HUBSPOT" && (
                <Field label="Private App Access Token" value={fields.accessToken} onChange={(v) => updateField("accessToken", v)} placeholder="pat-na1-..." type="password" />
              )}
              {(editing === "GOOGLE_CALENDAR" || editing === "GOOGLE_SHEETS") && (
                <>
                  <div className="space-y-1.5">
                    <Label>Service account JSON key</Label>
                    <textarea
                      className="min-h-[100px] w-full rounded-control border border-border bg-surface px-3 py-2 font-mono text-[12px] text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                      placeholder='{"type": "service_account", "client_email": "...", "private_key": "..."}'
                      value={fields.serviceAccountJson ?? ""}
                      onChange={(e) => updateField("serviceAccountJson", e.target.value)}
                    />
                  </div>
                  {editing === "GOOGLE_CALENDAR" ? (
                    <Field label="Calendar ID" value={fields.calendarId} onChange={(v) => updateField("calendarId", v)} placeholder="you@yourbusiness.com" />
                  ) : (
                    <Field label="Spreadsheet ID" value={fields.spreadsheetId} onChange={(v) => updateField("spreadsheetId", v)} placeholder="1BxiMVs0XRA5nFMdKvBd..." />
                  )}
                </>
              )}
            </div>

            <div className="rounded-control border border-border p-3.5">
              <p className="text-[12.5px] text-text-secondary">
                We&apos;ll make a real call to {meta[editing].name}&apos;s API with what you entered — this catches a typo&apos;d
                value immediately instead of it silently failing later.
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
