export interface UsageMetric {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

export type InvoiceStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: InvoiceStatus;
  description: string;
  invoiceUrl: string | null;
}

export const invoiceStatusVariant: Record<InvoiceStatus, "default" | "success" | "warning" | "danger"> = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
  Refunded: "default",
};

// ---- Real backend integration ------------------------------------------

export interface ApiBillingOverview {
  plan: { id: string; name: string; priceLabel: string };
  subscription: {
    status: "ON_TRIAL" | "ACTIVE" | "PAUSED" | "PAST_DUE" | "UNPAID" | "CANCELLED" | "EXPIRED";
    renewsAt: string | null;
    cardBrand: string | null;
    cardLastFour: string | null;
  } | null;
  usage: {
    leads: { used: number; limit: number };
    aiMessages: { used: number; limit: number };
    workflowRuns: { used: number; limit: number };
    teamMembers: { used: number; limit: number };
  };
}

export interface ApiInvoice {
  id: string;
  amountCents: number;
  currency: string;
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  invoiceUrl: string | null;
  billingReason: string | null;
  issuedAt: string;
}

const invoiceStatusMap: Record<ApiInvoice["status"], InvoiceStatus> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export function mapUsage(overview: ApiBillingOverview): UsageMetric[] {
  return [
    { label: "Leads captured", used: overview.usage.leads.used, limit: overview.usage.leads.limit, unit: "/mo" },
    { label: "AI messages sent", used: overview.usage.aiMessages.used, limit: overview.usage.aiMessages.limit, unit: "/mo" },
    { label: "Workflow runs", used: overview.usage.workflowRuns.used, limit: overview.usage.workflowRuns.limit, unit: "/mo" },
    { label: "Team seats", used: overview.usage.teamMembers.used, limit: overview.usage.teamMembers.limit, unit: "seats" },
  ];
}

export function mapInvoice(inv: ApiInvoice): Invoice {
  return {
    id: inv.id,
    date: new Date(inv.issuedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    amount: `$${(inv.amountCents / 100).toFixed(2)}`,
    status: invoiceStatusMap[inv.status],
    description: inv.billingReason ?? "Subscription charge",
    invoiceUrl: inv.invoiceUrl,
  };
}

export const subscriptionStatusLabel: Record<NonNullable<ApiBillingOverview["subscription"]>["status"], string> = {
  ON_TRIAL: "Trial",
  ACTIVE: "Active",
  PAUSED: "Paused",
  PAST_DUE: "Past due",
  UNPAID: "Unpaid",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export const NEXT_PLAN: Record<string, string> = {
  starter: "growth",
  growth: "scale",
  scale: "scale",
};
