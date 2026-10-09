"use client";

import React from "react";

export function QuickActionCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 select-none font-sans">
      {/* 1. Add New Card (Soft container with centered Orange plus button) */}
      <div className="bg-[var(--vt-color-orange-50,#FFF4EE)]/50 hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-dashed border-[var(--vt-color-orange-300,#FBA674)] rounded-xl p-4.5 sm:p-5 flex flex-col items-center justify-center min-h-[145px] sm:min-h-[160px] transition-all cursor-pointer group shadow-2xs">
        <button
          type="button"
          title="Add New Project or Stage"
          className="w-10 h-10 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-[0_4px_12px_rgba(239,95,24,0.35)] cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="text-[11px] font-bold text-[var(--vt-color-orange-700,#B33C08)] mt-2.5 group-hover:text-[var(--vt-color-orange-800,#8F320D)] transition-colors">
          Add new
        </span>
      </div>

      {/* 2. Stay organized */}
      <div className="bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/30 border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] rounded-xl p-4.5 sm:p-5 flex flex-col justify-between min-h-[145px] sm:min-h-[160px] shadow-[0_4px_12px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.08)] transition-all cursor-pointer group">
        {/* Line style Calendar illustration with Orange accents */}
        <div className="h-14 sm:h-16 flex items-center justify-center">
          <svg className="h-12 w-12 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 56 56" fill="none">
            {/* Binder rings */}
            <path d="M19 10C19 8.34315 20.3431 7 22 7C23.6569 7 25 8.34315 25 10V14H19V10Z" stroke="currentColor" strokeWidth="2" />
            <path d="M31 10C31 8.34315 32.3431 7 34 7C35.6569 7 37 8.34315 37 10V14H31V10Z" stroke="currentColor" strokeWidth="2" />
            {/* Calendar page */}
            <rect x="13" y="12" width="30" height="34" rx="4" stroke="currentColor" strokeWidth="2.2" fill="#FFFFFF" />
            <path d="M13 20H43" stroke="currentColor" strokeWidth="2" />
            {/* Checked block in warm orange tint */}
            <rect x="17" y="24" width="10" height="10" rx="2" fill="var(--vt-color-orange-100,#FFE6D5)" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="1.8" />
            {/* Pointer cursor arrow in orange brand */}
            <path d="M34 32L38 42L33 39L29 44L27 42L31 37L28 35L34 32Z" fill="var(--vt-color-orange-500,#EF5F18)" stroke="var(--vt-color-indigo-900,#261A66)" strokeWidth="1.5" />
          </svg>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors leading-tight mb-1">
            Stay organized
          </h3>
          <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] leading-tight line-clamp-2">
            A clear structure for your notes
          </p>
        </div>
      </div>

      {/* 3. Sync your notes */}
      <div className="bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/30 border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] rounded-xl p-4.5 sm:p-5 flex flex-col justify-between min-h-[145px] sm:min-h-[160px] shadow-[0_4px_12px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.08)] transition-all cursor-pointer group">
        {/* Hanging wire notes with Orange accent */}
        <div className="h-14 sm:h-16 flex items-center justify-center">
          <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
            {/* Wire line */}
            <path d="M6 14Q32 20 58 14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Left Card hanging */}
            <rect x="10" y="16" width="16" height="22" rx="3" transform="rotate(-8 10 16)" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
            <line x1="16" y1="12" x2="16" y2="18" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Middle Card hanging in orange tint */}
            <rect x="25" y="17" width="16" height="23" rx="3" transform="rotate(5 25 17)" stroke="currentColor" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
            <line x1="33" y1="13" x2="33" y2="19" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M29 28L33 32L39 24" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Right Card hanging */}
            <rect x="42" y="16" width="15" height="21" rx="3" transform="rotate(12 42 16)" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
            <line x1="49" y1="13" x2="49" y2="19" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors leading-tight mb-1">
            Sync your notes
          </h3>
          <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] leading-tight line-clamp-2">
            Ensure that notes are synced
          </p>
        </div>
      </div>

      {/* 4. Collaborate and share */}
      <div className="bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/30 border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] rounded-xl p-4.5 sm:p-5 flex flex-col justify-between min-h-[145px] sm:min-h-[160px] shadow-[0_4px_12px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.08)] transition-all cursor-pointer group relative">
        {/* Open folder & share illustration */}
        <div className="h-14 sm:h-16 flex items-center justify-center relative">
          <svg className="h-12 w-14 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 60 56" fill="none">
            {/* Folder body */}
            <path d="M12 18H24L28 22H48C50.2091 22 52 23.7909 52 26V42C52 44.2091 50.2091 46 48 46H12C9.79086 46 8 44.2091 8 42V22C8 19.7909 9.79086 18 12 18Z" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
            {/* Inner sheet in warm orange */}
            <rect x="14" y="24" width="32" height="12" rx="2" fill="var(--vt-color-orange-50,#FFF4EE)" stroke="var(--vt-color-orange-400,#F6803F)" strokeWidth="1.5" />
            {/* Clasp in brand orange */}
            <circle cx="30" cy="30" r="3.5" fill="var(--vt-color-orange-500,#EF5F18)" />
          </svg>
          {/* Small -5% pill badge top-right */}
          <span className="absolute top-1 right-2 px-2 py-0.5 rounded-full bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[9px] font-bold border border-[var(--vt-color-orange-200,#FDCAA9)] font-sans">
            -5%
          </span>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors leading-tight mb-1">
            Collaborate and share
          </h3>
          <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] leading-tight line-clamp-2">
            Share notes with colleagues
          </p>
        </div>
      </div>
    </div>
  );
}
