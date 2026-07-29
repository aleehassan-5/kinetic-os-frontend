# Kinetic OS — Frontend

The Isolated Workspace: an outcome-first automation platform for small business owners — every
channel unified into one inbox, an AI that learns the owner's tone over time, and a dashboard
that reports in terms an owner actually feels (customers added, meetings booked, hours reclaimed),
not raw platform metrics.

Built by Lead Sync Intelligence.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
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
| `/dashboard` | Outcome-framed overview — new customers, hours reclaimed, meetings booked, buying intent |
| `/leads` | Omni-channel lead inbox (WhatsApp, Instagram, Telegram, Messenger, Email) with intent scoring & AI-authored replies |
| `/chat` | Knowledge-base-grounded AI assistant |
| `/workflows` | Visual node-based workflow builder (trigger → score → condition → action) |
| `/scheduler` | Social content calendar & queue (Instagram, Facebook, TikTok, LinkedIn) with AI generation |
| `/knowledge` | Knowledge base: document upload, website crawl, sync status |
| `/calendar` | Meeting scheduling via Calendly / Google Calendar integrations |
| `/team` | Team member management with role-based access |
| `/billing` | Plan usage, invoices, payment methods (Lemon Squeezy) |
| `/settings` | Profile, workspace, channel connections, notifications, integrations, API keys |

## Project Structure

```
app/                  # Next.js App Router pages
components/
  ui/                 # Design system primitives (Button, Card, Badge, Input, Switch)
  layout/             # Sidebar, Topnav, mobile nav
  <feature>/           # Feature-specific components + API type/mapper helpers in data.ts
```

## Backend Integration

All pages are wired to the live backend API via `lib/api-client.ts`. Each `data.ts` holds
presentation-only metadata (labels, icons, colors) plus `ApiX` types and `mapApiX()` functions
that convert backend responses into UI shapes — it does not hold mock records pretending to be
real data.

## Product Philosophy

The Business Mechanics Addendum (see project docs) sets the design rule this frontend follows:
every screen speaks in outcomes the owner already understands, not in the mechanics underneath.
The Dashboard, in particular, deliberately reports "hours reclaimed" and "customers added" rather
than technical throughput numbers — the same automation, framed the way an owner actually thinks
about progress.

## Status

Actively in development. See the [backend repo](https://github.com/aleehassan-5/kinetic-os-backend) for the API.
