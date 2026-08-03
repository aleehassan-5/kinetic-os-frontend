"use client";

import * as React from "react";
import Link from "next/link";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  label: string;
}

const toc: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "customer-side", label: "What the customer sees" },
  { id: "founder-side", label: "Activating a customer (you)" },
  { id: "pricing", label: "How pricing works" },
  { id: "setup", label: "One-time setup" },
  { id: "switching", label: "Switching to automated billing later" },
  { id: "faq", label: "FAQ" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-1 font-display text-[20px] font-semibold tracking-tight text-text-primary">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1.5 text-[14px] font-semibold text-text-primary">{title}</h3>
      <div className="space-y-1.5 text-[13px] leading-relaxed text-text-secondary">{children}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-control border border-warning/25 bg-warning-muted px-3.5 py-2.5 text-[12.5px] leading-relaxed text-warning">
      <strong className="font-semibold">Note — </strong>
      {children}
    </p>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-control border border-primary/25 bg-primary-muted/40 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-text-primary">
      <strong className="font-semibold text-primary">Tip — </strong>
      {children}
    </p>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-control border border-border bg-white/[0.02] p-3.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-muted text-[12px] font-semibold text-primary">
        {n}
      </span>
      <div className="text-[13px] leading-relaxed text-text-secondary">{children}</div>
    </div>
  );
}

