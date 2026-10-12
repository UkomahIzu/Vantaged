# Vantaged — Monetization Strategy & Billing Architecture

**Document Version:** 1.0  
**Status:** Approved Product Decision  
**Target Market:** Nigerian Domestic & Diaspora Construction Infrastructure  
**Core Currency:** Nigerian Naira (NGN) with USD/GBP Diaspora Equivalents  

---

## 1. Executive Summary & Revenue Philosophy

Vantaged operates a **Dual-Engine Monetization Model**:
1. **Escrow Take-Rate (Transaction Velocity Fee):** High-margin transaction fee on every milestone tranche funded and released.
2. **Tier-Based SaaS Subscriptions (Capacity Slots):** Recurring monthly subscription model scaled by concurrent construction project slots, with à la carte slot add-ons.

```
                              VANTAGED REVENUE ENGINE
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
  REVENUE STREAM A:                                                 REVENUE STREAM B:
  ESCROW TAKE-RATE                                                  TIER SUBSCRIPTIONS
  (Primary Cash Cow)                                                (Predictable ARR)
        │                                                                 │
  • 1.0% – 1.5% platform fee on milestone releases                 • Companies: B2B tiers by active concurrent job slots
  • ₦1.5M – ₦3M+ net platform revenue per villa build              • Developers: Multi-site portfolio tiers
  • Solves the core "Trust Deficit" in African construction         • Single-Home Owners: 100% FREE entry hook
```

---

## 2. Revenue Stream A: Escrow Take-Rate & Transaction Model

### 2.1 Why Active Escrow Replaces "Just Record Transactions"
- **The Pitfall of "Just Record Transactions":** If Vantaged merely records offline bank receipts, users can bypass the software after exchanging contacts, disputes cannot be enforced, and client money remains exposed to contractor abandonment or fraud.
- **The Power of Escrow Custody:** Holding milestone funds in dedicated escrow provides the foundational value proposition of Vantaged:
  - **For Diaspora & Local Owners:** Funds are locked in a protected vault and cannot be touched until an independent engineer certifies physical milestone progress (geofenced photos, cube slump tests, structural inspection).
  - **For Contractors:** Guarantees that the client has actual capital locked in escrow before the contractor mobilizes heavy equipment, pours foundation piles, or buys materials.

---

### 2.2 Take-Rate Fee Schedule (The Golden 1.5% Sweet Spot)

Platform take-rate is structured hierarchically based on the total project contract value:

| Project Contract Size (NGN) | Platform Fee Rate | Example Milestone Tranche | Vantaged Platform Revenue |
| :--- | :---: | :---: | :---: |
| **Tier I: Standard Build (< ₦100M)** | **1.50%** | ₦20,000,000 (Foundation Slab) | **₦300,000** |
| **Tier II: Mid-Scale / Luxury (₦100M – ₦500M)** | **1.00%** | ₦50,000,000 (Framing / Decking) | **₦500,000** |
| **Tier III: Major Commercial (> ₦500M)** | **0.75%** | ₦150,000,000 (Curtain Wall / MEP) | **₦1,125,000** |

#### Unit Economics Example (₦180,000,000 Lekki Duplex):
- Total contract: ₦180,000,000
- 1.0% – 1.5% cumulative fee across all milestones = **₦1,800,000 – ₦2,700,000 in net platform revenue from a single residential home**.
- At 20 active builds per month, Vantaged generates **₦36M – ₦54M/month** in high-margin transaction revenue.

---

### 2.3 Fee Payment Allocation (Who Pays?)
- **Model:** **"Milestone Protection & Escrow Fee"** paid by the Owner on tranche deposit.
- **Rationale:** In Nigerian construction, contractors price strictly based on Bill of Quantities (BOQ) and refuse deductions from their contract value. The owner willingly pays the 1.5% protection surcharge because it is significantly cheaper than insurance or hiring private legal trustees to prevent project abandonment.
- **Alternative:** 50/50 split option (0.75% owner surcharge + 0.75% contractor settlement deduction).

---

### 2.4 Banking Rails & Legal Custody Architecture

```
[Diaspora / Local Owner]
           │ (Bank Transfer / NIP / RTGS / Swift FX)
           ▼
[Dedicated Project Virtual Escrow NUBAN]
  • Generated per project (e.g. Providus Bank / Monnify / Paystack)
  • Webhook confirms deposit ──► Vault Status: "Locked in Escrow"
           │
           │ (Site Inspector certifies milestone with geofenced proof)
           │ (Owner clicks "Approve & Release Milestone")
           ▼
[Automated Split Transfer API]
  ├──► 98.5% (Contractor's Corporate Account)
  └──►  1.5% (Vantaged Corporate Revenue Wallet)
```

- **Legal Compliance:** Platform fees are legal service fees under Nigerian Contract Law, CAMA, and FCCPC guidelines when transparently disclosed before authorization. Funds custody is routed via licensed partner banks and CBN-regulated FinTech switches (Monnify / Providus Bank / Paystack).

---

## 3. Revenue Stream B: Tier-Based Subscription Model

### 3.1 Strategy: Asymmetric SaaS Tiers

Based on Procore’s proven model and marketplace incentives:
- **Single-Home Private Owners:** **100% FREE** to monitor their build (growth hook; monetized via 1.5% escrow take-rate).
- **Construction Companies / Contractors:** **Primary B2B Subscribers** (monetized per concurrent active job capacity + directory visibility).
- **Commercial Developers / Portfolio Owners:** **Developer Tier Subscribers** (monetized for multi-site portfolio oversight).

