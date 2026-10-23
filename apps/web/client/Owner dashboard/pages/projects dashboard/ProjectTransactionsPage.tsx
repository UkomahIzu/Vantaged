"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail, ProjectTransactionTranche } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import {
  IconCheck,
  IconClose,
  IconLock,
  IconPlus,
  IconCopy,
  IconReceipt,
  IconDownload,
  IconPrinter,
  IconShieldCheck,
  IconArrowRight,
  IconClock,
} from "./ProjectIcons";

interface ProjectTransactionsPageProps {
  projectId?: string;
}

export function ProjectTransactionsPage({ projectId = "proj-lekki" }: ProjectTransactionsPageProps) {
  const project = getProjectDetail(projectId);

  // Dynamic transactions list (allows interactive deposit simulation)
  const [transactions, setTransactions] = useState<ProjectTransactionTranche[]>(() => project.transactions);
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "escrow" | "scheduled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTranche, setSelectedTranche] = useState<ProjectTransactionTranche | null>(null);

  // Copy feedback
  const [copiedBankCode, setCopiedBankCode] = useState(false);
  const [copiedEscrowCode, setCopiedEscrowCode] = useState(false);
  const [isExportNoticeOpen, setIsExportNoticeOpen] = useState(false);

  // Deposit modal state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmountInput, setDepositAmountInput] = useState("25000000");
  const [depositMethod, setDepositMethod] = useState<"transfer" | "card">("transfer");
  const [depositStep, setDepositStep] = useState<"form" | "confirming" | "success">("form");

  const formatNaira = (val: number) => {
    if (val >= 1000000000) {
      return `₦${(val / 1000000000).toFixed(2)}B`;
    }
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  // Aggregated Financial Totals
  const totalPaid = useMemo(() => {
    return transactions
      .filter((t) => t.status === "Paid to Builder")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalInEscrow = useMemo(() => {
    return transactions
      .filter((t) => t.status === "Held on Vantaged" || t.status === "Ready for Your Approval")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const retainageAmount = project.contractValue * 0.05;

  const paidCount = transactions.filter((t) => t.status === "Paid to Builder").length;
  const escrowCount = transactions.filter(
    (t) => t.status === "Held on Vantaged" || t.status === "Ready for Your Approval"
  ).length;
  const scheduledCount = transactions.filter((t) => t.status === "Scheduled").length;

  const percentDisbursed = Math.min(100, Math.round((totalPaid / project.contractValue) * 100));
  const percentEscrow = Math.min(100, Math.round((totalInEscrow / project.contractValue) * 100));
  const percentRetainage = 5;

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Tab filter
      if (activeTab === "paid" && t.status !== "Paid to Builder") return false;
      if (activeTab === "escrow" && t.status !== "Held on Vantaged" && t.status !== "Ready for Your Approval") return false;
      if (activeTab === "scheduled" && t.status !== "Scheduled") return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesStage = t.stageLinked.toLowerCase().includes(q);
        const matchesRef = t.bankSessionId?.toLowerCase().includes(q);
        const matchesMethod = t.paymentMethod?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesStage && !matchesRef && !matchesMethod) return false;
      }
      return true;
    });
  }, [transactions, activeTab, searchQuery]);

  // Execute Deposit
  const handleExecuteDeposit = () => {
    const rawVal = depositAmountInput.replace(/[^0-9]/g, "");
    const parsedAmount = Math.max(100000, parseInt(rawVal, 10) || 25000000);
    setDepositStep("confirming");

    setTimeout(() => {
      const newRef = `DEP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newTx: ProjectTransactionTranche = {
        id: `tx-dep-${Date.now()}`,
        trancheNumber: transactions.length + 1,
        title: `Escrow Top-up: ${project.title}`,
        stageLinked: "Escrow Reserve Deposit",
        amount: parsedAmount,
        status: "Held on Vantaged",
        dueDate: "Instant Escrow Credit",
        paidDate: "Today, Just now",
        bankSessionId: `NIBSS/00001426${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        paymentMethod: depositMethod === "transfer" ? "Providus Virtual Account (NIBSS Instant)" : "Debit Card (Instant)",
        notes: `₦${parsedAmount.toLocaleString("en-NG")} deposited by owner into project escrow vault. Protected by Vantaged Escrow Guarantee.`,
      };

      setTransactions((prev) => [newTx, ...prev]);
      setDepositStep("success");
    }, 1200);
  };

  const handleExportStatement = () => {
    setIsExportNoticeOpen(true);
    setTimeout(() => {
      setIsExportNoticeOpen(false);
    }, 4000);
  };

  return (
    <div
      style={{ fontFamily: "var(--vt-font-sans), var(--font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="transactions" />

      <main className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Money & Payments"
            />
          }
        />

        {/* ── Headline Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Money & Payments for this Building
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 max-w-2xl leading-relaxed">
              Your money is protected by Vantaged Escrow. Funds are deposited into a dedicated project vault and only disbursed to the builder step-by-step as each stage checklist is inspected and approved.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportStatement}
              className="h-10 px-3.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <IconPrinter className="w-3.5 h-3.5" />
              <span>Statement</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDepositStep("form");
                setIsDepositModalOpen(true);
              }}
              className="h-10 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" />
              <span>Deposit to Escrow</span>
            </button>
          </div>
        </section>

        {/* Live Statement Download Toast */}
        {isExportNoticeOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 px-4 py-2.5 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#17512F)] border border-[var(--vt-color-green-200,#A3D9B1)] text-xs font-bold shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="w-4 h-4 text-[var(--vt-color-green-600,#248246)]" />
              <span>Project Payment Statement compiled! Ready for download, bank verification, or printing.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExportNoticeOpen(false)}
              className="text-[11px] underline hover:text-[var(--vt-color-green-900,#0F3620)] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── 4 Key Financial Metrics Cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Agreed Contract Price
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
                {formatNaira(project.contractValue)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Locked plan</span>
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{project.stages.length} milestones</span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-green-700,#1F6B3E)]">
                Paid Out to Builder
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
                {formatNaira(totalPaid)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">{paidCount} stages completed</span>
              <span className="font-bold text-[var(--vt-color-green-700,#1F6B3E)]">{percentDisbursed}% of contract</span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
                Safe in Vantaged Escrow
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
                {formatNaira(totalInEscrow)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Guaranteed funds</span>
              <button
                type="button"
                onClick={() => {
                  setDepositStep("form");
                  setIsDepositModalOpen(true);
                }}
                className="font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
              >
                + Add Deposit
              </button>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Final Quality Hold (5%)
              </span>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
                {formatNaira(retainageAmount)}
              </div>
            </div>
            <div className="pt-2.5 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]/70 flex items-center justify-between text-xs">
              <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Defect liability hold</span>
              <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">Released at handover</span>
            </div>
          </div>
        </section>

        {/* ── Visual Cashflow & Escrow Distribution Progress ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
              Building Funds Allocation Status
            </span>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--vt-color-green-600,#248246)]" />
                <span>Paid ({percentDisbursed}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                <span>In Escrow ({percentEscrow}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--vt-color-indigo-600,#483699)]" />
                <span>5% Retention</span>
              </span>
            </div>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden flex">
            <div
              style={{ width: `${percentDisbursed}%` }}
              title={`Paid Out: ${formatNaira(totalPaid)}`}
              className="h-full bg-[var(--vt-color-green-600,#248246)] transition-all duration-500"
            />
            <div
              style={{ width: `${percentEscrow}%` }}
              title={`In Escrow: ${formatNaira(totalInEscrow)}`}
              className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] transition-all duration-500"
            />
            <div
              style={{ width: `${percentRetainage}%` }}
              title={`Retainage: ${formatNaira(retainageAmount)}`}
              className="h-full bg-[var(--vt-color-indigo-600,#483699)] transition-all duration-500"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] pt-0.5">
            <span>Building Start: {project.startDate}</span>
            <span>Target Handover: {project.targetEndDate}</span>
          </div>
        </section>

        {/* ── Two Verified Accounts Strip (Escrow Vault + Contractor Account) ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card A: Dedicated Project Escrow Account */}
          <div className="p-4 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0">
                <IconShieldCheck className="w-5 h-5 text-[var(--vt-color-orange-600,#D84C0B)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Dedicated Project Escrow Vault
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                    Protected
                  </span>
                </div>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Providus / Zenith Bank • Account: <strong className="font-mono text-[var(--vt-color-indigo-900,#261A66)]">9910482109</strong>
                </p>
                <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">
                  Vantaged Escrow / {project.title}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">
                Funds deposited here are protected until you approve work.
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText("9910482109");
                  setCopiedEscrowCode(true);
                  setTimeout(() => setCopiedEscrowCode(false), 2000);
                }}
                className="font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <IconCopy className="w-3 h-3" />
                <span>{copiedEscrowCode ? "Copied" : "Copy Escrow No"}</span>
              </button>
            </div>
          </div>

          {/* Card B: Contractor Verified Payout Account */}
          <div className="p-4 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-indigo-50,#F0EFFB)] text-[var(--vt-color-indigo-700,#362680)] flex items-center justify-center shrink-0">
                <IconLock className="w-5 h-5 text-[var(--vt-color-indigo-700,#362680)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                    Builder: {project.contractor.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#17512F)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                    CAC Verified
                  </span>
                </div>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  {project.contractor.bankName} • Account: <strong className="font-mono text-[var(--vt-color-indigo-900,#261A66)]">{project.contractor.bankAccountNumber}</strong>
                </p>
                <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">
                  CAC Number: {project.contractor.cacNumber} • Director: {project.contractor.directorName}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">
                Payments release directly to this account upon stage approval.
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(project.contractor.bankAccountNumber);
                  setCopiedBankCode(true);
                  setTimeout(() => setCopiedBankCode(false), 2000);
                }}
                className="font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <IconCopy className="w-3 h-3" />
                <span>{copiedBankCode ? "Copied" : "Copy Account"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Payments List Table with Filters & Search ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden flex flex-col pb-6">
          {/* Top Controls: Tabs & Search */}
          <div className="p-4 sm:p-5 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {[
                { id: "all", label: `All Activity (${transactions.length})` },
                { id: "paid", label: `Paid to Builder (${paidCount})` },
                { id: "escrow", label: `Held in Escrow (${escrowCount})` },
                { id: "scheduled", label: `Scheduled (${scheduledCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white shadow-2xs"
                      : "bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by stage, reference..."
                className="h-9 px-3 text-xs rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] w-full sm:w-64 text-[var(--vt-color-neutral-900,#191530)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--vt-color-orange-500,#EF5F18)]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-neutral-700,#46425F)]"
                >
                  <IconClose className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[780px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                  <th className="py-3 px-4">Milestone / Item</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Escrow Status</th>
                  <th className="py-3 px-4">Trigger / Release Condition</th>
                  <th className="py-3 px-4">Bank Ref / Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] font-bold text-[10px] flex items-center justify-center text-[var(--vt-color-neutral-600,#5E5A7D)] shrink-0">
                            {trx.trancheNumber}
                          </span>
                          <div>
                            <span className="block">{trx.title}</span>
                            {trx.paymentMethod && (
                              <span className="text-[10px] font-normal text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                                {trx.paymentMethod}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                        {formatNaira(trx.amount)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            trx.status === "Paid to Builder"
                              ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]"
                              : trx.status === "Ready for Your Approval"
                              ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]"
                              : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                          }`}
                        >
                          {trx.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                        {trx.dueDate}
                      </td>

                      <td className="py-3.5 px-4 text-[11px]">
                        {trx.paidDate ? (
                          <div>
                            <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] block">
                              {trx.paidDate}
                            </span>
                            {trx.bankSessionId && (
                              <span className="font-mono text-[9.5px] text-[var(--vt-color-neutral-400,#A3A0B8)] truncate max-w-[140px] block">
                                {trx.bankSessionId}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[var(--vt-color-neutral-400,#A3A0B8)]">Pending milestone</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {trx.status === "Paid to Builder" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedTranche(trx)}
                            className="h-8 px-3 rounded-md bg-white hover:bg-[var(--vt-color-orange-500,#EF5F18)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <IconReceipt className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        ) : trx.status === "Ready for Your Approval" ? (
                          <Link
                            href={`/owner/projects/${project.id}/stages/stg-4`}
                            className="h-8 px-3 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>Inspect & Pay</span>
                            <IconArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                      No transactions match your current search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── Official Payment Receipt Modal ── */}
      {selectedTranche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[var(--vt-color-orange-600,#D84C0B)]">
                  Official Payment Receipt
                </span>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  {selectedTranche.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTranche(null)}
                title="Close"
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Highlight */}
            <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">
                  Amount Disbursed
                </span>
                <div className="text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  {formatNaira(selectedTranche.amount)}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                Confirmed Paid
              </span>
            </div>

            {/* Metadata Lines */}
            <div className="flex flex-col gap-2 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Beneficiary:</span>
                <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{project.contractor.name}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Bank & Account:</span>
                <span className="font-mono">{project.contractor.bankName} ({project.contractor.bankAccountNumber})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>NIBSS / Bank Session Ref:</span>
                <strong className="font-mono text-[10.5px] text-[var(--vt-color-indigo-900,#261A66)]">{selectedTranche.bankSessionId}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Date & Time Paid:</span>
                <strong>{selectedTranche.paidDate}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Inspection Verified By:</span>
                <strong>{selectedTranche.verifiedBy || "Arc. Folake Davies"} ({selectedTranche.verifiedRole || "Quality Inspector"})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Contractor Receipt Status:</span>
                <span className="text-[var(--vt-color-green-700,#1F6B3E)] font-bold">
                  {selectedTranche.contractorConfirmed ? "Acknowledged by Contractor" : "Pending confirmation"}
                </span>
              </div>
              {selectedTranche.notes && (
                <div className="p-2.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  {selectedTranche.notes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setSelectedTranche(null)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors"
              >
                <IconDownload className="w-3.5 h-3.5" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fund Escrow Deposit Modal (PRD Flow CL-7 / CL-M01-M03) ── */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {depositStep !== "success" ? (
              <>
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                      Deposit to Project Escrow
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      Fund your dedicated project escrow vault safely
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDepositModalOpen(false)}
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDepositMethod("transfer")}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      depositMethod === "transfer"
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-800,#8F320D)] font-bold"
                        : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    Bank Transfer (NIBSS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositMethod("card")}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      depositMethod === "card"
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-800,#8F320D)] font-bold"
                        : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    Debit Card / Online
                  </button>
                </div>

                {/* Transfer Info */}
                {depositMethod === "transfer" ? (
                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2.5 text-xs">
                    <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                      Transfer into your dedicated project vault:
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Bank Name:</span>
                      <strong className="text-[var(--vt-color-indigo-900,#261A66)]">Providus Bank / Zenith</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Account Name:</span>
                      <strong className="text-[var(--vt-color-indigo-900,#261A66)] truncate max-w-[200px]">Vantaged Escrow - {project.title}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Virtual Account No:</span>
                      <span className="font-mono text-sm font-black text-[var(--vt-color-orange-600,#D84C0B)]">9910482109</span>
                    </div>

                    <div className="flex flex-col gap-1 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                      <label className="text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        Amount to Deposit (NGN)
                      </label>
                      <input
                        type="number"
                        value={depositAmountInput}
                        onChange={(e) => setDepositAmountInput(e.target.value)}
                        placeholder="e.g. 25000000"
                        className="h-9 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-900,#191530)]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                      Amount to Deposit (NGN)
                    </label>
                    <input
                      type="number"
                      value={depositAmountInput}
                      onChange={(e) => setDepositAmountInput(e.target.value)}
                      placeholder="e.g. 25,000,000"
                      className="h-10 px-3.5 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-sm font-bold text-[var(--vt-color-neutral-900,#191530)]"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => setIsDepositModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteDeposit}
                    disabled={depositStep === "confirming"}
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {depositStep === "confirming" ? (
                      <span>Verifying Transfer...</span>
                    ) : (
                      <span>Confirm Deposit</span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-600,#248246)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center">
                  <IconCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Deposit Received & Escrow Credited!
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  Your funds are now safe in your dedicated project vault. They have been credited to your transaction history below and are ready for upcoming stage disbursements.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsDepositModalOpen(false);
                    setDepositStep("form");
                  }}
                  className="mt-2 h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
