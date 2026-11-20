
# Vantaged — Next Steps & Implementation Roadmap

**Last Updated:** 2026-11-20
**Current Status:** Marketing Website, Owner Dashboard (including Project Sub-Dashboard, Empty/Demo States, Subscription & Capacity, Live Pricing Sync), and Admin Dashboard (connected to local JSON API routes) are built and compile cleanly with zero TypeScript or Next.js build errors.

---

## Immediate Housekeeping (Before Starting New Features)

- [ ] **Create a Git Checkpoint Commit** — Commit the current batch of completed Owner Dashboard & Admin Dashboard work (empty states, Messages page, Owner Profile modal, live `/api/pricing` sync, Admin API routes, and Turbopack fixes) so we have a clean rollback point.
- [ ] **Clean Up Legacy/Unused Files** — Confirm whether `apps/admin/app/projects/page.tsx` can be removed now that contractor projects live under `apps/admin/app/contractors/[id]/projects/page.tsx`, and verify `apps/web/data/contractor-submissions.json` is not duplicated against `packages/db/data/contractor-submissions.json`.

---

## Phase 1: Contractor / Company Dashboard (`apps/web/app/contractor/*`)

Currently only `apps/web/app/contractor/login/page.tsx` exists. This is the biggest missing frontend surface needed to complete the two-sided workflow with Owners.

- [ ] **Contractor Shell, Navigation & Role Views**
  - Sidebar navigation, header bar, empty-state vs. demo-mode toggle (matching Owner Dashboard), and profile modal.
  - Support both **Verified/Certified Companies** and **Uncertified / Independent Trade Tier** contractors (with clear status indicators and an upgrade/verification prompt).
- [ ] **Contractor Dashboard Home (`/contractor/dashboard`)**
  - Active contracts summary, pending client invitations, stages awaiting submission or fix (punch list), pending payment confirmations (3-day receipt confirmation clock), and active disputes alerts.
- [ ] **Projects & Stage Plan Builder (`/contractor/projects`, `/contractor/projects/[id]/*`)**
  - View invited/active/completed projects and enforce project slot capacity limits based on contractor subscription tier.
  - Build and submit milestone stage plans using the **Stage Preset Library** fetched from Admin (`/api/presets`), with basis-point stage weights (`10000 = 100%`).
  - **Stage Execution & Proof Submission**: Upload geo-tagged photos, videos, and lab/test reports, complete checklist items, and mark stages as `Ready for Review`.
  - **Fix Requests & Disputes**: Respond to Owner/Rep punch-list items (`Request Fix`) and submit counter-evidence for disputed stages.
  - **Change Requests (Variations)**: Propose scope/BOQ variations with cost and timeline impact for owner approval.
- [ ] **Payments & Receipt Confirmation (`/contractor/transactions`)**
  - Track expected milestone tranches, escrow-funded stages, 5% retainage holds, and the **3-day "Confirm Receipt"** workflow when an owner disburses funds.
- [ ] **Crew & Team Management (`/contractor/team`)**
  - Invite and manage company members by role (`DIRECTOR`, `SITE_MANAGER`, `OFFICE_COORDINATOR`, `CREW_MEMBER`) with zero per-seat penalties.
- [ ] **Messages, Notifications & Settings (`/contractor/messages`, `/contractor/notifications`, `/contractor/settings`)**
  - Direct project chat with owners/client reps, real-time alerts, company verification document uploads (`CAC`, `TIN`, `COREN`, `CORBON`, `BPP`, `TAX_CLEARANCE`, `INSURANCE`), bank account details, and live-synced subscription/slot management (connected to `/api/pricing`).

---

## Phase 2: Client Rep & Independent Specialist / Inspector Portals

- [ ] **Client Representative Workspace**
  - Dedicated login/invite acceptance flow for appointed reps (`CLIENT_REP`).
  - Enforce the 7 granular permission modules from `docs/vantaged_client_reps_and_permissions_architecture.md` (`VIEW_PROGRESS`, `REVIEW_STAGES`, `PAYMENTS`, `CHANGE_REQUESTS`, `MESSAGE_CONTRACTOR`, `SHARE_LINKS`, `INVITE_PEOPLE`) including Naira escrow and variation approval caps.
- [ ] **QA/QC Specialist & Inspector Flow**
  - Accept site inspection dispatches, complete technical compliance checklists, attach signed inspection certificates/test results, and submit verdicts directly into the stage review timeline.

---

