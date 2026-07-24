export interface UsageMetric {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

export const usageMetrics: UsageMetric[] = [
  { label: "AI conversations", used: 3420, limit: 5000, unit: "/mo" },
  { label: "Content generations (reels + graphics)", used: 68, limit: 100, unit: "/mo" },
  { label: "Knowledge Base storage", used: 4.6, limit: 20, unit: "GB" },
  { label: "Team seats", used: 6, limit: 10, unit: "seats" },
];

export type InvoiceStatus = "Paid" | "Pending" | "Failed";

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
  description: string;
}

export const invoices: Invoice[] = [
  { id: "INV-2026-007", date: "Jul 1, 2026", amount: "$249.00", status: "Paid", description: "Growth plan — monthly" },
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: "$249.00", status: "Paid", description: "Growth plan — monthly" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: "$249.00", status: "Paid", description: "Growth plan — monthly" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "$199.00", status: "Paid", description: "Starter plan — monthly" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$199.00", status: "Failed", description: "Starter plan — monthly (retried)" },
];

export const invoiceStatusVariant: Record<InvoiceStatus, "default" | "success" | "warning" | "danger"> = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
};
