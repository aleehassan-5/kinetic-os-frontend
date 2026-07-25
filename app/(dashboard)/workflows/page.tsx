"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Play, Save } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { WorkflowCanvas } from "@/components/workflows/workflow-canvas";
import { NodePalette } from "@/components/workflows/node-palette";
import { NodeInspector } from "@/components/workflows/node-inspector";
import { WorkflowSwitcher, WorkflowSummary } from "@/components/workflows/workflow-switcher";
import { DEFAULT_BACKEND_GRAPH } from "@/components/workflows/data";
import { api, ApiError } from "@/lib/api-client";

interface ApiWorkflow {
  id: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED";
  graph: unknown;
  createdAt: string;
  updatedAt: string;
}

interface ApiWorkflowRun {
  id: string;
  status: "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";
  logs: { nodeId: string; nodeType: string; status: string; message: string; timestamp: string }[];
  createdAt: string;
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function WorkflowsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedId, setSelectedId] = useState<string | null>("n2");
  const [workflows, setWorkflows] = useState<ApiWorkflow[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [runs, setRuns] = useState<ApiWorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testLogs, setTestLogs] = useState<ApiWorkflowRun["logs"] | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);

  const active = workflows.find((w) => w.id === activeWorkflowId) ?? null;

  async function refreshWorkflows(preferId?: string) {
    const data = await api.get<{ workflows: ApiWorkflow[] }>("/workflows");
    setWorkflows(data.workflows);
    if (preferId) {
      setActiveWorkflowId(preferId);
    } else if (!activeWorkflowId && data.workflows.length > 0) {
      setActiveWorkflowId(data.workflows[0].id);
    }
    return data.workflows;
  }

  useEffect(() => {
    (async () => {
      try {
        const list = await refreshWorkflows();
        if (list.length === 0 || searchParams.get("new") === "1") {
          setCreateOpen(true);
          setCreateName(list.length === 0 ? "Lead qualification & booking" : "");
        }
      } catch {
        setWorkflows([]);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeWorkflowId) {
      setRuns([]);
      return;
    }
    api
      .get<{ runs: ApiWorkflowRun[] }>(`/workflows/${activeWorkflowId}/runs`)
      .then((data) => setRuns(data.runs))
      .catch(() => setRuns([]));
  }, [activeWorkflowId]);

  async function handleCreate() {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const workflow = await api.post<ApiWorkflow>("/workflows", {
        name: createName.trim(),
        graph: DEFAULT_BACKEND_GRAPH,
      });
      await refreshWorkflows(workflow.id);
      setCreateOpen(false);
      setCreateName("");
      router.replace("/workflows");
      setBanner({ type: "success", text: `"${workflow.name}" created.` });
    } catch (err) {
      setBanner({ type: "error", text: err instanceof ApiError ? err.message : "Couldn't create the workflow." });
    } finally {
      setCreating(false);
    }
  }

  async function handleSave() {
    if (!active) {
      setCreateOpen(true);
      return;
    }
    setSaving(true);
    setBanner(null);
    try {
      const updated = await api.patch<ApiWorkflow>(`/workflows/${active.id}`, {
        name: active.name,
        graph: DEFAULT_BACKEND_GRAPH,
        status: active.status === "DRAFT" ? "ACTIVE" : active.status,
      });
      setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      setBanner({ type: "success", text: "Workflow saved." });
    } catch (err) {
      setBanner({ type: "error", text: err instanceof ApiError ? err.message : "Couldn't save the workflow." });
    } finally {
      setSaving(false);
    }
  }

  async function handleTestRun() {
    if (!active) {
      setBanner({ type: "error", text: "Select or create a workflow first." });
      return;
    }
    setTesting(true);
    setBanner(null);
    setTestLogs(null);
    try {
      const result = await api.post<{ logs: ApiWorkflowRun["logs"]; leadUsed: { name: string | null } }>(
        `/workflows/${active.id}/test-run`
      );
      setTestLogs(result.logs);
      setBanner({
        type: "success",
        text: `Test run complete against ${result.leadUsed.name ?? "a sample lead"} — no real messages were sent.`,
      });
      const data = await api.get<{ runs: ApiWorkflowRun[] }>(`/workflows/${active.id}/runs`);
      setRuns(data.runs);
    } catch (err) {
      setBanner({ type: "error", text: err instanceof ApiError ? err.message : "Test run failed." });
    } finally {
      setTesting(false);
    }
  }

  const lastRun = runs[0];
  const executionsToday = runs.filter((r) => isToday(r.createdAt)).length;

  return (
    <>
      <Topnav
        title="Workflow Builder"
        subtitle="Design your automation, one step at a time"
        onNewWorkflow={() => {
          setCreateName("");
          setCreateOpen(true);
        }}
      />

      <main className="p-6 lg:p-8">
        {banner && (
          <div
            className={`mb-4 rounded-control border px-4 py-2.5 text-[13px] ${
              banner.type === "success"
                ? "border-success/30 bg-success-muted text-success"
                : "border-danger/30 bg-danger-muted text-danger"
            }`}
          >
            {banner.text}
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <WorkflowSwitcher
              workflows={workflows.map((w): WorkflowSummary => ({ id: w.id, name: w.name, status: w.status }))}
              activeId={activeWorkflowId}
              onSelect={setActiveWorkflowId}
              onCreateNew={() => {
                setCreateName("");
                setCreateOpen(true);
              }}
            />
            {active && (
              <Badge variant={active.status === "ACTIVE" ? "success" : active.status === "PAUSED" ? "warning" : "default"} dot>
                {active.status === "ACTIVE" ? "Active" : active.status === "PAUSED" ? "Paused" : "Draft"}
              </Badge>
            )}
            <span className="text-[12px] text-text-muted">
              {loading
                ? "Loading…"
                : active
                ? `Last run ${lastRun ? timeAgo(lastRun.createdAt) : "never"} · ${executionsToday} executions today`
                : "No workflow selected"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleTestRun} loading={testing} disabled={!active}>
              <Play className="h-3.5 w-3.5" /> Test run
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              <Save className="h-3.5 w-3.5" /> Save workflow
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px]">
            <div className="border-b border-border p-3.5 lg:border-b-0 lg:border-r">
              <NodePalette />
            </div>

            <div className="border-b border-border p-4 lg:border-b-0 lg:border-r">
              <WorkflowCanvas selectedId={selectedId} onSelect={setSelectedId} />
            </div>

            <div className="h-[560px]">
              <NodeInspector selectedId={selectedId} />
            </div>
          </div>
        </Card>

        {testLogs && (
          <Card className="mt-4 p-4">
            <p className="mb-3 text-[13px] font-semibold text-text-primary">Test run log</p>
            <div className="space-y-2">
              {testLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[12.5px]">
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      log.status === "success" ? "bg-success" : log.status === "failed" ? "bg-danger" : "bg-text-muted"
                    }`}
                  />
                  <div>
                    <span className="font-medium text-text-primary">{log.nodeType}</span>
                    <span className="text-text-secondary"> — {log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      <Modal
        open={createOpen}
        onClose={() => !creating && setCreateOpen(false)}
        title="New workflow"
        description="Give it a name — you can wire up the automation logic afterwards."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Workflow name</Label>
            <Input
              placeholder="e.g. Lead qualification & booking"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleCreate} loading={creating}>
            Create workflow
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default function WorkflowsPage() {
  return (
    <Suspense fallback={null}>
      <WorkflowsPageInner />
    </Suspense>
  );
}
