import { HeroSection } from "../client/website/sections/HeroSection";
import { AppDownloadSection } from "../client/website/sections/AppDownloadSection";
import { FooterSection } from "../client/website/sections/FooterSection";

export const metadata = {
  title: "Vantaged | Monitor Every Stage, Prove The Build",
  description: "The trust-first construction management and verification platform for property owners, international investors, and registered contractors worldwide.",
};

export default function Home() {
  const lifecycleStages = [
    { num: "01", title: "Site Demarcation & Soil Prep", desc: "Boundary surveying, soil bearing test, and site clearing benchmarks." },
    { num: "02", title: "Substructure & Foundation", desc: "Excavation, high-tensile reinforcement tying, and concrete slump test certified cast." },
    { num: "03", title: "Superstructure & Decking", desc: "Column alignment, formwork, and suspended floor slab casting with 28-day curing." },
    { num: "04", title: "Blockwork & Framing", desc: "Perimeter masonry, load-bearing blockwork, and structural aperture framing." },
    { num: "05", title: "Roofing & Weatherproofing", desc: "Certified trusses, waterproof moisture membrane, and roof covering installation." },
    { num: "06", title: "MEP Rough-In", desc: "Concealed electrical distribution, pressurized water piping, and HVAC ducting." },
    { num: "07", title: "Finishes & Screeding", desc: "Internal wall rendering, precision floor screeds, tiling, and sanitary fittings." },
    { num: "08", title: "Commissioning & Handover", desc: "Electrical load audit, snag clearance, and key release with digital dossier." },
  ];

  return (
    <main className="min-h-screen w-full bg-white dark:bg-[var(--vt-color-background-default,#110C30)] flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-200">
      {/* ── Top Hero Section (With Navbar, Dark/Light Toggle, Drafting Grid & Headline) ── */}
      <HeroSection />

      {/* ── Section 1: The Problem & The Industry Trust Gap (The Hook) ── */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
              The Construction Trust Deficit
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] tracking-tight uppercase leading-tight mb-4">
              Building on Promises Destroys Projects Worldwide
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
              Every year, billions in capital are stalled, diverted, or lost in construction disputes. Traditional informal construction relies on trust where verification is essential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm mb-5">
                !
              </div>
              <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                The Cash Advance Trap
              </h3>
              <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                Demanding 40% to 70% upfront capital strips owners of all financial leverage. When contractors encounter cashflow issues, projects are abandoned with zero legal recovery.
              </p>
            </div>

            <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm mb-5">
                !
              </div>
              <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                Blind Spots &amp; Phantom Progress
              </h3>
              <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                Staged photos in WhatsApp groups hide structural defects, missing reinforcement steel, and sub-standard materials until long after walls are sealed.
              </p>
            </div>

            <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm mb-5">
                !
              </div>
              <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                Contractor Payment Insecurity
              </h3>
              <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                Legitimate builders carry immense payroll and material liabilities, only to face clients who delay final stage payouts or invent excuses to withhold funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: How Vantaged Works (The 4-Step Dual-Lock Protocol) ── */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-white dark:bg-[var(--vt-color-background-default,#110C30)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
              The Solution
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] tracking-tight uppercase leading-tight mb-4">
              How Trust Is Engineered: The 4-Step Protocol
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
              Vantaged establishes mutual certainty by locking deliverables, protecting capital in bank escrow, and releasing payouts strictly upon verified physical proof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl p-6 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] block mb-3">
                  STEP 01
                </span>
                <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Digital Milestone Lock
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  Scope of work, technical specifications, inspection criteria, and stage pricing are agreed and locked digitally before mobilization.
                </p>
              </div>
            </div>

            <div className="rounded-xl p-6 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] block mb-3">
                  STEP 02
                </span>
                <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Bank Escrow Funding
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  Stage capital is deposited into a dedicated bank escrow account. The builder sees verified proof of funds; the owner maintains release custody.
                </p>
              </div>
            </div>

            <div className="rounded-xl p-6 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] block mb-3">
                  STEP 03
                </span>
                <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Physical Site Verification
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  Contractors submit multi-angle visual evidence. Certified structural engineers conduct on-site audits for critical load-bearing stages.
                </p>
              </div>
            </div>

            <div className="rounded-xl p-6 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] block mb-3">
                  STEP 04
                </span>
                <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                  Automated Stage Payout
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  Upon verified sign-off, escrow funds disburse automatically to the contractor&apos;s corporate account within 24 hours. No delays, no disputes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Standard 8-Stage Construction Lifecycle (Interactive Overview) ── */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
              End-to-End Governance
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] tracking-tight uppercase leading-tight mb-4">
              The 8 Standard Milestones Tracked on Vantaged
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
              From initial groundbreaking through structural framing to final key handover, every phase is governed by clear technical acceptance criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lifecycleStages.map((stage) => (
              <div
                key={stage.num}
                className="rounded-xl p-6 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] block mb-2">
                    STAGE {stage.num}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1.5 leading-snug">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Mutual Value (Why Both Sides Win) ── */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-white dark:bg-[var(--vt-color-background-default,#110C30)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
              Mutual Alignment
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
              Engineered for Fairness, Built for Scale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Owners */}
            <div className="rounded-xl p-8 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                For Property Owners &amp; Investors
              </span>
              <h3 className="text-xl font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-4">
                Total Peace of Mind &amp; Capital Security
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-green-600,#1F6B3E)] font-bold text-base">✓</span>
                  <span><strong>Zero Advance Risk:</strong> Funds are locked safely in bank escrow and only released when physical milestone criteria are met.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-green-600,#1F6B3E)] font-bold text-base">✓</span>
                  <span><strong>Remote Oversight:</strong> Full visibility of your project from anywhere in the world without physical presence or third-party hearsay.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-green-600,#1F6B3E)] font-bold text-base">✓</span>
                  <span><strong>Permanent Digital Asset Dossier:</strong> Complete audit record of every inspection, change order, and payment for future resale.</span>
                </div>
              </div>
            </div>

            {/* For Contractors */}
            <div className="rounded-xl p-8 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                For General Contractors &amp; Builders
              </span>
              <h3 className="text-xl font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-4">
                Guaranteed Payouts &amp; Enterprise Growth
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-base">✓</span>
                  <span><strong>Guaranteed Stage Payouts:</strong> No more delayed receivables or client excuses once work is completed and verified.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-base">✓</span>
                  <span><strong>Verified Reputation Score:</strong> Build an immutable record of high-quality delivery to win commercial and institutional tenders.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-base">✓</span>
                  <span><strong>24-Hour Corporate Settlement:</strong> Approved funds disburse directly into your corporate bank account.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Procore-Style Multi-Page Navigational Gateways ── */}
      <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-14 border-t border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
              Explore the Platform
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
              Tailored for Your Role and Workflow
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/stakeholders"
              className="group rounded-xl p-6 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] hover:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors mb-2">
                  Stakeholders &rarr;
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  Dedicated solutions for property owners, international diaspora investors, and licensed general contractors.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-4 block">
                Learn more &rarr;
              </span>
            </a>

            <a
              href="/the-advantage"
              className="group rounded-xl p-6 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] hover:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors mb-2">
                  The Advantage &rarr;
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  How Vantaged outperforms informal cash construction and generic task apps worldwide.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-4 block">
                Compare protocols &rarr;
              </span>
            </a>

            <a
              href="/pricing"
              className="group rounded-xl p-6 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] hover:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors mb-2">
                  Pricing Plans &rarr;
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  Always free for property owners; first project free for registered building firms.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-4 block">
                View pricing &rarr;
              </span>
            </a>

            <a
              href="/support"
              className="group rounded-xl p-6 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] hover:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors mb-2">
                  Support &amp; Advisory &rarr;
                </h4>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                  24/7 client desk, engineering inspector dispatch, and cross-border consultation.
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-4 block">
                Get in touch &rarr;
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Section 6: Mobile Field App (With Phone Mockup & Download Buttons) ── */}
      <AppDownloadSection />

      {/* ── Section 7: Executive Call To Action Banner ── */}
      <section className="py-20 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-4">
            Build with Complete Certainty. Pay on Verified Proof.
          </h2>
          <p className="text-sm sm:text-base text-[var(--vt-color-neutral-300,#CBC8DA)] max-w-xl leading-relaxed mb-8">
            Experience the peace of mind that comes from locked milestone agreements and protected bank escrow.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="/signup/owner"
              className="h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Start as an Owner</span>
              <span>&rarr;</span>
            </a>
            <a
              href="/signup?role=contractor"
              className="h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Register Company</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <FooterSection />
    </main>
  );
}
