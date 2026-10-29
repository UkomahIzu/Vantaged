"use client";

import React from "react";
import { Navbar } from "../sections/Navbar";
import { FooterSection } from "../sections/FooterSection";

export function StakeholdersPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[var(--vt-color-background-default,#110C30)] flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 sm:py-8 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
        <Navbar activeLinkId="nav-stakeholders" />
      </div>

      <main className="flex-1">
        {/* ── Page Header / Hero ── */}
        <section className="relative py-16 sm:py-24 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
                Unified Build Protocol
              </span>
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] uppercase max-w-4xl leading-[1.08] mb-6">
              BUILT FOR EVERY STAKEHOLDER IN CONSTRUCTION
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-2xl leading-relaxed mb-10">
              Vantaged bridges the trust gap between property owners, general contractors, and engineering consultants through clear milestone verification and financial escrow.
            </p>

            {/* Quick Navigation Cards to Dedicated Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl text-left">
              <a
                href="/stakeholders/owners"
                className="group rounded-xl p-5 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] hover:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                    Dedicated Page
                  </span>
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors mb-1.5">
                    Property Owners &rarr;
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    Escrow protection, live inspection telemetry, and permanent asset dossiers.
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-3">
                  Explore Owner Services &rarr;
                </span>
              </a>

              <a
                href="/stakeholders/contractors"
                className="group rounded-xl p-5 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] hover:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                    Dedicated Page
                  </span>
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors mb-1.5">
                    Contractors &amp; Builders &rarr;
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    Guaranteed milestone payouts, digital change-orders, and verified reputation.
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-3">
                  Explore Contractor Services &rarr;
                </span>
              </a>

              <a
                href="/stakeholders/specialists"
                className="group rounded-xl p-5 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] hover:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] block mb-1">
                    Dedicated Page
                  </span>
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors mb-1.5">
                    Specialists &amp; Inspectors &rarr;
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                    Standardized stage checklists, concrete test audits, and liability protection.
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-3">
                  Explore Specialist Services &rarr;
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Stakeholder 1: Property Owners ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2">
                For Property Owners
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
                Full Oversight of Your Project Without Daily Site Visits
              </h2>
              <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
                Never wonder whether your building materials were actually delivered or if the foundation was laid to specification. You hold the ultimate approval before any stage funds leave escrow.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Milestone-Gated Escrow Security
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Your build capital is held in regulated bank escrow and only released when you approve verified stage proof.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Independent Site Inspections
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Access certified structural engineers and site representatives to conduct quality audits on critical milestones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Permanent Audit Trail
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Every site photo, change order approval, and invoice is stored permanently for future valuation and insurance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="/stakeholders/owners"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Dedicated Owner Page</span>
                  <span>&rarr;</span>
                </a>
                <a
                  href="/signup/owner"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <span>Sign Up as Owner</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-lg aspect-[4/3] relative">
                <img
                  src="/images/site-inspection.jpg"
                  alt="Quality engineer inspecting structural build milestone"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stakeholder 2: General Contractors ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-lg aspect-[4/3] relative">
                <img
                  src="/images/survey-blueprints.jpg"
                  alt="Contractors reviewing site blueprints and milestone plans"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2">
                For General Contractors
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
                Guaranteed Payouts for Verified Work and Faster Client Sign-offs
              </h2>
              <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
                Stop chasing unpaid invoices or waiting months for client disbursements. Work with owners who have pre-funded project milestones in escrow.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Instant Stage Releases
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Once milestone criteria are verified and signed off, payment releases automatically to your corporate account within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Verified Reputation Score
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Build an immutable record of on-time, high-quality delivery that attracts commercial clients and institutional tenders.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Dispute Mitigation
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Clear milestone definitions and change-order records prevent scope creep and post-completion disagreements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="/stakeholders/contractors"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Dedicated Contractor Page</span>
                  <span>&rarr;</span>
                </a>
                <a
                  href="/signup?role=contractor"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <span>Register Contractor Account</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stakeholder 3: Engineers & Specialists ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2">
                For Engineers &amp; Consultants
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
                Standardized Field Inspections and Objective Sign-Offs
              </h2>
              <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
                Deliver professional integrity with structured checklists, laboratory test verification, and formal milestone approvals.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Standardized Stage Protocols
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Follow structured inspection checklists from substructure and reinforcement through finishes and handover.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-100,#FFE6D5)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                      Liability Protection
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mt-0.5">
                      Clear timestamps, signed punch-lists, and photo logs document exact site conditions when inspections occurred.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="/stakeholders/specialists"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Dedicated Specialist Page</span>
                  <span>&rarr;</span>
                </a>
                <a
                  href="/support"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <span>Inspector Desk</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-lg aspect-[4/3] relative">
                <img
                  src="/images/site-earthwork.jpg"
                  alt="Foundation excavation and structural ground inspection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Call To Action Banner ── */}
        <section className="py-20 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-4">
              Bring Accountability and Certainty to Your Next Build
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-300,#CBC8DA)] max-w-xl leading-relaxed mb-8">
              Join property owners, investors, and premier contractors already managing milestone delivery through Vantaged.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href="/signup/owner"
                className="h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started as an Owner</span>
                <span>&rarr;</span>
              </a>
              <a
                href="/signup?role=contractor"
                className="h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Register as a Contractor</span>
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
