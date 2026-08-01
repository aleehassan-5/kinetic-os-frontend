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
  { id: "billing", label: "Lemon Squeezy (Billing)" },
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
  envVars,
  free,
}: {
  name: string;
  who: "self-serve" | "deployment";
  where: string;
  steps: string[];
  envVars?: string[];
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
      {envVars && envVars.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">Backend .env variables</p>
          <div className="flex flex-wrap gap-1.5">
            {envVars.map((v) => (
              <code key={v} className="rounded bg-black/20 px-1.5 py-0.5 text-[11.5px] text-primary">{v}</code>
            ))}
          </div>
        </div>
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
                  These five you can connect yourself, right now, from{" "}
                  <Link href="/settings" className="text-primary hover:underline">Settings → Integrations</Link>.
                  Click <strong className="text-text-primary">Connect</strong> on any of them — it opens a
                  2-step wizard that shows you exactly where to find the credentials (same info as below), then
                  makes a real test call to verify what you pasted actually works before saving it.
                </p>
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
                  envVars={["WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN"]}
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
                  envVars={["TELEGRAM_BOT_TOKEN"]}
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
                  envVars={["META_APP_ID", "META_APP_SECRET", "META_PAGE_ACCESS_TOKEN"]}
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
                  Everything below this line is set up once on the server (as an environment variable), not
                  from inside the app. If any of these matter to you and aren&apos;t working yet, this section
                  tells you exactly what account to create and what to hand to whoever manages your deployment —
                  you can do the account-creation part yourself and just pass along the resulting key.
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
                  envVars={["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_LOGIN_REDIRECT_URI"]}
                  free="Free. Google will show an unverified-app warning to users until you submit the consent screen for verification, which is worth doing before a real launch."
                />
              </Section>

              <Section id="ai-providers" title="AI Providers (chat replies, intent scoring)">
                <Provider
                  name="OpenAI"
                  who="deployment"
                  where="platform.openai.com"
                  steps={[
                    "Sign up / log in at platform.openai.com.",
                    "Add a payment method under Settings → Billing — the API isn't usable on a free trial alone for most accounts anymore.",
                    "Settings → API Keys → Create new secret key.",
                    "Copy it immediately — like Kinetic OS's own API keys, OpenAI only shows it once.",
                  ]}
                  envVars={["OPENAI_API_KEY", "OPENAI_CHAT_MODEL", "OPENAI_EMBEDDING_MODEL", "OPENAI_IMAGE_MODEL"]}
                  free="Pay-as-you-go, billed by usage — no meaningful free tier for production traffic."
                />
                <Provider
                  name="Anthropic (alternative)"
                  who="deployment"
                  where="console.anthropic.com"
                  steps={[
                    "Sign up / log in at console.anthropic.com.",
                    "Settings → Billing → add credit.",
                    "Settings → API Keys → Create Key.",
                  ]}
                  envVars={["ANTHROPIC_API_KEY"]}
                  free="Pay-as-you-go, billed by usage."
                />
                <Note>
                  Leave both blank and Kinetic OS runs in a local &quot;stub&quot; mode — deterministic
                  placeholder replies and fake embeddings, no external calls or cost. Fine for exploring the
                  product, not for real customer conversations.
                </Note>
              </Section>

              <Section id="calendly" title="Calendly">
                <Provider
                  name="Calendly"
                  who="deployment"
                  where="calendly.com"
                  steps={[
                    "Sign up (or log in) at calendly.com and set up at least one event type — this is the meeting slot leads will book into.",
                    "Integrations → API & Webhooks → Personal Access Tokens → Generate New Token.",
                    "Find your event type's URI by calling GET https://api.calendly.com/event_types with that token (or check your event type's own settings page) — it looks like https://api.calendly.com/event_types/AAAAAAAAAAAAAAAA.",
                    "Still on the API & Webhooks page, create a webhook subscription pointing at https://your-api-domain/webhooks/calendly, subscribed to the invitee.created and invitee.canceled events, and copy its signing key.",
                  ]}
                  envVars={["CALENDLY_ACCESS_TOKEN", "CALENDLY_EVENT_TYPE_URI", "CALENDLY_WEBHOOK_SIGNING_KEY"]}
                  free="Calendly's own free plan covers one event type, which is enough to connect this."
                />
                <Note>
                  A meeting only shows up on the Calendar page once someone actually books through Calendly —
                  the webhook is what creates that record in real time, so it has to be registered correctly for
                  meetings to appear at all.
                </Note>
              </Section>

              <Section id="google-calendar" title="Google Calendar (direct booking)">
                <Provider
                  name="Google Calendar via Service Account"
                  who="deployment"
                  where="console.cloud.google.com"
                  steps={[
                    "Same Google Cloud project as Google Sign-in above (or a new one) — APIs & Services → Enable APIs → enable the \"Google Calendar API\".",
                    "IAM & Admin → Service Accounts → Create Service Account (this creates a robot account, not a normal login).",
                    "Keys tab on that service account → Add Key → Create new key → JSON — this downloads a file containing the private key and the service account's email address.",
                    "Open Google Calendar in your browser, find the specific calendar you want bookings to land on, Settings → \"Share with specific people\" → add the service account's email with \"Make changes to events\" permission.",
                    "Copy that calendar's ID from Settings → \"Integrate calendar\" → Calendar ID (for your primary calendar this is just your Gmail address; for a secondary calendar it looks like a long string ending in @group.calendar.google.com).",
                  ]}
                  envVars={["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", "GOOGLE_CALENDAR_ID"]}
                  free="Free — Google Calendar API has a generous free quota well beyond what a small business needs."
                />
              </Section>

              <Section id="crm" title="HubSpot & Google Sheets (CRM sync)">
                <Provider
                  name="HubSpot"
                  who="deployment"
                  where="app.hubspot.com"
                  steps={[
                    "Log into your HubSpot account (or sign up for a free one).",
                    "Settings (gear icon) → Integrations → Private Apps → Create a private app.",
                    "Name it, then under Scopes enable at least crm.objects.contacts.write and crm.objects.contacts.read.",
                    "Create app → copy the generated access token.",
                  ]}
                  envVars={["HUBSPOT_ACCESS_TOKEN"]}
                  free="HubSpot's free CRM tier is enough for this — private apps aren't gated behind a paid plan."
                />
                <Provider
                  name="Google Sheets"
                  who="deployment"
                  where="console.cloud.google.com"
                  steps={[
                    "Reuses the exact same service account created for Google Calendar above — no separate account needed. Just enable the \"Google Sheets API\" on the same project (APIs & Services → Enable APIs).",
                    "Create (or open) the spreadsheet you want leads synced into, then Share it with the service account's email (Editor access).",
                    "Copy the spreadsheet ID from its URL — the long string between /d/ and /edit, e.g. docs.google.com/spreadsheets/d/THIS_PART/edit.",
                  ]}
                  envVars={["GOOGLE_SHEETS_SPREADSHEET_ID"]}
                  free="Free."
                />
              </Section>

              <Section id="social-publishing" title="Social Publishing (Scheduler)">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Instagram and Facebook publishing reuse the same Meta app credentials as the DM channels
                  above — no separate app needed, just two more IDs.
                </p>
                <Provider
                  name="Instagram + Facebook posting"
                  who="deployment"
                  where="developers.facebook.com"
                  steps={[
                    "Same Meta app as WhatsApp/Instagram DMs — add the \"Instagram Graph API\" product if it isn't already added.",
                    "Grab your Instagram professional account's ID (Graph API Explorer: GET /me/accounts, then GET {page-id}?fields=instagram_business_account).",
                    "Your Facebook Page ID is visible on the Page itself (About → Page transparency), or from the same GET /me/accounts call.",
                  ]}
                  envVars={["INSTAGRAM_BUSINESS_ACCOUNT_ID", "FACEBOOK_PAGE_ID"]}
                  free="Free — usage limits are generous for a single business's own posting volume."
                />
                <Provider
                  name="TikTok"
                  who="deployment"
                  where="developers.tiktok.com"
                  steps={[
                    "Create a developer account at developers.tiktok.com.",
                    "Manage apps → Create an app, and request access to the \"Content Posting API\" product for it.",
                    "TikTok reviews Content Posting API access requests manually — this isn't instant approval like the others.",
                    "Once approved, complete the OAuth flow for your own TikTok business account to get an access token.",
                  ]}
                  envVars={["TIKTOK_ACCESS_TOKEN"]}
                  free="Free, but gated behind TikTok's own app review — budget real time for this one specifically."
                />
                <Provider
                  name="LinkedIn"
                  who="deployment"
                  where="developer.linkedin.com"
                  steps={[
                    "Create an app at developer.linkedin.com (requires an associated LinkedIn Company Page).",
                    "Request access to the \"Share on LinkedIn\" / Community Management API product.",
                    "Complete OAuth for your organization to get an access token, and find your organization's URN under your Page's admin settings (looks like urn:li:organization:12345678).",
                  ]}
                  envVars={["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_ORGANIZATION_URN"]}
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
                  who="deployment"
                  where="elevenlabs.io"
                  steps={[
                    "Sign up at elevenlabs.io.",
                    "Profile icon (top right) → API Keys → copy your key.",
                  ]}
                  envVars={["ELEVENLABS_API_KEY"]}
                  free="Free tier includes a limited number of characters per month, enough to try it out."
                />
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Leave this blank and reels still generate — just as silent video with the script as on-screen
                  text, no narration.
                </p>
              </Section>

              <Section id="billing" title="Lemon Squeezy (Billing)">
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
                  envVars={[
                    "LEMONSQUEEZY_API_KEY",
                    "LEMONSQUEEZY_STORE_ID",
                    "LEMONSQUEEZY_WEBHOOK_SECRET",
                    "LEMONSQUEEZY_VARIANT_STARTER",
                    "LEMONSQUEEZY_VARIANT_GROWTH",
                    "LEMONSQUEEZY_VARIANT_SCALE",
                  ]}
                  free="Free to set up — Lemon Squeezy takes a percentage per transaction instead of a monthly fee."
                />
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
                  envVars={["SENTRY_DSN"]}
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
