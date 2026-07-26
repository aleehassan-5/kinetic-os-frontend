# Orbit AI — Frontend

Premium dark-theme frontend for **Orbit AI**, an omni-channel AI automation platform for leads, chat, workflows, and content scheduling.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide Icons

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL to your backend
npm run dev
```

App runs at `http://localhost:3000` and redirects to `/login`.

## Features

| Page | Description |
|---|---|
| `/login`, `/signup` | Auth flows, wired to the backend — email/password or "Continue with Google" |
| `/auth/callback` | Completes the Google sign-in redirect and hands off to the dashboard |
| `/dashboard` | Stat cards, lead volume chart, channel breakdown, activity timeline |
| `/leads` | Omni-channel lead inbox (WhatsApp, Instagram, Telegram, Messenger, Email) with intent scoring & AI-authored replies |
| `/chat` | Knowledge-base-grounded AI assistant |
| `/workflows` | Visual node-based workflow builder (trigger → score → condition → action) |
| `/scheduler` | Social content calendar & queue (Instagram, Facebook, TikTok, LinkedIn) with AI generation |
| `/knowledge` | Knowledge base: document upload, website crawl, sync status |
| `/calendar` | Meeting scheduling via Calendly / Google Calendar integrations |
| `/team` | Team member management with role-based access |
| `/billing` | Plan usage, invoices, payment methods (Lemon Squeezy) |
| `/settings` | Profile, workspace, notifications, integrations, API keys |

## Project Structure

```
app/                  # Next.js App Router pages
components/
  ui/                 # Design system primitives (Button, Card, Badge, Input, Switch)
  layout/             # Sidebar, Topnav, mobile nav
  <feature>/           # Feature-specific components + API type/mapper helpers in data.ts
```

## Backend Integration

All pages are wired to the live backend API via `lib/api-client.ts` — there's no page left rendering hardcoded fixture numbers as if they were real. Each `data.ts` now holds presentation-only metadata (labels, icons, colors) plus `ApiX` types and `mapApiX()` functions that convert backend responses into UI shapes; it no longer holds mock records pretending to be real data.

Known, honestly-labeled gaps (not hidden behind fake data):

- **Calendly / Google Calendar** show "Not connected" on `/calendar` and `/settings` — meetings are real DB rows, but there's no OAuth connect flow wired up yet to actually sync from those providers.
- **Notification preference toggles** on `/settings` are UI-only for now — there's no backend model to persist them yet, and the page says so.
- **No automated test suite yet** — treat this as an early-stage product, not production-hardened.

## Status

Actively in development. See the [backend repo](https://github.com/aleehassan-5/orbit-ai-backend) for the API.
