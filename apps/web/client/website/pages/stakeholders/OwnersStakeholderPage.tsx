"use client";

import React, { useState } from "react";
import { Navbar } from "../../sections/Navbar";
import { FooterSection } from "../../sections/FooterSection";

export function OwnersStakeholderPage() {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

  const services = [
    {
      num: "01",
      title: "Milestone-Gated Bank Escrow",
      desc: "Your capital is held safely in dedicated, regulated bank trust escrow. Funds are never released to the contractor until you have personally reviewed and approved the verified stage proof.",
    },
    {
      num: "02",
      title: "Real-Time Spending & Budget Tracker",
      desc: "Track every single cent or kobo allocated across your project. View live expenditure burn-downs, compare Bill of Quantities (BOQ) actuals against quotes, and download itemized financial summaries.",
    },
    {
      num: "03",
      title: "Live Site Intelligence & Visual Evidence",
      desc: "Access real-time, time-stamped photo and video streams directly from the job site. View structural progress, material deliveries, and physical milestones from anywhere in the world.",
    },
    {
      num: "04",
      title: "Independent Engineering Audits",
      desc: "Dispatch accredited structural engineers and independent quality inspectors to conduct objective physical checks on critical load-bearing stages before concrete is poured.",
    },
    {
      num: "05",
      title: "Strict Change-Order & Variation Controls",
      desc: "Eliminate surprise cost overruns. Any addition, material substitution, or timeline modification requires an explicit digital cost preview and dual sign-off before funds are committed.",
    },
    {
      num: "06",
      title: "Permanent Property Asset Dossier",
      desc: "Every approved milestone, structural test certificate, and payment receipt is archived in an immutable digital ledger for future property valuation, financing, and resale.",
    },
  ];

  const financialMetrics = {
    USD: {
      budget: "$245,000",
      disbursed: "$168,500",
      inEscrow: "$52,000",
      retainage: "$24,500",
      recentPayment: "$38,000",
    },
    NGN: {
      budget: "₦245,000,000",
      disbursed: "₦168,500,000",
      inEscrow: "₦52,000,000",
      retainage: "₦24,500,000",
      recentPayment: "₦38,000,000",
    },
  }[currency];

  const stageBreakdown = [
    {
      stage: "Stage 01: Substructure & Foundation Slab",
      budgetUSD: "$42,000",
      budgetNGN: "₦42,000,000",
      status: "Verified & Disbursed",
      percent: 100,
      stateColor: "text-[#1F6B3E] dark:text-[#52B874]",
      barColor: "bg-[#1F6B3E]",
    },
    {
      stage: "Stage 02: Framing, Columns & Deck Casting",
      budgetUSD: "$68,500",
      budgetNGN: "₦68,500,000",
      status: "Verified & Disbursed",
      percent: 100,
      stateColor: "text-[#1F6B3E] dark:text-[#52B874]",
      barColor: "bg-[#1F6B3E]",
    },
    {
      stage: "Stage 03: Roofing Structure & Waterproofing",
      budgetUSD: "$58,000",
      budgetNGN: "₦58,000,000",
      status: "Verified & Disbursed",
      percent: 100,
      stateColor: "text-[#1F6B3E] dark:text-[#52B874]",
      barColor: "bg-[#1F6B3E]",
    },
    {
      stage: "Stage 04: Mechanical, Electrical & Plumbing (MEP)",
      budgetUSD: "$52,000",
      budgetNGN: "₦52,000,000",
      status: "In Progress (Locked in Escrow)",
      percent: 65,
      stateColor: "text-[#D84C0B] dark:text-[#F17C42]",
      barColor: "bg-[#EF5F18]",
    },
    {
      stage: "Stage 05: Interior Finishes & Handover",
      budgetUSD: "$24,500",
      budgetNGN: "₦24,500,000",
      status: "Defects Liability Holdback",
      percent: 0,
      stateColor: "text-[#5E5A7D] dark:text-[#918ADA]",
      barColor: "bg-[#CBC8DA]",
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
                For Property Owners &amp; Diaspora Investors
              </span>
              <span className="h-0.5 w-6 bg-[var(--vt-color-orange-500,#EF5F18)]" />
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] uppercase max-w-4xl leading-[1.08] mb-6">
              COMPLETE BUILD OVERSIGHT AND FINANCIAL CERTAINTY
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] max-w-2xl leading-relaxed">
              Never wonder whether building materials were delivered or if structural work was completed correctly. You maintain 100% financial control over your build capital.
            </p>
          </div>
        </section>

        {/* ── Overview & Visual Section ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                The Owner Experience
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)] leading-tight mb-4">
                Build with Total Confidence Without Being Physically on Site
              </h2>
              <p className="text-sm sm:text-base text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)] leading-relaxed mb-6">
                Whether you are developing a residential home, managing an investment portfolio, or building from thousands of miles away, Vantaged guarantees that work is proven before payment is released.
              </p>
              <div className="space-y-3 mb-8 text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] dark:text-[var(--vt-color-text-muted,#B8B1E9)]">
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Zero exposure to upfront cash loss or contractor abandonment.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Independent structural checks verify foundation, columns, and roofing.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold text-sm">✓</span>
                  <span>Permanent building dossier increases future property market value.</span>
                </div>
              </div>
              <div>
                <a
                  href="/signup/owner"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Create Free Owner Account</span>
                  <span>&rarr;</span>
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

        {/* ── Financial Command Center & Real-Time Spending Tracker ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-white dark:bg-[#110C30] border-b border-[#E2E0EC] dark:border-[#2C2460]">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="max-w-3xl mb-12">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="h-0.5 w-5 bg-[#EF5F18]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#EF5F18]">
                  Financial Transparency &amp; Control
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#261A66] dark:text-[#F4F3FC] leading-tight mb-4">
                The Owner Financial Command Center: Track Every Cent in Real Time
              </h2>
              <p className="text-sm sm:text-base text-[#5E5A7D] dark:text-[#B8B1E9] leading-relaxed">
                Construction budgets no longer disappear into a black hole. With Vantaged, you see exactly where every dollar or naira goes — how much is budgeted, how much is safely locked in bank escrow, and how much has been disbursed against verified physical steel and concrete.
              </p>
            </div>

            {/* ── Interactive Financial Dashboard Preview Card ── */}
            <div className="rounded-2xl p-6 sm:p-8 bg-[#F7F7FA] dark:bg-[#18123F] border border-[#E2E0EC] dark:border-[#2C2460] shadow-sm mb-12">
              {/* Top Control Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E0EC] dark:border-[#2C2460] mb-8">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#EF5F18] block mb-0.5">
                    Active Site Financial Dossier
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#261A66] dark:text-[#F4F3FC]">
                    Lekki Phase 1 Luxury Villa · Project #VTG-8821
                  </h3>
                  <span className="text-xs text-[#5E5A7D] dark:text-[#B8B1E9]">
                    Prime Contractor: Julius B. Consortium · Regulated Partner Trust Vault
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Currency Switcher */}
                  <div className="flex items-center p-1 rounded-md bg-[#EDEBF5] dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460]">
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
                        currency === "USD"
                          ? "bg-[#EF5F18] text-white shadow-xs"
                          : "text-[#5E5A7D] hover:text-[#261A66] hover:bg-[#CBC8DA]/70 dark:text-[#B8B1E9] dark:hover:text-white dark:hover:bg-[#2C2460]"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("NGN")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${
                        currency === "NGN"
                          ? "bg-[#EF5F18] text-white shadow-xs"
                          : "text-[#5E5A7D] hover:text-[#261A66] hover:bg-[#CBC8DA]/70 dark:text-[#B8B1E9] dark:hover:text-white dark:hover:bg-[#2C2460]"
                      }`}
                    >
                      NGN (₦)
                    </button>
                  </div>

                  {/* Export PDF Button */}
                  <button
                    type="button"
                    className="h-9 px-3.5 rounded-md bg-[#261A66] hover:bg-[#EF5F18] text-white dark:bg-[#EF5F18] dark:hover:bg-[#D84C0B] text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Download Statement</span>
                    <span>&darr;</span>
                  </button>
                </div>
              </div>

              {/* 4 Financial Stat Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* 1. Total Committed Budget */}
                <div className="p-4.5 rounded-xl bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] shadow-2xs">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block mb-1">
                    Total Project Budget
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                    {financialMetrics.budget}
                  </div>
                  <span className="text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9] block leading-tight">
                    Original BOQ Contract · 0 Unapproved Variations
                  </span>
                </div>

                {/* 2. Disbursed upon Proof */}
                <div className="p-4.5 rounded-xl bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] shadow-2xs">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1F6B3E] dark:text-[#52B874] block mb-1">
                    Disbursed Payouts (68%)
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#1F6B3E] dark:text-[#52B874] mb-1">
                    {financialMetrics.disbursed}
                  </div>
                  <span className="text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9] block leading-tight">
                    Released for Stages 1–3 after engineer inspection
                  </span>
                </div>

                {/* 3. Locked in Bank Escrow */}
                <div className="p-4.5 rounded-xl bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] shadow-2xs">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#EF5F18] block mb-1">
                    Protected in Escrow
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#EF5F18] mb-1">
                    {financialMetrics.inEscrow}
                  </div>
                  <span className="text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9] block leading-tight">
                    Locked in bank trust for Stage 4 (MEP &amp; Plumbing)
                  </span>
                </div>

                {/* 4. Retainage Defect Reserve */}
                <div className="p-4.5 rounded-xl bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] shadow-2xs">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA] block mb-1">
                    Defect Holdback (10%)
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#261A66] dark:text-[#F4F3FC] mb-1">
                    {financialMetrics.retainage}
                  </div>
                  <span className="text-[11px] text-[#5E5A7D] dark:text-[#B8B1E9] block leading-tight">
                    Retained in trust until 6-month defect liability period
                  </span>
                </div>
              </div>

              {/* Real-Time Stage Spending & Verification Table */}
              <div className="rounded-xl bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460] p-5 sm:p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-[#261A66] dark:text-[#F4F3FC]">
                    Stage-by-Stage Expenditure &amp; Deliverables Audit
                  </h4>
                  <span className="font-mono text-xs font-bold text-[#1F6B3E] dark:text-[#52B874]">
                    3 of 5 Stages Fully Handed Over
                  </span>
                </div>

                <div className="space-y-4">
                  {stageBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#F7F7FA] dark:bg-[#18123F] border border-[#E2E0EC] dark:border-[#2C2460] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[#261A66] dark:text-[#F4F3FC]">
                            {item.stage}
                          </span>
                          <span className={`font-mono font-bold ${item.stateColor}`}>
                            {item.status}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-[#E2E0EC] dark:bg-[#2C2460] overflow-hidden">
                          <div
                            className={`h-full ${item.barColor} transition-all duration-300`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="shrink-0 text-left md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-[#E2E0EC] dark:border-[#2C2460]">
                        <span className="font-mono font-extrabold text-sm text-[#261A66] dark:text-[#F4F3FC] block">
                          {currency === "USD" ? item.budgetUSD : item.budgetNGN}
                        </span>
                        <span className="text-[10px] text-[#7C7894] dark:text-[#918ADA]">
                          {item.percent === 100
                            ? "Receipt & Proof Archived"
                            : item.percent > 0
                            ? "Escrow Funded · Active"
                            : "Scheduled Stage"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Verified Financial Transactions */}
              <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#211A4D] border border-[#E2E0EC] dark:border-[#2C2460]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#7C7894] dark:text-[#918ADA]">
                    Recent Ledger Activity
                  </span>
                  <span className="text-xs font-bold text-[#EF5F18]">
                    Bank Session Log: Safe &amp; Audited
                  </span>
                </div>

                <div className="divide-y divide-[#E2E0EC] dark:divide-[#2C2460] text-xs">
                  <div className="py-2.5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <span className="font-bold text-[#261A66] dark:text-[#F4F3FC] block">
                        Milestone 3 Payout Disbursed to Julius B. Consortium
                      </span>
                      <span className="text-[11px] text-[#7C7894] dark:text-[#918ADA]">
                        Ref: VTG-TX-99014 · Verified by Engr. Alabi (Civil/Structural)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#1F6B3E] dark:text-[#52B874] block">
                        {financialMetrics.recentPayment}
                      </span>
                      <span className="text-[10px] text-[#7C7894] dark:text-[#918ADA]">
                        Official Bank Transfer Settled
                      </span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <span className="font-bold text-[#261A66] dark:text-[#F4F3FC] block">
                        Milestone 4 Escrow Deposit Confirmed
                      </span>
                      <span className="text-[11px] text-[#7C7894] dark:text-[#918ADA]">
                        Ref: VTG-TX-98942 · Dedicated Virtual Vault Account
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#EF5F18] block">
                        {financialMetrics.inEscrow}
                      </span>
                      <span className="text-[10px] text-[#7C7894] dark:text-[#918ADA]">
                        Locked in Partner Bank Custody
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 4 Pillars of Owner Financial Protection ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-[#F7F7FA] dark:bg-[#18123F] border border-[#E2E0EC] dark:border-[#2C2460]">
                <div className="w-10 h-10 rounded-lg bg-[#FFF4EE] dark:bg-[#3A1A0E] text-[#D84C0B] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  01
                </div>
                <h4 className="text-base font-bold text-[#261A66] dark:text-[#F4F3FC] mb-2">
                  Micro-Audited BOQ
                </h4>
                <p className="text-xs text-[#5E5A7D] dark:text-[#B8B1E9] leading-relaxed">
                  Track contractor expenditures against the pre-agreed Bill of Quantities. Every ton of rebar and bag of cement is matched to physical job site milestones.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#F7F7FA] dark:bg-[#18123F] border border-[#E2E0EC] dark:border-[#2C2460]">
                <div className="w-10 h-10 rounded-lg bg-[#FFF4EE] dark:bg-[#3A1A0E] text-[#D84C0B] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  02
                </div>
                <h4 className="text-base font-bold text-[#261A66] dark:text-[#F4F3FC] mb-2">
                  Zero Scope Creep
                </h4>
                <p className="text-xs text-[#5E5A7D] dark:text-[#B8B1E9] leading-relaxed">
                  Contractors cannot verbally alter costs. Any change-order requires explicit digital cost previews and owner approval before committing funds.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#F7F7FA] dark:bg-[#18123F] border border-[#E2E0EC] dark:border-[#2C2460]">
                <div className="w-10 h-10 rounded-lg bg-[#FFF4EE] dark:bg-[#3A1A0E] text-[#D84C0B] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  03
                </div>
                <h4 className="text-base font-bold text-[#261A66] dark:text-[#F4F3FC] mb-2">
                  Defect Retainage Vault
                </h4>
                <p className="text-xs text-[#5E5A7D] dark:text-[#B8B1E9] leading-relaxed">
                  Automatically withhold 5%–10% of total contract value in regulated escrow until defects liability inspection is complete after handover.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#F7F7FA] dark:bg-[#18123F] border border-[#E2E0EC] dark:border-[#2C2460]">
                <div className="w-10 h-10 rounded-lg bg-[#FFF4EE] dark:bg-[#3A1A0E] text-[#D84C0B] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  04
                </div>
                <h4 className="text-base font-bold text-[#261A66] dark:text-[#F4F3FC] mb-2">
                  Audit-Ready Statements
                </h4>
                <p className="text-xs text-[#5E5A7D] dark:text-[#B8B1E9] leading-relaxed">
                  Export certified PDF financial statements complete with transaction hashes, bank session IDs, and stage stamps for mortgage banks and tax filings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6 Core Services for Owners ── */}
        <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 bg-[var(--vt-color-neutral-50,#F7F7FA)] dark:bg-[var(--vt-color-surface-sunken,#0C0824)] border-b border-[var(--vt-color-border-default,#E2E0EC)] dark:border-[var(--vt-color-border-default,#2C2460)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] mb-2 block">
                Comprehensive Protection
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] dark:text-[var(--vt-color-text-default,#F4F3FC)]">
                Services Vantaged Provides for Property Owners
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
              Protect Your Capital and Build with Guaranteed Peace of Mind
            </h2>
            <p className="text-sm sm:text-base text-[var(--vt-color-neutral-300,#CBC8DA)] max-w-xl leading-relaxed mb-8">
              Account creation and milestone tracking are free for all property owners. Invite your contractor today.
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
                href="/support"
                className="h-11 px-6 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Schedule a Consultation</span>
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

