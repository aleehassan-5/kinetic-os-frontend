export type DocType = "PDF" | "DOCX" | "URL" | "FAQ" | "Sheet";
export type SyncStatus = "Indexed" | "Processing" | "Failed" | "Queued";

export interface KnowledgeDoc {
  id: string;
  name: string;
  type: DocType;
  status: SyncStatus;
  size: string;
  chunks: number;
  lastSynced: string;
  source: string;
  sourceUrl?: string | null;
}

export const typeStyle: Record<DocType, { bg: string; text: string }> = {
  PDF: { bg: "bg-danger-muted", text: "text-danger" },
  DOCX: { bg: "bg-primary-muted", text: "text-primary" },
  URL: { bg: "bg-secondary-muted", text: "text-secondary" },
  FAQ: { bg: "bg-warning-muted", text: "text-warning" },
  Sheet: { bg: "bg-success-muted", text: "text-success" },
};

export const statusVariant: Record<SyncStatus, "default" | "primary" | "success" | "warning" | "danger"> = {
  Indexed: "success",
  Processing: "warning",
  Failed: "danger",
  Queued: "default",
};