## Phase 3: Real Backend, Auth & Database Migration (Supabase + Prisma)

Currently, the Owner Dashboard relies on `localStorage` (`projectStore.ts`, `useOwnerSubscription.ts`, etc.) and Admin/Web APIs read/write local JSON files in `packages/db/data/`.

- [ ] **Supabase Auth & Role-Based Access Control (RBAC)**
  - Wire up real email/password + magic link authentication where `User.id` maps directly to the Supabase Auth user ID (as defined in `packages/db/prisma/schema.prisma`).
  - Protect routes via Next.js middleware (`apps/web` and `apps/admin`) with role guards (`CLIENT_ADMIN`, `CLIENT_REP`, `CONTRACTOR`, `SPECIALIST`, `PLATFORM_ADMIN`).
- [ ] **Database Schema & Migrations**
  - Review and push `packages/db/prisma/schema.prisma` to Supabase PostgreSQL (keeping money in minor units `BigInt` kobo/cents, stage weights in basis points, UTC timestamps).
  - Add Row-Level Security (RLS) policies and database indexes across projects, stages, disputes, transactions, messages, and audit logs.
- [ ] **Replace Local JSON & `localStorage` with Live APIs**
  - Migrate `/api/pricing`, `/api/contractors`, `/api/verifications`, `/api/disputes`, `/api/presets`, and `/api/audit` from `packages/db/data/*.json` to Prisma queries.
  - Create full CRUD API routes (and shared types/clients in `packages/contracts` and `packages/api-client`) for projects, stages, stage proofs, change requests, transactions, notifications, client reps, and messages.
- [ ] **Media & Document Storage (Supabase Storage)**
  - Set up private buckets with signed URLs for verification documents (CAC/NIN/COREN), stage proof photos/videos, inspection reports, and CAD/BIM vaults.
- [ ] **Realtime Updates**
  - Wire Supabase Realtime for live Owner ↔ Contractor ↔ Rep chat messages, stage status transitions, and notification badges.

---

## Phase 4: Payments, Escrow & Subscription Billing

Reference: `docs/vantaged_billing_and_monetization_plan.md`

- [ ] **Subscription & À La Carte Slot Checkout**
  - Integrate **Paystack / Flutterwave** (NGN) and **Stripe** (USD) for Owner, Contractor, and Specialist recurring subscriptions (monthly/yearly) and à la carte project slot purchases.
  - Handle webhook events (`invoice.paid`, `subscription.cancelled`, `charge.succeeded`) to automatically update active tier and slot capacity in Postgres.
- [ ] **Escrow & Milestone Disbursements**
  - Implement escrow deposit funding, bank reference/session ID tracking, tiered platform take-rates (`1.50%` / `1.00%`), automatic 5% retainage holdbacks, and the 3-day builder confirmation timer with escalation if unconfirmed.
- [ ] **Automated Receipts & Financial Exports**
  - Generate downloadable PDF payment receipts and project financial statements.

---

## Phase 5: Mobile App Build-Out (`apps/mobile`)

Currently Expo is scaffolded with welcome, sign-in, sign-up, and base UI components.

- [ ] **Shared Auth & API Client Integration**
  - Connect `apps/mobile` to Supabase Auth and `packages/api-client` / `packages/contracts`.
- [ ] **Field Mode for Contractors & Site Engineers**
  - Mobile-first stage proof capture: camera upload with EXIF/GPS geo-tagging and timestamp watermarking, offline queue for low-connectivity construction sites, and checklist sign-offs.
- [ ] **On-the-Go Tracking for Property Owners**
  - Project progress feed, photo/drone telemetry viewer, one-tap stage approval / fix requests, push notifications for milestone submissions and escrow releases, and direct contractor messaging.

---

## Phase 6: Security, Verification & Launch Readiness

- [ ] **Identity & Document Verification Integrations**
  - Integrate NIN / CAC / bank account name-match verification providers inside `packages/integrations`.
- [ ] **Transactional Notifications**
  - Wire up email (e.g., Resend), SMS alerts (for escrow release & 2FA), and mobile push notifications honoring user notification preferences and quiet hours.
- [ ] **Testing & QA**
  - Add end-to-end tests covering core flows: Owner signup → tier limit check → invite Contractor → submit stage plan → upload proof → approve/dispute stage → escrow disbursement → Admin audit log.
- [ ] **Deployment & Observability**
  - Configure production environments for `apps/web` and `apps/admin`, CI checks (`tsc`, `next build`, tests), error tracking, and database backups.
