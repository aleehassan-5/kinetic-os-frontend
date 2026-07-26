"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api-client";
import { Platform, platformStyle, platformToApi } from "./data";

interface ApiAccount {
  id: string;
  platform: "INSTAGRAM" | "FACEBOOK" | "TIKTOK" | "LINKEDIN";
  status: "CONNECTED" | "DISCONNECTED";
  externalId: string;
  displayName: string | null;
  autoReplyComments: boolean;
}

const platforms: Platform[] = ["Instagram", "Facebook", "TikTok", "LinkedIn"];

const idHint: Record<Platform, string> = {
  Instagram: "Instagram Business Account ID (from Meta Business Suite)",
  Facebook: "Facebook Page ID",
  TikTok: "TikTok Business account/user ID",
  LinkedIn: "LinkedIn Organization URN, e.g. urn:li:organization:12345",
};

export function ConnectedAccounts() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<ApiAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [externalId, setExternalId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [autoReply, setAutoReply] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    api
      .get<{ accounts: ApiAccount[] }>("/social/accounts")
      .then((data) => setAccounts(data.accounts))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  const connectedCount = accounts.filter((a) => a.status === "CONNECTED").length;

  function openEditor(p: Platform) {
    const existing = accounts.find((a) => a.platform === platformToApi[p]);
    setEditingPlatform(p);
    setExternalId(existing?.externalId ?? "");
    setDisplayName(existing?.displayName ?? "");
    setAutoReply(existing?.autoReplyComments ?? false);
    setFormError(null);
  }

  async function save() {
    if (!editingPlatform) return;
    if (!externalId.trim()) {
      setFormError("Paste the account/page ID first.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await api.post("/social/accounts", {
        platform: platformToApi[editingPlatform],
        externalId: externalId.trim(),
        displayName: displayName.trim() || undefined,
        autoReplyComments: autoReply,
      });
      setEditingPlatform(null);
      refresh();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-4 rounded-card border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Plug className="h-4 w-4 text-text-secondary" />
          <span className="text-[13px] font-medium text-text-primary">Connected accounts</span>
          <span className="text-[12px] text-text-muted">
            {loading ? "…" : `${connectedCount}/${platforms.length} connected`}
          </span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-2 border-t border-border p-3 sm:grid-cols-2 xl:grid-cols-4">
          {platforms.map((p) => {
            const account = accounts.find((a) => a.platform === platformToApi[p]);
            const connected = account?.status === "CONNECTED";
            const s = platformStyle[p];
            return (
              <button
                key={p}
                onClick={() => openEditor(p)}
                className="flex items-center justify-between rounded-control border border-border p-3 text-left transition-colors duration-200 hover:border-border-strong"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("rounded px-1.5 py-[1px] text-[11px] font-medium", s.bg, s.text)}>{p}</span>
                    {connected && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                  </div>
                  <p className="mt-1 truncate text-[11.5px] text-text-secondary">
                    {connected ? account?.displayName || account?.externalId : "Not connected"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editingPlatform}
        onClose={() => !saving && setEditingPlatform(null)}
        title={`Connect ${editingPlatform ?? ""}`}
        description={editingPlatform ? idHint[editingPlatform] : undefined}
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Account / Page ID</Label>
            <Input placeholder="17841400000000000" value={externalId} onChange={(e) => setExternalId(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Display name (optional)</Label>
            <Input placeholder="Orbit AI" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-[12.5px] text-text-secondary">
            <input
              type="checkbox"
              checked={autoReply}
              onChange={(e) => setAutoReply(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            Auto-reply to comments with the AI assistant
          </label>
          {formError && <p className="text-[12.5px] text-danger">{formError}</p>}
          <Button className="w-full" onClick={save} loading={saving}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null} Save connection
          </Button>
          <p className="text-[11px] leading-relaxed text-text-muted">
            The platform access token itself (Meta/TikTok/LinkedIn API credentials) is configured once on the
            backend — this just tells Orbit AI which of your already-authorized accounts to publish to.
          </p>
        </div>
      </Modal>
    </div>
  );
}
