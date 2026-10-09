"use client";

import React, { useState } from "react";

export function HeaderBar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pt-1 pb-2 font-sans select-none">
      {/* Left: History Navigation (< -) matching Drive Storage reference + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Subtle History Navigation Buttons (← →) */}
        <div className="flex items-center gap-1.5 shrink-0 text-[var(--vt-color-neutral-400,#A3A0B8)]">
          <button
            type="button"
            title="Go Back"
            className="w-8 h-8 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            title="Go Forward"
            className="w-8 h-8 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Center/Left Search Bar (rounded-md / 10px matching tokens) */}
        <div className="relative flex items-center flex-1 min-w-[200px]">
          <svg
            className="w-4 h-4 text-[var(--vt-color-neutral-400,#A3A0B8)] absolute left-3.5 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search properties, milestones, telemetry..."
            className="w-full h-9 pl-9 pr-4 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/15 rounded-md text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] outline-none transition-all shadow-2xs font-sans"
          />
        </div>
      </div>

      {/* Right: Actions, Utilities & Primary CTA Button */}
      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
        {/* Light / Dark Mode Toggle */}
        <div className="p-0.5 bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] rounded-md flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all cursor-pointer font-sans ${
              theme === "light"
                ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-xs"
                : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
            }`}
          >
            <svg className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold transition-all cursor-pointer font-sans ${
              theme === "dark"
                ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white shadow-xs"
                : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span>Dark</span>
          </button>
        </div>

        {/* Notifications Bell */}
        <button
          type="button"
          title="Notifications"
          className="w-9 h-9 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-center text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] transition-colors cursor-pointer shadow-2xs relative"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] ring-1.5 ring-white" />
        </button>

        {/* Export Data Button */}
        <button
          type="button"
          className="hidden md:flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] transition-colors cursor-pointer shadow-2xs font-sans"
        >
          <svg className="w-3.5 h-3.5 text-[var(--vt-color-neutral-500,#7C7894)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export data</span>
          <span className="ml-0.5 px-1.5 py-0.2 bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] text-[10px] font-bold rounded-sm border border-[var(--vt-color-orange-200,#FDCAA9)]">
            PDF
          </span>
        </button>

        {/* Primary CTA Button in Vibrant Brand Orange 30% */}
        <button
          type="button"
          className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)] flex items-center gap-1.5 font-sans"
        >
          <span>+ Add new board</span>
        </button>
      </div>
    </header>
  );
}
