"use client";

import * as React from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { api, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type AiProviderId = "OPENAI" | "ANTHROPIC" | "ELEVENLABS";

interface AiProviderRow {
  provider: AiProviderId;
  status: "CONNECTED" | "NOT_CONNECTED" | "ERROR";
  detail: string | null;
  fallbackConfigured: boolean;
}

const providerMeta: Record<AiProviderId, { name: string; usedFor: string; logoInitial: string; logoClassName: string }> = {
  OPENAI: {
    name: "OpenAI",
    usedFor: "AI Chat replies, knowledge base search, social captions & graphics",
    logoInitial: "O",
    logoClassName: "bg-white/[0.08] text-text-primary",
  },
  ANTHROPIC: {
    name: "Anthropic",
    usedFor: "Reserved for Claude-powered features",
    logoInitial: "A",
    logoClassName: "bg-secondary-muted text-secondary",
  },
  ELEVENLABS: {
    name: "ElevenLabs",
    usedFor: "Voiceovers for reel & story scripts",
    logoInitial: "E",
    logoClassName: "bg-primary-muted text-primary",
  },
};

const setupInstructions: Record<AiProviderId, React.ReactNode> = {
  OPENAI: (
    <>
      Go to <strong>platform.openai.com/api-keys</strong>, sign in, and click <strong>Create new secret key</strong>.
      Copy it immediately — OpenAI only shows it once. You&apos;ll also need a card on file at{" "}
      <strong>platform.openai.com/settings/organization/billing</strong> for the key to work.
    </>
  ),
  ANTHROPIC: (
    <>
      Go to <strong>console.anthropic.com/settings/keys</strong>, sign in, and click <strong>Create Key</strong>. Copy
      it immediately — it&apos;s only shown once.
    </>
  ),
  ELEVENLABS: (
    <>
      Go to <strong>elevenlabs.io</strong> → sign in → click your profile icon → <strong>API Keys</strong>, then{" "}
      <strong>Create API Key</strong>.
    </>
  ),
};

export function AiProvidersSection() {
  const [providers, setProviders] = React.useState<AiProviderRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<AiProviderId | null>(null);
  const [apiKey, setApiKey] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [disconnectingId, setDisconnectingId] = React.useState<AiProviderId | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ valid: boolean; detail: string } | null>(null);

  function refresh() {
    setLoading(true);
    api
      .get<{ providers: AiProviderRow[] }>("/ai-providers")
      .then((data) => setProviders(data.providers))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }

  React.useEffect(refresh, []);

  function openConnect(provider: AiProviderId) {
    setEditing(provider);
    setApiKey("");
    setFormError(null);
    setTestResult(null);
  }

  function updateKey(value: string) {
    setApiKey(value);
    setTestResult(null); // any edit invalidates the last test — must re-verify before saving
  }

  async function disconnect(provider: AiProviderId) {
    setDisconnectingId(provider);
    try {
      await api.delete(`/ai-providers/${provider}`);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't disconnect this provider.");
    } finally {
      setDisconnectingId(null);
    }
  }

  async function runTest() {
    if (!editing || testing || !apiKey) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await api.post<{ valid: boolean; detail: string }>("/ai-providers/test", {
        provider: editing,
        apiKey,
      });
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
      await api.post("/ai-providers", { provider: editing, apiKey });
      setEditing(null);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this key — double-check the value.");
    } finally {
      setSaving(false);
    }
  }

  const providerIds: AiProviderId[] = ["OPENAI", "ANTHROPIC", "ELEVENLABS"];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div>
          <CardTitle>AI Providers</CardTitle>
          <CardDescription>Bring your own API keys — used for chat, knowledge base search, and content generation</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center gap-2 py-6 text-[13px] text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading providers…
          </div>
        ) : (
          providerIds.map((id) => {
            const row = providers.find((p) => p.provider === id);
            const info = providerMeta[id];
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
                  <p className="truncate text-[11.5px] text-text-muted">{row?.detail ?? info.usedFor}</p>
                </div>
                {isConnected ? (
                  <Button variant="ghost" size="sm" loading={isDisconnecting} onClick={() => disconnect(id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => openConnect(id)}>
                    <KeyRound className="h-3.5 w-3.5" /> Connect
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
        title={`Connect ${editing ? providerMeta[editing].name : ""}`}
        description="Paste your key, then verify it before saving"
      >
        {editing && (
          <div className="space-y-4">
            <div className="rounded-control border border-primary/20 bg-primary-muted px-3.5 py-3 text-[12.5px] leading-relaxed text-text-secondary">
              {setupInstructions[editing]}
            </div>

            <div className="space-y-1.5">
              <Label>API key</Label>
              <Input
                type="password"
                placeholder={editing === "OPENAI" ? "sk-..." : editing === "ANTHROPIC" ? "sk-ant-..." : "xi-api-key..."}
                value={apiKey}
                onChange={(e) => updateKey(e.target.value)}
              />
            </div>

            <div className="rounded-control border border-border p-3.5">
              <p className="text-[12.5px] text-text-secondary">
                We&apos;ll make a real call to {providerMeta[editing].name}&apos;s API with this key — this catches a
                typo&apos;d or expired key immediately instead of it silently failing later.
              </p>
              <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={runTest} loading={testing} disabled={!apiKey}>
                Test key
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