---

### 3.2 Construction Company / Contractor Tiers

Contractors subscribe to unlock active concurrent construction contracts, verified bidding capacity, and directory prominence:

| Tier Name | Concurrent Active Jobs | Monthly Fee (NGN) | Annual Fee (NGN) | Included Capabilities |
| :--- | :---: | :---: | :---: | :--- |
| **Starter Contractor** | **1 Job Slot** | **₦25,000 / mo** | ₦250,000 / yr | Standard milestone telemetry, basic client escrow portal, up to 2 bid submissions/mo. |
| **Verified Builder** | **Up to 3 Job Slots** | **₦75,000 / mo** | ₦750,000 / yr | 3 active concurrent jobs, Verified COREN Badge, priority ranking in *"Find Companies"*, up to 10 brief bids/mo. |
| **Prime Consortium** | **Up to 8 Job Slots** | **₦180,000 / mo** | ₦1,800,000 / yr | 8 active concurrent jobs, Featured placement on directory, unlimited RFP bidding, priority escrow payout rails, dedicated account manager. |

---

### 3.3 Commercial Developer / Multi-Site Owner Tiers

For property development firms and serial diaspora investors building multiple sites:

| Tier Name | Active Project Slots | Monthly Fee (NGN) | USD Equivalent | Included Capabilities |
| :--- | :---: | :---: | :---: | :--- |
| **Private Owner** | **1 Project Slot** | **FREE** | **$0 / mo** | Lifetime free monitoring of 1 home; 1.5% escrow fee applies on milestone release. |
| **Portfolio Investor** | **Up to 3 Slots** | **₦85,000 / mo** | **$65 / mo** | 3 concurrent site dashboards, multi-site Gantt timeline, subcontractor performance benchmarks. |
| **Estate Developer** | **Up to 10 Slots** | **₦275,000 / mo** | **$220 / mo** | 10 concurrent active sites, multi-user role management (Project Managers, Quantity Surveyors), unlimited blueprint cloud storage. |

---

### 3.4 The À La Carte "Single Construction Slot" Add-On

To eliminate upgrade friction, users do not need to upgrade to the next major tier if they only need one temporary space:

- **Contractor Extra Job Slot:** **+₦25,000 / month per slot**
  - *Scenario:* A Verified Builder (3 slots) wins a 4th tender. Rather than jumping from ₦75k to ₦180k, they pay +₦25k/mo for that 4th slot until completion.
- **Owner Extra Construction Slot:** **+₦30,000 / month per slot**
  - *Scenario:* A Private Owner (1 slot) begins an auxiliary guest chalet or boundary fence project. They pay +₦30k/mo for that single slot.

---

## 4. Key Product Decisions & Workflow Agreements

### 4.1 Project Inception & Scoping Protocol
- **Owner Role:** Submits a high-level **Project Brief** (Title, Category, Target Budget, Location, Scope Description).
- **Contractor Role:** Reviews the brief and drafts the technical **Milestone Breakdown & BOQ Schedule** (Deliverables, Slump test specifications, Payment tranche percentages).
- **Mutual Agreement:** Contract is locked once the Owner approves the Contractor’s milestone schedule and deposits the first escrow tranche.

### 4.2 Preconstruction & Blueprints (Procore Benchmark)
*(To be integrated in the upcoming Project Dashboard phase)*:
- **Approved Blueprints Hub:** Cloud sheet repository with OCR revision management.
- **Drawing-to-Milestone Linking:** Blueprints tagged directly to Milestone inspectables (e.g. Drawing S-03 tagged to Milestone 2: Foundation Slab).
- **Pin Annotations:** Field inspectors pin tamper-proof photos directly onto blueprint coordinates.

### 4.3 Communication Architecture
- **WhatsApp-like Direct Messages Scrapped:** Removed stand-alone messages page to prevent out-of-band communication and disputes.
- **Milestone & Snagging Threads:** Formal, auditable inspection logs attached directly to each project milestone.
- **Floating Desk Widget:** Persistent quick-access floating widget (`OwnerFloatingDeskWidget`) for escrow balance check, customer support, and project telemetry.

### 4.4 Find Companies Directory UX
- **Header Bar:** Standardized top navigation bar with centralized search, theme toggle, notifications, and back navigation.
- **Simplified Filter Dropdown:** Specialty selection, Region/State selection, COREN Verified checkbox, and **♥ Favourited Companies Only** toggle.
- **Compact Toolbar:** Icon-only **`Invite Company`** button (`w-9 h-9`), inline `[ Companies | My Briefs ]` switcher.
- **Aligned Table Format for Briefs:** Project scope, recipient contractor, budget, location, submission date, and status aligned in tabular format with a `"View Brief"` scope modal.

---

## 5. Next Implementation Milestones

1. **Owner Financials & Escrow Ledger Screen:**
   - Dedicated Escrow Vault page showing total funds locked, released tranches, platform fee calculation (1.5%), and bank transfer deposit instructions (Virtual NUBAN details).
2. **Contractor Milestone Scoping Flow:**
   - Interface for contractors to review owner briefs and generate structured milestone tranches.
3. **Project Dashboard with Blueprints & Inspection Feed:**
   - Drawing overlay hub, milestone inspection timeline, and single-click tranche release approval.
