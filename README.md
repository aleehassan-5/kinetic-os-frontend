# Orbit AI — Frontend Foundation

Premium dark-theme frontend for the AI Automation Platform (omni-channel leads, AI chat, content automation).

## Stack
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion–ready · Lucide Icons · Recharts

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/login`.

## What's included in this pass

- **Design system**: color tokens, `Button`, `Card`, `Badge`, `Input` (all variants, hover/active/disabled states) in `components/ui/`
- **App shell**: `Sidebar` (grouped nav, active states) + `Topnav` (search, notifications, quick action) in `components/layout/`
- **Login** (`/login`) — split layout, error state, loading state, social auth row
- **Signup** (`/signup`)
- **Dashboard** (`/dashboard`) — stat cards (with skeleton state), area chart (lead volume vs. AI replies), channel breakdown, activity timeline, content queue
- **Lead Inbox** (`/leads`) — omni-channel list (WhatsApp/Instagram/Telegram/Messenger/Email), channel filters, empty state, intent-score meter, conversation detail panel with AI-authored replies
- **AI Chat** (`/chat`) — Knowledge-Base-grounded assistant, conversation history sidebar, typing indicator, composer
- **Workflow Builder** (`/workflows`) — visual node canvas (trigger → score → condition → action/integration branches) with SVG connectors, node palette, and a config inspector panel per node type
- **Social Scheduler** (`/scheduler`) — month calendar with per-day post previews, platform-tagged queue list (Instagram/Facebook/TikTok/LinkedIn), status badges (Draft/Generating/Scheduled/Published/Failed), and a "New post" composer modal with AI-voiceover toggle
- **Knowledge Base** (`/knowledge`) — stat row (docs/indexed/chunks/storage), drag-and-drop upload zone with drag state, website-crawl & manual-FAQ entry actions, document table with type icons, sync-status badges (Indexed/Processing/Failed/Queued), re-sync/remove row actions, empty state
- **Calendar** (`/calendar`) — Calendly & Google Calendar connection cards, meetings list grouped by day with lead avatar/channel/topic, status filter (Confirmed/Pending/Cancelled/Completed), "Join" action on confirmed calls, empty state
- **Team** (`/team`) — member table with role badges, status (Active/Pending/Suspended), last-active timestamps, invite modal with role picker + descriptions
- **Billing** (`/billing`) — current plan with usage meters (near-limit warning color), payment method card, upgrade upsell, invoice history table with per-row download and status (Paid/Pending/Failed)
- **Settings** (`/settings`) — tabbed page: Profile (avatar, form, save state), Workspace (name/timezone/industry), Notification preferences (per-category email/push toggles), Integrations (WhatsApp/Instagram/Telegram/Messenger/Email/Calendly/Google Calendar/HubSpot/Sheets — connect/disconnect/reconnect states), API Keys (table, generate modal, copy/revoke with confirm), Danger Zone (leave/delete workspace with type-to-confirm)
- **Notifications** — dropdown panel from the bell icon in `Topnav` (used on every page): All/Unread tabs, per-type icons (lead/workflow/billing/team/system), mark-all-read, click-to-read, empty state
- **Mobile nav drawer** — `Topnav` now shows a hamburger below `lg`; opens a slide-in `Sidebar` drawer with backdrop, Escape-to-close, and auto-close on route change

## Wired to the real backend

- **Lead Inbox** (`/leads`) and **Social Scheduler** (`/scheduler`) both fetch from and post to the live `orbit-ai-backend` API (see `lib/api-client.ts`). The scheduler's "New post" composer calls `POST /social/posts` and supports both "save as draft" and "generate & schedule" (which runs the real AI graphic/script/voiceover pipeline).
- Login/signup already call `/auth/login` and `/auth/register`.

## Not yet built

- Dashboard stat cards/chart, Knowledge Base, Calendar, Team, Billing, and Settings pages still render their original static fixture data (`components/*/data.ts`). Wiring them follows the same pattern already used in `leads/data.ts` and `scheduler/data.ts` — an `ApiX` type + `mapApiX()` function, fetched with `api.get()` in the page's `useEffect`.
- The scheduler's month view only reflects the current calendar month; multi-month navigation (the prev/next arrows) isn't wired to a date range yet.
