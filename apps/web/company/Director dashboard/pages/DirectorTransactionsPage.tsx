"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { readLocalData, writeLocalData } from "../utils/localPersistence";

export type CompanyTxStatus =
  | "Pending Receipt Confirmation"
  | "Confirmed & Settled"
  | "Held in Escrow"
  | "Retention Holdback";

export interface CompanyTransactionItem {
  id: string;
  reference: string;
  bankSessionId: string;
  projectTitle: string;
  clientName: string;
  stageTitle: string;
  amount: number;
  date: string;
  bankName: string;
  status: CompanyTxStatus;
  slaLabel?: string;
  notes: string;
}

export interface CompanyProjectCashflow {
  id: string;
  title: string;
  client: string;
  contractValue: number;
  receivedAmount: number;
  inEscrowAmount: number;
  retentionAmount: number;
}

const INITIAL_CASHFLOW: CompanyProjectCashflow[] = [
  {
    id: "cf-lekki",
    title: "Lekki Phase 1 Five-Bedroom Villa",
    client: "James Robinson",
    contractValue: 185000000,
    receivedAmount: 77700000,
    inEscrowAmount: 22500000,
    retentionAmount: 9250000,
  },
  {
    id: "cf-ikoyi",
    title: "Banana Island Terrace Apartments",
    client: "Adanna Okafor",
    contractValue: 320000000,
    receivedAmount: 64000000,
    inEscrowAmount: 38000000,
    retentionAmount: 6400000,
  },
  {
    id: "cf-abuja",
    title: "Maitama Commercial Complex Annex",
    client: "Dr. Musa Danjuma",
    contractValue: 240000000,
    receivedAmount: 72000000,
    inEscrowAmount: 24000000,
    retentionAmount: 4200000,
  },
];

const MONTHLY_CASHFLOW_SERIES = [
  { month: "May", settledM: 28, escrowM: 15 },
  { month: "Jun", settledM: 42, escrowM: 22 },
  { month: "Jul", settledM: 35, escrowM: 18 },
  { month: "Aug", settledM: 54, escrowM: 28 },
  { month: "Sep", settledM: 48, escrowM: 32 },
  { month: "Oct", settledM: 66, escrowM: 22.5 },
];

const INITIAL_COMPANY_TXS: CompanyTransactionItem[] = [
  {
    id: "ctx-1",
    reference: "PAY-2026-98412",
    bankSessionId: "NIP-88492014",
    projectTitle: "Lekki Phase 1 Five-Bedroom Villa",
    clientName: "James Robinson",
    stageTitle: "Stage 4: First-Floor Slab & Decking",
    amount: 22500000,
    date: "Today, 10:15 AM",
    bankName: "Zenith Bank (Vantaged Escrow)",
    status: "Pending Receipt Confirmation",
    slaLabel: "Day 2 of 3 SLA",
    notes:
      "Client transfer proof uploaded. Confirm funds have landed in your company NUBAN within the 3-day SLA.",
  },
  {
    id: "ctx-2",
    reference: "PAY-2026-95104",
    bankSessionId: "NIBSS/0000142610150912",
    projectTitle: "Maitama Commercial Complex Annex",
    clientName: "Dr. Musa Danjuma",
    stageTitle: "Stage 3: Ground-Floor Blockwork",
    amount: 24000000,
    date: "Oct 16, 2026",
    bankName: "Access Bank (Vantaged Escrow)",
    status: "Held in Escrow",
    notes:
      "Stage 3 funds funded in bank escrow; release pending concrete cube test dossier resolution.",
  },
  {
    id: "ctx-3",
    reference: "PAY-2026-91208",
    bankSessionId: "NIBSS/0000142610101422",
    projectTitle: "Banana Island Terrace Apartments",
    clientName: "Adanna Okafor",
    stageTitle: "Stage 2: Substructure & Raft Foundation",
    amount: 38000000,
    date: "Oct 10, 2026",
    bankName: "Zenith Bank (Vantaged Escrow)",
    status: "Confirmed & Settled",
    notes:
      "Confirmed by Office Coordinator Amaka Nwosu. Settled to Apex Structure Ltd corporate NUBAN.",
  },
  {
    id: "ctx-4",
    reference: "PAY-2026-87410",
    bankSessionId: "NIBSS/0000142610021105",
    projectTitle: "Lekki Phase 1 Five-Bedroom Villa",
    clientName: "James Robinson",
    stageTitle: "Stage 3: Ground Floor Columns & Beams",
    amount: 31200000,
    date: "Oct 02, 2026",
    bankName: "Zenith Bank (Vantaged Escrow)",
    status: "Confirmed & Settled",
    notes:
      "COREN inspection passed with zero snags; tranche released and confirmed within 6 hours.",
  },
  {
    id: "ctx-5",
    reference: "RET-2026-84019",
    bankSessionId: "NIBSS/0000142609251630",
    projectTitle: "Lekki Phase 1 Five-Bedroom Villa",
    clientName: "James Robinson",
    stageTitle: "5% Structural Warranty Retention",
    amount: 9250000,
    date: "Sep 25, 2026",
    bankName: "Access Bank (Escrow Custody)",
    status: "Retention Holdback",
    notes:
      "Statutory 5% defects liability retention held until final building handover.",
  },
  {
    id: "ctx-6",
    reference: "PAY-2026-79820",
    bankSessionId: "NIBSS/0000142609140845",
    projectTitle: "Maitama Commercial Complex Annex",
    clientName: "Dr. Musa Danjuma",
    stageTitle: "Stage 2: Piling & Foundation Grade Beam",
    amount: 48000000,
    date: "Sep 14, 2026",
    bankName: "Access Bank (Vantaged Escrow)",
    status: "Confirmed & Settled",
    notes: "Pile integrity testing passed. Funds settled to company account.",
  },
];

