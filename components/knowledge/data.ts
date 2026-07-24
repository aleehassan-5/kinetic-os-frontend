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
}

export const documents: KnowledgeDoc[] = [
  { id: "d1", name: "Pricing & Retainer Tiers 2026.pdf", type: "PDF", status: "Indexed", size: "1.2 MB", chunks: 48, lastSynced: "2h ago", source: "Uploaded" },
  { id: "d2", name: "Service Agreement Template.docx", type: "DOCX", status: "Indexed", size: "340 KB", chunks: 22, lastSynced: "1d ago", source: "Uploaded" },
  { id: "d3", name: "orbitai.com/faq", type: "URL", status: "Indexed", size: "—", chunks: 61, lastSynced: "6h ago", source: "Website crawl" },
  { id: "d4", name: "Onboarding Checklist.pdf", type: "PDF", status: "Processing", size: "780 KB", chunks: 0, lastSynced: "Syncing…", source: "Uploaded" },
  { id: "d5", name: "Common Objections — Sales FAQ", type: "FAQ", status: "Indexed", size: "—", chunks: 34, lastSynced: "3d ago", source: "Manual entry" },
  { id: "d6", name: "Client Roster — Master Sheet.xlsx", type: "Sheet", status: "Failed", size: "2.1 MB", chunks: 0, lastSynced: "Failed 1d ago", source: "Google Sheets" },
  { id: "d7", name: "Refund & Cancellation Policy.pdf", type: "PDF", status: "Queued", size: "210 KB", chunks: 0, lastSynced: "Waiting…", source: "Uploaded" },
];

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
