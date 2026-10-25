"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import {
  getProjectDetail,
  ProjectTransactionTranche,
  ProjectChangeRequestItem,
  ProjectDisputeItem,
} from "./projectData";
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
  IconAlertTriangle,
} from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";

interface ProjectTransactionsPageProps {
  projectId?: string;
}

export function ProjectTransactionsPage({ projectId = "proj-lekki" }: ProjectTransactionsPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_tx_${projectId}`);
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

  // Change Requests sync from local storage with fallback (SSR hydration-safe)
  const [changeRequests, setChangeRequests] = useState<ProjectChangeRequestItem[]>(() => project.changeRequests || []);

  // Disputes sync from local storage with fallback (SSR hydration-safe)
  const [disputes, setDisputes] = useState<ProjectDisputeItem[]>(() => project.disputes || []);

  // Cross-tab / cross-page synchronization on client mount
  useEffect(() => {
    const handleSync = () => {
      try {
        const crSaved = localStorage.getItem(`vantaged_cr_${projectId}`);
        if (crSaved) {
          const parsed = JSON.parse(crSaved);
          if (Array.isArray(parsed) && parsed.length > 0) setChangeRequests(parsed);
        }
        const dispSaved = localStorage.getItem(`vantaged_disputes_${projectId}`);
        if (dispSaved) {
          const parsed = JSON.parse(dispSaved);
          if (Array.isArray(parsed) && parsed.length > 0) setDisputes(parsed);
        }
      } catch {}
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, [projectId]);

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
  const isCompleted =
    project.status === "Completed" ||
    project.verifiedProgress >= 100 ||
    projectId.startsWith("hist-") ||
    (transactions.length > 0 && transactions.every((t) => t.status === "Paid to Builder"));

  // 1. Next Payment Due Calculation
  const pendingTranches = useMemo(() => {
    return transactions
      .filter((t) => t.status !== "Paid to Builder")
      .sort((a, b) => a.trancheNumber - b.trancheNumber);
  }, [transactions]);

  const nextTranche = pendingTranches[0] || null;
  const nextTrancheAmount = nextTranche ? nextTranche.amount : 0;
  const nextStage = useMemo(() => {
    if (!nextTranche) return null;
    return (
      project.stages.find(
        (s) =>
          s.title.toLowerCase().includes(nextTranche.stageLinked.toLowerCase()) ||
          nextTranche.title.toLowerCase().includes(s.title.toLowerCase()) ||
          `Stage ${s.stageNumber}`.toLowerCase() === nextTranche.stageLinked.toLowerCase()
      ) ||
      project.stages[3] ||
      project.stages[0]
    );
  }, [nextTranche, project.stages]);

  // 2. Escrow Funding Runway Calculation
  const escrowCoveragePercent = nextTrancheAmount > 0
    ? Math.round((totalInEscrow / nextTrancheAmount) * 100)
    : 100;
  const escrowSurplusOrShortfall = totalInEscrow - nextTrancheAmount;
  const isEscrowCovered = totalInEscrow >= nextTrancheAmount;

  // 3. Variations & Budget Drift Calculation
  const approvedCRs = useMemo(() => {
    return changeRequests.filter((cr) => cr.status === "Approved");
  }, [changeRequests]);

  const pendingCRs = useMemo(() => {
    return changeRequests.filter(
      (cr) =>
        cr.status === "Waiting for Your Approval" ||
        cr.status === "Awaiting Contractor Assessment"
    );
  }, [changeRequests]);

  const totalApprovedVariations = useMemo(() => {
    return approvedCRs.reduce((sum, cr) => sum + (cr.costImpact || 0), 0);
  }, [approvedCRs]);

  const totalPendingVariationsCost = useMemo(() => {
    return pendingCRs.reduce((sum, cr) => sum + (cr.costImpact || 0), 0);
  }, [pendingCRs]);

  const adjustedContractValue = project.contractValue + totalApprovedVariations;
  const driftPercent =
    project.contractValue > 0
      ? ((totalApprovedVariations / project.contractValue) * 100).toFixed(1)
      : "0.0";

  // 4. Dispute Quarantine Lock Calculation
  const activeDisputes = useMemo(() => {
    return disputes.filter((d) => d.status !== "Resolved");
  }, [disputes]);

  const totalQuarantinedAmount = useMemo(() => {
    return activeDisputes.reduce((sum, d) => {
      const amt =
        typeof d.escrowQuarantineAmount === "number"
          ? d.escrowQuarantineAmount
          : d.linkedTrancheAmount || 0;
      return sum + amt;
    }, 0);
  }, [activeDisputes]);

  const quarantinedPercent =
    project.contractValue > 0
      ? ((totalQuarantinedAmount / project.contractValue) * 100).toFixed(1)
      : "0.0";

  const earliestCureDeadline = useMemo(() => {
    const withDeadline = activeDisputes.find((d) => d.cureNoticeDeadline);
    return withDeadline?.cureNoticeDeadline || null;
  }, [activeDisputes]);

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
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="transactions" />

      <main ref={scrollRef} className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5">
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

            {isCompleted ? (
              <span className="h-10 px-3.5 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-300,#81C792)] text-[var(--vt-color-green-800,#17512F)] text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                <IconCheck className="w-4 h-4 text-[var(--vt-color-green-600,#248246)] stroke-[2.5]" />
                <span>100% Fully Settled</span>
              </span>
            ) : (
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
            )}
          </div>
        </section>

        {/* ── 100% Fully Settled Banner for Contract History ── */}
        {isCompleted && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--vt-color-green-900,#0F331E)] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-green-600,#248246)] text-white flex items-center justify-center shrink-0 shadow-xs">
                <IconCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-sm text-[var(--vt-color-green-950,#061F10)] block">
                  Contract Completed & 100% Disbursed
                </span>
                <span className="text-[11.5px] text-[var(--vt-color-green-800,#17512F)]">
                  All payment tranches have been inspected, approved, and disbursed to the contractor through secure bank escrow. No outstanding liabilities remain.
                </span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-[var(--vt-color-green-300,#81C792)] font-black text-xs text-[var(--vt-color-green-800,#17512F)] shrink-0 shadow-2xs">
              Zero Balance in Escrow
            </span>
          </div>
        )}

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

        {/* ── Live Money & Cash Flow Monitor (4 Spacious Actionable Cards) ── */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)] uppercase tracking-wider">
                  Live Money & Cash Flow Monitor
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-indigo-50,#F3F0FC)] text-[var(--vt-color-indigo-700,#382B73)] border border-[var(--vt-color-indigo-200,#D3CEEB)]">
                  Live Updates
                </span>
              </div>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                Track your upcoming milestone payments, escrow readiness, extra costs, and dispute protections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Card 1: Next Milestone Payment */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col justify-between gap-4 hover:border-[var(--vt-color-neutral-300,#CBC8DA)] transition-all">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-indigo-50,#F3F0FC)] text-[var(--vt-color-indigo-700,#382B73)] flex items-center justify-center shrink-0">
                      <IconClock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                        Next Milestone Payment
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Upcoming payout scheduled for site work
                      </p>
                    </div>
                  </div>

                  {isCompleted || !nextTranche ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                      All Settled
                    </span>
                  ) : nextTranche.status === "Ready for Your Approval" ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-600,#D84C0B)] animate-pulse" />
                      <span>Ready to Approve</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)] shrink-0">
                      Scheduled
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                    {nextTranche ? formatNaira(nextTranche.amount) : "₦0"}
                  </div>
                  <div className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                    {nextTranche
                      ? `Stage ${nextStage?.stageNumber || nextTranche.trancheNumber || "4"} of ${project.stages.length} • ${nextTranche.title}`
                      : "All project milestones completed"}
                  </div>
                </div>

                <div className="mt-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]/70 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Building Stage</span>
                    <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate text-right">
                      {nextTranche ? nextTranche.title : "All stages finished"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Release Condition</span>
                    <span className="font-bold text-[var(--vt-color-neutral-700,#403D58)] truncate text-right">
                      {nextTranche?.status === "Ready for Your Approval"
                        ? "Requires engineer inspection & your signoff"
                        : nextTranche
                        ? nextTranche.dueDate
                        : "Completed and paid"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Vault Status</span>
                    <span className={`font-bold truncate text-right ${
                      nextTranche?.status === "Ready for Your Approval"
                        ? "text-[var(--vt-color-orange-700,#B33C08)]"
                        : "text-[var(--vt-color-indigo-900,#261A66)]"
                    }`}>
                      {nextTranche?.status === "Ready for Your Approval"
                        ? "Held in escrow • Ready for payout"
                        : nextTranche
                        ? "Scheduled in payment plan"
                        : "Paid in full"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium truncate">
                  Funds stay 100% in escrow until you approve.
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {nextTranche?.status === "Ready for Your Approval" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedTranche(nextTranche)}
                        className="h-7.5 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-700,#403D58)] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                      <Link
                        href={`/owner/projects/${project.id}/stages/${nextStage?.id || "stg-4"}`}
                        className="h-7.5 px-3.5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer active:scale-98"
                      >
                        <span>Inspect & Approve</span>
                        <IconArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </>
                  ) : nextTranche ? (
                    <button
                      type="button"
                      onClick={() => setSelectedTranche(nextTranche)}
                      className="h-7.5 px-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>View Stage Details</span>
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs text-[var(--vt-color-green-700,#1F6B3E)] font-bold">
                      100% Paid Out ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Next Milestone Readiness (Distinct from top card) */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col justify-between gap-4 hover:border-[var(--vt-color-neutral-300,#CBC8DA)] transition-all">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] flex items-center justify-center shrink-0">
                      <IconShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                        Next Milestone Readiness
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Vault readiness for upcoming contractor release
                      </p>
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                      All Settled
                    </span>
                  ) : isEscrowCovered ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                      Fully Funded (100%)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] shrink-0">
                      Top-Up Required
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className={`text-xl sm:text-2xl font-black tracking-tight ${
                    isCompleted
                      ? "text-[var(--vt-color-indigo-900,#261A66)]"
                      : isEscrowCovered
                      ? "text-[var(--vt-color-green-700,#1F6B3E)]"
                      : "text-[var(--vt-color-orange-600,#D84C0B)]"
                  }`}>
                    {isCompleted
                      ? "₦0 Needed"
                      : isEscrowCovered
                      ? `+${formatNaira(escrowSurplusOrShortfall)} Cushion`
                      : `-${formatNaira(Math.abs(escrowSurplusOrShortfall))} Shortfall`}
                  </div>
                  <div className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                    {isCompleted ? (
                      "All project milestones paid in full"
                    ) : isEscrowCovered ? (
                      `Vault has ${formatNaira(totalInEscrow)} covering next stage with ${formatNaira(escrowSurplusOrShortfall)} cushion`
                    ) : (
                      `Top up ${formatNaira(Math.abs(escrowSurplusOrShortfall))} before contractor starts next stage`
                    )}
                  </div>
                </div>

                <div className="mt-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]/70 flex flex-col gap-2">
                  <div>
                    <div className="flex items-center justify-between text-xs gap-4 mb-1">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Stage Coverage</span>
                      <span className={`font-bold truncate text-right ${isEscrowCovered ? "text-[var(--vt-color-green-700,#1F6B3E)]" : "text-[var(--vt-color-orange-600,#D84C0B)]"}`}>
                        {nextTrancheAmount > 0 ? `${escrowCoveragePercent}% ready` : "100% ready"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--vt-color-neutral-200,#E2E0EC)] overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, escrowCoveragePercent)}%` }}
                        className={`h-full transition-all duration-500 ${
                          isEscrowCovered
                            ? "bg-[var(--vt-color-green-600,#248246)]"
                            : "bg-[var(--vt-color-orange-500,#EF5F18)]"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Next Milestone Cost</span>
                    <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate text-right">
                      {nextTrancheAmount > 0 ? formatNaira(nextTrancheAmount) : "₦0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Available in Vault</span>
                    <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate text-right">
                      {formatNaira(totalInEscrow)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Surplus Cushion</span>
                    <span className={`font-bold truncate text-right ${isEscrowCovered ? "text-[var(--vt-color-green-700,#1F6B3E)]" : "text-[var(--vt-color-orange-600,#D84C0B)]"}`}>
                      {isEscrowCovered
                        ? `+${formatNaira(escrowSurplusOrShortfall)} extra`
                        : `-${formatNaira(Math.abs(escrowSurplusOrShortfall))} needed`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium truncate">
                  Protected Providus / Zenith Escrow Vault
                </span>
                {!isCompleted ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (escrowSurplusOrShortfall < 0) {
                        setDepositAmountInput(String(Math.abs(escrowSurplusOrShortfall)));
                      }
                      setDepositStep("form");
                      setIsDepositModalOpen(true);
                    }}
                    className={`h-7.5 px-3.5 rounded-md text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-98 ${
                      escrowSurplusOrShortfall < 0
                        ? "bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white"
                        : "bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)]"
                    }`}
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>{escrowSurplusOrShortfall < 0 ? "Fund Shortfall Now" : "Add Extra Funds"}</span>
                  </button>
                ) : (
                  <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                    Fully Disbursed
                  </span>
                )}
              </div>
            </div>

            {/* Card 3: Extra Costs & Changes */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col justify-between gap-4 hover:border-[var(--vt-color-neutral-300,#CBC8DA)] transition-all">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-indigo-50,#F3F0FC)] text-[var(--vt-color-indigo-700,#382B73)] flex items-center justify-center shrink-0">
                      <IconReceipt className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                        Extra Costs & Changes
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Approved variation orders & changes added to contract
                      </p>
                    </div>
                  </div>

                  {totalApprovedVariations > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-indigo-50,#F3F0FC)] text-[var(--vt-color-indigo-700,#382B73)] border border-[var(--vt-color-indigo-200,#D3CEEB)] shrink-0">
                      +{driftPercent}% Extra
                    </span>
                  ) : totalApprovedVariations < 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                      {driftPercent}% Saved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                      On Budget
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                    {totalApprovedVariations > 0
                      ? `+${formatNaira(totalApprovedVariations)}`
                      : totalApprovedVariations < 0
                      ? `-${formatNaira(Math.abs(totalApprovedVariations))}`
                      : "₦0"}
                  </div>
                  <div className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                    Adjusted: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{formatNaira(adjustedContractValue)}</strong> (Base: {formatNaira(project.contractValue)})
                  </div>
                </div>

                <div className="mt-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]/70 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Approved Variations</span>
                    <strong className="text-[var(--vt-color-indigo-900,#261A66)] truncate text-right">
                      {approvedCRs.length} approved (+{formatNaira(totalApprovedVariations)})
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Waiting for Review</span>
                    <span className="font-bold text-[var(--vt-color-orange-700,#B33C08)] truncate text-right">
                      {pendingCRs.length > 0
                        ? `${pendingCRs.length} pending (~${formatNaira(totalPendingVariationsCost)})`
                        : "0 pending review"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Latest Change</span>
                    <span
                      title={approvedCRs[0]?.title || pendingCRs[0]?.title || "No changes requested"}
                      className="font-bold text-[var(--vt-color-neutral-700,#403D58)] truncate text-right"
                    >
                      {approvedCRs[0]?.title || pendingCRs[0]?.title || "No changes requested"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium truncate">
                  Only owner-approved changes alter the contract.
                </span>
                <Link
                  href={`/owner/projects/${project.id}/change-requests`}
                  className="h-7.5 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>Manage Changes ({changeRequests.length})</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4: Money on Hold */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col justify-between gap-4 hover:border-[var(--vt-color-neutral-300,#CBC8DA)] transition-all">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      totalQuarantinedAmount > 0
                        ? "bg-[var(--vt-color-red-50,#FDEEEE)] text-[var(--vt-color-red-700,#C72E2E)]"
                        : "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]"
                    }`}>
                      <IconLock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] leading-tight">
                        Money on Hold for Fixes
                      </h3>
                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                        Escrow funds locked until reported site defects are corrected
                      </p>
                    </div>
                  </div>

                  {totalQuarantinedAmount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-red-50,#FDEEEE)] text-[var(--vt-color-red-700,#C72E2E)] border border-[var(--vt-color-red-200,#F9BDBD)] flex items-center gap-1.5 shrink-0">
                      <IconLock className="w-3 h-3" />
                      <span>{activeDisputes.length} Held</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                      All Clear
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className={`text-xl sm:text-2xl font-black tracking-tight ${
                    totalQuarantinedAmount > 0
                      ? "text-[var(--vt-color-red-700,#C72E2E)]"
                      : "text-[var(--vt-color-indigo-900,#261A66)]"
                  }`}>
                    {formatNaira(totalQuarantinedAmount)}
                  </div>
                  <div className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                    {totalQuarantinedAmount > 0
                      ? `${quarantinedPercent}% of total contract locked for site fixes`
                      : "Zero funds locked • Site work approved without defects"}
                  </div>
                </div>

                <div className="mt-3.5 bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]/70 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Active Site Issues</span>
                    <strong className="text-[var(--vt-color-indigo-900,#261A66)] truncate text-right">
                      {activeDisputes.length > 0 ? `${activeDisputes.length} active issue${activeDisputes.length === 1 ? "" : "s"} reported` : "0 issues"}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Contractor Payout Status</span>
                    <span className={`font-bold truncate text-right ${
                      activeDisputes.length > 0 ? "text-[var(--vt-color-red-700,#C72E2E)]" : "text-[var(--vt-color-green-700,#1F6B3E)]"
                    }`}>
                      {activeDisputes.length > 0 ? "Blocked from release until you confirm fix" : "100% unlocked for approved stages"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium shrink-0">Resolution Deadline</span>
                    <span className="font-bold text-[var(--vt-color-orange-700,#B33C08)] truncate text-right">
                      {earliestCureDeadline ? `Due by ${earliestCureDeadline}` : "No pending cure notice"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium truncate">
                  Funds cannot be withdrawn until you confirm resolution.
                </span>
                <Link
                  href={`/owner/projects/${project.id}/disputes`}
                  className="h-7.5 px-3 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>{activeDisputes.length > 0 ? `View Issues (${activeDisputes.length})` : "View Disputes"}</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
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

      {/* ── Official Payment Receipt & Tranche Deliverable Inspection Modal ── */}
      {selectedTranche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[var(--vt-color-orange-600,#D84C0B)]">
                  {selectedTranche.status === "Paid to Builder"
                    ? "Official Payment Receipt"
                    : "Stage Payment Details & Protection"}
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

            {/* Tranche / Receipt Highlight */}
            <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">
                  {selectedTranche.status === "Paid to Builder" ? "Amount Disbursed" : "Stage Amount"}
                </span>
                <div className="text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  {formatNaira(selectedTranche.amount)}
                </div>
                <div className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  ₦{selectedTranche.amount.toLocaleString("en-NG")}
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  selectedTranche.status === "Paid to Builder"
                    ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                    : selectedTranche.status === "Ready for Your Approval"
                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]"
                    : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                }`}
              >
                {selectedTranche.status}
              </span>
            </div>

            {/* Metadata Lines */}
            <div className="flex flex-col gap-2 text-xs text-[var(--vt-color-neutral-600,#5E5A7D)]">
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Beneficiary Contractor:</span>
                <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{project.contractor.name}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Contractor Payout Account:</span>
                <span className="font-mono">{project.contractor.bankName} ({project.contractor.bankAccountNumber})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                <span>Safe Escrow Account:</span>
                <strong className="font-mono text-[11px] text-[var(--vt-color-indigo-900,#261A66)]">Providus / Zenith (9910482109)</strong>
              </div>

              {selectedTranche.status === "Paid to Builder" ? (
                <>
                  <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span>NIBSS / Bank Session Ref:</span>
                    <strong className="font-mono text-[10.5px] text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedTranche.bankSessionId || "NIBSS/000014261016091422"}
                    </strong>
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
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1 border-b border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span>Condition to Pay:</span>
                    <strong className="text-[var(--vt-color-indigo-900,#261A66)] text-right max-w-[280px]">
                      {selectedTranche.dueDate}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--vt-color-indigo-50,#F3F0FC)] border border-[var(--vt-color-indigo-200,#D3CEEB)] flex items-start gap-2.5 text-[11.5px] text-[var(--vt-color-indigo-950,#191147)]">
                    <IconShieldCheck className="w-4 h-4 text-[var(--vt-color-indigo-700,#382B73)] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-[var(--vt-color-indigo-900,#261A66)]">
                        Safe Escrow Protection
                      </strong>
                      <span>
                        Funds will not be paid to the contractor until you inspect site photos and sign off the stage checklist.
                      </span>
                    </div>
                  </div>
                </>
              )}

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
              {selectedTranche.status === "Paid to Builder" ? (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <IconDownload className="w-3.5 h-3.5" />
                  <span>Download PDF Receipt</span>
                </button>
              ) : selectedTranche.status === "Ready for Your Approval" ? (
                <Link
                  href={`/owner/projects/${project.id}/stages/${
                    project.stages.find(
                      (s) =>
                        s.title.toLowerCase().includes(selectedTranche.stageLinked.toLowerCase()) ||
                        selectedTranche.title.toLowerCase().includes(s.title.toLowerCase()) ||
                        `Stage ${s.stageNumber}`.toLowerCase() === selectedTranche.stageLinked.toLowerCase()
                    )?.id || "stg-4"
                  }`}
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Go to Stage Inspection & Signoff</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : null}
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
