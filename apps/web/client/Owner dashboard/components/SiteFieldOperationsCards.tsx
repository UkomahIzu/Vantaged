"use client";

import React, { useState } from "react";

export function SiteFieldOperationsCards() {
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 font-sans select-none pb-8">
      {/* ── Section Title & Status Indicator ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Site Updates & Finances
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] text-[10px] font-bold border border-[var(--vt-color-green-200,#A3D9B1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] animate-pulse" />
              Live Site
            </span>
          </div>
          <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
            Live updates on your site, weather, workers, contractor checks, and payments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
            Lekki Phase 1 Project · Site #VT-092
          </span>
        </div>
      </div>

      {/* ── Row 1: Payments & Balance (1) + Project Changes (7) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full">
        {/* 1. Project Payments & Balance Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                    Project Payments & Balance
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Total budget and money in escrow
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                Total: <strong className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">₦694,500,000</strong>
              </span>
            </div>

            {/* Main Stats: 3 Clean Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 py-3 px-3.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <span className="text-[10px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider block">
                  Paid Out
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5 block leading-tight">
                  ₦342,000,000
                </span>
                <span className="text-[10px] text-[var(--vt-color-green-700,#1F6B3E)] font-medium">
                  49% of budget
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider block">
                  Balance in Escrow
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5 block leading-tight">
                  ₦317,775,000
                </span>
                <span className="text-[10px] text-[var(--vt-color-orange-700,#B33C08)] font-medium">
                  Safe in vault
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider block">
                  Final Handover Hold
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block leading-tight">
                  ₦34,725,000
                </span>
                <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                  5% warranty
                </span>
              </div>
            </div>

            {/* Simple Clean Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                <span>Payment progress</span>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">49% paid</span>
              </div>
              <div className="h-2 w-full bg-[var(--vt-color-neutral-200,#E2E0EC)] rounded-full overflow-hidden">
                <div
                  style={{ width: "49.2%" }}
                  className="bg-[var(--vt-color-green-500,#2E9E57)] h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
              Starting: ₦680M + ₦14.5M changes
            </span>
            <button
              type="button"
              className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View payments</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* 7. Project Changes Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                    Project Changes
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Extra work or adjustments
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[10px] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]">
                1 needs review
              </span>
            </div>

            {/* Simplified Changes List */}
            <div className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
              {/* Item 1: Needs Action */}
              <div className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                    Master Suite Floor Tiles
                  </h4>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    <strong className="text-[var(--vt-color-orange-600,#D84C0B)] font-bold">+₦2,850,000</strong>
                    <span className="mx-1.5 text-[var(--vt-color-neutral-300,#CBC8DA)]">·</span>
                    <span>+2 days</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVariation("CR-04")}
                  className="h-7 px-3 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  Review
                </button>
              </div>

              {/* Item 2: Approved */}
              <div className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                    Outer Inverter Wiring
                  </h4>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    <span className="text-[var(--vt-color-neutral-700,#443E68)] font-semibold">+₦1,200,000</span>
                    <span className="mx-1.5 text-[var(--vt-color-neutral-300,#CBC8DA)]">·</span>
                    <span>No extra days</span>
                  </p>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] px-2 py-0.5 rounded-full border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                  <svg className="w-3 h-3 text-[var(--vt-color-green-600,#2E9E57)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Approved</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-3 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
              2 total changes so far
            </span>
            <button
              type="button"
              className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer"
            >
              + Ask for a change
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Weather (2) + Workers on Site (5) + Contractor Checks (4) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
        {/* 2. Site Weather & Delays Card */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                    Site Weather & Delays
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Lekki Phase 1, Lagos
                  </p>
                </div>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] animate-ping" title="Weather updated live" />
            </div>

            {/* Weather Metrics Display */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] mb-3">
              <div>
                <span className="text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                  31°C
                </span>
                <span className="text-xs font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] block mt-0.5">
                  Partly Cloudy
                </span>
              </div>
              <div className="text-right text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] space-y-0.5">
                <div>Humidity: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">74%</strong></div>
                <div>Wind: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">14 km/h</strong></div>
                <div>Chance of Rain: <strong className="text-[var(--vt-color-green-700,#1F6B3E)]">12%</strong></div>
              </div>
            </div>

            {/* Delay Verification Status */}
            <div className="p-2.5 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[var(--vt-color-green-600,#2E9E57)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[var(--vt-color-green-800,#144D2A)] block leading-tight">
                  Work is Ongoing
                </span>
                <span className="text-[10px] text-[var(--vt-color-green-700,#1F6B3E)]">
                  No rain delays recorded this week
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
            <span>Good for concrete and brickwork</span>
            <span className="font-semibold text-[var(--vt-color-orange-600,#D84C0B)]">See hourly forecast &rarr;</span>
          </div>
        </div>

        {/* 5. Workers On Site Card */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                    Workers On Site Today
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Confirmed workers currently at your build
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] text-[11px] font-extrabold border border-[var(--vt-color-green-200,#A3D9B1)]">
                18 on site
              </span>
            </div>

            {/* Site Manager Check-in Banner */}
            <div className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] block uppercase font-bold tracking-wider">
                  Site Supervisor
                </span>
                <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
                  Engr. Emeka (07:48 AM)
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--vt-color-green-100,#D5F0DC)] text-[var(--vt-color-green-800,#144D2A)] text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                Confirmed on site
              </span>
            </div>

            {/* Trades Headcount Pills */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
                <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] block text-sm">
                  06
                </span>
                <span className="text-[9px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                  Bricklayers
                </span>
              </div>
              <div className="p-2 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
                <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] block text-sm">
                  04
                </span>
                <span className="text-[9px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                  Iron benders
                </span>
              </div>
              <div className="p-2 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
                <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] block text-sm">
                  08
                </span>
                <span className="text-[9px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                  Helpers & QA
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
            <span>Checks that workers actually show up</span>
            <span className="font-semibold text-[var(--vt-color-orange-600,#D84C0B)]">View daily attendance &rarr;</span>
          </div>
        </div>

        {/* 4. Contractor Checks Card */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                    Contractor Checks
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    SolidGround Engineering Ltd
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] text-[10px] font-bold border border-[var(--vt-color-green-200,#A3D9B1)]">
                All Checks Passed
              </span>
            </div>

            {/* Compliance Items Checklist */}
            <div className="space-y-2 text-xs">
              {/* CAC Status */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[var(--vt-color-green-600,#2E9E57)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                    Company Registered
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                  CAC #1482931 verified
                </span>
              </div>

              {/* COREN / CORBON Stamp */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[var(--vt-color-green-600,#2E9E57)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                    Certified Engineer
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                  COREN #34912
                </span>
              </div>

              {/* All-Risk Insurance */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[var(--vt-color-green-600,#2E9E57)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                    Site Insurance
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
                  Active (Nov 2026)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
            <span>State building permits on file</span>
            <span className="font-semibold text-[var(--vt-color-orange-600,#D84C0B)]">View documents &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
