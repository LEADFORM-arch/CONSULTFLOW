# ConsultFlow

ConsultFlow is a client operating system for independent consultants. It brings qualification, paid scheduling, engagement context, client follow-through, and revenue protection into one focused workspace.

This repository currently contains the premium interactive product prototype for the US market. The product language, demo data, currency, and operating model are intentionally US-first.

## Product thesis

Scheduling is only one moment in a consulting relationship. ConsultFlow is designed around the full engagement lifecycle:

1. Qualify the opportunity.
2. Secure the commercial terms.
3. Prepare the consultant with client context.
4. Run the engagement.
5. Capture decisions and follow-through.
6. Collect and protect revenue.

The initial product wedge is deliberately narrow enough for a solo founder: the daily practice cockpit, engagement pipeline, client context, and revenue protection. Escrow, insurance, lending, marketplace, and regulated-industry claims are roadmap items, not implied capabilities.

## Implemented prototype

- Executive daily briefing with the next engagement and preparation context
- Signature Engagement Rail with payment confidence and next actions
- Day/week calendar with preparation and debrief buffers
- Engagement lifecycle and active-work pipeline
- Searchable client relationship book
- Revenue coverage, collection rhythm, and trend reporting
- Practice intelligence recommendations for pricing, capacity, and retention
- Command search with `Ctrl/Cmd + K`
- Interactive client brief, engagement creation flow, notifications, and action feedback
- Responsive desktop and mobile navigation
- Reduced-motion support, keyboard focus states, semantic landmarks, and accessible labels

All product data is currently local demo data. No payment, calendar, messaging, or AI provider is connected yet.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- Lucide icons

The prototype intentionally keeps the dependency surface small. The next production phase should add infrastructure only when its user flow is implemented end-to-end.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Product system

The design intent, product vocabulary, color rationale, surface hierarchy, spacing, and reusable interface rules live in [`.interface-design/system.md`](.interface-design/system.md).

## Recommended production sequence

1. Authentication and consultant workspace model
2. Services, qualification intake, and booking availability
3. Stripe Connect upfront payment and signed webhook handling
4. Google/Microsoft calendar synchronization and idempotent booking writes
5. Client timeline, meeting notes, and invoice state
6. Background workflows for reminders and follow-through
7. Production analytics, audit logs, rate limiting, and end-to-end tests

Keep the promise narrow until the complete booking-to-payment path is reliable. Financial protection, escrow, factoring, and compliance badges require legal and operational validation before being marketed.
