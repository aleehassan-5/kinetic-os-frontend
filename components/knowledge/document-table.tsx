import { useEffect, useRef, useState } from "react";
import { FileText, FileSpreadsheet, Globe, HelpCircle, File, RotateCw, Trash2, MoreHorizontal, Loader2, ExternalLink, Copy, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { KnowledgeDoc, typeStyle, statusVariant } from "./data";

const typeIcon = { PDF: FileText, DOCX: File, URL: Globe, FAQ: HelpCircle, Sheet: FileSpreadsheet };

/** Visible on-hover/tap bubble with the actual ingestion failure reason — a native `title` attribute alone is too easy to miss. */
function FailureReasonTip({ message }: { message: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="group/tip relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-4 w-4 items-center justify-center text-danger/80 transition-colors duration-150 hover:text-danger"
      >
        <AlertCircle className="h-3.5 w-3.5" />
      </button>
      <div
        className={cn(
          "absolute left-1/2 top-[calc(100%+6px)] z-20 w-64 -translate-x-1/2 rounded-control border border-border bg-card p-2.5 text-left text-[12px] leading-relaxed text-text-secondary shadow-lg transition-opacity duration-150",
          open ? "opacity-100" : "pointer-events-none opacity-0 group-hover/tip:opacity-100"
        )}
      >
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-danger">Why it failed</p>
        {message}
      </div>
    </div>
  );
}

function RowActionsMenu({ doc }: { doc: KnowledgeDoc }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(doc.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be blocked — fail silently, nothing else to do here
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
        title="More"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-10 w-44 overflow-hidden rounded-control border border-border bg-card shadow-lg">
          {doc.sourceUrl && (
            <a
              href={doc.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-left text-[12.5px] text-text-secondary transition-colors duration-200 hover:bg-white/[0.04] hover:text-text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open source
            </a>
          )}
          <button
            onClick={() => {
              copyId();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] text-text-secondary transition-colors duration-200 hover:bg-white/[0.04] hover:text-text-primary"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy document ID
          </button>
        </div>
      )}
    </div>
  );
}

export function DocumentTable({
  docs,
  onDelete,
  deletingId,
  onResync,
  resyncingId,
}: {
  docs: KnowledgeDoc[];
  onDelete?: (id: string) => void;
  deletingId?: string | null;
  onResync?: (id: string) => void;
  resyncingId?: string | null;
}) {
  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05]">
          <FileText className="h-5 w-5 text-text-muted" />
        </div>
        <p className="text-[13.5px] font-medium text-text-primary">No documents match this filter</p>
        <p className="text-[12.5px] text-text-secondary">Try a different type, or upload a new source above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            <th className="px-5 py-3">Document</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Chunks</th>
            <th className="px-3 py-3">Size</th>
            <th className="px-3 py-3">Last synced</th>
            <th className="px-3 py-3" />
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => {
            const Icon = typeIcon[doc.type];
            const ts = typeStyle[doc.type];
            return (
              <tr key={doc.id} className="border-b border-border transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]", ts.bg)}>
                      <Icon className={cn("h-[15px] w-[15px]", ts.text)} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-text-primary">{doc.name}</p>
                      <p className="text-[11px] text-text-muted">{doc.source} · {doc.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={statusVariant[doc.status]} dot={doc.status !== "Processing"}>
                      {doc.status === "Processing" && <Loader2 className="h-3 w-3 animate-spin" />}
                      {doc.status}
                    </Badge>
                    {doc.status === "Failed" && (
                      <FailureReasonTip message={doc.error || "No error details were recorded for this failure — try re-syncing."} />
                    )}
                  </div>
                </td>
                <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{doc.chunks || "—"}</td>
                <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{doc.size}</td>
                <td className="px-3 py-3.5 text-[12.5px] text-text-muted">{doc.lastSynced}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onResync?.(doc.id)}
                      disabled={resyncingId === doc.id || doc.status === "Processing"}
                      className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary disabled:opacity-40"
                      title="Re-sync"
                    >
                      {resyncingId === doc.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCw className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDelete?.(doc.id)}
                      disabled={deletingId === doc.id}
                      className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-danger-muted hover:text-danger disabled:opacity-40"
                      title="Remove"
                    >
                      {deletingId === doc.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <RowActionsMenu doc={doc} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
