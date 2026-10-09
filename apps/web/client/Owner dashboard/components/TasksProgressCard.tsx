"use client";

import React from "react";
import { todayTasks } from "../data/mockData";

export function TasksProgressCard() {
  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_12px_rgba(38,26,102,0.05)] flex flex-col justify-between font-sans select-none min-h-[310px]">
      {/* Header with Title, Avatar Stack & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
            Today tasks
          </h2>

          {/* Stacked Avatars + Orange Plus Button */}
          <div className="flex items-center -space-x-1.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces"
              alt="Team member"
              className="w-6 h-6 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=faces"
              alt="Team member"
              className="w-6 h-6 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=faces"
              alt="Team member"
              className="w-6 h-6 rounded-full border-2 border-white object-cover"
            />
            <button
              type="button"
              className="w-6 h-6 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[11px] font-bold border-2 border-white flex items-center justify-center cursor-pointer hover:bg-[var(--vt-color-orange-600,#D84C0B)] shadow-2xs"
              title="Add assignee"
            >
              +
            </button>
          </div>
        </div>

        {/* View and Edit Controls */}
        <div className="flex items-center gap-3 text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
          <div className="flex items-center gap-0.5 p-0.5 bg-[var(--vt-color-neutral-100,#EFEEF5)] rounded-md border border-[var(--vt-color-border-default,#E2E0EC)]">
            <button type="button" className="p-1 rounded-sm bg-white text-[var(--vt-color-orange-600,#D84C0B)] shadow-2xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button type="button" className="p-1 rounded-sm text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </button>
          </div>

          <button type="button" className="flex items-center gap-1 hover:text-[var(--vt-color-orange-600,#D84C0B)] cursor-pointer">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </button>

          <button type="button" className="flex items-center gap-1 hover:text-[var(--vt-color-orange-600,#D84C0B)] cursor-pointer">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Task Rows List */}
      <div className="flex flex-col gap-2.5">
        {todayTasks.map((t, idx) => (
          <div
            key={t.id}
            className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
              idx === 0
                ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/40 border border-[var(--vt-color-orange-200,#FDCAA9)]"
                : "hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/80"
            }`}
          >
            {/* Task Name & Timestamp */}
            <div className="min-w-0 md:w-1/3">
              <h4 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                {t.title}
              </h4>
              <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-sans">
                {idx === 0 ? "4 May, 09:20 AM" : idx === 1 ? "14 May, 12:45 AM" : "21 May, 10:30 AM"}
              </span>
            </div>

            {/* Duration */}
            <div className="text-left md:text-center md:w-1/4">
              <span className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] block">Duration</span>
              <span className="text-xs font-bold text-[var(--vt-color-neutral-700,#46425F)] font-sans">
                {t.duration}
              </span>
            </div>

            {/* Progress Bar & Percentage in Vibrant Orange */}
            <div className="flex items-center gap-2 md:w-1/3">
              <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] font-sans shrink-0">
                {t.progressPercent}%
              </span>
              <div className="flex-1 h-1.5 bg-[var(--vt-color-orange-100,#FFE6D5)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full transition-all duration-500"
                  style={{ width: `${t.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Badges / Comments / Dates */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-[var(--vt-color-neutral-500,#7C7894)] shrink-0 font-sans">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>{t.commentsCount}</span>
              </span>

              {t.photosCount ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>{t.photosCount}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[var(--vt-color-neutral-400,#A3A0B8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span>{t.deadline}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
