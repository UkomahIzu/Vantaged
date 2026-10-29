"use client";

import React from "react";
import { IconDisputes } from "../../components/AdminIcons";

export default function DisputesRadarPage() {
  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
            <IconDisputes className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
            Risk & Escrow Radar
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">Dispute & Risk Monitoring</h1>
        <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
          Real-time oversight of escrow holds, unconfirmed bank transfers, repeated milestone rejections, and bank account changes.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Open Disputes</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">00</div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">Zero formal platform disputes</div>
        </div>

        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Unconfirmed Transfers</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">00</div>
          <div className="text-[11px] font-medium text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1">"Paid - Not Confirmed" receipts: 0</div>
        </div>

        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Repeated Rejections</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] tracking-tight">01</div>
          <div className="text-[11px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-1">1 site with 2+ consecutive rejections</div>
        </div>

        <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">Bank Detail Changes</span>
          <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">00</div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">No anomalous NUBAN modifications</div>
        </div>
      </div>

      {/* Risk Alert Queue */}
      <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.04)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] mb-4">
          <h2 className="text-base font-bold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">Active Platform Alerts</h2>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
            1 ADVISORY NOTICE
          </span>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--vt-color-orange-200,#FDCAA9)] bg-[var(--vt-color-orange-50,#FFF4EE)] p-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--vt-color-orange-500,#EF5F18)] text-white">
                    MILESTONE REJECTION WARNING
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--vt-color-orange-700,#B33C08)]">PRJ-KN-0193 · Kano Plaza</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Second consecutive stage review rejection logged by Owner Rep
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  Substructure reinforcement inspection rejected twice due to missing stirrup spacing documentation. Escrow tranche remains locked. Platform protocol allows contractor 5 working days before mediation triggers.
                </p>
              </div>

              <button className="shrink-0 h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold text-white transition-all shadow-sm">
                Inspect Timeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
