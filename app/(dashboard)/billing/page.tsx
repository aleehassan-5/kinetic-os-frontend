"use client";

import { useEffect, useState } from "react";
import { CreditCard, Download, Sparkles, ArrowUpRight, Loader2, MessageCircle, Landmark, Smartphone } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { UsageMeter } from "@/components/billing/usage-meter";
import {
  ApiBillingOverview,
  ApiInvoice,
  Invoice,
  StartCheckoutResult,
  mapInvoice,
  mapUsage,
  invoiceStatusVariant,
  subscriptionStatusLabel,
  NEXT_PLAN,
} from "@/components/billing/data";
import { api, ApiError } from "@/lib/api-client";

export default function BillingPage() {
  const [overview, setOverview] = useState<ApiBillingOverview | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [manualCheckout, setManualCheckout] = useState<Extract<StartCheckoutResult, { mode: "manual" }> | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ApiBillingOverview>("/billing/overview"),
      api.get<{ invoices: ApiInvoice[] }>("/billing/invoices"),
    ])
      .then(([overviewData, invoicesData]) => {
        setOverview(overviewData);
        setInvoices(invoicesData.invoices.map(mapInvoice));
      })
      .catch((err) => setNotice(err instanceof ApiError ? err.message : "Couldn't load billing details."))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpgrade() {
    if (!overview) return;
    const nextPlanId = NEXT_PLAN[overview.plan.id] ?? "scale";
    if (nextPlanId === overview.plan.id) {
      setNotice("You're already on our top plan.");
      return;
    }
    setUpgrading(true);
    setNotice(null);
    try {
      const result = await api.post<StartCheckoutResult>("/billing/checkout", { planId: nextPlanId });
      if (result.mode === "manual") {
        setManualCheckout(result);
      } else {
        window.open(result.checkoutUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't start checkout.");
    } finally {
      setUpgrading(false);
    }
  }

  async function handleUpdatePaymentMethod() {
    setOpeningPortal(true);
    setNotice(null);
    try {
      const { portalUrl } = await api.get<{ portalUrl: string | null }>("/billing/portal");
      if (portalUrl) window.open(portalUrl, "_blank", "noopener,noreferrer");
      else setNotice("No billing portal link is available yet.");
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Couldn't open the billing portal.");
    } finally {
      setOpeningPortal(false);
    }
  }

  const usageMetrics = overview ? mapUsage(overview) : [];
  const nextPlanId = overview ? NEXT_PLAN[overview.plan.id] ?? "scale" : "scale";

  return (
    <>
      <Topnav title="Billing" subtitle="Plan, usage, and payment history" />

      <main className="space-y-6 p-6 lg:p-8">
        {notice && (
          <div className="rounded-control border border-border bg-white/[0.03] px-4 py-2.5 text-[13px] text-text-secondary">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading billing…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card className="overflow-hidden xl:col-span-2">
                <CardHeader>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{overview?.plan.name ?? "—"} plan</CardTitle>
                      {overview?.subscription && (
                        <Badge variant={overview.subscription.status === "ACTIVE" ? "primary" : "warning"} dot>
                          {subscriptionStatusLabel[overview.subscription.status]}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {overview?.plan.priceLabel ?? "—"}
                      {overview?.subscription?.renewsAt &&
                        ` · renews ${new Date(overview.subscription.renewsAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`}
                    </CardDescription>
                    {overview?.plan.pitchLine && (
                      <p className="mt-0.5 text-[11.5px] text-text-muted">{overview.plan.pitchLine}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleUpgrade} loading={upgrading}>
                    <ArrowUpRight className="h-3.5 w-3.5" /> Upgrade plan
                  </Button>
                </CardHeader>
                <CardContent className="space-y-5">
                  {usageMetrics.map((m) => (
                    <UsageMeter key={m.label} metric={m} />
                  ))}
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <div>
                    <CardTitle>Payment method</CardTitle>
                    <CardDescription>
                      {overview?.billingMode === "manual" ? "Bank transfer, JazzCash, or Easypaisa" : "Default card on file"}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {overview?.billingMode === "manual" ? (
                    <div className="flex items-center gap-3 rounded-control border border-border p-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-white/[0.05]">
                        <MessageCircle className="h-4 w-4 text-text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-text-primary">
                          {overview.subscription?.status === "ACTIVE" ? "Confirmed via WhatsApp" : "Message us to pay"}
                        </p>
                        <p className="text-[11.5px] text-text-muted">No card needed — pay how you already pay everyone else</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-control border border-border p-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-white/[0.05]">
                        <CreditCard className="h-4 w-4 text-text-secondary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-text-primary">
                          {overview?.subscription?.cardBrand
                            ? `${overview.subscription.cardBrand} •••• ${overview.subscription.cardLastFour ?? "----"}`
                            : "No card on file"}
                        </p>
                      </div>
                    </div>
                  )}
                  {overview?.billingMode !== "manual" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={handleUpdatePaymentMethod}
                      loading={openingPortal}
                    >
                      Update payment method
                    </Button>
                  )}

                  {nextPlanId !== overview?.plan.id && (
                    <button
                      onClick={handleUpgrade}
                      className="mt-5 block w-full rounded-control border border-border bg-primary-muted/30 p-3.5 text-left transition-colors duration-200 hover:border-primary/40"
                    >
                      <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-primary">
                        <Sparkles className="h-3.5 w-3.5" /> {nextPlanId === "scale" ? "Scale" : "Growth"} plan
                      </div>
                      <p className="mt-1 text-[11.5px] text-text-secondary">
                        {nextPlanId === "scale"
                          ? "Unlimited AI conversations, more content generations/mo, and priority support."
                          : "More leads, AI messages, and workflow runs per month."}
                      </p>
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <CardHeader>
                <div>
                  <CardTitle>Invoice history</CardTitle>
                  <CardDescription>Download past invoices for your records</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {invoices.length === 0 ? (
                  <p className="p-6 text-center text-[13px] text-text-secondary">No invoices yet.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                        <th className="px-5 py-3">Invoice</th>
                        <th className="px-3 py-3">Date</th>
                        <th className="px-3 py-3">Amount</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-border transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]">
                          <td className="px-5 py-3.5">
                            <p className="text-[13px] font-medium text-text-primary">{inv.id}</p>
                            <p className="text-[11.5px] text-text-muted">{inv.description}</p>
                          </td>
                          <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{inv.date}</td>
                          <td className="px-3 py-3.5 text-[12.5px] text-text-secondary">{inv.amount}</td>
                          <td className="px-3 py-3.5">
                            <Badge variant={invoiceStatusVariant[inv.status]}>{inv.status}</Badge>
                          </td>
                          <td className="px-3 py-3.5">
                            <div className="flex justify-end">
                              <button
                                disabled={!inv.invoiceUrl}
                                onClick={() => inv.invoiceUrl && window.open(inv.invoiceUrl, "_blank", "noopener,noreferrer")}
                                className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary disabled:opacity-30"
                                title={inv.invoiceUrl ? "Download invoice" : "No invoice file available"}
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Modal
        open={!!manualCheckout}
        onClose={() => setManualCheckout(null)}
        title={`Subscribe to ${manualCheckout?.plan.name ?? ""}`}
        description={manualCheckout ? `${manualCheckout.plan.priceLabel} — pay however's easiest, then message us to activate` : undefined}
      >
        {manualCheckout && (
          <div className="space-y-3">
            {manualCheckout.whatsappUrl && (
              <a
                href={manualCheckout.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-control border border-success/30 bg-success-muted p-3.5 transition-colors duration-200 hover:border-success/50"
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-success" />
                <div>
                  <p className="text-[13px] font-medium text-text-primary">Message us on WhatsApp</p>
                  <p className="text-[11.5px] text-text-secondary">Fastest way — we'll confirm and activate your plan same-day</p>
                </div>
              </a>
            )}

            {manualCheckout.bank && (
              <div className="flex items-start gap-3 rounded-control border border-border p-3.5">
                <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary" />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">Bank transfer</p>
                  <p className="text-[12px] text-text-secondary">{manualCheckout.bank.bankName}</p>
                  <p className="text-[12px] text-text-secondary">{manualCheckout.bank.accountTitle}</p>
                  <p className="font-mono text-[12px] text-text-primary">{manualCheckout.bank.accountNumber}</p>
                </div>
              </div>
            )}

            {(manualCheckout.easypaisaNumber || manualCheckout.jazzcashNumber) && (
              <div className="flex items-start gap-3 rounded-control border border-border p-3.5">
                <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary" />
                <div className="min-w-0 space-y-1">
                  <p className="text-[13px] font-medium text-text-primary">Mobile wallet</p>
                  {manualCheckout.easypaisaNumber && (
                    <p className="text-[12px] text-text-secondary">
                      Easypaisa: <span className="font-mono text-text-primary">{manualCheckout.easypaisaNumber}</span>
                    </p>
                  )}
                  {manualCheckout.jazzcashNumber && (
                    <p className="text-[12px] text-text-secondary">
                      JazzCash: <span className="font-mono text-text-primary">{manualCheckout.jazzcashNumber}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {!manualCheckout.whatsappUrl && !manualCheckout.bank && !manualCheckout.easypaisaNumber && !manualCheckout.jazzcashNumber && (
              <p className="text-[12.5px] text-text-secondary">
                Payment details haven't been configured yet — contact support to subscribe.
              </p>
            )}

            <p className="text-[11.5px] text-text-muted">
              Your plan activates as soon as we confirm the payment — usually within a few hours.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
