import { CreditCard, Download, Sparkles, ArrowUpRight } from "lucide-react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsageMeter } from "@/components/billing/usage-meter";
import { usageMetrics, invoices, invoiceStatusVariant } from "@/components/billing/data";

export default function BillingPage() {
  return (
    <>
      <Topnav title="Billing" subtitle="Plan, usage, and payment history" />

      <main className="space-y-6 p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2">
            <CardHeader>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Growth plan</CardTitle>
                  <Badge variant="primary" dot>Active</Badge>
                </div>
                <CardDescription>$249/mo · renews Aug 1, 2026</CardDescription>
              </div>
              <Button variant="outline" size="sm">
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
                <CardDescription>Default card on file</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-control border border-border p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-white/[0.05]">
                  <CreditCard className="h-4 w-4 text-text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-text-primary">Visa •••• 4242</p>
                  <p className="text-[11.5px] text-text-muted">Expires 09/28</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="mt-3 w-full">Update payment method</Button>

              <div className="mt-5 rounded-control border border-border bg-primary-muted/30 p-3.5">
                <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Scale plan
                </div>
                <p className="mt-1 text-[11.5px] text-text-secondary">
                  Unlimited AI conversations, 500 content generations/mo, and priority support.
                </p>
              </div>
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
                        <button className="rounded-control p-1.5 text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