function formatNairaShort(num: number): string {
  if (num >= 1000000000) return `₦${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
  return `₦${num.toLocaleString("en-NG")}`;
}

export function DirectorTransactionsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("director_transactions");
  const { isDemoMode } = useDirectorDemoMode();

  const [txs, setTxs] = useState<CompanyTransactionItem[]>(() =>
    readLocalData("vantaged_director_transactions", INITIAL_COMPANY_TXS)
  );
  const [cashflow] = useState<CompanyProjectCashflow[]>(INITIAL_CASHFLOW);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [inspectedTx, setInspectedTx] = useState<CompanyTransactionItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const visibleTxs = useMemo(() => (isDemoMode ? txs : []), [isDemoMode, txs]);
  const visibleCashflow = useMemo(
    () => (isDemoMode ? cashflow : []),
    [isDemoMode, cashflow]
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Aggregated KPIs
  const totalContractValue = useMemo(
    () => visibleCashflow.reduce((sum, c) => sum + c.contractValue, 0),
    [visibleCashflow]
  );
  const totalReceived = useMemo(
    () => visibleCashflow.reduce((sum, c) => sum + c.receivedAmount, 0),
    [visibleCashflow]
  );
  const totalInEscrow = useMemo(
    () => visibleCashflow.reduce((sum, c) => sum + c.inEscrowAmount, 0),
    [visibleCashflow]
  );
  const totalRetention = useMemo(
    () => visibleCashflow.reduce((sum, c) => sum + c.retentionAmount, 0),
    [visibleCashflow]
  );
  const pendingConfirmTotal = useMemo(
    () =>
      visibleTxs
        .filter((t) => t.status === "Pending Receipt Confirmation")
        .reduce((sum, t) => sum + t.amount, 0),
    [visibleTxs]
  );
  const pendingCount = useMemo(
    () =>
      visibleTxs.filter((t) => t.status === "Pending Receipt Confirmation").length,
    [visibleTxs]
  );

  const filteredTxs = useMemo(() => {
    return visibleTxs.filter((t) => {
      if (projectFilter !== "All Projects" && t.projectTitle !== projectFilter) {
        return false;
      }
      if (statusFilter !== "All Statuses" && t.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.reference.toLowerCase().includes(q) ||
          t.bankSessionId.toLowerCase().includes(q) ||
          t.projectTitle.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q) ||
          t.stageTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [visibleTxs, projectFilter, statusFilter, searchQuery]);

  const handleConfirmReceipt = (txId: string) => {
    const nextTxs = txs.map((item) =>
      item.id === txId
        ? {
            ...item,
            status: "Confirmed & Settled" as const,
            slaLabel: undefined,
            notes: `${item.notes} Receipt confirmed by Company Director just now.`,
          }
        : item
    );
    setTxs(nextTxs);
    writeLocalData("vantaged_director_transactions", nextTxs);
    setInspectedTx((prev) =>
      prev && prev.id === txId ? { ...prev, status: "Confirmed & Settled" } : prev
    );
    showToast("Receipt confirmed! Tranche marked as Confirmed & Settled.");
  };

  const handleExportCsv = () => {
    const header = "Reference,Session ID,Project,Client,Stage,Amount (NGN),Date,Status\n";
    const rows = filteredTxs
      .map(
        (t) =>
          `"${t.reference}","${t.bankSessionId}","${t.projectTitle}","${t.clientName}","${t.stageTitle}",${t.amount},"${t.date}","${t.status}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vantaged-company-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV ledger exported.");
  };

  // Donut Chart geometry
  const donutTotal = Math.max(1, totalContractValue);
  const receivedPct = isDemoMode ? Math.round((totalReceived / donutTotal) * 100) : 0;
  const escrowPct = isDemoMode ? Math.round((totalInEscrow / donutTotal) * 100) : 0;
  const remainingPct = Math.max(0, 100 - receivedPct - escrowPct);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const receivedDash = (receivedPct / 100) * circumference;
  const escrowDash = (escrowPct / 100) * circumference;

  const maxMonthlyVal = 90; // ₦90M scale ceiling

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      <DirectorSidebarNav currentActiveItem="transactions" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-10"
      >
        <DirectorHeaderBar
          leftSlot={
            <Link
              href="/contractor/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Title & Export */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Payments &amp; Transactions
            </h1>
            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              See money paid to your company, confirm bank transfers, and track your monthly income.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {pendingCount > 0 && (
              <span className="px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold">
                {pendingCount} Waiting for You
              </span>
            )}
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredTxs.length === 0}
              className="h-9 px-4 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-45"
            >
              Download CSV
            </button>
          </div>
        </section>

        {/* 4 Financial KPI Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Total Project Value
            </span>
            <p className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] font-mono mt-1">
              {formatNairaShort(totalContractValue)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              From {visibleCashflow.length} active projects
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Money Received
            </span>
            <p className="text-2xl font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] font-mono mt-1">
              {formatNairaShort(totalReceived)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-green-700,#1F6B3E)] font-semibold mt-1">
              {receivedPct}% of total project value
            </p>
          </div>

          <div className="bg-[var(--vt-color-orange-50,#FFF4EE)] rounded-2xl border border-[var(--vt-color-orange-200,#FDCAA9)] p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
              Waiting for You
            </span>
            <p className="text-2xl font-extrabold text-[var(--vt-color-orange-700,#B33C08)] font-mono mt-1">
              {formatNairaShort(pendingConfirmTotal)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-orange-800,#8F320D)] font-semibold mt-1">
              {pendingCount > 0 ? `${pendingCount} payment to confirm` : "All payments confirmed"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Saved for Handover
            </span>
            <p className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] font-mono mt-1">
              {formatNairaShort(totalRetention)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              5% kept until project finishes
            </p>
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Chart 1: Monthly Money Flow */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Monthly Money Flow
                </h2>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                  Money paid out vs. money held safely (₦ Millions)
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-[var(--vt-color-indigo-900,#261A66)]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--vt-color-orange-500,#EF5F18)]" />
                  Paid
                </span>
                <span className="flex items-center gap-1.5 text-[var(--vt-color-indigo-900,#261A66)]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--vt-color-indigo-900,#261A66)]" />
                  Held Safely
                </span>
              </div>
            </div>

            {!isDemoMode ? (
              <div className="h-52 flex items-center justify-center rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                Your monthly income chart will show here once payments start.
              </div>
            ) : (
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                {MONTHLY_CASHFLOW_SERIES.map((item) => {
                  const settledH = Math.round((item.settledM / maxMonthlyVal) * 100);
                  const escrowH = Math.round((item.escrowM / maxMonthlyVal) * 100);
                  const isHovered = hoveredMonth === item.month;
                  return (
                    <div
                      key={item.month}
                      onMouseEnter={() => setHoveredMonth(item.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 h-full flex flex-col items-center justify-end gap-1.5 relative group cursor-pointer"
                    >
                      {isHovered && (
                        <div className="absolute -top-3 z-20 px-2 py-1 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] text-white text-[10px] font-mono font-bold whitespace-nowrap shadow-lg">
                          ₦{item.settledM}M + ₦{item.escrowM}M
                        </div>
                      )}
                      <div className="w-full flex-1 flex items-end justify-center gap-1.5">
                        <div
                          className="w-5 sm:w-6 rounded-t-md bg-[var(--vt-color-orange-500,#EF5F18)] group-hover:bg-[var(--vt-color-orange-600,#D84C0B)] transition-all duration-300"
                          style={{ height: `${settledH}%` }}
                        />
                        <div
                          className="w-5 sm:w-6 rounded-t-md bg-[var(--vt-color-indigo-900,#261A66)]/85 group-hover:bg-[var(--vt-color-indigo-900,#261A66)] transition-all duration-300"
                          style={{ height: `${escrowH}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chart 2: Escrow Distribution Donut + Per-Project Progress */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                Where Your Money Is
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                How much has been paid, is waiting, or is left to earn
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="#EFEEF5"
                    strokeWidth="14"
                  />
                  {isDemoMode && (
                    <>
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="#EF5F18"
                        strokeWidth="14"
                        strokeDasharray={`${receivedDash} ${circumference}`}
                        strokeLinecap="round"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        fill="none"
                        stroke="#261A66"
                        strokeWidth="14"
                        strokeDasharray={`${escrowDash} ${circumference}`}
                        strokeDashoffset={-receivedDash}
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    {receivedPct}%
                  </span>
                  <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Paid
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF5F18]" />
                    Paid to You
                  </span>
                  <span className="font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    {receivedPct}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#261A66]" />
                    Held Safely
                  </span>
                  <span className="font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    {escrowPct}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EFEEF5]" />
                    Left to Earn
                  </span>
                  <span className="font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                    {remainingPct}%
                  </span>
                </div>
              </div>
            </div>

            {visibleCashflow.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                {visibleCashflow.map((proj) => {
                  const pct = Math.round((proj.receivedAmount / proj.contractValue) * 100);
                  return (
                    <div key={proj.id} className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[var(--vt-color-indigo-900,#261A66)] truncate pr-2">
                          {proj.title}
                        </span>
                        <span className="font-mono text-[var(--vt-color-orange-600,#D84C0B)] shrink-0">
                          {formatNairaShort(proj.receivedAmount)} / {formatNairaShort(proj.contractValue)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Ledger Filters & Table */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                Payment History ({filteredTxs.length})
              </h2>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                Click any row to view the bank receipt or confirm you got the money.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search receipt ID, project, client..."
                className="h-9 w-full sm:w-56 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
              <VantagedSelect
                value={projectFilter}
                onChange={(val) => setProjectFilter(val)}
                containerClassName="w-full sm:w-52"
                options={[
                  { value: "All Projects", label: "All Projects" },
                  ...visibleCashflow.map((c) => ({ value: c.title, label: c.title })),
                ]}
              />
              <VantagedSelect
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                containerClassName="w-full sm:w-52"
                options={[
                  { value: "All Statuses", label: "All Statuses" },
                  { value: "Pending Receipt Confirmation", label: "Waiting for You" },
                  { value: "Confirmed & Settled", label: "Paid" },
                  { value: "Held in Escrow", label: "Held Safely" },
                  { value: "Retention Holdback", label: "Saved for Handover" },
                ]}
              />
            </div>
          </div>

          {filteredTxs.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <p className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                No Payments Yet
              </p>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1 max-w-md mx-auto">
                Stage payments, bank receipts, and saved handover funds will show here once work starts.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--vt-color-neutral-50,#F7F7FA)] border-b border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                    <th className="py-3 px-4">Receipt / Bank ID</th>
                    <th className="py-3 px-4">Project &amp; Stage</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
                  {filteredTxs.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setInspectedTx(tx)}
                      className="hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          {tx.reference}
                        </p>
                        <p className="text-[10.5px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          {tx.bankSessionId}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          {tx.projectTitle}
                        </p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                          {tx.stageTitle}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                        {tx.clientName}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                        ₦{tx.amount.toLocaleString("en-NG")}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            tx.status === "Confirmed & Settled"
                              ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]"
                              : tx.status === "Pending Receipt Confirmation"
                              ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-200,#FDCAA9)]"
                              : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] border-[var(--vt-color-border-default,#E2E0EC)]"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {tx.status === "Pending Receipt Confirmation" ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmReceipt(tx.id);
                            }}
                            className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
                          >
                            Confirm Receipt
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                            Inspect →
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Transaction Receipt Detail Modal */}
      {inspectedTx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setInspectedTx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-5 sm:p-6 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-start justify-between gap-3">
              <div>
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                  {inspectedTx.reference} · {inspectedTx.bankSessionId}
                </span>
                <h3 className="text-xl font-extrabold font-mono mt-1">
                  ₦{inspectedTx.amount.toLocaleString("en-NG")}
                </h3>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] mt-0.5">
                  {inspectedTx.projectTitle} · {inspectedTx.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedTx(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Client
                  </span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {inspectedTx.clientName}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Channel
                  </span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {inspectedTx.bankName}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Milestone Stage
                </span>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  {inspectedTx.stageTitle}
                </p>
                <p className="text-[11.5px] text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1 leading-relaxed">
                  {inspectedTx.notes}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectedTx(null)}
                className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
              >
                Close
              </button>
                  {inspectedTx.status === "Pending Receipt Confirmation" && (
                <button
                  type="button"
                  onClick={() => handleConfirmReceipt(inspectedTx.id)}
                  className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
                >
                  Yes, I Got the Money
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
