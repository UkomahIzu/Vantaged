"use client";

import React from "react";
import Link from "next/link";
import { useContractorUser } from "../hooks/useContractorUser";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";

interface DirectorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DirectorProfileModal({ isOpen, onClose }: DirectorProfileModalProps) {
  const user = useContractorUser();
  const { isDemoMode } = useDirectorDemoMode();

  if (!isOpen) return null;

  const initials = user.fullName
    .replace(/^(Engr\.|Arch\.|QS|Chief)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/50 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-[0_20px_50px_rgba(38,26,102,0.22)] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[var(--vt-color-indigo-900,#261A66)] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
              {initials || "BA"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {user.fullName}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                {user.companyName} · {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                CAC Registration
              </span>
              <div className="mt-1 font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                {isDemoMode ? user.rcNumber : "Pending Submission"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                Subscription Quota
              </span>
              <div className="mt-1 font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)] tabular-nums">
                {isDemoMode ? "Verified Builder (3 / 3)" : "Starter Free Slot (0 / 1)"}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                Director Role Capabilities
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                Full Company Access
              </span>
            </div>
            <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              Includes Site Manager, Office Coordinator, and Crew operations across all projects alongside exclusive Director authority over bank details (48h lock), staff roles, company verification, and billing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-2">
          <Link
            href="/contractor/login"
            onClick={onClose}
            className="h-9 px-3.5 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center transition-colors"
          >
            Switch Company Role
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-md bg-[var(--vt-color-primary-default,#B33C08)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(179,60,8,0.25)] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