export default function BillingGuidePage() {
  const [activeId, setActiveId] = React.useState(toc[0].id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Topnav title="Billing & Payment Guide" subtitle="How getting paid actually works right now, and what to do for each customer" />

      <main className="p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <nav className="lg:sticky lg:top-20 lg:h-fit lg:w-56 lg:shrink-0">
            <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {toc.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-control px-3 py-2 text-[13px] font-medium transition-colors duration-200",
                    activeId === t.id
                      ? "bg-primary-muted text-primary"
                      : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                  )}
                >
                  {t.label}
                </a>
              ))}
            </div>
          </nav>

          <Card className="min-w-0 flex-1">
            <CardContent className="space-y-12 p-6 lg:p-8">
              <Section id="overview" title="Overview">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Kinetic OS bills in <strong className="text-text-primary">manual mode</strong> right now, on
                  purpose. There&apos;s no card checkout — every customer pays you directly (WhatsApp, bank
                  transfer, JazzCash, or Easypaisa) and you flip their workspace to &quot;paid&quot; yourself. This
                  isn&apos;t a placeholder waiting to be finished; it&apos;s the right setup for the first 5–10
                  customers coming from your own network, where a real conversation about price beats a rigid
                  checkout page.
                </p>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  The short version: a customer clicks <strong className="text-text-primary">Upgrade plan</strong> on
                  their Billing page, gets your WhatsApp number and payment details, you agree on a number and
                  they pay however&apos;s easiest for them, and then you run one command to activate their plan.
                </p>
              </Section>

              <Section id="customer-side" title="What the customer sees">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  From their Billing page (<code className="rounded bg-black/20 px-1 py-0.5 text-primary">/billing</code>),
                  clicking <strong className="text-text-primary">Upgrade plan</strong> opens a modal — not a
                  checkout redirect — showing:
                </p>
                <ul className="ml-4 list-disc space-y-1.5 text-[13px] leading-relaxed text-text-secondary">
                  <li>A <strong className="text-text-primary">Message us on WhatsApp</strong> button, pre-filled with which plan they&apos;re interested in</li>
                  <li>Your bank account details, if configured</li>
                  <li>Your Easypaisa / JazzCash number, if configured</li>
                </ul>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Nothing here charges them automatically — it&apos;s purely informational, meant to start the
                  WhatsApp conversation.
                </p>
              </Section>

              <Section id="founder-side" title="Activating a customer (you)">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Once you&apos;ve agreed on a price with a customer and confirmed the transfer landed (bank
                  statement, JazzCash/Easypaisa SMS, or just their word for the first few), you flip their
                  workspace to that plan using their workspace ID (visible in their Settings → Workspace) and
                  the price you agreed on.
                </p>
                <Step n={1}>
                  Get their <strong className="text-text-primary">workspace ID</strong> — visible in Settings →
                  Workspace on their account, or ask them to send a screenshot.
                </Step>
                <Step n={2}>
                  Activate their plan for the exact amount you agreed on. This is a deployment-level action, not
                  something inside the app — see the internal ops notes for whoever manages your Kinetic OS
                  server for exactly how.
                </Step>
                <Step n={3}>
                  Their plan activates immediately, a real PAID invoice for that exact amount appears on their
                  Billing page, and their usage limits update to the new plan&apos;s tier.
                </Step>
                <Note>
                  The activation step is deliberately not a button inside the app — it&apos;s protected
                  separately so no logged-in customer can ever activate their own plan for free. Only whoever
                  holds the deployment&apos;s admin credentials can do this.
                </Note>
              </Section>

              <Section id="pricing" title="How pricing works">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  <strong className="text-text-primary">There is no price list.</strong> You decide the number
                  for each customer, one conversation at a time — whatever you agree on with them is exactly
                  what gets charged. Nothing in the app suggests a price to the customer, and nothing forces you
                  to charge the same amount twice.
                </p>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Starter / Growth / Scale still exist behind the scenes purely as{" "}
                  <strong className="text-text-primary">feature tiers</strong> — they control how many
                  leads/AI messages/workflow runs/team seats a workspace gets, nothing about price. When you
                  activate a customer (see the previous section), you pick whichever tier matches what you sold
                  them and enter the exact amount they&apos;re paying — that amount is what shows on their
                  invoice, full stop.
                </p>
              </Section>

              <Section id="setup" title="One-time setup">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Before the payment modal shows anything useful, whoever manages your deployment needs to add
                  your WhatsApp number and whichever payment details you actually want to offer — bank account,
                  Easypaisa, and/or JazzCash. All optional independently; whatever isn&apos;t set just doesn&apos;t
                  show up in the customer&apos;s payment modal.
                </p>
                <Note>
                  This is configured on the backend server, not inside this app — send your WhatsApp number and
                  payment details to whoever set up your Kinetic OS deployment, the same way you would for any
                  other account-level setting.
                </Note>
              </Section>

              <Section id="switching" title="Switching to automated billing later">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  When there&apos;s enough volume that manually activating each customer stops making sense, ask
                  whoever manages your deployment to switch on automated billing. The Lemon Squeezy integration
                  was built alongside manual mode, not ripped out — &quot;Upgrade plan&quot; will redirect to a
                  real card checkout instead of the WhatsApp modal, no other code changes needed.
                </p>
                <Note>
                  Lemon Squeezy checkout only accepts card and PayPal — and PayPal doesn&apos;t support individual
                  accounts in Pakistan. That&apos;s realistically international-card-only for a Pakistani buyer,
                  which many small business owners don&apos;t have. Worth confirming your customer base has cards
                  before switching, or keep manual mode running alongside it.
                </Note>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  See the{" "}
                  <Link href="/help/integrations#billing" className="text-primary hover:underline">
                    API Integration Guide
                  </Link>{" "}
                  for exactly how to set up a Lemon Squeezy store and get its API keys when that day comes.
                </p>
              </Section>

              <Section id="faq" title="FAQ">
                <Sub title="A customer says they paid but I don't see it anywhere">
                  There&apos;s nothing to &quot;see&quot; automatically in manual mode — bank transfers and mobile
                  wallet payments land in your own bank/JazzCash/Easypaisa app, not inside Kinetic OS. Check
                  there, then activate them per the steps above.
                </Sub>
                <Sub title="Can a customer downgrade or cancel themselves?">
                  Cancel, yes — the Cancel button on their Billing page works in manual mode too, it just marks
                  their subscription cancelled locally. Downgrading isn&apos;t self-serve yet; message them
                  and re-run the activation step with the lower plan.
                </Sub>
                <Sub title="What happens to a plan after 30 days?">
                  Nothing automatic — manual activations don&apos;t auto-renew or auto-charge. Keep track of
                  renewal dates yourself for now (shown as &quot;renews [date]&quot; on their Billing page) and
                  follow up for the next payment.
                </Sub>
                <Sub title="Is this secure enough for real money?">
                  Activation is protected separately from the app itself, using a constant-time secret
                  comparison, and isn&apos;t reachable by any logged-in customer — only whoever holds your
                  deployment&apos;s admin credentials can activate a plan. No payment details ever pass through
                  it; you&apos;re just confirming money you already received elsewhere.
                </Sub>
              </Section>

              <div className="flex items-center gap-2 border-t border-border pt-6">
                <Badge variant="default">Kinetic OS</Badge>
                <span className="text-[12px] text-text-muted">
                  See also the <Link href="/help" className="text-primary hover:underline">full Help &amp; Guide</Link> and
                  the <Link href="/help/integrations" className="text-primary hover:underline">API Integration Guide</Link>.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
