"use client";

import * as React from "react";
import { Plus, Copy, Trash2, Check, X, KeyRound, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { mapApiKey, type ApiKey, type ApiKeyRecord } from "./data";
import { api, ApiError } from "@/lib/api-client";

export function ApiKeysSection() {
  const [keys, setKeys] = React.useState<ApiKey[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [revokeId, setRevokeId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyScope, setNewKeyScope] = React.useState<"FULL" | "READ_ONLY">("READ_ONLY");
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // The raw secret is only ever available right after creation — the backend
  // never stores or returns it again, so we show it once and make the user copy it.
  const [revealedKey, setRevealedKey] = React.useState<string | null>(null);

  function loadKeys() {
    setLoading(true);
    api
      .get<{ apiKeys: ApiKeyRecord[] }>("/api-keys")
      .then((data) => setKeys(data.apiKeys.map(mapApiKey)))
      .catch(() => setKeys([]))
      .finally(() => setLoading(false));
  }

  React.useEffect(loadKeys, []);

  function handleCopy(id: string, text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleRevoke() {
    if (!revokeId) return;
    const id = revokeId;
    setRevokeId(null);
    const prev = keys;
    setKeys((cur) => cur.filter((k) => k.id !== id));
    try {
      await api.delete(`/api-keys/${id}`);
    } catch {
      setKeys(prev);
    }
  }

  async function handleGenerate() {
    const name = newKeyName.trim();
    if (!name || generating) return;
    setGenerating(true);
    setError(null);
    try {
      const created = await api.post<{ id: string; rawKey: string }>("/api-keys", { name, scope: newKeyScope });
      setRevealedKey(created.rawKey);
      setShowModal(false);
      setNewKeyName("");
      setNewKeyScope("READ_ONLY");
      loadKeys();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't generate the key.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      {revealedKey && (
        <div className="mb-4 rounded-control border border-warning/30 bg-warning-muted px-4 py-3.5">
          <p className="text-[13px] font-medium text-text-primary">Copy your new key now</p>
          <p className="mt-0.5 text-[12px] text-text-secondary">
            This is the only time it will be shown in full.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <code className="flex-1 truncate rounded-control bg-black/20 px-2.5 py-1.5 text-[12px] text-text-primary">
              {revealedKey}
            </code>
            <Button size="sm" variant="outline" onClick={() => handleCopy("revealed", revealedKey)}>
              {copiedId === "revealed" ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setRevealedKey(null)}>Done</Button>
          </div>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>API keys</CardTitle>
            <CardDescription>Used to authenticate requests to the Kinetic OS API</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-3.5 w-3.5" /> Generate new key
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading keys…
            </div>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05]">
                <KeyRound className="h-[18px] w-[18px] text-text-muted" />
              </div>
              <p className="text-[13px] font-medium text-text-primary">No API keys yet</p>
              <p className="text-[11.5px] text-text-muted">Generate one to start calling the Kinetic OS API.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-3 py-3">Key</th>
                  <th className="px-3 py-3">Scope</th>
                  <th className="px-3 py-3">Last used</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className="border-b border-border transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-text-primary">{k.name}</p>
                      <p className="text-[11.5px] text-text-muted">Created {k.created}</p>
                    </td>
                    <td className="px-3 py-3.5">
                      <code className="text-[12px] text-text-secondary">{k.keyPreview}</code>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={k.scope === "Full access" ? "primary" : "default"}>{k.scope}</Badge>
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{k.lastUsed}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setRevokeId(k.id)}
                          className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-danger-muted hover:text-danger"
                          aria-label="Revoke key"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-card border border-border bg-card shadow-elevated animate-slide-up">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-[14.5px] font-semibold text-text-primary">Generate new API key</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewKeyName("");
                  setNewKeyScope("READ_ONLY");
                }}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
              {error && (
                <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Key name</Label>
                <Input
                  placeholder="e.g. Production backend"
                  autoFocus
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Scope</Label>
                <div className="space-y-2">
                  {([
                    { value: "FULL" as const, label: "Full access", desc: "Read and write access to all resources" },
                    { value: "READ_ONLY" as const, label: "Read only", desc: "Can only read data, no write access" },
                  ]).map((s) => (
                    <label key={s.value} className="flex cursor-pointer items-start gap-2.5 rounded-control border border-border p-3 transition-colors duration-200 hover:border-border-strong">
                      <input
                        type="radio"
                        name="scope"
                        checked={newKeyScope === s.value}
                        onChange={() => setNewKeyScope(s.value)}
                        className="mt-0.5 accent-primary"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">{s.label}</p>
                        <p className="text-[11.5px] text-text-secondary">{s.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowModal(false);
                  setNewKeyName("");
                  setNewKeyScope("READ_ONLY");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleGenerate} disabled={!newKeyName.trim()} loading={generating}>
                Generate key
              </Button>
            </div>
          </div>
        </div>
      )}

      {revokeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-card border border-border bg-card shadow-elevated animate-slide-up">
            <div className="px-5 py-4">
              <h3 className="text-[14.5px] font-semibold text-text-primary">Revoke this API key?</h3>
              <p className="mt-1.5 text-[12.5px] text-text-secondary">
                Any application using this key will immediately lose access. This can&apos;t be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <Button variant="ghost" size="sm" onClick={() => setRevokeId(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleRevoke}>Revoke key</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
