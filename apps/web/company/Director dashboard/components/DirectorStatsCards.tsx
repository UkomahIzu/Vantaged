"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { useContractorCapacity } from "../hooks/useContractorCapacity";
import { DEMO_DIRECTOR_PROJECTS } from "../data/directorData";
import { readScopedCompanyAcceptedProjects } from "../../../shared/vantagedAuth";
import {
  CONTRACTOR_SYNC_EVENT,
  SHARED_SYNC_EVENT,
} from "../../../shared/vantagedSyncBridge";
import {
  CONTRACTOR_STORAGE_EVENT,
  ContractorProjectStage,
  ContractorProjectTranche,
  getContractorProjectDetail,
  loadProjectKey,
} from "../pages/project dashboard/contractorProjectData";
import { readLocalData } from "../utils/localPersistence";

function formatNairaShort(amount: number): string {
  if (amount <= 0) return "₦0";
  if (amount >= 1000000000) return `₦${(amount / 1000000000).toFixed(2)}B`;
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function DirectorStatsCards() {
  const { isDemoMode } = useDirectorDemoMode();
  const capacity = useContractorCapacity();

  const [metrics, setMetrics] = useState({
    stagesNeedingAction: 0,
    fixCount: 0,
    reviewCount: 0,
    pendingReceiptAmount: 0,
    pendingReceiptCount: 0,
    confirmedTotal: 0,
    approvedStages: 0,
    totalEvaluatedStages: 0,
  });

  useEffect(() => {
    const compute = () => {
      const liveAccepted = readScopedCompanyAcceptedProjects<any>();
      const demoAllowed = isDemoMode
        ? Math.max(0, capacity.totalSlots - liveAccepted.length)
        : 0;
      const projectIds = Array.from(
        new Set([
          ...liveAccepted.map((p: any) => p.id).filter(Boolean),
          ...(isDemoMode
            ? DEMO_DIRECTOR_PROJECTS.slice(0, demoAllowed).map((p) => p.id)
            : []),
        ])
      );

      let fixCount = 0;
      let reviewCount = 0;
      let disputedCount = 0;
      let approvedStages = 0;
      let totalEvaluatedStages = 0;
      let pendingReceiptAmount = 0;
      let pendingReceiptCount = 0;
      let confirmedTotal = 0;

      for (const pid of projectIds) {
        const detail = getContractorProjectDetail(pid, true);
        const stages = loadProjectKey<ContractorProjectStage[]>(pid, "stages", detail.stages);
        const tranches = loadProjectKey<ContractorProjectTranche[]>(
          pid,
          "tranches",
          detail.tranches
        );

        for (const st of stages) {
          if (st.status === "Fix Requested") {
            fixCount++;
            totalEvaluatedStages++;
          } else if (st.status === "Disputed") {
            disputedCount++;
            totalEvaluatedStages++;
          } else if (st.status === "Ready for Review") {
            reviewCount++;
          } else if (st.status === "Approved") {
            approvedStages++;
            totalEvaluatedStages++;
          }
        }

        for (const tr of tranches) {
          if (tr.status === "Awaiting Your Confirmation") {
            pendingReceiptCount++;
            pendingReceiptAmount += tr.netPayout;
          } else if (tr.status === "Receipt Confirmed") {
            confirmedTotal += tr.netPayout;
          }
        }
      }

      // Also include any unconfirmed demo ledger item if in Demo Mode and no project tranches pending
      if (isDemoMode && pendingReceiptCount === 0) {
        const demoTxs = readLocalData<any[]>("vantaged_director_transactions", []);
        const pendingDemo = demoTxs.filter(
          (t) => t?.status === "Pending Receipt Confirmation"
        );
        if (pendingDemo.length > 0) {
          pendingReceiptCount = pendingDemo.length;
          pendingReceiptAmount = pendingDemo.reduce((s, t) => s + (Number(t.amount) || 0), 0);
        }
      }

      setMetrics({
        stagesNeedingAction: fixCount + disputedCount + reviewCount,
        fixCount: fixCount + disputedCount,
        reviewCount,
        pendingReceiptAmount,
        pendingReceiptCount,
        confirmedTotal,
        approvedStages,
        totalEvaluatedStages,
      });
    };

    compute();
    window.addEventListener(CONTRACTOR_STORAGE_EVENT, compute);
    window.addEventListener(SHARED_SYNC_EVENT, compute);
    window.addEventListener(CONTRACTOR_SYNC_EVENT, compute);
    window.addEventListener("vantaged_company_projects_update", compute);
    window.addEventListener("vantaged_director_demo_toggle", compute);
    window.addEventListener("storage", compute);
    return () => {
      window.removeEventListener(CONTRACTOR_STORAGE_EVENT, compute);
      window.removeEventListener(SHARED_SYNC_EVENT, compute);
      window.removeEventListener(CONTRACTOR_SYNC_EVENT, compute);
      window.removeEventListener("vantaged_company_projects_update", compute);
      window.removeEventListener("vantaged_director_demo_toggle", compute);
      window.removeEventListener("storage", compute);
    };
  }, [isDemoMode, capacity.totalSlots]);

  const totalActive = capacity.usedSlots;
  const activeProjectsDisplay = totalActive.toString().padStart(2, "0");
  const slotSubtitle = `${capacity.usedSlots} / ${capacity.totalSlots} ${capacity.planName} slot${capacity.totalSlots === 1 ? "" : "s"} used`;

  const stagesPendingActionDisplay = metrics.stagesNeedingAction.toString().padStart(2, "0");
  const stageSubtitle =
    metrics.stagesNeedingAction > 0
      ? `${metrics.fixCount} fix/dispute · ${metrics.reviewCount} awaiting review`
      : "No pending submissions or fixes";

  const receiptsPendingDisplay = formatNairaShort(metrics.pendingReceiptAmount);
  const approvalRate =
    metrics.totalEvaluatedStages > 0
      ? Math.round((metrics.approvedStages / metrics.totalEvaluatedStages) * 100)
      : null;
  const ratingDisplay = isDemoMode
    ? "4.9 ★"
    : approvalRate !== null
    ? `${(4 + approvalRate / 100).toFixed(1)} ★`
    : "—";
  const ratingSubtitle = isDemoMode
    ? "92% first-time approval rate"
    : approvalRate !== null
    ? `${approvalRate}% verified stage approval rate`
    : "No verified stages completed yet";

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

      {/* 2. Stages Needing Site Action / Review (Live) */}
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
            <span>{metrics.stagesNeedingAction > 0 ? "Needs attention" : "Up to date"}</span>
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
            {stageSubtitle}
          </p>
        </div>
      </Link>

      {/* 3. Pending Receipt Confirmations (Live) */}
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
            <span>
              {metrics.pendingReceiptCount > 0
                ? `${metrics.pendingReceiptCount} Pending`
                : "Ledger"}
            </span>
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
            {formatNairaShort(metrics.confirmedTotal)} confirmed payouts
          </p>
        </div>
      </Link>

      {/* 4. Reputation & Rating (Live) */}
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
            {ratingSubtitle}
          </p>
        </div>
      </Link>
    </div>
  );
}
