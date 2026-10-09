"use client";

import React from "react";
import { circularMetrics, upcomingMeeting } from "../data/mockData";

export function MetricsAndMeetingCard() {
  return (
    <div className="flex flex-col gap-4 font-sans select-none">
      {/* 1. Top Section: 2 Circular Progress Metric Cards Side-by-Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Metric 1: 90% Data Research */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-4 shadow-[0_4px_12px_rgba(38,26,102,0.05)] flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            {/* SVG Circular Donut Chart 90% in Green */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[var(--vt-color-green-50,#E9F6EC)]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--vt-color-green-500,#2E9E57)]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray="90, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-[var(--vt-color-indigo-900,#261A66)] font-sans">
                90%
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[9px] font-bold text-[var(--vt-color-green-700,#1F6B3E)] uppercase tracking-wider block">
                DATA RESEARCH
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                Marketing
              </h4>
            </div>
          </div>

          <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] leading-tight mt-1">
            You marked <span className="font-sans font-semibold">5/5</span>.<br />All assignments are done!
          </p>
        </div>

        {/* Metric 2: 65% UI/UX Design with Orange Check Button */}
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-4 shadow-[0_4px_12px_rgba(38,26,102,0.05)] flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            {/* SVG Circular Donut Chart 65% in Vibrant Brand Orange */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[var(--vt-color-orange-50,#FFF4EE)]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--vt-color-orange-500,#EF5F18)]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray="65, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] font-sans">
                65%
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[9px] font-bold text-[var(--vt-color-orange-700,#B33C08)] uppercase tracking-wider block">
                UI/UX DESIGN
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                Typography
              </h4>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] leading-tight">
              You marked <span className="font-sans font-semibold">3/5</span>.<br />2 assignments left.
            </p>

            <button
              type="button"
              className="h-7 px-3 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-[10px] font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              Check
            </button>
          </div>
        </div>
      </div>

      {/* 2. Bottom Section: Board Meeting Card */}
      <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-4.5 sm:p-5 shadow-[0_4px_12px_rgba(38,26,102,0.05)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Board meeting
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
            <span className="text-[11px] font-medium text-[var(--vt-color-neutral-500,#7C7894)] font-sans">
              March 24 at 4:00 PM
            </span>
          </div>

          <button type="button" className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] cursor-pointer flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </button>
        </div>

        <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mb-4">
          Meeting with John Smith, 4th floor, room 159
        </p>

        {/* Action Buttons: Reschedule & Accept Invite */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            className="h-9 px-4 rounded-md bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors cursor-pointer"
          >
            Reschedule
          </button>

          <button
            type="button"
            className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:scale-95 text-xs font-bold text-white transition-all cursor-pointer shadow-[0_2px_8px_rgba(239,95,24,0.3)] hover:shadow-[0_4px_14px_rgba(239,95,24,0.4)]"
          >
            Accept invite
          </button>
        </div>
      </div>
    </div>
  );
}
