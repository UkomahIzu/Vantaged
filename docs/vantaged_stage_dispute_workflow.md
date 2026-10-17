# Vantaged: Contextual Stage Review & Dispute Workflow

## 1. Architectural Principle: No Standalone Disputes Tab
Disputes in Vantaged do not exist in a vacuum. A dispute is always strictly tied to either:
1. **A specific construction milestone / stage proof** (e.g. Substandard rebar, failed concrete compression test, unapproved layout deviation).
2. **An escrow payment tranche** (e.g. Contested disbursement claim, missing telemetry certificates, withheld release).

Therefore, **"Disputes" is removed from the primary sidebar navigation**. Instead, dispute creation and resolution are embedded directly into the **Project & Stage Review** flow.

---

## 2. Stage Review Flow (When Contractor Submits Proof)
When the contractor marks a stage as "Ready for Review", the Owner Admin and authorized Client Reps (with `approveStages` module) receive a notification and see the milestone in their "Waiting on You" action queue.

Upon opening the Stage Review modal or Project view, the reviewer has 3 clear actions:

```
[Contractor Submits Stage Proof (Photos, Videos, Test Reports)]
                          │
                          ▼
             [Owner / Rep Technical Review]
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
  [1. APPROVE]     [2. REQUEST FIX]    [3. RAISE DISPUTE]
       │                  │                  │
• Milestone verified • Checklist item    • Stage placed on hold
• Escrow tranche       ticked as failed    (⏸ On Hold)
  released           • Comments / photos • Escrow frozen
• Project advances     sent to contractor• Evidence trail
                     • Contractor fixes    opened
                       & resubmits       • 14-day mutual
                                           resolution clock
```

### Action Breakdown:
1. **Approve Stage**:
   - Verified progress advances.
   - Escrow tranche payment is authorized for release.
   - Contractor can begin next stage.

2. **Request Fix (Punch List / Minor Remediation)**:
   - Reviewer marks failed checklist items and leaves photos or notes.
   - Stage returns to `In Progress` for the contractor to correct and re-upload.
   - Normal, non-contentious construction quality assurance cycle.

3. **Raise Dispute (Formal Impasse or Serious Defect)**:
   - Used on 3rd repeated rejection, deadlock, or major unapproved structural deviations.
   - Formally marks the milestone as `⏸ On Hold — Disputed`.
   - Freezes the relevant escrow payout.
   - Both sides submit hard proof into the dispute dossier.
   - Both sides have a 14-day window to reach a mutual resolution before public reputation flags apply.

---

## 3. How Disputes Surface Across the Dashboard (Without a Sidebar Tab)

1. **Dashboard Home ("Waiting on You" / Alert Banner)**:
   - If any project has an active dispute, a top banner or badge alerts the owner:
     `⚠️ Lekki Phase 1 Luxury Villa: Stage 2 paused due to active dispute [Review Evidence & Resolve]`

2. **Project Card (Projects Directory)**:
   - The project card displays an amber/red status pill:
     `⏸ Paused — 1 Active Dispute`
   - Clicking the pill jumps directly to the disputed milestone view.

3. **Inside Project Milestone Timeline**:
   - The specific stage row shows:
     `[Disputed — Evidence Under Review]` with direct access to resolution actions.
