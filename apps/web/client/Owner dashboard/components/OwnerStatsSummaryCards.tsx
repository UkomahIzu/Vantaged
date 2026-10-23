"use client";

import React from "react";
import Link from "next/link";

export function OwnerStatsSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full select-none font-sans">
      {/* 1. Active Projects Card - Linked to /owner/projects */}
      <Link
        href="/owner/projects"
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
            <span>View all</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1">
            06
          </div>
          <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
            Active projects
          </h3>
        </div>
      </Link>

      {/* 2. Awaiting Your Approval Card - Linked to /owner/projects/proj-lekki/stages */}
      <Link
        href="/owner/projects/proj-lekki/stages"
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
            <span>Review stage</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] tracking-tight mb-1">
            01
          </div>
          <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
            Awaiting your approval
          </h3>
        </div>
      </Link>

      {/* 3. Total Spent Card - Linked to /owner/transactions */}
      <Link
        href="/owner/transactions"
        className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-green-400,#52B874)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(46,158,87,0.12)] transition-all flex flex-col justify-between group cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] group-hover:text-[var(--vt-color-green-700,#1F6B3E)] flex items-center gap-1 transition-colors">
            <span>Ledger</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight mb-1">
            ₦701,746,000
          </div>
          <h3 className="text-sm font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] group-hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors">
            Total spent
          </h3>
        </div>
      </Link>
    </div>
  );
}
