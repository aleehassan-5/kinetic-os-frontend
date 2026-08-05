"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Ban, RotateCcw, Loader2, Mail, Phone, Briefcase, Users, Building2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api-client";

type AccountStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

interface ApiAccountDetail {
  id: string;
  businessName: string;
  ownerEmail: string;
  niche: string | null;
  phone: string | null;
  status: AccountStatus;
  createdAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  users: { id: string; name: string; email: string; createdAt: string }[];
  workspace: { id: string; name: string } | null;
  approvedBy: { id: string; name: string; email: string } | null;
}

const statusVariant: Record<AccountStatus, "warning" | "success" | "danger" | "default"> = {
  PENDING: "warning",
  ACTIVE: "success",
  REJECTED: "danger",
  SUSPENDED: "default",
};

export default function AdminAccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [account, setAccount] = useState<ApiAccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  function refresh() {
    setLoading(true);
    api
      .get<ApiAccountDetail>(`/admin/accounts/${id}`)
      .then(setAccount)
      .catch((err) => setNotice(err instanceof ApiError ? err.message : "Couldn't load this account."))
      .finally(() => setLoading(false));
  }

  useEffect(refresh, [id]);

  async function approve() {
    setBusy(true);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${id}/approve`);
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't approve this account.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReject() {
    setBusy(true);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${id}/reject`, { reason: rejectReason || undefined });
      setRejectOpen(false);
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't reject this account.");
    } finally {
      setBusy(false);
    }
  }

  async function suspend() {
    setBusy(true);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${id}/suspend`);
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't suspend this account.");
    } finally {
      setBusy(false);
    }
  }

  async function reactivate() {
    setBusy(true);
    setNotice(null);
    try {
      await api.post(`/admin/accounts/${id}/reactivate`);
      refresh();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't reactivate this account.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-text-secondary">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading account…
      </div>
    );
  }

  if (!account) {
    return <p className="text-[13px] text-text-secondary">{notice ?? "Account not found."}</p>;
  }

  return (
    <div className="max-w-2xl space-y-5">
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All accounts
      </button>

      {notice && (
        <div className="rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger">
          {notice}
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{account.businessName}</CardTitle>
              <Badge variant={statusVariant[account.status]}>{account.status}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {account.status === "PENDING" && (
              <>
                <Button size="sm" onClick={approve} loading={busy}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setRejectOpen(true)} disabled={busy}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </>
            )}
            {account.status === "ACTIVE" && (
              <Button size="sm" variant="ghost" onClick={suspend} loading={busy}>
                <Ban className="h-3.5 w-3.5" /> Suspend
              </Button>
            )}
            {account.status === "SUSPENDED" && (
              <Button size="sm" variant="secondary" onClick={reactivate} loading={busy}>
                <RotateCcw className="h-3.5 w-3.5" /> Reactivate
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2.5 text-[13px] text-text-secondary">
            <Mail className="h-3.5 w-3.5 text-text-muted" /> {account.ownerEmail}
          </div>
          {account.phone && (
            <div className="flex items-center gap-2.5 text-[13px] text-text-secondary">
              <Phone className="h-3.5 w-3.5 text-text-muted" /> {account.phone}
            </div>
          )}
          {account.niche && (
            <div className="flex items-center gap-2.5 text-[13px] text-text-secondary">
              <Briefcase className="h-3.5 w-3.5 text-text-muted" /> {account.niche}
            </div>
          )}
          <div className="flex items-center gap-2.5 text-[13px] text-text-secondary">
            <Users className="h-3.5 w-3.5 text-text-muted" /> {account.users.length} team member{account.users.length === 1 ? "" : "s"}
          </div>
          {account.workspace && (
            <div className="flex items-center gap-2.5 text-[13px] text-text-secondary">
              <Building2 className="h-3.5 w-3.5 text-text-muted" /> Workspace: {account.workspace.name}
            </div>
          )}

          <div className="border-t border-border pt-3 text-[12px] text-text-muted">
            Applied {new Date(account.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {account.approvedAt && account.approvedBy && (
              <> · Approved {new Date(account.approvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} by {account.approvedBy.name}</>
            )}
          </div>
          {account.status === "REJECTED" && account.rejectionReason && (
            <div className="rounded-control border border-danger/20 bg-danger-muted px-3 py-2 text-[12.5px] text-danger">
              Rejected: {account.rejectionReason}
            </div>
          )}
        </CardContent>
      </Card>

      {account.users.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 p-0">
            {account.users.map((u) => (
              <div key={u.id} className="flex items-center justify-between border-t border-border px-5 py-3 first:border-t-0">
                <div>
                  <p className="text-[13px] font-medium text-text-primary">{u.name}</p>
                  <p className="text-[12px] text-text-muted">{u.email}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Modal
        open={rejectOpen}
        onClose={() => !busy && setRejectOpen(false)}
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
          <Button variant="danger" className="w-full" onClick={submitReject} loading={busy}>
            Confirm rejection
          </Button>
        </div>
      </Modal>
    </div>
  );
}
