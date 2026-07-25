"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function DangerZoneSection() {
  const [modal, setModal] = React.useState<"leave" | "delete" | null>(null);
  const [confirmText, setConfirmText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { logout, workspace } = useAuth();
  const router = useRouter();

  function closeModal() {
    setModal(null);
    setConfirmText("");
    setError(null);
  }

  async function handleConfirm() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (modal === "leave") {
        await api.post("/workspace/leave");
        await logout();
      } else if (modal === "delete") {
        await api.delete("/workspace");
        await logout();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }
    router.push("/login");
  }

  return (
    <>
      <Card className="overflow-hidden border-danger/20">
        <CardHeader>
          <div>
            <CardTitle className="text-danger">Danger zone</CardTitle>
            <CardDescription>These actions are permanent and cannot be undone</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 rounded-control border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] font-medium text-text-primary">Leave workspace</p>
              <p className="text-[11.5px] text-text-secondary">Remove yourself from {workspace?.name ?? "this"} workspace. Ownership must be transferred first.</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => setModal("leave")}>
              Leave workspace
            </Button>
          </div>
          <div className="flex flex-col gap-3 rounded-control border border-danger/20 bg-danger-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[13px] font-medium text-text-primary">Delete workspace</p>
              <p className="text-[11.5px] text-text-secondary">Permanently delete all leads, workflows, and knowledge base data.</p>
            </div>
            <Button variant="danger" size="sm" className="shrink-0" onClick={() => setModal("delete")}>
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-card border border-border bg-card shadow-elevated animate-slide-up">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-danger" />
                <h3 className="text-[14.5px] font-semibold text-text-primary">
                  {modal === "leave" ? `Leave ${workspace?.name ?? "this"} workspace?` : `Delete ${workspace?.name ?? "this"} workspace?`}
                </h3>
              </div>
              <button onClick={closeModal} className="text-text-muted hover:text-text-primary" disabled={submitting}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 px-5 py-4">
              {error && (
                <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
                  {error}
                </div>
              )}
              <p className="text-[12.5px] text-text-secondary">
                {modal === "leave"
                  ? "You'll lose access to all leads, workflows, and settings in this workspace immediately."
                  : "This deletes all leads, conversations, workflows, and knowledge base documents for everyone. This cannot be reversed."}
              </p>
              <div className="space-y-1.5">
                <Label>Type <span className="font-semibold text-text-primary">{modal === "leave" ? "LEAVE" : "DELETE"}</span> to confirm</Label>
                <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={modal === "leave" ? "LEAVE" : "DELETE"} disabled={submitting} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <Button variant="ghost" size="sm" onClick={closeModal} disabled={submitting}>Cancel</Button>
              <Button
                variant="danger"
                size="sm"
                disabled={confirmText !== (modal === "leave" ? "LEAVE" : "DELETE") || submitting}
                onClick={handleConfirm}
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {modal === "leave" ? "Leave workspace" : "Delete workspace"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
