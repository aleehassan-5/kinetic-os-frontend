import { FileText, FileSpreadsheet, Globe, HelpCircle, File, RotateCw, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { KnowledgeDoc, typeStyle, statusVariant } from "./data";

const typeIcon = { PDF: FileText, DOCX: File, URL: Globe, FAQ: HelpCircle, Sheet: FileSpreadsheet };

export function DocumentTable({ docs }: { docs: KnowledgeDoc[] }) {
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
                  <Badge variant={statusVariant[doc.status]} dot={doc.status !== "Processing"}>
                    {doc.status === "Processing" && <Loader2 className="h-3 w-3 animate-spin" />}
                    {doc.status}
                  </Badge>
                </td>
                <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{doc.chunks || "—"}</td>
                <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{doc.size}</td>
                <td className="px-3 py-3.5 text-[12.5px] text-text-muted">{doc.lastSynced}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary" title="Re-sync">
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-danger-muted hover:text-danger" title="Remove">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
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
