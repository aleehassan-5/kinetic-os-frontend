"use client";

import { useState } from "react";
import { Database, Layers, HardDrive, CheckCircle2 } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardContent } from "@/components/ui/card";
import { UploadZone } from "@/components/knowledge/upload-zone";
import { DocumentTable } from "@/components/knowledge/document-table";
import { documents, DocType } from "@/components/knowledge/data";
import { cn } from "@/lib/utils";

const filters: (DocType | "All")[] = ["All", "PDF", "DOCX", "URL", "FAQ", "Sheet"];

export default function KnowledgeBasePage() {
  const [filter, setFilter] = useState<DocType | "All">("All");
  const filtered = filter === "All" ? documents : documents.filter((d) => d.type === filter);

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks, 0);
  const indexedCount = documents.filter((d) => d.status === "Indexed").length;

  return (
    <>
      <Topnav title="Knowledge Base" subtitle="Grounds every AI reply in your actual business context" />

      <main className="space-y-6 p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Total documents</p>
              <Database className="h-4 w-4 text-text-muted" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">{documents.length}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Indexed &amp; ready</p>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">{indexedCount}<span className="text-[14px] text-text-muted">/{documents.length}</span></p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Vector chunks</p>
              <Layers className="h-4 w-4 text-text-muted" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">{totalChunks}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Storage used</p>
              <HardDrive className="h-4 w-4 text-text-muted" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">4.6<span className="text-[14px] text-text-muted"> MB</span></p>
          </Card>
        </div>

        <UploadZone />

        <Card className="overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-border p-3.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors duration-200",
                  filter === f ? "bg-primary text-white" : "text-text-secondary hover:bg-white/[0.05]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <CardContent className="p-0">
            <DocumentTable docs={filtered} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
