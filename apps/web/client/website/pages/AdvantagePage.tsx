"use client";

import React from "react";
import { Navbar } from "../sections/Navbar";
import { FooterSection } from "../sections/FooterSection";

export function AdvantagePage() {
  const workflowSteps = [
    {
      num: "01",
      title: "Milestone Definition & Digital Contract Lock",
      desc: "Both owner and builder agree on discrete project stages, timelines, acceptance criteria, and budgets. Deliverables are digitally sealed into a binding milestone contract before any work commences.",
      roleBadge: "Mutual Pre-Alignment",
    },
    {
      num: "02",
      title: "Segregated Escrow Capital Custody",
      desc: "Funds for the upcoming milestone are deposited into a regulated multi-currency bank trust account. The builder sees verified proof of liquidity; the owner maintains exclusive disbursement authority.",
      roleBadge: "Capital Protection",
    },
    {
      num: "03",
      title: "On-Site Execution & Mobile Field Evidence",
      desc: "The contractor executes the agreed stage on site. Multi-angle photographic evidence, material delivery slips, and certified test reports are captured directly via the Vantaged mobile app.",
      roleBadge: "Transparent Proof",
    },
    {
      num: "04",
      title: "Objective Technical Field Verification",
      desc: "An accredited structural engineer or independent quality inspector audits the physical deliverables against pre-agreed specifications and signs off on the digital quality checklist.",
      roleBadge: "Independent Audit",
    },
    {
      num: "05",
      title: "One-Tap Sign-Off & Automated 24h Payout",
      desc: "The property owner reviews the verified proof and grants approval with a single tap. Escrow funds disburse automatically to the contractor's corporate bank account within 24 hours.",
      roleBadge: "Instant Settlement",
    },
    {
      num: "06",
      title: "Cryptographic Asset Dossier Archiving",
      desc: "Every signed milestone, inspection report, timestamped photo, and financial transaction is permanently locked into the property's digital ledger for future appraisal, insurance, and resale.",
      roleBadge: "Permanent Record",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[var(--vt-color-background-default,#110C30)] flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 sm:py-8 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
        <Navbar activeLinkId="nav-the-advantage" />
      </div>

      <main className="flex-1">
        {/* ── Page Header / Hero ── */}
        <section className="relative py-16 sm:py-24 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
                The Trust-First Construction Protocol
              </span>
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            </div>

            <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] uppercase max-w-4xl leading-[1.05] mb-6">
              The Vantaged <span className="text-[var(--vt-color-orange-500,#EF5F18)]">Advantage</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-3xl leading-relaxed">
              Yes, we put our name on it twice. Because when your capital sits safely in regulated escrow until licensed engineers verify real steel and concrete, that's not just an advantage — that's The Vantaged Advantage.
            </p>
          </div>
        </section>

        {/* ── The Root Problem: The Asymmetric Risk Dilemma ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                  The Root Cause
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
                  Why Traditional Construction Breaks Down Worldwide
                </h2>
                <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
                  Construction contracts are plagued by structural distrust. Property owners fear paying upfront for work that may never be finished; contractors fear executing expensive stages without guaranteed client payment.
                </p>
                <div className="space-y-3 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                  <p>
                    • Over 70% of private and commercial projects suffer budget disputes due to vague verbal scope adjustments.
                  </p>
                  <p>
                    • Massive upfront deposits often lead to contractor abandonment, material diversion, or sub-standard substitutions.
                  </p>
                  <p>
                    • Unstructured messaging threads leave both sides with zero verifiable legal record when disputes arise.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-xl p-6 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                    The Owner&apos;s Vulnerability
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    Paying 50% to 70% upfront cash advances transfers all financial leverage away from the owner, creating massive exposure to phantom progress and delayed delivery.
                  </p>
                </div>

                <div className="rounded-xl p-6 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2">
                    The Contractor&apos;s Risk
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    Builders regularly finance materials and labor out of pocket, only to face delayed disbursements, unapproved scope additions, and client non-payment.
                  </p>
                </div>

                <div className="rounded-xl p-6 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border-2 border-[var(--vt-color-orange-500,#EF5F18)] sm:col-span-2 shadow-sm">
                  <h3 className="text-sm font-bold text-[var(--vt-color-orange-600,#D84C0B)] mb-2">
                    The Vantaged Dual-Lock Solution
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    By locking milestone funds in regulated bank escrow before work begins, the contractor is guaranteed liquidity upon completion, while the owner retains absolute release authority until physical quality is verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Six Foundational Pillars (Corrected to 6) ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Architecture of Certainty
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                Six Core Pillars of the Vantaged Advantage
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6 font-mono font-bold text-lg">
                    01
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                    Regulated Bank Milestone Escrow
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                    Capital is deposited into dedicated multi-currency bank trust escrow accounts. Neither party can unilaterally sweep or misappropriate project funds.
                  </p>
                  <p className="text-xs text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                    Zero upfront capital loss exposure.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6 font-mono font-bold text-lg">
                    02
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                    Independent Physical Site Verification
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                    Milestones require certified field audits, concrete test certifications, and standardized photo evidence before completion can be requested.
                  </p>
                  <p className="text-xs text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                    Eliminates staged photos and ghost work.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6 font-mono font-bold text-lg">
                    03
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                    Guaranteed Payouts for Builders
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                    Contractors know project capital is already sitting in escrow. Once stage criteria are signed off, payout transfers to corporate accounts in 24 hours.
                  </p>
                  <p className="text-xs text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                    Eliminates delayed receivables and client ghosting.
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6 font-mono font-bold text-lg">
                    04
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                    Digital Scope &amp; Change Orders
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                    Any modification to materials, budget, or timeline must be submitted as a digital change order and approved by both parties before work proceeds.
                  </p>
                  <p className="text-xs text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                    Zero surprise costs or scope disputes.
                  </p>
                </div>
              </div>

              {/* Pillar 5 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6 font-mono font-bold text-lg">
                    05
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                    Lifetime Property Dossier
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                    Every inspection timestamp, structural calculation, photo, and invoice is preserved in a cryptographic asset dossier for property valuation and resale.
                  </p>
                  <p className="text-xs text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                    Appreciation and financing collateral proof.
                  </p>
                </div>
              </div>

              {/* Pillar 6 */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] flex items-center justify-center text-[var(--vt-color-orange-600,#D84C0B)] mb-6 font-mono font-bold text-lg">
                    06
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                    Multi-Currency Global Funding
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-4">
                    International investors fund escrow accounts in USD, EUR, GBP, CAD, or local currencies. Funds are protected against currency exchange shocks.
                  </p>
                  <p className="text-xs text-[var(--vt-color-orange-600,#D84C0B)] font-bold">
                    Frictionless cross-border construction finance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Workflow of Vantaged (Replaced specific milestones with general project workflow) ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Standard Execution Engine
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                The Workflow of Vantaged
              </h2>
              <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] mt-3">
                A universal milestone lifecycle that governs any project—ensuring transparency, financial safety, and objective delivery regardless of project scale or type.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowSteps.map((step) => (
                <div
                  key={step.num}
                  className="rounded-xl p-7 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)]">
                        STAGE {step.num}
                      </span>
                      <span className="text-[10px] font-mono font-semibold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        {step.roleBadge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-2.5 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Role-Specific Advantages (Dedicated Sections for All Roles) ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Tailored Impact
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                Advantages Specific to Each Role
              </h2>
            </div>

            <div className="space-y-8">
              {/* Role 1: Property Owners & Private Builders */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center font-bold text-sm">
                    01
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      For Property Owners &amp; Private Investors
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                      Residential builders, family developers, and land owners
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Zero Upfront Capital Exposure
                    </h4>
                    <p className="text-xs leading-relaxed">
                      You never risk large advance deposits. Capital is held safely in escrow and only released upon your personal approval.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Objective Physical Verification
                    </h4>
                    <p className="text-xs leading-relaxed">
                      High-resolution visual proof and independent engineer audits ensure construction meets the exact specifications you paid for.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Appreciation Asset Dossier
                    </h4>
                    <p className="text-xs leading-relaxed">
                      A permanent digital archive of every receipt, structural test, and milestone increases your property&apos;s resale and collateral value.
                    </p>
                  </div>
                </div>
              </div>

              {/* Role 2: International & Diaspora Investors */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center font-bold text-sm">
                    02
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      For International &amp; Diaspora Investors
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                      Cross-border investors building homes and commercial assets from abroad
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Eliminate Third-Party Diversion
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Bypass unverified family or middleman reports. View time-stamped proof and release funds directly without intermediate leakage.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Multi-Currency Escrow Funding
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Fund milestones securely in USD, EUR, GBP, or CAD. Avoid unfavorable conversion spreads and informal wire risks.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Binding Digital Contracts
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Clear milestone terms with legal enforceability eliminate the ambiguity that typically derails cross-border developments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Role 3: General Contractors & Registered Builders */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center font-bold text-sm">
                    03
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      For General Contractors &amp; Builders
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                      General contractors, design-build firms, and EPC specialists
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Guaranteed Stage Payouts
                    </h4>
                    <p className="text-xs leading-relaxed">
                      You mobilize with certainty knowing client funds are already secured in escrow. No bad debts, no delayed receivables.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      24-Hour Corporate Settlement
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Approved milestone funds settle directly into your corporate accounts without bureaucratic delays or payment friction.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Verified Directory Reputation
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Build an immutable record of on-time milestone completions to win commercial contracts and institutional projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Role 4: Engineers, Architects & Inspectors */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center font-bold text-sm">
                    04
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      For Engineers, Architects &amp; Site Inspectors
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                      Structural consultants, site quality inspectors, and project architects
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Standardized Digital Checklists
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Execute structured stage audits with verified dimensional tolerances, concrete slump certificates, and rebar schedules.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Professional Liability Defense
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Timestamped photo observations and signed defect punch-lists provide tamper-proof defense of your professional indemnity.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Direct Network Dispatch
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Accredited structural professionals receive direct inspection mandates on high-value residential and commercial builds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Role 5: Commercial Developers & Enterprise Portfolios */}
              <div className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center font-bold text-sm">
                    05
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      For Multi-Site Estate Developers &amp; Commercial Owners
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] dark:text-[var(--vt-color-text-subtle,#918ADA)]">
                      Estate developers, property syndicates, and commercial asset managers
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Multi-Site Command Center
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Govern multiple concurrent construction projects from a single portfolio console with role-based permissions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Enterprise ERP &amp; Finance Integration
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Integrate milestone releases directly with corporate accounting, treasury systems, and institutional investor reporting.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-1">
                      Priority Dispute Mediation
                    </h4>
                    <p className="text-xs leading-relaxed">
                      Dedicated technical arbitration team to resolve contractor claims swiftly without costly courtroom litigation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Comprehensive Comparison Table (No Badges) ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Side-by-Side Comparison
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                How Vantaged Compares to Traditional Methods
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] shadow-sm">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] bg-[var(--vt-color-neutral-100,#EFEEF5)] dark:bg-[var(--vt-color-surface-default,#18123F)]">
                    <th className="py-4 px-6 font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] w-2/5">
                      Capability &amp; Safeguard
                    </th>
                    <th className="py-4 px-6 font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] w-1/5 text-center">
                      Informal WhatsApp &amp; Cash
                    </th>
                    <th className="py-4 px-6 font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] w-1/5 text-center">
                      Generic Task Apps
                    </th>
                    <th className="py-4 px-6 font-bold text-[var(--vt-color-orange-600,#D84C0B)] w-1/5 text-center bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)]">
                      Vantaged Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)] dark:divide-[var(--vt-color-border-default,#2C2460)]">
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Regulated Bank Milestone Escrow
                    </td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ None (Direct wire)</td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ No payment escrow</td>
                    <td className="py-4 px-6 text-center font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)]">✓ Built-in Bank Trust</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Dual-Approval Release Protocol
                    </td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ Verbal pressure</td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ Manual tracking</td>
                    <td className="py-4 px-6 text-center font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)]">✓ Guaranteed Dual Lock</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Certified Independent Inspector Network
                    </td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ Unverified claims</td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ Self-reported only</td>
                    <td className="py-4 px-6 text-center font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)]">✓ Professional Dispatch</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Digital Change-Order Approvals
                    </td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ Unrecorded arguments</td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-500,#7C7894)]">Partial comments</td>
                    <td className="py-4 px-6 text-center font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)]">✓ Formal audit trail</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Cross-Border Multi-Currency Funding
                    </td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ High FX risk &amp; delays</td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ No multi-currency</td>
                    <td className="py-4 px-6 text-center font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)]">✓ USD, EUR, GBP &amp; Global</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Permanent Build Dossier for Resale
                    </td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ Lost in chat history</td>
                    <td className="py-4 px-6 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">✕ Deleted when unsubscribed</td>
                    <td className="py-4 px-6 text-center font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)]">✓ Lifetime property ledger</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Call To Action Banner ── */}
        <section className="py-20 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-4">
              Build on Guaranteed Proof, Not Promises
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-300,#CBC8DA)] max-w-xl leading-relaxed mb-8">
              Protect your capital, empower quality builders, and ensure every milestone is completed to exact specifications.
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
      </main>

      {/* ── Footer ── */}
      <FooterSection />
    </div>
  );
}
