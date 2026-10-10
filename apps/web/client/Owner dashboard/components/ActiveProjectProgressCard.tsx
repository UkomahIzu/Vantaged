"use client";

import React from "react";

export function ActiveProjectProgressCard() {
  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_6px_20px_rgba(38,26,102,0.06)] flex flex-col justify-between font-sans select-none w-full transition-all">
      {/* 1. Top Identifier Row: Active Visit / Project & Job ID */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-bold tracking-wider text-[var(--vt-color-orange-600,#D84C0B)] uppercase font-sans">
          ACTIVE PROJECT
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--vt-color-indigo-50,#F4F3FC)] border border-[var(--vt-color-indigo-200,#D7D3F3)] text-[var(--vt-color-indigo-800,#342982)] text-[10px] font-bold font-sans">
          JOB-4821
        </span>
      </div>

      {/* 2. Project Title, Location Subtitle & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight leading-snug">
            Lekki Phase 1 Luxury Villa
          </h2>
          <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 font-sans">
            Plot 14, Admiralty Way, Lekki • 4-Bedroom Detached + Penthouse
          </p>
        </div>

        {/* 'In progress' Status Pill matching reference */}
        <div className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold font-sans">
          <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
          <span>In progress</span>
        </div>
      </div>

      {/* 3. Scope Box (Matching 'SERVICE SELECTION' from reference) */}
      <div className="bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 border border-[var(--vt-color-border-default,#E2E0EC)] rounded-lg p-3.5 sm:p-4 mb-4 flex items-start sm:items-center gap-3.5">
        {/* Tool/Crane Icon in rounded square */}
        <div className="w-10 h-10 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider block font-sans">
            CURRENT STAGE SCOPE
          </span>
          <h3 className="text-sm sm:text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight mt-0.5">
            First Floor Slab Casting + Structural Column Reinforcement
          </h3>
          <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 leading-relaxed font-sans">
            Includes: High-tensile 16mm rebar tying · C30 ready-mix concrete pour · Core test cylinder collection · On-site Rep inspection
          </p>
        </div>
      </div>

      {/* 4. Responsible Technician / Lead Contractor Row */}
      <div className="flex items-center gap-2 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mb-4 font-sans">
        <span>Lead Contractor:</span>
        <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Julius B. Consortium</span>
        <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
          (4.8 ★ · 14 verified milestones completed)
        </span>
        <span className="hidden md:inline text-[var(--vt-color-neutral-300,#CBC8DA)]">•</span>
        <span className="hidden md:inline text-[var(--vt-color-neutral-500,#7C7894)]">
          Assigned Rep: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">Engr. Chidi O.</strong> (On-site)
        </span>
      </div>

      {/* 5. Five-Segment Progress Track (Matching exact 5-bar layout from reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-4">
        {/* Step 1: Completed */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full" />
          <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight font-sans">
            Site setting out
          </h4>
          <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
            Mon, 08:30
          </span>
        </div>

        {/* Step 2: Completed */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full" />
          <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight font-sans">
            Substructure & DPC
          </h4>
          <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
            Mon, 09:20
          </span>
        </div>

        {/* Step 3: Completed */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full" />
          <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight font-sans">
            Quote approved & paid
          </h4>
          <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
            Today, 09:12
          </span>
        </div>

        {/* Step 4: Work in Progress (Active) */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full shadow-[0_0_8px_rgba(239,95,24,0.4)]" />
          <h4 className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] leading-tight flex items-center gap-1 font-sans">
            <span>Work in progress</span>
          </h4>
          <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
            Started 09:40 · ~1h 10m left
          </span>
        </div>

        {/* Step 5: Pending */}
        <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
          <div className="h-1.5 w-full bg-[var(--vt-color-neutral-200,#E2E0EC)] rounded-full" />
          <h4 className="text-xs font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] leading-tight font-sans">
            Ready for sign-off
          </h4>
          <span className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-sans">
            Expected 15:30
          </span>
        </div>
      </div>

      {/* 6. Bottom Price & Action Buttons (Divider line above) */}
      <div className="pt-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Total Escrow Funded / Milestone Value */}
        <div>
          <span className="text-xs font-medium text-[var(--vt-color-neutral-500,#7C7894)] block font-sans">
            Total milestone value funded
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] font-sans tracking-tight mt-0.5">
            ₦18,450,000
          </div>
        </div>

        {/* Action Button: Single Track visit primary button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-10 px-6 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] font-sans flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Track project</span>
          </button>
        </div>
      </div>
    </div>
  );
}
