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
  { id: "using-billing", label: "Using the Billing page" },
  { id: "setup", label: "Setting up Lemon Squeezy" },
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

function BtnList({ items }: { items: { name: string; does: string }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.name} className="flex gap-2 rounded-control border border-border bg-white/[0.02] p-3">
          <span className="shrink-0 rounded bg-primary-muted px-1.5 py-0.5 text-[11.5px] font-semibold text-primary">
            {it.name}
          </span>
          <span className="text-[12.5px] leading-relaxed text-text-secondary">{it.does}</span>
        </li>
      ))}
    </ul>
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
      <Topnav title="Billing User Guide" subtitle="How plans, invoices, and payment work — and how it's set up behind the scenes" />

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
                  Billing in Kinetic OS runs on Lemon Squeezy — plan checkout, payment methods, and invoices all
                  happen on their secure pages, not inside Kinetic OS itself. This guide covers both sides: how
                  to use the <Link href="/billing" className="text-primary hover:underline">Billing</Link> page
                  day-to-day, and — if you&apos;re the one managing this deployment — how Lemon Squeezy gets
                  connected in the first place.
                </p>
              </Section>

              <Section id="using-billing" title="Using the Billing page">
                <BtnList
                  items={[
                    { name: "Upgrade plan", does: "Opens a secure Lemon Squeezy checkout page in a new tab for the next plan tier up." },
                    { name: "Update payment method", does: "Opens the billing portal in a new tab, where you can change your card on file." },
                    { name: "Download icon (per invoice row)", does: "Opens that invoice's PDF in a new tab. Greyed out if no invoice file is available yet for that entry." },
                  ]}
                />
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  The usage meters (leads, AI messages, workflow runs, etc.) show how much of your current
                  plan&apos;s monthly allowance you&apos;ve used — read-only, resets each billing period.
                </p>
                <Note>
                  If a button here says it can&apos;t open a link, billing usually just isn&apos;t connected on
                  this deployment yet — see setup below.
                </Note>
              </Section>

              <Section id="setup" title="Setting up Lemon Squeezy (deployment-level)">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  This part isn&apos;t done from inside Kinetic OS — it&apos;s set up once as an environment
                  variable on the server, by whoever manages your deployment. You can still create the account
                  and generate everything yourself, then hand off the resulting keys.
                </p>
                <div className="rounded-control border border-border bg-white/[0.02] p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-text-primary">Lemon Squeezy</h3>
                    <Badge variant="default" dot>Deployment-level</Badge>
                  </div>
                  <p className="mb-2 text-[12.5px] text-text-muted">
                    Create your account at:{" "}
                    <a href="https://lemonsqueezy.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      lemonsqueezy.com
                    </a>
                  </p>
                  <ol className="ml-4 list-decimal space-y-1.5 text-[13px] leading-relaxed text-text-secondary">
                    <li>Create a store at lemonsqueezy.com and complete their account verification (needed before you can accept real payments).</li>
                    <li>Settings → API → Create API key.</li>
                    <li>Your Store ID is shown right on that same Settings → API page.</li>
                    <li>Create one product per plan tier (Starter / Growth / Scale) — each product&apos;s default variant ID is on its product page under Variants.</li>
                    <li>Settings → Webhooks → Create webhook pointing at https://your-api-domain/webhooks/lemonsqueezy, subscribed to subscription events, and copy the signing secret shown there.</li>
                  </ol>
                  <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">Backend .env variables</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "LEMONSQUEEZY_API_KEY",
                        "LEMONSQUEEZY_STORE_ID",
                        "LEMONSQUEEZY_WEBHOOK_SECRET",
                        "LEMONSQUEEZY_VARIANT_STARTER",
                        "LEMONSQUEEZY_VARIANT_GROWTH",
                        "LEMONSQUEEZY_VARIANT_SCALE",
                      ].map((v) => (
                        <code key={v} className="rounded bg-black/20 px-1.5 py-0.5 text-[11.5px] text-primary">{v}</code>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2.5 text-[12px] text-text-muted">
                    Free to set up — Lemon Squeezy takes a percentage per transaction instead of a monthly fee.
                  </p>
                </div>
              </Section>

              <Section id="faq" title="FAQ">
                <div className="space-y-3 text-[13px] leading-relaxed text-text-secondary">
                  <p>
                    <strong className="text-text-primary">The Billing page looks empty / buttons don&apos;t do anything.</strong>{" "}
                    Lemon Squeezy hasn&apos;t been connected on this deployment yet — pass the setup steps above
                    along to whoever manages the server.
                  </p>
                  <p>
                    <strong className="text-text-primary">Where do I see what plan I&apos;m on?</strong> At the
                    top of the <Link href="/billing" className="text-primary hover:underline">Billing</Link> page,
                    alongside the usage meters for the current period.
                  </p>
                  <p>
                    <strong className="text-text-primary">Can I cancel or downgrade from here?</strong>{" "}
                    <strong className="text-text-primary">Update payment method</strong> opens Lemon Squeezy&apos;s
                    own billing portal in a new tab — plan changes and cancellation happen there, on their
                    secure page.
                  </p>
                </div>
              </Section>

              <div className="flex items-center gap-2 border-t border-border pt-6">
                <Badge variant="default">Kinetic OS</Badge>
                <span className="text-[12px] text-text-muted">
                  See also the{" "}
                  <Link href="/help/integrations" className="text-primary hover:underline">API Integration Guide</Link>{" "}
                  for every other account this deployment can connect.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
