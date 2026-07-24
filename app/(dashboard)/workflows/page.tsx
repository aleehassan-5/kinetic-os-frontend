"use client";

import { useState } from "react";
import { Play, Save, ChevronDown, Zap } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowCanvas } from "@/components/workflows/workflow-canvas";
import { NodePalette } from "@/components/workflows/node-palette";
import { NodeInspector } from "@/components/workflows/node-inspector";

export default function WorkflowsPage() {
  const [selectedId, setSelectedId] = useState<string | null>("n2");

  return (
    <>
      <Topnav title="Workflow Builder" subtitle="Design your automation, one step at a time" />

      <main className="p-6 lg:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 rounded-control border border-border px-3 py-1.5 text-[13px] font-medium text-text-primary hover:border-border-strong">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Lead qualification &amp; booking
              <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            </button>
            <Badge variant="success" dot>Active</Badge>
            <span className="text-[12px] text-text-muted">Last run 4m ago · 812 executions today</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Play className="h-3.5 w-3.5" /> Test run</Button>
            <Button size="sm"><Save className="h-3.5 w-3.5" /> Save workflow</Button>
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
      </main>
    </>
  );
}
