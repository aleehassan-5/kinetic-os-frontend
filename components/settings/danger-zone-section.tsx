"use client";

import * as React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function DangerZoneSection() {
  const [modal, setModal] = React.useState<"leave" | "delete" | null>(null);
  const [confirmText, setConfirmText] = React.useState("");

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
              <p className="text-[11.5px] text-text-secondary">Remove yourself from Growth workspace. Ownership must be transferred first.</p>
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
                  {modal === "leave" ? "Leave Growth workspace?" : "Delete Growth workspace?"}
                </h3>
              </div>
              <button onClick={() => { setModal(null); setConfirmText(""); }} className="text-text-muted hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 px-5 py-4">
              <p className="text-[12.5px] text-text-secondary">
                {modal === "leave"
                  ? "You'll lose access to all leads, workflows, and settings in this workspace immediately."
                  : "This deletes all leads, conversations, workflows, and knowledge base documents for everyone. This cannot be reversed."}
              </p>
              <div className="space-y-1.5">
                <Label>Type <span className="font-semibold text-text-primary">{modal === "leave" ? "LEAVE" : "DELETE"}</span> to confirm</Label>
                <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={modal === "leave" ? "LEAVE" : "DELETE"} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <Button variant="ghost" size="sm" onClick={() => { setModal(null); setConfirmText(""); }}>Cancel</Button>
              <Button
                variant="danger"
                size="sm"
                disabled={confirmText !== (modal === "leave" ? "LEAVE" : "DELETE")}
                onClick={() => { setModal(null); setConfirmText(""); }}
              >
                {modal === "leave" ? "Leave workspace" : "Delete workspace"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
