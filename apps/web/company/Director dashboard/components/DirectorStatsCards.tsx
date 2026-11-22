"use client";

import React from "react";
import Link from "next/link";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { DEMO_DIRECTOR_PROJECTS } from "../data/directorData";

export function DirectorStatsCards() {
  const { isDemoMode } = useDirectorDemoMode();

  const activeProjectsDisplay = isDemoMode
    ? DEMO_DIRECTOR_PROJECTS.length.toString().padStart(2, "0")
    : "00";
  const slotSubtitle = isDemoMode ? "3 / 3 Verified slots used" : "0 / 1 Free starter slot used";

  const stagesPendingActionDisplay = isDemoMode ? "02" : "00";
  const receiptsPendingDisplay = isDemoMode ? "₦22,500,000" : "₦0";
  const ratingDisplay = isDemoMode ? "4.9 ★" : "—";

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full select-none font-sans"
    >
      {/* 1. Active Builds & Slot Usage */}
      <Link
        href="/contractor/projects"
        className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center gap-1 transition-colors">
            <span>View builds</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1 tabular-nums">
            {activeProjectsDisplay}
          </div>
          <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
            Active projects
          </h3>
          <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5 tabular-nums">
            {slotSubtitle}
          </p>
        </div>
      </Link>

      {/* 2. Stages Needing Site Action / Review */}
      <Link
        href="/contractor/projects"
        className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <polyline points="9 15 11 17 15 13" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] flex items-center gap-1 group-hover:underline">
            <span>{isDemoMode ? "Needs attention" : "Up to date"}</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] tracking-tight mb-1 tabular-nums">
            {stagesPendingActionDisplay}
          </div>
          <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
            Stages awaiting action
          </h3>
          <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">
            {isDemoMode ? "1 punch-list fix · 1 client review" : "No pending submissions or fixes"}
          </p>
        </div>
      </Link>

      {/* 3. Pending Receipt Confirmations (3-Day Window) */}
      <Link
        href="/contractor/transactions"
        className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-green-400,#52B874)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(46,158,87,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[var(--vt-color-green-700,#1F6B3E)] flex items-center gap-1 transition-colors">
            <span>{isDemoMode ? "1 Receipt (Day 2/3)" : "Ledger"}</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div>
          <div
            style={{ fontFeatureSettings: "'tnum' 1" }}
            className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1 truncate tabular-nums"
          >
            {receiptsPendingDisplay}
          </div>
          <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
            Receipts awaiting confirm
          </h3>
          <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5 tabular-nums">
            {isDemoMode ? "₦213,700,000 confirmed total" : "₦0 total confirmed payouts"}
          </p>
        </div>
      </Link>

      {/* 4. Reputation & Rating */}
      <Link
        href="/contractor/settings"
        className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-indigo-300,#ABA3E8)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(38,26,102,0.1)] transition-all flex flex-col justify-between group cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-700,#43379A)] border border-[var(--vt-color-indigo-200,#D7D3F3)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1 transition-colors">
            <span>Profile</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1 tabular-nums">
            {ratingDisplay}
          </div>
          <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
            Directory standing
          </h3>
          <p className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">
            {isDemoMode ? "92% first-time approval rate" : "No completed project ratings yet"}
          </p>
        </div>
      </Link>
    </div>
  );
}
