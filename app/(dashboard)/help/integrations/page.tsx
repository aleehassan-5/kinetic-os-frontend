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
  { id: "self-serve", label: "Self-serve (Settings)" },
  { id: "whatsapp", label: "WhatsApp Business" },
  { id: "telegram", label: "Telegram" },
  { id: "instagram-messenger", label: "Instagram DMs & Messenger" },
  { id: "email", label: "Email (SMTP)" },
  { id: "deployment-level", label: "Deployment-level (.env)" },
  { id: "google-login", label: "Google Sign-in" },
  { id: "ai-providers", label: "AI Providers" },
  { id: "calendly", label: "Calendly" },
  { id: "google-calendar", label: "Google Calendar" },
  { id: "crm", label: "HubSpot & Google Sheets" },
  { id: "social-publishing", label: "Social Publishing" },
  { id: "elevenlabs", label: "ElevenLabs Voiceover" },
  { id: "billing", label: "Billing (manual by default)" },
  { id: "sentry", label: "Sentry (Monitoring)" },
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

function Provider({
  name,
  who,
  where,
  steps,
  free,
}: {
  name: string;
  who: "self-serve" | "deployment";
  where: string;
  steps: string[];
  free?: string;
}) {
  return (
    <div className="rounded-control border border-border bg-white/[0.02] p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="text-[14px] font-semibold text-text-primary">{name}</h3>
        <Badge variant={who === "self-serve" ? "success" : "default"} dot>
          {who === "self-serve" ? "Connect it yourself" : "Deployment-level"}
        </Badge>
      </div>
      <p className="mb-2 text-[12.5px] text-text-muted">
        Get your credentials at: <a href={`https://${where}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{where}</a>
      </p>
      <ol className="ml-4 list-decimal space-y-1.5 text-[13px] leading-relaxed text-text-secondary">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      {who === "deployment" && (
        <p className="mt-3 text-[12px] text-text-muted">
          Send whatever you get here to whoever manages your Kinetic OS deployment — it&apos;s configured on
          the backend server, not inside this app.
        </p>
      )}
      {free && <p className="mt-2.5 text-[12px] text-text-muted">{free}</p>}
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

export default function IntegrationsGuidePage() {
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
      <Topnav title="API Integration Guide" subtitle="Every account you need, where to make it, and exactly what to paste in" />

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
                  Kinetic OS talks to a lot of outside services — messaging apps, an AI provider, a calendar
                  tool, social platforms, a payment processor. None of them come bundled in; each one needs its
                  own account and its own API key/token. This page lists every single one, where to sign up,
                  and exactly what to copy into Kinetic OS.
                </p>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  There are two different ways an integration gets connected — knowing which kind each one is
                  saves a lot of confusion:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-control border border-success/25 bg-success-muted p-3.5">
                    <p className="text-[13px] font-semibold text-success">Self-serve, in the app</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-text-secondary">
                      You go to <Link href="/settings" className="text-primary hover:underline">Settings → Integrations</Link>,
                      click Connect, and paste your own credentials in — done in a couple of minutes, no
                      developer help needed.
                    </p>
                  </div>
                  <div className="rounded-control border border-border bg-white/[0.02] p-3.5">
                    <p className="text-[13px] font-semibold text-text-primary">Deployment-level</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-text-secondary">
                      Set once as an environment variable on the server, by whoever manages your Kinetic OS
                      deployment (usually the developer who set it up for you). There&apos;s no button for these
                      inside the app yet.
                    </p>
                  </div>
                </div>
              </Section>

              <Section id="self-serve" title="Self-serve integrations (Settings → Integrations)">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  All of these you can connect yourself, right now, from{" "}
                  <Link href="/settings" className="text-primary hover:underline">Settings → Integrations</Link>.
                  Click <strong className="text-text-primary">Connect</strong> on any of them — it opens the same
                  guided 2-step wizard everywhere: fill in credentials with instructions shown right there, then
                  a real test call against that provider&apos;s API before it lets you save, so a typo gets caught
                  immediately instead of failing silently later.
                </p>
                <Note>
                  Wherever a card shows <strong>&quot;Using deployment default&quot;</strong> instead of
                  &quot;Not connected,&quot; it means whoever manages your server already set a fallback key for
                  the whole deployment — you can still connect your own to override it for this workspace
                  specifically, or leave it as-is and it just works already.
                </Note>
              </Section>

              <Section id="whatsapp" title="WhatsApp Business">
                <Provider
                  name="WhatsApp Cloud API (Meta)"
                  who="self-serve"
                  where="developers.facebook.com"
                  steps={[
                    "Create a free Meta developer account at developers.facebook.com if you don't have one.",
                    "My Apps → Create App → choose \"Business\" as the app type.",
                    "In your new app's dashboard, find \"WhatsApp\" in the product list and click Set up.",
                    "On the WhatsApp → API Setup screen, you'll see a test phone number already provisioned, with a Phone Number ID and a temporary access token right there on the page.",
                    "Copy the Phone Number ID and Access Token into Kinetic OS: Settings → Integrations → WhatsApp Business → Connect.",
                  ]}
                  free="Meta's test number works immediately for development. For a real business number that customers can message, you'll need to go through Meta's business verification — that part isn't instant, budget a few days."
                />
                <Note>
                  The temporary access token Meta gives you on that setup page expires in 24 hours. For anything
                  beyond quick testing, generate a permanent token instead: App dashboard → System Users (under
                  Business Settings) → create a system user → generate a token with the{" "}
                  <code className="rounded bg-black/20 px-1 py-0.5 text-primary">whatsapp_business_messaging</code>{" "}
                  permission.
                </Note>
              </Section>

              <Section id="telegram" title="Telegram">
                <Provider
                  name="Telegram Bot API"
                  who="self-serve"
                  where="telegram.org"
                  steps={[
                    "Open Telegram (app or web) and search for the account @BotFather — it's Telegram's own official bot for creating bots.",
                    "Send it the command /newbot.",
                    "Follow the prompts: give your bot a display name, then a username (must end in \"bot\", e.g. yourbusiness_bot).",
                    "BotFather replies with a token that looks like 123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11 — copy that whole string.",
                    "Paste it into Kinetic OS: Settings → Integrations → Telegram → Connect.",
                  ]}
                  free="Entirely free, no approval process — this is the fastest one to set up."
                />
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Once connected, Kinetic OS registers its own webhook for that bot automatically — nothing else
                  to configure on Telegram&apos;s side.
                </p>
              </Section>

              <Section id="instagram-messenger" title="Instagram DMs & Messenger">
                <Provider
                  name="Instagram DMs / Messenger (Meta Graph API)"
                  who="self-serve"
                  where="developers.facebook.com"
                  steps={[
                    "Same Meta app as WhatsApp above (you can reuse it) — or create a new one, type \"Business\".",
                    "Add the \"Messenger\" product to the app from the product list.",
                    "Under Messenger → Settings, connect a Facebook Page you manage (for Instagram DMs, that Page needs to already be linked to your Instagram professional/business account — do that from Instagram's own Settings → Linked accounts first if it isn't already).",
                    "Still on Messenger → Settings, copy the Page ID, then click \"Generate Token\" next to that Page to get a Page Access Token.",
                    "Paste both into Kinetic OS: Settings → Integrations → Instagram DMs (or Messenger) → Connect.",
                  ]}
                  free="Free for development/testing with your own accounts. Messaging people who aren't added as testers on your app requires Meta's App Review — plan for that before a real launch."
                />
              </Section>

              <Section id="email" title="Email (SMTP)">
                <Provider
                  name="Email"
                  who="self-serve"
                  where="app.kineticos (Settings only — no external account needed for this step)"
                  steps={[
                    "The actual mail server (SMTP credentials) is already configured for this deployment by whoever manages it — you don't need your own mail provider account for this one.",
                    "Go to Settings → Integrations → Email → Connect.",
                    "Enter the address you want replies to appear to come from (e.g. hello@yourbusiness.com).",
                    "Kinetic OS confirms the shared mail account is working and records that address.",
                  ]}
                />
                <Note>
                  If you want fully independent, dedicated email sending (not the shared server account), that
                  requires setting up your own SMTP provider (e.g. SendGrid, Postmark, Amazon SES) — that part is
                  deployment-level, see below.
                </Note>
              </Section>

              <Section id="deployment-level" title="Deployment-level integrations">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Everything below this line is genuinely different from the rest — these are things that only
                  make sense to configure once per deployment (not per workspace), so they&apos;re still set up
                  as an environment variable on the server by whoever manages it, not from inside the app. You
                  can still do the account-creation part yourself and just hand off the resulting key.
                </p>
              </Section>

              <Section id="google-login" title={'Google Sign-in ("Continue with Google")'}>
                <Provider
                  name="Google OAuth Client"
                  who="deployment"
                  where="console.cloud.google.com"
                  steps={[
                    "Google Cloud Console → create a new project (or use an existing one).",
                    "APIs & Services → OAuth consent screen — fill in an app name, support email, and set it to \"External\" (unless every user has a Google Workspace account on your own domain).",
                    "APIs & Services → Credentials → Create Credentials → OAuth client ID → Application type: Web application.",
                    "Under \"Authorized redirect URIs\" add both: https://your-api-domain/auth/google/callback (login) and https://your-api-domain/integrations/google/callback (Calendar booking, if you'll use that too).",
                    "Copy the generated Client ID and Client Secret.",
                  ]}
                  free="Free. Google will show an unverified-app warning to users until you submit the consent screen for verification, which is worth doing before a real launch."
                />
              </Section>

              <Section id="ai-providers" title="AI Providers (chat replies, intent scoring)">
                <Provider
                  name="OpenAI"
                  who="self-serve"
                  where="platform.openai.com/api-keys"
                  steps={[
                    "Sign in at platform.openai.com/api-keys and click Create new secret key.",
                    "Copy it immediately — OpenAI only shows it once.",
                    "Add a card on file at platform.openai.com/settings/organization/billing — the key won't work without one.",
                    "Paste it into Kinetic OS: Settings → Integrations → AI Providers → OpenAI → Connect.",
                  ]}
                  free="Pay-as-you-go, billed by usage — no meaningful free tier for production traffic."
                />
                <Provider
                  name="Anthropic"
                  who="self-serve"
                  where="console.anthropic.com/settings/keys"
                  steps={[
                    "Sign in at console.anthropic.com/settings/keys and click Create Key.",
                    "Copy it immediately — it's only shown once.",
                    "Connect it the same way: Settings → Integrations → AI Providers → Anthropic → Connect.",
                  ]}
                  free="Pay-as-you-go, billed by usage. Currently reserved for upcoming Claude-powered features."
                />
                <Note>
                  Connect nothing here and Kinetic OS runs in a local &quot;stub&quot; mode — deterministic
                  placeholder replies and fake embeddings, no external calls or cost. Fine for exploring the
                  product, not for real customer conversations.
                </Note>
              </Section>

              <Section id="calendly" title="Calendly">
                <Provider
                  name="Calendly"
                  who="self-serve"
                  where="calendly.com"
                  steps={[
                    "Sign up (or log in) at calendly.com and set up at least one event type — this is the meeting slot leads will book into.",
                    "Integrations & apps → API & Webhooks → Personal access tokens → generate one.",
                    "Open that event type → Edit → Share via API and copy its API URI (looks like https://api.calendly.com/event_types/AAAA...).",
                    "Paste both into Kinetic OS: Settings → Integrations → Scheduling → Calendly → Connect.",
                  ]}
                  free="Calendly's own free plan covers one event type, which is enough to connect this."
                />
                <Note>
                  A meeting only shows up on the Calendar page once someone actually books through Calendly — a
                  webhook (registered automatically once you connect) is what creates that record in real time.
                </Note>
              </Section>

              <Section id="google-calendar" title="Google Calendar (direct booking)">
                <Provider
                  name="Google Calendar via Service Account"
                  who="self-serve"
                  where="console.cloud.google.com"
                  steps={[
                    "Google Cloud Console → APIs & Services → Enable APIs → enable the \"Google Calendar API\".",
                    "IAM & Admin → Service Accounts → Create Service Account (this creates a robot account, not a normal login).",
                    "Keys tab on that service account → Add Key → Create new key → JSON — this downloads a file with the private key and the service account's email address.",
                    "In Google Calendar, open the specific calendar you want bookings to land on → Settings → \"Share with specific people\" → add the service account's email as editor.",
                    "Copy that calendar's ID from Settings → \"Integrate calendar\" → Calendar ID.",
                    "Paste the whole downloaded JSON file plus the Calendar ID into Kinetic OS: Settings → Integrations → Scheduling → Google Calendar → Connect.",
                  ]}
                  free="Free — Google Calendar API has a generous free quota well beyond what a small business needs."
                />
              </Section>

              <Section id="crm" title="HubSpot & Google Sheets (CRM sync)">
                <Provider
                  name="HubSpot"
                  who="self-serve"
                  where="app.hubspot.com"
                  steps={[
                    "Log into your HubSpot account (or sign up for a free one).",
                    "Settings (gear icon) → Integrations → Private Apps → Create a private app.",
                    "Name it, then under Scopes enable crm.objects.contacts.write.",
                    "Create app → copy the generated access token → paste into Kinetic OS: Settings → Integrations → CRM → HubSpot → Connect.",
                  ]}
                  free="HubSpot's free CRM tier is enough for this — private apps aren't gated behind a paid plan."
                />
                <Provider
                  name="Google Sheets"
                  who="self-serve"
                  where="console.cloud.google.com"
                  steps={[
                    "Reuses the exact same service account created for Google Calendar above (or make a new one) — just also enable the \"Google Sheets API\" on that project.",
                    "Open the spreadsheet you want leads synced into → Share it with the service account's email as editor.",
                    "Copy the spreadsheet ID from its URL — the long string between /d/ and /edit.",
                    "Paste the JSON key plus the Spreadsheet ID into Kinetic OS: Settings → Integrations → CRM → Google Sheets → Connect.",
                  ]}
                  free="Free."
                />
              </Section>

              <Section id="social-publishing" title="Social Publishing (Scheduler)">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  All four connect from Settings → Integrations → Social Accounts. Instagram and Facebook reuse
                  the same Meta app as the DM channels above.
                </p>
                <Provider
                  name="Instagram publishing"
                  who="self-serve"
                  where="developers.facebook.com"
                  steps={[
                    "Same Meta app as WhatsApp/Instagram DMs → Instagram Graph API → generate a Page Access Token for the Facebook Page linked to your Instagram Business account.",
                    "Copy the Instagram Business Account ID from that Page's settings.",
                    "Paste both into Kinetic OS: Settings → Integrations → Social Accounts → Instagram → Connect.",
                  ]}
                  free="Free — usage limits are generous for a single business's own posting volume."
                />
                <Provider
                  name="Facebook Page publishing"
                  who="self-serve"
                  where="developers.facebook.com"
                  steps={[
                    "Same Meta app → Messenger → Settings → generate a Page Access Token for the Page you want to publish to, and copy its Page ID.",
                    "Paste both into Kinetic OS: Settings → Integrations → Social Accounts → Facebook Page → Connect.",
                  ]}
                  free="Free."
                />
                <Provider
                  name="TikTok"
                  who="self-serve"
                  where="developers.tiktok.com"
                  steps={[
                    "Create a developer account, then Manage apps → your app.",
                    "Complete the OAuth flow with the video.publish scope to get an access token.",
                    "TikTok reviews Content Posting API access requests manually — this isn't instant like the others, budget real time for it.",
                    "Paste the access token into Kinetic OS: Settings → Integrations → Social Accounts → TikTok → Connect.",
                  ]}
                  free="Free, but gated behind TikTok's own app review."
                />
                <Provider
                  name="LinkedIn"
                  who="self-serve"
                  where="developer.linkedin.com"
                  steps={[
                    "Create an app (requires an associated LinkedIn Company Page) → Auth tab.",
                    "Generate an access token with the w_organization_social scope.",
                    "Find your organization's URN under your Page's admin settings URL (looks like urn:li:organization:12345).",
                    "Paste both into Kinetic OS: Settings → Integrations → Social Accounts → LinkedIn → Connect.",
                  ]}
                  free="Free, also gated behind LinkedIn's own product access review."
                />
                <Note>
                  LinkedIn video (Reel) posting isn&apos;t implemented in Kinetic OS yet — text and image posts
                  work fine there.
                </Note>
              </Section>

              <Section id="elevenlabs" title="ElevenLabs (AI voiceover)">
                <Provider
                  name="ElevenLabs"
                  who="self-serve"
                  where="elevenlabs.io"
                  steps={[
                    "Sign up at elevenlabs.io.",
                    "Profile icon (top right) → API Keys → Create API Key.",
                    "Paste it into Kinetic OS: Settings → Integrations → AI Providers → ElevenLabs → Connect.",
                  ]}
                  free="Free tier includes a limited number of characters per month, enough to try it out."
                />
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Leave this disconnected and reels still generate — just as silent video with the script as
                  on-screen text, no narration.
                </p>
              </Section>

              <Section id="billing" title="Billing (manual by default)">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Kinetic OS bills manually out of the box — customers pay by WhatsApp / bank transfer /
                  JazzCash / Easypaisa, and you activate their plan by hand. There&apos;s no account to create
                  or key to fetch for this to work; whoever manages your deployment just needs your WhatsApp
                  number and whichever payment details you want to offer.
                </p>
                <Link
                  href="/help/billing"
                  className="flex items-center justify-between rounded-control border border-primary/25 bg-primary-muted/40 px-3.5 py-3 text-[13px] text-text-primary transition-colors duration-200 hover:bg-primary-muted"
                >
                  <span>
                    <strong className="text-primary">Full walkthrough</strong> — how to activate a customer,
                    how pricing works, and how this all fits together.
                  </span>
                  <span className="text-primary">→</span>
                </Link>

                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  Automated card checkout is available when you&apos;re ready for it — set{" "}
                  <code className="rounded bg-black/20 px-1 py-0.5 text-primary">BILLING_MODE=lemonsqueezy</code>:
                </p>
                <Provider
                  name="Lemon Squeezy"
                  who="deployment"
                  where="lemonsqueezy.com"
                  steps={[
                    "Create a store at lemonsqueezy.com and complete their account verification (needed before you can accept real payments).",
                    "Settings → API → Create API key.",
                    "Your Store ID is shown right on that same Settings → API page.",
                    "Create one product per plan tier (Starter / Growth / Scale) — each product's default variant ID is on its product page under Variants.",
                    "Settings → Webhooks → Create webhook pointing at https://your-api-domain/webhooks/lemonsqueezy, subscribed to subscription events, and copy the signing secret shown there.",
                  ]}
                  free="Free to set up — Lemon Squeezy takes a percentage per transaction instead of a monthly fee."
                />
                <Note>
                  Lemon Squeezy checkout only accepts card and PayPal — and PayPal doesn&apos;t support
                  individual accounts in Pakistan. Confirm your customer base actually has international cards
                  before relying on this as the only payment option.
                </Note>
              </Section>

              <Section id="sentry" title="Sentry (error monitoring)">
                <Provider
                  name="Sentry"
                  who="deployment"
                  where="sentry.io"
                  steps={[
                    "Sign up at sentry.io (free tier is enough to start).",
                    "Create a new project, framework: Node.js.",
                    "Settings → Client Keys (DSN) → copy the DSN shown there.",
                  ]}
                  free="Free tier covers a generous volume of errors per month for a small business."
                />
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Optional — errors are always logged locally on the server either way, this just also sends
                  them somewhere you can see without SSH-ing in.
                </p>
              </Section>

              <Section id="faq" title="FAQ">
                <div className="space-y-3 text-[13px] leading-relaxed text-text-secondary">
                  <p>
                    <strong className="text-text-primary">Do I need all of these?</strong> No. Connect only what
                    you&apos;ll actually use. Everything not connected simply shows &quot;Not connected&quot; and that
                    feature quietly does less (or nothing) — nothing breaks elsewhere in the app.
                  </p>
                  <p>
                    <strong className="text-text-primary">I created the account and have a key — now what?</strong>{" "}
                    For anything marked &quot;Connect it yourself&quot; above, paste it straight into{" "}
                    <Link href="/settings" className="text-primary hover:underline">Settings → Integrations</Link>.
                    For anything marked &quot;Deployment-level,&quot; send the key to whoever manages your
                    Kinetic OS server — it goes into their <code className="rounded bg-black/20 px-1 py-0.5 text-primary">.env</code> file,
                    not into the app itself.
                  </p>
                  <p>
                    <strong className="text-text-primary">Is my key safe once I paste it in?</strong> Channel
                    credentials you connect yourself are encrypted before being stored. Never paste an API key
                    into a chat message, a screenshot, or anywhere outside the actual Settings form.
                  </p>
                  <p>
                    <strong className="text-text-primary">Something says &quot;Action needed&quot;.</strong> That
                    means Kinetic OS tried to use that connection and it failed — usually an expired or revoked
                    token. Reconnect it the same way you connected it the first time.
                  </p>
                </div>
              </Section>

              <div className="flex items-center gap-2 border-t border-border pt-6">
                <Badge variant="default">Kinetic OS</Badge>
                <span className="text-[12px] text-text-muted">
                  See also the <Link href="/help" className="text-primary hover:underline">full Help &amp; Guide</Link> for how each connected integration is actually used inside the product.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
