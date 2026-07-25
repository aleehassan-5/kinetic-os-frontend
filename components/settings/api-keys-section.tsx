"use client";

import * as React from "react";
import { Plus, Copy, Trash2, Check, X, KeyRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { apiKeys as initialKeys, type ApiKey } from "./data";

export function ApiKeysSection() {
  const [keys, setKeys] = React.useState<ApiKey[]>(initialKeys);
  const [showModal, setShowModal] = React.useState(false);
  const [revokeId, setRevokeId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyScope, setNewKeyScope] = React.useState<"Full access" | "Read only">("Read only");

  function handleCopy(id: string) {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function handleRevoke() {
    setKeys((prev) => prev.filter((k) => k.id !== revokeId));
    setRevokeId(null);
  }

  function randomSuffix() {
    return Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6);
  }

  function handleGenerate() {
    const name = newKeyName.trim();
    if (!name) return;
    const prefix = newKeyScope === "Full access" ? "sk_live_" : "sk_test_";
    const newKey: ApiKey = {
      id: `k${Date.now()}`,
      name,
      keyPreview: `${prefix}••••••••••••${randomSuffix()}`,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
      scope: newKeyScope,
    };
    setKeys((prev) => [newKey, ...prev]);
    setShowModal(false);
    setNewKeyName("");
    setNewKeyScope("Read only");
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>API keys</CardTitle>
            <CardDescription>Used to authenticate requests to the Orbit AI API</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-3.5 w-3.5" /> Generate new key
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05]">
                <KeyRound className="h-[18px] w-[18px] text-text-muted" />
              </div>
              <p className="text-[13px] font-medium text-text-primary">No API keys yet</p>
              <p className="text-[11.5px] text-text-muted">Generate one to start calling the Orbit AI API.</p>
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
                      <div className="flex items-center gap-2">
                        <code className="text-[12px] text-text-secondary">{k.keyPreview}</code>
                        <button
                          onClick={() => handleCopy(k.id)}
                          className="text-text-muted transition-colors duration-200 hover:text-text-primary"
                          aria-label="Copy key"
                        >
                          {copiedId === k.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
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
                  setNewKeyScope("Read only");
                }}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 px-5 py-4">
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
                  {(["Full access", "Read only"] as const).map((s) => (
                    <label key={s} className="flex cursor-pointer items-start gap-2.5 rounded-control border border-border p-3 transition-colors duration-200 hover:border-border-strong">
                      <input
                        type="radio"
                        name="scope"
                        checked={newKeyScope === s}
                        onChange={() => setNewKeyScope(s)}
                        className="mt-0.5 accent-primary"
                      />
                      <div>
                        <p className="text-[13px] font-medium text-text-primary">{s}</p>
                        <p className="text-[11.5px] text-text-secondary">
                          {s === "Full access" ? "Read and write access to all resources" : "Can only read data, no write access"}
                        </p>
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
                  setNewKeyScope("Read only");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleGenerate} disabled={!newKeyName.trim()}>
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
