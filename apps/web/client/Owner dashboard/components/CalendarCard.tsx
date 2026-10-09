"use client";

import React, { useState } from "react";
import { calendarDays, scheduleEvents } from "../data/mockData";

export function CalendarCard() {
  const [selectedDay, setSelectedDay] = useState<number>(18);

  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_12px_rgba(38,26,102,0.05)] flex flex-col justify-between font-sans select-none min-h-[300px]">
      {/* Month Header with Chevrons */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
          May 2021
        </h2>
        <div className="flex items-center gap-1 text-[var(--vt-color-neutral-500,#7C7894)]">
          <button
            type="button"
            className="w-7 h-7 rounded-md hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-md hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days Strip with Orange Active Indicator */}
      <div className="grid grid-cols-7 gap-1 text-center mb-4 pb-2 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
        {calendarDays.map((d) => {
          const isActive = d.dayNumber === selectedDay;
          return (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => setSelectedDay(d.dayNumber)}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <span className={`text-[10px] font-semibold transition-colors ${
                isActive ? "text-[var(--vt-color-orange-600,#D84C0B)]" : "text-[var(--vt-color-neutral-500,#7C7894)] group-hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}>
                {d.dayName}
              </span>
              <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-all ${
                  isActive
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-[0_2px_8px_rgba(239,95,24,0.35)] scale-105"
                    : "text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)]"
                }`}
              >
                {d.dayNumber}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Items with Dotted Tracks */}
      <div className="flex flex-col gap-3">
        {scheduleEvents.map((ev) => (
          <div key={ev.id} className="flex flex-col gap-1.5">
            {/* Time Slot with Dotted Line */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--vt-color-neutral-700,#46425F)] uppercase tracking-wider shrink-0 font-sans">
                {ev.timeSlot}
              </span>
              <div className="flex-1 border-b border-dotted border-[var(--vt-color-border-strong,#CBC8DA)]" />
            </div>

            {/* Event Card with Orange Icon Container */}
            <div className="flex items-center justify-between p-2.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/40 border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight truncate">
                    {ev.title}
                  </h4>
                  <p className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                    {ev.locationOrType}
                  </p>
                </div>
              </div>

              <button type="button" className="text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] p-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
