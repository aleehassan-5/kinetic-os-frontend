"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Ban, RotateCcw, Loader2, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api-client";

type AccountStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

interface ApiAccount {
  id: string;
  businessName: string;
  ownerEmail: string;
  niche: string | null;
  phone: string | null;
  status: AccountStatus;
  createdAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  users: { id: string; name: string; email: string }[];
  workspace: { id: string; name: string } | null;
  approvedBy: { id: string; name: string; email: string } | null;
}

const statusVariant: Record<AccountStatus, "warning" | "success" | "danger" | "default"> = {
  PENDING: "warning",
  ACTIVE: "success",
  REJECTED: "danger",
  SUSPENDED: "default",
};

const tabs: { label: string; value: AccountStatus | "ALL" }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Active", value: "ACTIVE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "All", value: "ALL" },
];

export default function AdminAccountsPage() {
  const [tab, setTab] = useState<AccountStatus | "ALL">("PENDING");
  const [accounts, setAccounts] = useState<ApiAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  function refresh() {
    setLoading(true);
    const qs = tab === "ALL" ? "" : `?status=${tab}`;
    api
      .get<{ accounts: ApiAccount[] }>(`/admin/accounts${qs}`)
      .then((data) => setAccounts(data.accounts))
      .catch((err) => setNotice(err instanceof ApiError ? err.message : "Couldn't load accounts."))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, [tab]);

  async function approve(id: string) {
    setBusyId(id);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${id}/approve`);
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't approve this account.");
    } finally {
      setBusyId(null);
    }
  }

  async function submitReject() {
    if (!rejectingId) return;
    setBusyId(rejectingId);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${rejectingId}/reject`, { reason: rejectReason || undefined });
      setRejectingId(null);
      setRejectReason("");
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't reject this account.");
    } finally {
      setBusyId(null);
    }
  }

  async function suspend(id: string) {
    setBusyId(id);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${id}/suspend`);
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't suspend this account.");
    } finally {
      setBusyId(null);
    }
  }

  async function reactivate(id: string) {
    setBusyId(id);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${id}/reactivate`);
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't reactivate this account.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[22px] font-medium tracking-tight text-text-primary">Accounts</h1>
        <p className="mt-0.5 text-[13px] text-text-secondary">Review and manage every client account on the platform.</p>
      </div>

      {notice && (
        <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger">
          {notice}
        </div>
      )}

      <div className="flex items-center gap-1.5 border-b border-border pb-px">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-t-control px-3 py-2 text-[13px] font-medium transition-colors duration-200",
              tab === t.value
                ? "border-b-2 border-primary text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading accounts…
        </div>
      ) : accounts.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-12 text-center">
          <Building2 className="h-6 w-6 text-text-muted" />
          <p className="text-[13px] text-text-secondary">No accounts here.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-5 py-3">Business</th>
                <th className="px-3 py-3">Owner</th>
                <th className="px-3 py-3">Niche</th>
                <th className="px-3 py-3">Applied</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => {
                const busy = busyId === acc.id;
                return (
                  <tr key={acc.id} className="border-b border-border transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/accounts/${acc.id}`} className="text-[13px] font-medium text-text-primary hover:text-primary">
                        {acc.businessName}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{acc.ownerEmail}</td>
                    <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{acc.niche ?? "—"}</td>
                    <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">
                      {new Date(acc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge variant={statusVariant[acc.status]}>{acc.status}</Badge>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        {acc.status === "PENDING" && (
                          <>
                            <Button size="sm" onClick={() => approve(acc.id)} loading={busy}>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setRejectingId(acc.id);
                                setRejectReason("");
                              }}
                              disabled={busy}
                            >
                              <XCircle className="h-3.5 w-3.5" /> Reject
                            </Button>
                          </>
                        )}
                        {acc.status === "ACTIVE" && (
                          <Button size="sm" variant="ghost" onClick={() => suspend(acc.id)} loading={busy}>
                            <Ban className="h-3.5 w-3.5" /> Suspend
                          </Button>
                        )}
                        {acc.status === "SUSPENDED" && (
                          <Button size="sm" variant="secondary" onClick={() => reactivate(acc.id)} loading={busy}>
                            <RotateCcw className="h-3.5 w-3.5" /> Reactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={!!rejectingId}
        onClose={() => !busyId && setRejectingId(null)}
        title="Reject this account"
        description="Optional — let them know why, they'll see this in their notification email."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Reason (optional)</Label>
            <Input
              placeholder="e.g. Outside our current supported niches"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <Button variant="danger" className="w-full" onClick={submitReject} loading={!!busyId}>
            Confirm rejection
          </Button>
        </div>
      </Modal>
    </div>
  );
}
