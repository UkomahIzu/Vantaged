"use client";

import React, { useState } from "react";

export function SiteFieldOperationsCards() {
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);

  return (
    <div className="w-full font-sans select-none pb-8">
      {/* ── 2-Card Clean Row: Project Changes (Left) + Contractor Checks (Right) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full items-stretch">
        {/* 1. Project Changes Card */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all min-h-[340px]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Extra work, upgrades & adjustments
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[10px] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)]">
                1 needs review
              </span>
            </div>

            {/* Changes List */}
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

              {/* Item 3: Approved */}
              <div className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                    Security Sensor Conduit Wiring
                  </h4>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    <span className="text-[var(--vt-color-neutral-700,#443E68)] font-semibold">+₦650,000</span>
                    <span className="mx-1.5 text-[var(--vt-color-neutral-300,#CBC8DA)]">·</span>
                    <span>Same timeline</span>
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
              3 total changes recorded
            </span>
            <button
              type="button"
              className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer"
            >
              + Ask for a change
            </button>
          </div>
        </div>

        {/* 2. Contractor Checks Card */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)] flex flex-col justify-between group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all min-h-[340px]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                    Contractor Checks
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    SolidGround Engineering Ltd · Verified EPC
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] text-[10px] font-bold border border-[var(--vt-color-green-200,#A3D9B1)]">
                All Passed
              </span>
            </div>

            {/* Compliance Items Checklist */}
            <div className="space-y-2 text-xs">
              {/* CAC Status */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
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

              {/* COREN Stamp */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[var(--vt-color-green-600,#2E9E57)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                    Certified Engineer
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                  COREN #34912 active
                </span>
              </div>

              {/* All-Risk Insurance */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[var(--vt-color-green-600,#2E9E57)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                    Site Insurance
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
                  Active (Valid Nov 2026)
                </span>
              </div>

              {/* State Building Permit */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[var(--vt-color-green-600,#2E9E57)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                    Building Permit
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
                  LASBCA Stamped
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-3 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
            <span>Verified state construction files</span>
            <span className="font-semibold text-[var(--vt-color-orange-600,#D84C0B)] cursor-pointer hover:underline">
              View documents &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
