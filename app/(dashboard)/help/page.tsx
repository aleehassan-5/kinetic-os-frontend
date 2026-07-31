"use client";

import * as React from "react";
import { Topnav } from "@/components/layout/topnav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  label: string;
}

const toc: TocItem[] = [
  { id: "getting-started", label: "Getting Started" },
  { id: "account-menu", label: "Account Menu" },
  { id: "dashboard", label: "Dashboard" },
  { id: "leads", label: "Lead Inbox" },
  { id: "chat", label: "AI Chat" },
  { id: "knowledge", label: "Knowledge Base" },
  { id: "listings", label: "Listings" },
  { id: "workflows", label: "Workflow Builder" },
  { id: "scheduler", label: "Social Scheduler" },
  { id: "calendar", label: "Calendar" },
  { id: "team", label: "Team" },
  { id: "billing", label: "Billing" },
  { id: "settings", label: "Settings" },
  { id: "faq", label: "FAQ & Troubleshooting" },
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

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-control border border-primary/25 bg-primary-muted/40 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-text-primary">
      <strong className="font-semibold text-primary">Tip — </strong>
      {children}
    </p>
  );
}

export default function HelpPage() {
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
      <Topnav title="Help & Guide" subtitle="Every page, every button — how to use Kinetic OS" />

      <main className="p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* In-page table of contents */}
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

          {/* Content */}
          <Card className="min-w-0 flex-1">
            <CardContent className="space-y-12 p-6 lg:p-8">
              <Section id="getting-started" title="Getting Started">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Kinetic OS runs one workspace per business — it&apos;s not an open sign-up product where
                  strangers can join. The very first person to create an account becomes the{" "}
                  <strong className="text-text-primary">workspace owner</strong>, and public sign-up closes
                  right after that. Everyone else who needs access joins later through an invite (see{" "}
                  <a href="#team" className="text-primary hover:underline">Team</a>).
                </p>
                <Sub title="Signing up">
                  <p>
                    On the sign-up screen, fill in your first name, last name, company name, work email, and a
                    password (minimum 8 characters) — or skip the form entirely and use the{" "}
                    <strong className="text-text-primary">Google</strong> button to sign up with your Google
                    account instead.
                  </p>
                  <Note>
                    There&apos;s also a &quot;Microsoft&quot; button next to Google on the sign-up screen — it&apos;s
                    not wired up yet, so tapping it currently does nothing. Use email/password or Google for now.
                  </Note>
                </Sub>
                <Sub title="Logging in">
                  <p>
                    Enter your email and password, or use <strong className="text-text-primary">Continue with
                    Google</strong>. If you signed up with Google originally, always use the Google button — there&apos;s
                    no separate password for that account unless you set one.
                  </p>
                  <p>
                    Forgot your password? Use the <strong className="text-text-primary">Forgot password?</strong>{" "}
                    link on the login screen — it emails you a reset link that takes you to a page where you set a
                    new one.
                  </p>
                </Sub>
              </Section>

              <Section id="account-menu" title="Account Menu">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Click your name/avatar at the bottom of the left sidebar (or, on mobile, at the bottom of the
                  slide-out menu) to open the account menu.
                </p>
                <BtnList
                  items={[
                    { name: "Light mode / Dark mode", does: "Switches the whole app's color theme. Your choice is remembered on this device — it'll still be there next time you open the app." },
                    { name: "Log out", does: "Signs you out and returns you to the login screen." },
                  ]}
                />
              </Section>

              <Section id="dashboard" title="Dashboard">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Your home screen — a snapshot of how the business is doing, framed in outcomes (customers,
                  revenue, hours saved) rather than raw technical numbers.
                </p>
                <Sub title="Ops check-in (top banner)">
                  <p>
                    A short AI-written summary of what needs your attention right now — hot leads nobody&apos;s
                    replied to, workflows that failed, integrations that need reconnecting. Tap the{" "}
                    <strong className="text-text-primary">refresh icon</strong> on the right to regenerate it.
                  </p>
                </Sub>
                <Sub title="Stat cards">
                  <p>
                    Customers Added This Week, Expected Revenue This Week, Hours Reclaimed, New Inquiries, AI
                    Reply Rate, Meetings Booked, and average Buying Intent — each shows the current number and how
                    it changed vs. the previous period. These are read-only; nothing to click.
                  </p>
                  <Tip>
                    Expected Revenue only counts customers who have a deal value set. Set one from any lead&apos;s
                    detail panel (see <a href="#leads" className="text-primary hover:underline">Lead Inbox</a>) once
                    they convert to a customer, and it flows into this number automatically.
                  </Tip>
                </Sub>
                <Sub title="Lead Volume &amp; AI Response chart">
                  Leads captured vs. AI replies sent, over the last 7 days. Read-only.
                </Sub>
                <Sub title="Channel Breakdown">
                  Which channel (WhatsApp, Instagram, Email, etc.) your leads are coming from, as a percentage bar
                  per channel.
                </Sub>
                <Sub title="Recent Activity">
                  A timeline of the latest events across the workspace — new leads, replies sent, workflows run.
                </Sub>
                <Sub title="Content Queue">
                  A preview of your next 3 scheduled social posts. Click{" "}
                  <a href="#scheduler" className="text-primary hover:underline">Social Scheduler</a> in the
                  sidebar to see and manage the full queue.
                </Sub>
              </Section>

              <Section id="leads" title="Lead Inbox">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  One unified inbox for every channel — WhatsApp, Instagram, Telegram, Messenger, and Email.
                  Two-column layout: conversation list on the left, full conversation + actions on the right.
                </p>
                <Sub title="Filtering the list">
                  <BtnList
                    items={[
                      { name: "Channel pills (All / WhatsApp / Instagram / …)", does: "Shows only leads from that channel." },
                      { name: "Filter icon (top right of the list)", does: "Opens advanced filters: minimum intent score, and sort by most recent or highest intent." },
                    ]}
                  />
                </Sub>
                <Sub title="Conversation detail panel (right side)">
                  <BtnList
                    items={[
                      { name: "⋯ (more options)", does: "Placeholder button in the header — currently no menu opens from it." },
                      { name: "Intent score", does: "Read-only AI-estimated buying intent, 0–100." },
                      { name: "Status dropdown", does: "Change the lead's stage: New, Replied, Qualified, Booked, Customer, or Lost. Saves immediately." },
                      { name: "Deal value field", does: "Only appears once status is \"Customer.\" Enter the deal's dollar value — it feeds directly into the Dashboard's Expected Revenue number. Saves when you click away or press Enter." },
                      { name: "Schedule Meeting", does: "Visible in the reply bar, but not wired to any action yet — clicking it does nothing right now. Use the Calendar page for meeting info instead." },
                      { name: "Log Call", does: "Same as above — currently decorative, no action attached." },
                      { name: "Message input + send button", does: "Type a reply and press Enter (or click the send button) to send it directly to the lead on their original channel." },
                    ]}
                  />
                </Sub>
              </Section>

              <Section id="chat" title="AI Chat">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  A chat assistant grounded in whatever you&apos;ve added to your{" "}
                  <a href="#knowledge" className="text-primary hover:underline">Knowledge Base</a> — useful for
                  quickly checking pricing, policies, or how something is set up without digging through
                  documents yourself.
                </p>
                <BtnList
                  items={[
                    { name: "New chat", does: "Starts a fresh conversation thread, listed on the left." },
                    { name: "Conversation list (left)", does: "Switch between chat threads you've started this session." },
                    { name: "Paperclip icon", does: "Present in the message bar but not connected to a file picker yet — attaching files isn't available here." },
                    { name: "Message box + send", does: "Type your question, press Enter or click send." },
                    { name: "\"N sources last used\"", does: "Shows how many Knowledge Base documents the last answer pulled from." },
                  ]}
                />
                <Note>
                  Chat threads live only in this browser tab for now — refreshing the page clears them. They
                  aren&apos;t saved to your account yet.
                </Note>
              </Section>

              <Section id="knowledge" title="Knowledge Base">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Everything here grounds the AI&apos;s replies in <a href="#leads" className="text-primary hover:underline">Lead Inbox</a> and{" "}
                  <a href="#chat" className="text-primary hover:underline">AI Chat</a> — so the AI answers using
                  your actual pricing, policies, and product info instead of guessing.
                </p>
                <Sub title="Top stat cards">
                  Total documents, indexed &amp; ready count, vector chunks, and storage used — read-only.
                </Sub>
                <Sub title="Add content">
                  <BtnList
                    items={[
                      { name: "Drag &amp; drop / click to upload", does: "Upload a PDF, DOCX, or spreadsheet — it gets chunked and embedded automatically for search." },
                      { name: "Crawl a website (link icon)", does: "Opens a form for a page title and URL — Kinetic OS fetches and indexes that page's content." },
                      { name: "Add FAQ (speech-bubble icon)", does: "Opens a form to manually type in a title and content block, useful for policies or Q&A pairs that don't exist as a document anywhere." },
                    ]}
                  />
                </Sub>
                <Sub title="Document table">
                  <p>Filter by type (PDF / DOCX / URL / FAQ / Sheet) using the pills above the table.</p>
                  <BtnList
                    items={[
                      { name: "Status column", does: "Queued → Processing → Indexed (ready to use), or Failed if something went wrong." },
                      { name: "Delete (trash icon)", does: "Removes the document and its indexed chunks permanently." },
                    ]}
                  />
                </Sub>
              </Section>

              <Section id="listings" title="Listings">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  A simple catalog of your current offers (products, properties, packages — whatever you sell)
                  that the AI content engine can turn into social posts.
                </p>
                <BtnList
                  items={[
                    { name: "Add listing", does: "Opens a form: title, description, price, location. Saving a new listing (not an edit) also queues a few AI-drafted post ideas automatically — you'll see a banner confirming that." },
                    { name: "Generate content plan", does: "On each listing card — asks the AI to propose a target audience and a few post ideas for that specific listing. Nothing publishes automatically; review and schedule from Social Scheduler." },
                    { name: "Pencil icon", does: "Edit the listing's details." },
                    { name: "Trash icon", does: "Delete the listing permanently." },
                  ]}
                />
              </Section>

              <Section id="workflows" title="Workflow Builder">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Visual automation: trigger → score → condition → action. This is where auto-replies, lead
                  scoring rules, and follow-up sequences live.
                </p>
                <Sub title="Top bar">
                  <BtnList
                    items={[
                      { name: "Workflow switcher (dropdown)", does: "Jump between your saved workflows, or start a new one." },
                      { name: "Test run", does: "Runs the workflow once against a real sample lead from your data — no real messages are sent, no real actions taken. A log of what would have happened appears below the canvas." },
                      { name: "Save workflow", does: "Saves the workflow and activates it (moves it out of Draft status) if this is its first save." },
                      { name: "\"+ New Workflow\" (top navigation bar)", does: "Opens the create-workflow dialog — same as the switcher's create option." },
                    ]}
                  />
                </Sub>
                <Sub title="Canvas area">
                  <p>Click any node on the canvas to see its configuration in the inspector panel on the right.</p>
                  <Note>
                    The node palette on the left (Trigger / Action / Condition / Integration) is currently for
                    reference only — clicking those buttons doesn&apos;t add a node to the canvas yet, and the
                    canvas layout itself isn&apos;t drag-to-rearrange. Saving a workflow uses a fixed built-in
                    template rather than a custom graph you&apos;ve assembled. Full drag-and-drop editing is planned
                    but not live in this build — treat the canvas as a visual reference of the automation logic
                    for now, not a live editor.
                  </Note>
                </Sub>
              </Section>

              <Section id="scheduler" title="Social Scheduler">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Plan and generate content — static graphics, AI-voiceover reels, and carousels — across
                  Instagram, Facebook, TikTok, and LinkedIn, laid out on a monthly calendar.
                </p>
                <Sub title="Connected accounts panel">
                  <p>Click to expand/collapse. Click any platform tile to connect or update it.</p>
                  <BtnList
                    items={[
                      { name: "Account / Page ID + Display name", does: "Tells Kinetic OS which of your already-authorized accounts to publish to. This does not do the OAuth authorization itself — the platform access token is configured once on the backend by whoever manages your deployment." },
                      { name: "Auto-reply to comments toggle", does: "When on, the AI assistant automatically replies to comments on your posts for that platform." },
                    ]}
                  />
                </Sub>
                <Sub title="Calendar &amp; queue">
                  <BtnList
                    items={[
                      { name: "◀ / ▶ arrows", does: "Move between months." },
                      { name: "Day cell (click)", does: "Filters the queue panel on the right to just that day's posts." },
                      { name: "View all", does: "Clears the day filter, shows every upcoming post." },
                      { name: "New post", does: "Opens the post composer." },
                    ]}
                  />
                </Sub>
                <Sub title="Post composer">
                  <BtnList
                    items={[
                      { name: "Platform pills", does: "Instagram, Facebook, TikTok, or LinkedIn." },
                      { name: "Content type", does: "Reel, Static Graphic, or Carousel. Note: LinkedIn doesn't support Reel video posting yet — you'll get a warning if you try that combination." },
                      { name: "Title / hook + Script prompt", does: "Describe what the post should say — Kinetic OS drafts the script and caption from this." },
                      { name: "Generate AI voiceover automatically", does: "Only shown for video content types. Adds a narrated voiceover to the generated reel." },
                      { name: "Publish date / time", does: "When it should go live." },
                      { name: "Save as draft", does: "Creates the post without generating any media yet — come back and generate later." },
                      { name: "Generate &amp; schedule", does: "Immediately generates the graphic/video/voiceover and schedules it for the chosen time." },
                    ]}
                  />
                </Sub>
                <Sub title="Queue list (each post)">
                  <BtnList
                    items={[
                      { name: "Retry", does: "Only shown on failed posts — attempts to publish it again right now." },
                      { name: "Delete", does: "Removes the post from the queue." },
                    ]}
                  />
                </Sub>
              </Section>

              <Section id="calendar" title="Calendar">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Shows meetings that were actually booked through your lead conversations — every row here is a
                  real booking, never a placeholder.
                </p>
                <Sub title="Integration cards (Calendly, Google Calendar)">
                  <p>
                    Each card shows how many meetings came from that source and links out to manage it directly
                    on Calendly/Google&apos;s own site.
                  </p>
                  <Note>
                    Both cards show &quot;Not connected&quot; by default in this UI — Calendly and Google Calendar
                    are set up once for the whole deployment (by whoever manages the backend), not per-workspace
                    from inside the app yet. If your team uses either, meetings booked through them will still
                    show up in the list below once they&apos;re configured on the backend.
                  </Note>
                </Sub>
                <Sub title="Meeting list">
                  Filter by status using the pills: All, Confirmed, Pending, Cancelled, Completed. Read-only list.
                </Sub>
              </Section>

              <Section id="team" title="Team">
                <BtnList
                  items={[
                    { name: "Invite teammate", does: "Opens a form: enter their email and pick a role (Admin, Editor, or Viewer), then send. They'll get an email invite." },
                    { name: "Role dropdown (per member row)", does: "Change an existing member's role. Saves immediately; if it fails, it rolls back automatically and shows an error." },
                    { name: "Remove (per member row)", does: "Removes that person from the workspace immediately." },
                  ]}
                />
                <Note>
                  Only OWNER and ADMIN roles can invite or remove people. There&apos;s only ever one Owner per
                  workspace (the person who originally signed up) — ownership isn&apos;t assignable from this
                  screen.
                </Note>
              </Section>

              <Section id="billing" title="Billing">
                <BtnList
                  items={[
                    { name: "Upgrade plan", does: "Opens a secure Lemon Squeezy checkout page in a new tab for the next plan tier up." },
                    { name: "Update payment method", does: "Opens the billing portal in a new tab, where you can change your card on file." },
                    { name: "Download icon (per invoice row)", does: "Opens that invoice's PDF in a new tab. Greyed out if no invoice file is available yet for that entry." },
                  ]}
                />
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  The usage meters (leads, AI messages, workflow runs, etc.) show how much of your current
                  plan&apos;s monthly allowance you&apos;ve used — read-only.
                </p>
              </Section>

              <Section id="settings" title="Settings">
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  Six tabs down the left side (or across the top on mobile): Profile, Workspace, Notifications,
                  Integrations, API Keys, and Danger Zone.
                </p>

                <Sub title="Profile tab">
                  <BtnList
                    items={[
                      { name: "Camera icon (avatar)", does: "Photo uploads aren't available yet — this button is disabled on purpose, not broken." },
                      { name: "Full name field + Save changes", does: "Updates your display name across the workspace." },
                      { name: "Email address", does: "Shown but not editable here — contact whoever manages your deployment to change it." },
                    ]}
                  />
                </Sub>

                <Sub title="Workspace tab">
                  <BtnList
                    items={[
                      { name: "Workspace name, Industry, Timezone + Save changes", does: "Updates workspace-wide settings." },
                      { name: "Workspace URL", does: "Shown for reference, not editable." },
                    ]}
                  />
                  <p>
                    Below the form, the <strong className="text-text-primary">Voice Profile</strong> card shows how
                    many of your own sent replies the AI has learned your tone from (it needs at least 5 before it
                    turns on) — read-only status, nothing to configure.
                  </p>
                </Sub>

                <Sub title="Notifications tab">
                  <p>Toggle Email/Push per notification category (new leads, failed workflows, etc.).</p>
                  <Note>
                    These toggles aren&apos;t saved to your account yet — they reset if you leave the page. Treat
                    this tab as a preview of what&apos;s coming, not a working settings panel yet.
                  </Note>
                </Sub>

                <Sub title="Integrations tab">
                  <p>
                    This is where <strong className="text-text-primary">you personally</strong> connect your own
                    WhatsApp, Instagram, Messenger, Telegram, and Email accounts — separate from any
                    deployment-wide fallback account.
                  </p>
                  <BtnList
                    items={[
                      { name: "Connect (per channel)", does: "Opens a guided 2-step wizard: Step 1 asks for the channel's credentials (with instructions on exactly where to find them), Step 2 makes a real test call to that platform's API to verify the credentials work before saving — so a typo gets caught immediately instead of failing silently later." },
                      { name: "Disconnect", does: "Removes that channel connection immediately." },
                    ]}
                  />
                  <p>
                    Further down, <strong className="text-text-primary">Scheduling</strong> (Calendly, Google
                    Calendar) and <strong className="text-text-primary">CRM</strong> (HubSpot, Google Sheets)
                    sections show real connection status but are read-only here — those are set up once on the
                    backend by whoever manages your deployment, not connected per-person from this screen.
                  </p>
                </Sub>

                <Sub title="API Keys tab">
                  <BtnList
                    items={[
                      { name: "Generate new key", does: "Opens a form for a key name and scope (Full access or Read only). The full key is shown exactly once right after creation — copy it immediately, it can't be viewed again." },
                      { name: "Copy icon", does: "Copies the newly generated key to your clipboard." },
                      { name: "Trash icon (per key row)", does: "Revokes that key immediately after a confirmation — any app using it loses access right away." },
                    ]}
                  />
                </Sub>

                <Sub title="Danger Zone tab">
                  <BtnList
                    items={[
                      { name: "Leave workspace", does: "Removes you from the workspace. Requires typing LEAVE to confirm. Ownership must be transferred to someone else first if you're the Owner." },
                      { name: "Delete workspace", does: "Permanently deletes all leads, conversations, workflows, and knowledge base data for everyone. Requires typing DELETE to confirm. Cannot be undone." },
                    ]}
                  />
                </Sub>
              </Section>

              <Section id="faq" title="FAQ & Troubleshooting">
                <Sub title="I don't see any leads / the Dashboard shows all zeros">
                  That&apos;s expected on a brand-new workspace — numbers grow as real conversations come in through a
                  connected channel. Connect one from{" "}
                  <a href="#settings" className="text-primary hover:underline">Settings → Integrations</a> to
                  start receiving real messages.
                </Sub>
                <Sub title="AI Chat / lead replies feel generic, not smart">
                  Add documents to your <a href="#knowledge" className="text-primary hover:underline">Knowledge
                  Base</a> — the AI only knows what&apos;s in there. Also check with whoever manages your deployment
                  that a real AI provider key is configured; without one, the AI runs in a basic placeholder mode.
                </Sub>
                <Sub title="A channel keeps failing to connect in Settings">
                  Use the built-in &quot;Test connection&quot; step in the connect wizard — it tells you exactly
                  what&apos;s wrong (bad token, wrong ID, etc.) instead of guessing.
                </Sub>
                <Sub title="I can't find a way to add a node to a workflow / rearrange the canvas">
                  That&apos;s a known limitation right now, not something you&apos;re missing — see the note in{" "}
                  <a href="#workflows" className="text-primary hover:underline">Workflow Builder</a> above.
                </Sub>
                <Sub title="Meetings aren't showing up on the Calendar page">
                  Meetings only appear once Calendly or Google Calendar is actually configured on the backend and
                  someone books through it — see the note in{" "}
                  <a href="#calendar" className="text-primary hover:underline">Calendar</a> above.
                </Sub>
                <Sub title="Who can I contact for help?">
                  Reach out to whoever manages your Kinetic OS deployment (usually whoever set up your workspace)
                  — they have access to the backend logs and configuration that this app doesn&apos;t expose directly.
                </Sub>
              </Section>

              <div className="flex items-center gap-2 border-t border-border pt-6">
                <Badge variant="default">Kinetic OS</Badge>
                <span className="text-[12px] text-text-muted">
                  This guide reflects what&apos;s actually built right now — it&apos;ll get updated as new features ship.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
