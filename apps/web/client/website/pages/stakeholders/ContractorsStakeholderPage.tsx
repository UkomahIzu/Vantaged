"use client";

import React from "react";
import { Navbar } from "../../sections/Navbar";
import { FooterSection } from "../../sections/FooterSection";
import { openCompanySignupModal } from "../../components/CompanySignupModal";

export function ContractorsStakeholderPage() {
  const services = [
    {
      num: "01",
      title: "Guaranteed Milestone Payouts",
      desc: "Work exclusively with clients who have pre-funded milestone escrow accounts. Eliminate delayed receivables, cash flow dry spells, and client excuses.",
    },
    {
      num: "02",
      title: "24-Hour Settlement to Corporate Account",
      desc: "Once milestone verification criteria are fulfilled and signed off by the client, funds disburse automatically to your corporate bank account within 24 hours.",
    },
    {
      num: "03",
      title: "Structured Proof & Evidence Submission",
      desc: "Submit high-resolution photo evidence, concrete slump test certificates, and inspection sign-offs directly from your phone through the Vantaged field app.",
    },
    {
      num: "04",
      title: "Change-Order Protection & Scope Certainty",
      desc: "Protect your firm against out-of-scope work. All alterations, variations, and additional requests must be digitally approved with escrow funding before you execute.",
    },
    {
      num: "05",
      title: "Verified Directory Profile & Reputation Score",
      desc: "Build an unimpeachable portfolio of verified on-time completions that positions your company for premium residential projects and institutional tenders.",
    },
    {
      num: "06",
      title: "Subcontractor & Supplier Payout Coordination",
      desc: "Directly link payments for trade specialists, steel fixers, and materials suppliers upon milestone release to streamline site cash flow.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[var(--vt-color-background-default,#110C30)] flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="w-full px-6 sm:px-10 lg:px-14 py-6 sm:py-8 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
        <Navbar activeLinkId="nav-stakeholders" />
      </div>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative py-16 sm:py-24 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-[var(--vt-color-orange-500,#EF5F18)]">
                For General Contractors &amp; Builders
              </span>
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] uppercase max-w-4xl leading-[1.08] mb-6">
              GUARANTEED PAYMENTS FOR VERIFIED CRAFTSMANSHIP
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-2xl leading-relaxed">
              Stop chasing clients for completed work. Vantaged protects quality contractors with escrow-backed milestones, faster sign-offs, and verified professional reputation.
            </p>
          </div>
        </section>

        {/* ── Overview & Visual Section ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                The Contractor Advantage
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
                Build Faster, Win Premium Clients, and Eliminate Bad Debts
              </h2>
              <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
                When project capital is secured in escrow before mobilization, your business operates with complete financial predictability. You prove the build; the platform guarantees the payout.
              </p>
              <div className="space-y-3 mb-8 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>First project is 100% free with zero platform transaction fees.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Formal change-orders ensure you are paid for every scope alteration.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Verified contractor directory score elevates your tender credibility.</span>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => openCompanySignupModal("starter")}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Register Contractor Account</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-lg aspect-[4/3] relative">
                <img
                  src="/images/survey-blueprints.jpg"
                  alt="Contractors reviewing site blueprints and milestone plans"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 6 Core Services for Contractors ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Enterprise Tools
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                Services Vantaged Provides for General Contractors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s) => (
                <div
                  key={s.num}
                  className="rounded-xl p-8 bg-white dark:bg-[var(--vt-color-surface-raised,#211A4D)] border border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF5EB)] dark:bg-[var(--vt-color-primary-subtle,#3A1A0E)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center font-mono font-bold text-sm mb-6">
                      {s.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Call To Action ── */}
        <section className="py-20 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight mb-4">
              Get Guaranteed Payouts for Your Work
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-300,#CBC8DA)] max-w-xl leading-relaxed mb-8">
              Join elite registered contractors managing milestone delivery and winning client trust through Vantaged.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => openCompanySignupModal("starter")}
                className="h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Register as a Contractor</span>
                <span>&rarr;</span>
              </button>
              <a
                href="/pricing?role=contractor"
                className="h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>View Contractor Pricing</span>
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

