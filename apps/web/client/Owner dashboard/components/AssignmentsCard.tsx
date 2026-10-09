"use client";

import React from "react";
import { currentAssignment } from "../data/mockData";

export function AssignmentsCard() {
  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_12px_rgba(38,26,102,0.05)] flex flex-col justify-between font-sans select-none min-h-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
          Assignments
        </h2>
        <button
          type="button"
          className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors cursor-pointer flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit</span>
        </button>
      </div>

      {/* Task Content Card */}
      <div className="flex flex-col gap-3">
        {/* Category & 3 dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
              {currentAssignment.categoryTag}
            </span>
            <span className="text-xs font-medium text-[var(--vt-color-neutral-500,#7C7894)]">
              Logo
            </span>
          </div>

          <button type="button" className="text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] p-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
              <circle cx="6" cy="12" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Task Title & Priority Badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm sm:text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-snug">
            {currentAssignment.title}
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--vt-color-red-50,#FDECEA)] text-[var(--vt-color-red-700,#B42318)] border border-[var(--vt-color-red-200,#F3A69D)] text-[10px] font-bold shrink-0">
            {currentAssignment.priority}
          </span>
        </div>

        {/* Tag & Assignee row */}
        <div className="flex items-center justify-between pt-1">
          <span className="px-3 py-1 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[11px] font-semibold">
            {currentAssignment.stageTag}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[var(--vt-color-neutral-700,#46425F)]">
              {currentAssignment.assignee.name}
            </span>
            <img
              src={currentAssignment.assignee.avatar}
              alt={currentAssignment.assignee.name}
              className="w-6 h-6 rounded-full object-cover border border-[var(--vt-color-border-default,#E2E0EC)]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Button: + Add new assignment (Vibrant Orange CTA) */}
      <button
        type="button"
        className="w-full mt-4 h-10 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(239,95,24,0.25)] hover:shadow-[0_4px_12px_rgba(239,95,24,0.35)]"
      >
        <span className="w-4 h-4 rounded-xs bg-white/20 text-white flex items-center justify-center text-xs font-bold">
          +
        </span>
        <span>Add new assignment</span>
      </button>
    </div>
  );
}
