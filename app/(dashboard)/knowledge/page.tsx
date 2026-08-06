"use client";

import { useEffect, useState } from "react";
import { Database, Layers, HardDrive, CheckCircle2 } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardContent } from "@/components/ui/card";
import { UploadZone } from "@/components/knowledge/upload-zone";
import { DocumentTable } from "@/components/knowledge/document-table";
import { DocType, KnowledgeDoc, SyncStatus } from "@/components/knowledge/data";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api-client";

const filters: (DocType | "All")[] = ["All", "PDF", "DOCX", "URL", "FAQ", "Sheet"];

interface ApiDocument {
  id: string;
  title: string;
  sourceType: "PDF" | "DOCX" | "URL" | "FAQ" | "SHEET";
  sourceUrl?: string | null;
  status: "QUEUED" | "PROCESSING" | "INDEXED" | "FAILED";
  chunkCount: number;
  storageBytes: number;
  createdAt: string;
  updatedAt: string;
  error?: string | null;
}

const typeFromSource: Record<ApiDocument["sourceType"], DocType> = {
  PDF: "PDF",
  DOCX: "DOCX",
  URL: "URL",
  FAQ: "FAQ",
  SHEET: "Sheet",
};

const statusFromApi: Record<ApiDocument["status"], SyncStatus> = {
  QUEUED: "Queued",
  PROCESSING: "Processing",
  INDEXED: "Indexed",
  FAILED: "Failed",
};

function formatSize(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function mapDoc(d: ApiDocument): KnowledgeDoc {
  return {
    id: d.id,
    name: d.title,
    type: typeFromSource[d.sourceType],
    status: statusFromApi[d.status],
    size: formatSize(d.storageBytes),
    chunks: d.chunkCount,
    lastSynced: d.status === "FAILED" ? `Failed ${formatRelativeTime(d.updatedAt)}` : formatRelativeTime(d.updatedAt),
    source: d.sourceType === "URL" ? "Website crawl" : d.sourceType === "FAQ" ? "Manual entry" : "Uploaded",
    sourceUrl: d.sourceUrl,
    error: d.error,
  };
}

export default function KnowledgeBasePage() {
  const [filter, setFilter] = useState<DocType | "All">("All");
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [storageBytesTotal, setStorageBytesTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resyncingId, setResyncingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await api.get<{ documents: ApiDocument[] }>("/knowledge");
      setDocuments(data.documents.map(mapDoc));
      setStorageBytesTotal(data.documents.reduce((sum, d) => sum + d.storageBytes, 0));
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = filter === "All" ? documents : documents.filter((d) => d.type === filter);
  const totalChunks = documents.reduce((sum, d) => sum + d.chunks, 0);
  const indexedCount = documents.filter((d) => d.status === "Indexed").length;

  async function handleUploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);
    await api.post("/knowledge/upload", form, { isFormData: true });
    await refresh();
  }

  async function handleCrawl(title: string, url: string) {
    await api.post("/knowledge/crawl", { title, url });
    await refresh();
  }

  async function handleAddFaq(title: string, content: string) {
    await api.post("/knowledge/faq", { title, content });
    await refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await api.delete(`/knowledge/${id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't remove that document.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleResync(id: string) {
    setResyncingId(id);
    try {
      await api.post(`/knowledge/${id}/resync`);
      await refresh(); // pick up the new "Processing" status immediately
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't re-sync that document.");
    } finally {
      setResyncingId(null);
    }
  }

  return (
    <>
      <Topnav title="Knowledge Base" subtitle="Grounds every AI reply in your actual business context" />

      <main className="space-y-6 p-6 lg:p-8">
        {notice && (
          <div className="rounded-control border border-danger/30 bg-danger-muted px-4 py-2.5 text-[13px] text-danger">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Total documents</p>
              <Database className="h-4 w-4 text-text-muted" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">{loading ? "—" : documents.length}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Indexed &amp; ready</p>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">
              {loading ? "—" : indexedCount}
              <span className="text-[14px] text-text-muted">/{loading ? "—" : documents.length}</span>
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Vector chunks</p>
              <Layers className="h-4 w-4 text-text-muted" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">{loading ? "—" : totalChunks}</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-text-secondary">Storage used</p>
              <HardDrive className="h-4 w-4 text-text-muted" />
            </div>
            <p className="mt-2 text-[24px] font-semibold text-text-primary">{loading ? "—" : formatSize(storageBytesTotal)}</p>
          </Card>
        </div>

        <UploadZone onUploadFile={handleUploadFile} onCrawl={handleCrawl} onAddFaq={handleAddFaq} />

        <Card className="overflow-visible">
          <div className="flex items-center gap-1.5 border-b border-border p-3.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors duration-200",
                  filter === f ? "bg-primary text-background" : "text-text-secondary hover:bg-white/[0.05]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <CardContent className="p-0">
            <DocumentTable docs={filtered} onDelete={handleDelete} deletingId={deletingId} onResync={handleResync} resyncingId={resyncingId} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
