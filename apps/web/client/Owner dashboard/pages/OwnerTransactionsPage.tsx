"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { VantagedSelect } from "../components/VantagedSelect";
import { DownloadPaymentSummaryModal } from "../components/DownloadPaymentSummaryModal";
import { openPrintStatementWindow } from "../components/paymentSummaryGenerator";

export interface TransactionItem {
  id: string;
  reference: string;
  bankSessionId: string;
  projectId: string;
  projectTitle: string;
  contractorName: string;
  contractorLogo?: string;
  stageNumber?: number;
  stageTitle: string;
  type: "Work Payment" | "Deposited on Vantaged" | "Extra Work Added" | "Final Holdback Released";
  amount: number;
  currency: string;
  date: string;
  rawDate: string;
  paymentMethod: "Zenith Bank (Vantaged Escrow)" | "Access Bank (Vantaged Escrow)" | "Direct Bank Transfer" | "Debit Card";
  status: "Received by Builder" | "Sent – Builder to Confirm" | "Deposited on Vantaged" | "Issue Reported";
  contractorConfirmationDeadline?: string;
  daysRemaining?: number;
  verifiedBy?: string;
  verifiedRole?: string;
  receiptUrl?: string;
  disputeReason?: string;
  notes?: string;
}

export interface ProjectFinancialSummary {
  id: string;
  title: string;
  contractor: string;
  originalBudget: number;
  approvedVariations: number;
  currentContractValue: number;
  disbursedAmount: number;
  inEscrowAmount: number;
  retainageAmount: number;
  percentDisbursed: number;
  health: "Going Well" | "Needs Check" | "Payment Coming Up";
}

const INITIAL_PROJECT_SUMMARIES: ProjectFinancialSummary[] = [
  {
    id: "proj-lekki",
    title: "Lekki Phase 1 Luxury Villa",
    contractor: "Julius B. Consortium",
    originalBudget: 245000000,
    approvedVariations: 0,
    currentContractValue: 245000000,
    disbursedAmount: 200900000,
    inEscrowAmount: 24500000,
    retainageAmount: 12250000,
    percentDisbursed: 82,
    health: "Going Well",
  },
  {
    id: "proj-enclave",
    title: "The Enclave Waterfront Resort",
    contractor: "Crane & Stone Builders",
    originalBudget: 180000000,
    approvedVariations: 8500000,
    currentContractValue: 188500000,
    disbursedAmount: 82500000,
    inEscrowAmount: 24000000,
    retainageAmount: 4125000,
    percentDisbursed: 44,
    health: "Going Well",
  },
  {
    id: "proj-guzape",
    title: "Guzape Hills Residence",
    contractor: "SolidGround Engineering",
    originalBudget: 210000000,
    approvedVariations: 0,
    currentContractValue: 210000000,
    disbursedAmount: 134400000,
    inEscrowAmount: 32000000,
    retainageAmount: 6720000,
    percentDisbursed: 64,
    health: "Payment Coming Up",
  },
  {
    id: "proj-eko",
    title: "Eko Atlantic Sky Tower",
    contractor: "Cappa & D'Alberto",
    originalBudget: 450000000,
    approvedVariations: 16500000,
    currentContractValue: 466500000,
    disbursedAmount: 139950000,
    inEscrowAmount: 45000000,
    retainageAmount: 6997500,
    percentDisbursed: 30,
    health: "Needs Check",
  },
  {
    id: "proj-banana",
    title: "Banana Island Horizon Penthouse",
    contractor: "Horizon Pro Developers",
    originalBudget: 140000000,
    approvedVariations: 4200000,
    currentContractValue: 144200000,
    disbursedAmount: 126896000,
    inEscrowAmount: 0,
    retainageAmount: 6344800,
    percentDisbursed: 88,
    health: "Going Well",
  },
  {
    id: "proj-vi",
    title: "Victoria Island Commercial Plaza",
    contractor: "Costain West Africa",
    originalBudget: 95000000,
    approvedVariations: 0,
    currentContractValue: 95000000,
    disbursedAmount: 17100000,
    inEscrowAmount: 15000000,
    retainageAmount: 4750000,
    percentDisbursed: 18,
    health: "Going Well",
  },
];

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-lekki-1",
    reference: "PAY-2026-97810",
    bankSessionId: "NIBSS/000014261016140209",
    projectId: "proj-lekki",
    projectTitle: "Lekki Phase 1 Luxury Villa",
    contractorName: "Julius B. Consortium",
    stageNumber: 3,
    stageTitle: "Stage 3: First Floor Suspended Slab Casting",
    type: "Work Payment",
    amount: 29400000,
    currency: "NGN",
    date: "Yesterday, 02:15 PM",
    rawDate: "2026-10-18T13:15:00Z",
    paymentMethod: "Zenith Bank (Vantaged Escrow)",
    status: "Received by Builder",
    verifiedBy: "Arc. Folake Davies",
    verifiedRole: "Quality Inspector",
    notes: "Batch plant test cylinders logged 38.5 MPa strength. Slab pour certified and tranche released.",
  },
  {
    id: "tx-vi-1",
    reference: "PAY-2026-92108",
    bankSessionId: "NIBSS/000014261015093012",
    projectId: "proj-vi",
    projectTitle: "Victoria Island Commercial Plaza",
    contractorName: "Costain West Africa",
    stageNumber: 1,
    stageTitle: "Stage 1: Perimeter Sheet Piling & Site Setup",
    type: "Work Payment",
    amount: 17100000,
    currency: "NGN",
    date: "Oct 15, 2026",
    rawDate: "2026-10-15T08:30:00Z",
    paymentMethod: "Access Bank (Vantaged Escrow)",
    status: "Received by Builder",
    verifiedBy: "Engr. Emeka Obi",
    verifiedRole: "Structural Representative",
    notes: "Site boundary beacons set, perimeter sheet piles driven, and dewatering pumps commissioned.",
  },
  {
    id: "tx-1",
    reference: "PAY-2026-94812",
    bankSessionId: "NIBSS/000014261014112001",
    projectId: "proj-enclave",
    projectTitle: "The Enclave Waterfront Resort",
    contractorName: "Crane & Stone Builders",
    stageNumber: 2,
    stageTitle: "Stage 2: Digging Ground & Laying Foundation",
    type: "Work Payment",
    amount: 24000000,
    currency: "NGN",
    date: "Today, 11:20 AM",
    rawDate: "2026-10-17T10:20:00Z",
    paymentMethod: "Zenith Bank (Vantaged Escrow)",
    status: "Sent – Builder to Confirm",
    contractorConfirmationDeadline: "2026-10-20T11:20:00Z",
    daysRemaining: 3,
    verifiedBy: "Engr. Folake Ade",
    verifiedRole: "Building Inspector & Site Engineer",
    notes: "Money paid out after concrete foundation test was passed and certified on the building site.",
  },
  {
    id: "tx-2",
    reference: "PAY-2026-89410",
    bankSessionId: "NIBSS/000014261012094102",
    projectId: "proj-guzape",
    projectTitle: "Guzape Hills Residence",
    contractorName: "SolidGround Engineering",
    stageNumber: 4,
    stageTitle: "Stage 4: Putting Up Roof & Roof Beams",
    type: "Work Payment",
    amount: 32000000,
    currency: "NGN",
    date: "Oct 15, 2026",
    rawDate: "2026-10-15T08:41:00Z",
    paymentMethod: "Access Bank (Vantaged Escrow)",
    status: "Received by Builder",
    verifiedBy: "Arc. Bello K.",
    verifiedRole: "Project Architect",
    notes: "Builder confirmed the money landed safely in their Stanbic IBTC bank account.",
  },
  {
    id: "tx-3",
    reference: "PAY-2026-81024",
    bankSessionId: "NIBSS/000014261008143210",
    projectId: "proj-eko",
    projectTitle: "Eko Atlantic Sky Tower",
    contractorName: "Cappa & D'Alberto",
    stageNumber: 3,
    stageTitle: "Extra Work: Stronger Steel Cables for Floor Decking",
    type: "Extra Work Added",
    amount: 16500000,
    currency: "NGN",
    date: "Oct 12, 2026",
    rawDate: "2026-10-12T13:32:00Z",
    paymentMethod: "Zenith Bank (Vantaged Escrow)",
    status: "Deposited on Vantaged",
    verifiedBy: "Engr. Tunde Coker",
    verifiedRole: "Lead Structural Engineer",
    notes: "Money deposited safely on Vantaged for approved extra steel work. The builder will only get it after Level 4 walls are checked.",
  },
  {
    id: "tx-4",
    reference: "PAY-2026-78402",
    bankSessionId: "NIBSS/000014261004101904",
    projectId: "proj-banana",
    projectTitle: "Banana Island Horizon Penthouse",
    contractorName: "Horizon Pro Developers",
    stageNumber: 6,
    stageTitle: "Stage 6: Installing Glass Windows & Balcony",
    type: "Work Payment",
    amount: 28500000,
    currency: "NGN",
    date: "Oct 04, 2026",
    rawDate: "2026-10-04T09:19:00Z",
    paymentMethod: "Direct Bank Transfer",
    status: "Received by Builder",
    verifiedBy: "Arc. Amina Yusuf",
    verifiedRole: "Design Architect",
    notes: "Bank transfer receipt verified with GTBank. Builder confirmed receipt within 18 hours.",
  },
  {
    id: "tx-5",
    reference: "PAY-2026-71930",
    bankSessionId: "NIBSS/000014260928160211",
    projectId: "proj-enclave",
    projectTitle: "The Enclave Waterfront Resort",
    contractorName: "Crane & Stone Builders",
    stageTitle: "Money Saved Ahead for Stage 3",
    type: "Deposited on Vantaged",
    amount: 35000000,
    currency: "NGN",
    date: "Sep 28, 2026",
    rawDate: "2026-09-28T15:02:00Z",
    paymentMethod: "Zenith Bank (Vantaged Escrow)",
    status: "Deposited on Vantaged",
    notes: "Money deposited on Vantaged ahead of time so the builder has confidence to bring heavy machines to the site.",
  },
  {
    id: "tx-6",
    reference: "PAY-2026-68190",
    bankSessionId: "NIBSS/000014260920114002",
    projectId: "proj-eko",
    projectTitle: "Eko Atlantic Sky Tower",
    contractorName: "Cappa & D'Alberto",
    stageNumber: 2,
    stageTitle: "Stage 2: Ground Floor Concrete Decking",
    type: "Work Payment",
    amount: 65000000,
    currency: "NGN",
    date: "Sep 20, 2026",
    rawDate: "2026-09-20T10:40:00Z",
    paymentMethod: "Access Bank (Vantaged Escrow)",
    status: "Received by Builder",
    verifiedBy: "Engr. Babatunde Adeleke",
    verifiedRole: "Site Engineer",
    notes: "Ground floor concrete pouring passed all strength tests and was approved by the engineer.",
  },
  {
    id: "tx-7",
    reference: "PAY-2026-62104",
    bankSessionId: "NIBSS/000014260910081249",
    projectId: "proj-guzape",
    projectTitle: "Guzape Hills Residence",
    contractorName: "SolidGround Engineering",
    stageNumber: 3,
    stageTitle: "Stage 3: First Floor Concrete Decking",
    type: "Work Payment",
    amount: 38400000,
    currency: "NGN",
    date: "Sep 10, 2026",
    rawDate: "2026-09-10T07:12:00Z",
    paymentMethod: "Direct Bank Transfer",
    status: "Received by Builder",
    verifiedBy: "QS Femi Oladipo",
    verifiedRole: "Cost & Quantity Surveyor",
    notes: "Payment sent after the steel rods and cement inspection was passed.",
  },
  {
    id: "tx-8",
    reference: "PAY-2026-59182",
    bankSessionId: "NIBSS/000014260901170940",
    projectId: "proj-banana",
    projectTitle: "Banana Island Horizon Penthouse",
    contractorName: "Horizon Pro Developers",
    stageNumber: 5,
    stageTitle: "Stage 5: Room Walls & Plastering",
    type: "Work Payment",
    amount: 22000000,
    currency: "NGN",
    date: "Sep 01, 2026",
    rawDate: "2026-09-01T16:09:00Z",
    paymentMethod: "Zenith Bank (Vantaged Escrow)",
    status: "Received by Builder",
    verifiedBy: "Arc. Amina Yusuf",
    verifiedRole: "Project Architect",
    notes: "Wall plastering and sound-proofing checked and approved by the architect.",
  },
];

// Helper to format currency in Nigerian Naira
function formatNaira(num: number): string {
  if (num >= 1000000000) {
    return `₦${(num / 1000000000).toFixed(2)}B`;
  }
  if (num >= 1000000) {
    return `₦${(num / 1000000).toFixed(1)}M`;
  }
  return `₦${num.toLocaleString("en-NG")}`;
}

export function OwnerTransactionsPage() {
  const searchParams = useSearchParams();
  const searchParam = searchParams?.get("search");
  const scrollRef = useScrollRestoration<HTMLElement>("owner_transactions");

  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [projectSummaries, setProjectSummaries] = useState<ProjectFinancialSummary[]>(INITIAL_PROJECT_SUMMARIES);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>("All Buildings");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All Payment Types");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All Statuses");

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  // Selected Transaction Modal
  const [inspectedTx, setInspectedTx] = useState<TransactionItem | null>(null);
  const [isExportNoticeOpen, setIsExportNoticeOpen] = useState(false);
  const [copiedBankCode, setCopiedBankCode] = useState(false);
  const [isReceiptDownloading, setIsReceiptDownloading] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Deposit Funds Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositStep, setDepositStep] = useState<"form" | "confirming" | "success">("form");
  const [selectedBuildingForDeposit, setSelectedBuildingForDeposit] = useState<string>(
    INITIAL_PROJECT_SUMMARIES[0]?.title || "The Enclave Waterfront Resort"
  );
  const [depositAmountInput, setDepositAmountInput] = useState<string>("25000000");
  const [depositMethod, setDepositMethod] = useState<"bank_transfer" | "card">("bank_transfer");
  const [copiedDepositAccount, setCopiedDepositAccount] = useState(false);
  const [lastDepositReceipt, setLastDepositReceipt] = useState<{
    reference: string;
    amount: number;
    projectName: string;
    date: string;
  } | null>(null);

  const handleCopyAccount = (accNum: string) => {
    navigator.clipboard?.writeText(accNum);
    setCopiedDepositAccount(true);
    setTimeout(() => {
      setCopiedDepositAccount(false);
    }, 2200);
  };

  const handleExecuteDeposit = () => {
    const rawVal = depositAmountInput.replace(/[^0-9]/g, "");
    const parsedAmount = Math.max(100000, parseInt(rawVal, 10) || 25000000);
    setDepositStep("confirming");

    setTimeout(() => {
      // 1. Update project escrow balance
      setProjectSummaries((prev) =>
        prev.map((proj) =>
          proj.title === selectedBuildingForDeposit
            ? { ...proj, inEscrowAmount: proj.inEscrowAmount + parsedAmount }
            : proj
        )
      );

      // 2. Add new deposit transaction to ledger
      const newRef = `DEP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newTx: TransactionItem = {
        id: `tx-dep-${Date.now()}`,
        reference: newRef,
        bankSessionId: `NIBSS/00001426${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        projectId: projectSummaries.find((p) => p.title === selectedBuildingForDeposit)?.id || "proj-enclave",
        projectTitle: selectedBuildingForDeposit,
        contractorName: projectSummaries.find((p) => p.title === selectedBuildingForDeposit)?.contractor || "Builder",
        stageTitle: "Escrow Deposit for Upcoming Milestones",
        type: "Deposited on Vantaged",
        amount: parsedAmount,
        currency: "NGN",
        date: "Today, Just now",
        rawDate: new Date().toISOString(),
        paymentMethod: depositMethod === "bank_transfer" ? "Zenith Bank (Vantaged Escrow)" : "Debit Card",
        status: "Deposited on Vantaged",
        notes: `₦${parsedAmount.toLocaleString("en-NG")} deposited by owner into secure bank escrow. Held until upcoming milestones are inspected and approved.`,
      };

      setTransactions((prev) => [newTx, ...prev]);

      setLastDepositReceipt({
        reference: newRef,
        amount: parsedAmount,
        projectName: selectedBuildingForDeposit,
        date: "Today, Just now",
      });

      setDepositStep("success");
    }, 1200);
  };

  // Aggregated Totals
  const totalCommittedBudget = useMemo(() => {
    return projectSummaries.reduce((acc, p) => acc + p.currentContractValue, 0);
  }, [projectSummaries]);

  const totalDisbursed = useMemo(() => {
    return projectSummaries.reduce((acc, p) => acc + p.disbursedAmount, 0);
  }, [projectSummaries]);

  const totalInEscrow = useMemo(() => {
    return projectSummaries.reduce((acc, p) => acc + p.inEscrowAmount, 0);
  }, [projectSummaries]);

  const totalRetainage = useMemo(() => {
    return projectSummaries.reduce((acc, p) => acc + p.retainageAmount, 0);
  }, [projectSummaries]);

  const totalPendingAction = useMemo(() => {
    return transactions
      .filter((t) => t.status === "Sent – Builder to Confirm" || t.status === "Issue Reported")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const disbursedPercentage = Math.round((totalDisbursed / totalCommittedBudget) * 100);

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedProjectFilter !== "All Buildings" && t.projectTitle !== selectedProjectFilter) {
        return false;
      }
      if (selectedTypeFilter !== "All Payment Types" && t.type !== selectedTypeFilter) {
        return false;
      }
      if (selectedStatusFilter !== "All Statuses" && t.status !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = t.reference.toLowerCase().includes(q);
        const matchesSession = t.bankSessionId.toLowerCase().includes(q);
        const matchesProject = t.projectTitle.toLowerCase().includes(q);
        const matchesContractor = t.contractorName.toLowerCase().includes(q);
        const matchesStage = t.stageTitle.toLowerCase().includes(q);
        if (!matchesRef && !matchesSession && !matchesProject && !matchesContractor && !matchesStage) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedProjectFilter, selectedTypeFilter, selectedStatusFilter, searchQuery]);

  const handleExportStatement = () => {
    setIsExportNoticeOpen(true);
    setTimeout(() => {
      setIsExportNoticeOpen(false);
    }, 4000);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Decorative subtle background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path
            d="M-100 300 C 400 150, 800 500, 1500 200"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M-50 700 C 500 600, 900 800, 1600 550"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="1200" cy="400" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.5" />
        </svg>
      </div>

      {/* ── Left Sidebar Navigation ── */}
      <SidebarNav currentActiveItem="transactions" />

      {/* ── Main Workspace ── */}
      <main
        ref={scrollRef}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 sm:gap-6 pb-24 md:pb-6"
      >
        {/* Top Header Navigation Bar */}
        <HeaderBar
          leftSlot={
            <Link
              href="/owner/dashboard"
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

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Payments & Building Costs
            </h1>
            <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)] max-w-2xl mt-1 leading-relaxed">
              A simple, clear record of all money spent on your building projects. See what you have paid, what is safely kept in the bank, and what payments are coming up next.
            </p>
          </div>

          {/* Quick Actions (Download Summary & Deposit Funds) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="h-9 px-3.5 rounded-md bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              <svg className="w-3.5 h-3.5 text-[var(--vt-color-neutral-500,#7C7894)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Payment Summary</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDepositStep("form");
                setIsDepositModalOpen(true);
              }}
              className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Deposit Funds</span>
            </button>
          </div>
        </div>

        {/* Live Export Notice */}
        {isExportNoticeOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 px-4 py-2.5 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#17512F)] border border-[var(--vt-color-green-200,#A3D9B1)] text-xs font-bold shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--vt-color-green-600,#248246)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Payment summary ready! You can save or print this to share with family or your bank.</span>
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

        {/* ── 5 Simplified Summary Cards (Extra clutter removed) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Agreed Budget */}
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Total Agreed Budget
              </span>
              <div className="relative group/tip flex items-center">
                <button
                  type="button"
                  aria-label="More information"
                  className="w-4 h-4 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] text-[10px] font-bold flex items-center justify-center cursor-help transition-colors leading-none select-none shrink-0"
                >
                  ?
                </button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:block z-40 w-56 p-2.5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] text-white text-[11px] font-normal leading-relaxed shadow-lg border border-[var(--vt-color-indigo-800,#362680)] pointer-events-none animate-in fade-in duration-150">
                  The full cost agreed with builders to finish all 6 buildings, plus any extra work you approved.
                  <span className="absolute right-1.5 top-full border-4 border-transparent border-t-[var(--vt-color-indigo-900,#261A66)]" />
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-2 tracking-tight">
              {formatNaira(totalCommittedBudget)}
            </div>
          </div>

          {/* Card 2: Money Paid Out */}
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs group hover:border-[var(--vt-color-green-300,#A3D9B1)] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Money Paid Out
              </span>
              <div className="relative group/tip flex items-center">
                <button
                  type="button"
                  aria-label="More information"
                  className="w-4 h-4 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] text-[10px] font-bold flex items-center justify-center cursor-help transition-colors leading-none select-none shrink-0"
                >
                  ?
                </button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:block z-40 w-56 p-2.5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] text-white text-[11px] font-normal leading-relaxed shadow-lg border border-[var(--vt-color-indigo-800,#362680)] pointer-events-none animate-in fade-in duration-150">
                  Total money already paid to builders for work that was checked and finished on site.
                  <span className="absolute right-1.5 top-full border-4 border-transparent border-t-[var(--vt-color-indigo-900,#261A66)]" />
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-2 tracking-tight">
              {formatNaira(totalDisbursed)}
            </div>
          </div>

          {/* Card 3: Money Deposited on Vantaged */}
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs group hover:border-[var(--vt-color-orange-300,#FBA674)] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Money Deposited on Vantaged
              </span>
              <div className="relative group/tip flex items-center">
                <button
                  type="button"
                  aria-label="More information"
                  className="w-4 h-4 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] text-[10px] font-bold flex items-center justify-center cursor-help transition-colors leading-none select-none shrink-0"
                >
                  ?
                </button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:block z-40 w-56 p-2.5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] text-white text-[11px] font-normal leading-relaxed shadow-lg border border-[var(--vt-color-indigo-800,#362680)] pointer-events-none animate-in fade-in duration-150">
                  Money you have deposited into your secure project escrow on Vantaged. Builders cannot touch this until your engineer inspects the site and you approve release.
                  <span className="absolute right-1.5 top-full border-4 border-transparent border-t-[var(--vt-color-indigo-900,#261A66)]" />
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-2 tracking-tight">
              {formatNaira(totalInEscrow)}
            </div>
          </div>

          {/* Card 4: Final Security Hold (5%) */}
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs group hover:border-[var(--vt-color-indigo-300,#ADA5DE)] transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Final Security Hold (5%)
              </span>
              <div className="relative group/tip flex items-center">
                <button
                  type="button"
                  aria-label="More information"
                  className="w-4 h-4 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] text-[10px] font-bold flex items-center justify-center cursor-help transition-colors leading-none select-none shrink-0"
                >
                  ?
                </button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:block z-40 w-56 p-2.5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] text-white text-[11px] font-normal leading-relaxed shadow-lg border border-[var(--vt-color-indigo-800,#362680)] pointer-events-none animate-in fade-in duration-150">
                  5% of every payment is held back until the house is 100% finished. This guarantees that if there are any faults or leaks, the builder will fix them before getting this final money.
                  <span className="absolute right-1.5 top-full border-4 border-transparent border-t-[var(--vt-color-indigo-900,#261A66)]" />
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-2 tracking-tight">
              {formatNaira(totalRetainage)}
            </div>
          </div>

          {/* Card 5: Waiting on Builder (3-Day Clock) */}
          <div className="bg-[var(--vt-color-orange-50,#FFF4EE)] p-4.5 rounded-2xl border border-[var(--vt-color-orange-200,#FDCAA9)] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                Waiting on Builder
              </span>
              <div className="relative group/tip flex items-center">
                <button
                  type="button"
                  aria-label="More information"
                  className="w-4 h-4 rounded-full bg-[var(--vt-color-orange-200,#FDCAA9)]/70 hover:bg-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-800,#8F320D)] text-[10px] font-bold flex items-center justify-center cursor-help transition-colors leading-none select-none shrink-0"
                >
                  ?
                </button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:block z-40 w-56 p-2.5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] text-white text-[11px] font-normal leading-relaxed shadow-lg border border-[var(--vt-color-indigo-800,#362680)] pointer-events-none animate-in fade-in duration-150">
                  Money you approved and sent to a builder. Builders have 3 days to click 'Confirm' on their phone to verify it arrived safely in their bank.
                  <span className="absolute right-1.5 top-full border-4 border-transparent border-t-[var(--vt-color-indigo-900,#261A66)]" />
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-orange-900,#722306)] mt-2 tracking-tight">
              {formatNaira(totalPendingAction)}
            </div>
          </div>
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2 Cols: Monthly Spending & Future Costs Graph */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Money Spent Month-by-Month & What's Coming Next
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    How much you spent each month and what you will need to pay over the next 3 months
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                    <span className="text-[var(--vt-color-neutral-600,#5E5A7D)] font-semibold">Money Paid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--vt-color-indigo-400,#7768B4)]" />
                    <span className="text-[var(--vt-color-neutral-600,#5E5A7D)] font-semibold">Coming Up (Estimated)</span>
                  </div>
                </div>
              </div>

              {/* Visual Graph */}
              <div className="h-56 w-full pt-4 flex flex-col justify-end">
                <div className="grid grid-cols-9 h-full items-end gap-2 sm:gap-4 px-2 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-2">
                  {/* May */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] opacity-0 group-hover:opacity-100 transition-opacity">₦35M</span>
                    <div style={{ height: "30%" }} className="w-full max-w-[28px] bg-[var(--vt-color-orange-500,#EF5F18)]/80 rounded-t-md transition-all group-hover:bg-[var(--vt-color-orange-500,#EF5F18)]" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">May</span>
                  </div>
                  {/* Jun */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] opacity-0 group-hover:opacity-100 transition-opacity">₦48M</span>
                    <div style={{ height: "42%" }} className="w-full max-w-[28px] bg-[var(--vt-color-orange-500,#EF5F18)]/80 rounded-t-md transition-all group-hover:bg-[var(--vt-color-orange-500,#EF5F18)]" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">Jun</span>
                  </div>
                  {/* Jul */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] opacity-0 group-hover:opacity-100 transition-opacity">₦58M</span>
                    <div style={{ height: "50%" }} className="w-full max-w-[28px] bg-[var(--vt-color-orange-500,#EF5F18)]/80 rounded-t-md transition-all group-hover:bg-[var(--vt-color-orange-500,#EF5F18)]" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">Jul</span>
                  </div>
                  {/* Aug */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] opacity-0 group-hover:opacity-100 transition-opacity">₦72M</span>
                    <div style={{ height: "65%" }} className="w-full max-w-[28px] bg-[var(--vt-color-orange-500,#EF5F18)]/80 rounded-t-md transition-all group-hover:bg-[var(--vt-color-orange-500,#EF5F18)]" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">Aug</span>
                  </div>
                  {/* Sep */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] opacity-0 group-hover:opacity-100 transition-opacity">₦92M</span>
                    <div style={{ height: "82%" }} className="w-full max-w-[28px] bg-[var(--vt-color-orange-500,#EF5F18)]/80 rounded-t-md transition-all group-hover:bg-[var(--vt-color-orange-500,#EF5F18)]" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">Sep</span>
                  </div>
                  {/* Oct (Current) */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    <div className="absolute -top-3 px-1.5 py-0.5 rounded bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[9px] font-extrabold">This Month</div>
                    <span className="text-[10px] font-bold text-[var(--vt-color-orange-600,#D84C0B)]">₦80M</span>
                    <div style={{ height: "70%" }} className="w-full max-w-[28px] bg-[var(--vt-color-orange-500,#EF5F18)] rounded-t-md shadow-xs ring-2 ring-[var(--vt-color-orange-200,#FDCAA9)]" />
                    <span className="text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">Oct</span>
                  </div>
                  {/* Nov (Projected) */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-indigo-600,#483699)] opacity-0 group-hover:opacity-100 transition-opacity">₦65M est</span>
                    <div style={{ height: "58%" }} className="w-full max-w-[28px] bg-[var(--vt-color-indigo-300,#ADA5DE)]/60 border-t-2 border-dashed border-[var(--vt-color-indigo-600,#483699)] rounded-t-md" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">Nov (est)</span>
                  </div>
                  {/* Dec (Projected) */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-indigo-600,#483699)] opacity-0 group-hover:opacity-100 transition-opacity">₦52M est</span>
                    <div style={{ height: "46%" }} className="w-full max-w-[28px] bg-[var(--vt-color-indigo-300,#ADA5DE)]/60 border-t-2 border-dashed border-[var(--vt-color-indigo-600,#483699)] rounded-t-md" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">Dec (est)</span>
                  </div>
                  {/* Jan (Projected) */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[var(--vt-color-indigo-600,#483699)] opacity-0 group-hover:opacity-100 transition-opacity">₦40M est</span>
                    <div style={{ height: "35%" }} className="w-full max-w-[28px] bg-[var(--vt-color-indigo-300,#ADA5DE)]/60 border-t-2 border-dashed border-[var(--vt-color-indigo-600,#483699)] rounded-t-md" />
                    <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">Jan (est)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-medium">
                  <span>* Estimates are based on the next stages scheduled by your builders</span>
                  <span>Average monthly spend: ₦64.2M</span>
                </div>
              </div>
            </div>

            {/* Right Col: Where Your Money Is Going */}
            <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Where Your Money Is Going
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  How every Naira is spent across your building projects
                </p>

                {/* Progress Bars with Plain English Categories */}
                <div className="flex flex-col gap-3.5 mt-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[var(--vt-color-indigo-900,#261A66)]">Walls & Concrete Decking</span>
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">42% (₦268.8M)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
                      <div style={{ width: "42%" }} className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[var(--vt-color-indigo-900,#261A66)]">Foundation & Ground Digging</span>
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">26% (₦166.4M)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
                      <div style={{ width: "26%" }} className="h-full bg-[var(--vt-color-indigo-900,#261A66)] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[var(--vt-color-indigo-900,#261A66)]">Pipes, Wiring & Plumbing</span>
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">18% (₦115.2M)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
                      <div style={{ width: "18%" }} className="h-full bg-[var(--vt-color-indigo-500,#5E4DB2)] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[var(--vt-color-indigo-900,#261A66)]">Finishing: Painting, Tiles & Windows</span>
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">10% (₦64.0M)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
                      <div style={{ width: "10%" }} className="h-full bg-[var(--vt-color-green-600,#248246)] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[var(--vt-color-indigo-900,#261A66)]">Extra Work Added Later</span>
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)]">4% (₦25.6M)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] overflow-hidden">
                      <div style={{ width: "4%" }} className="h-full bg-[var(--vt-color-orange-400,#FA8747)] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                <span>Total Spent So Far</span>
                <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">{formatNaira(totalDisbursed)}</span>
              </div>
            </div>

            {/* ── Full Payment History & Receipts Section (Directly under Month-by-Month Spending) ── */}
            <div
              id="payment-history-section"
              className="lg:col-span-3 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden flex flex-col scroll-mt-6"
            >
              {/* Header Banner */}
              <div className="p-5 sm:p-6 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    Payment History & Receipts
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Complete verified record of all bank escrow deposits, contractor releases, and inspection receipts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)]">
                    {filteredTransactions.length} of {transactions.length} Payments
                  </span>
                </div>
              </div>

              {/* Controls Bar: Search & Filters */}
              <div className="p-4 sm:p-5 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--vt-color-neutral-50,#F7F7FA)]/60">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search receipt code, building, or builder..."
                    className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-md text-[var(--vt-color-indigo-900,#261A66)] placeholder-[var(--vt-color-neutral-400,#A3A0B8)] focus:outline-hidden focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-1 focus:ring-[var(--vt-color-orange-500,#EF5F18)] transition-all font-sans"
                  />
                  <svg
                    className="w-4 h-4 absolute left-3 top-2.5 text-[var(--vt-color-neutral-400,#A3A0B8)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                  {/* Project Filter */}
                  <VantagedSelect
                    value={selectedProjectFilter}
                    onChange={(val) => setSelectedProjectFilter(val)}
                    containerClassName="w-auto min-w-[170px]"
                    className="h-9 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs"
                    options={[
                      { value: "All Buildings", label: "All Buildings (6)" },
                      { value: "Lekki Phase 1 Luxury Villa", label: "Lekki Phase 1 Luxury Villa" },
                      { value: "The Enclave Waterfront Resort", label: "The Enclave Waterfront" },
                      { value: "Guzape Hills Residence", label: "Guzape Hills Residence" },
                      { value: "Eko Atlantic Sky Tower", label: "Eko Atlantic Sky Tower" },
                      { value: "Banana Island Horizon Penthouse", label: "Banana Island Penthouse" },
                      { value: "Victoria Island Commercial Plaza", label: "Victoria Island Plaza" },
                    ]}
                  />

                  {/* Type Filter */}
                  <VantagedSelect
                    value={selectedTypeFilter}
                    onChange={(val) => setSelectedTypeFilter(val)}
                    containerClassName="w-auto min-w-[160px]"
                    className="h-9 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs"
                    options={[
                      { value: "All Payment Types", label: "All Payment Types" },
                      { value: "Work Payment", label: "Payment for Work Done" },
                      { value: "Deposited on Vantaged", label: "Deposited on Vantaged" },
                      { value: "Extra Work Added", label: "Extra Work Added" },
                      { value: "Final Holdback Released", label: "Final 5% Holdback" },
                    ]}
                  />

                  {/* Status Filter */}
                  <VantagedSelect
                    value={selectedStatusFilter}
                    onChange={(val) => setSelectedStatusFilter(val)}
                    containerClassName="w-auto min-w-[155px]"
                    className="h-9 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs"
                    options={[
                      { value: "All Statuses", label: "All Statuses" },
                      { value: "Received by Builder", label: "Received by Builder" },
                      { value: "Sent – Builder to Confirm", label: "Sent (Builder to Confirm)" },
                      { value: "Deposited on Vantaged", label: "Deposited on Vantaged" },
                      { value: "Issue Reported", label: "Issue Reported" },
                    ]}
                  />

                  {(selectedProjectFilter !== "All Buildings" ||
                    selectedTypeFilter !== "All Payment Types" ||
                    selectedStatusFilter !== "All Statuses" ||
                    searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProjectFilter("All Buildings");
                        setSelectedTypeFilter("All Payment Types");
                        setSelectedStatusFilter("All Statuses");
                        setSearchQuery("");
                      }}
                      className="h-9 px-2.5 rounded-md text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Clean Responsive Ledger Table (No Horizontal Scroll) */}
              <div className="w-full overflow-hidden rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]/70">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                      <th className="py-3 px-4">Building & Milestone</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          <svg className="w-10 h-10 mx-auto mb-2.5 text-[var(--vt-color-neutral-300,#CBC8DA)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <p className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">No payments found</p>
                          <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">Try clearing your filters or search keywords.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr
                          key={tx.id}
                          onClick={() => setInspectedTx(tx)}
                          className={`hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/70 transition-colors cursor-pointer group ${
                            tx.id.startsWith("tx-dep-") ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/40" : ""
                          }`}
                        >
                          {/* Col 1: Building & Milestone */}
                          <td className="py-3.5 px-4 min-w-[180px]">
                            <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors">
                              {tx.projectTitle}
                            </div>
                            <div className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 line-clamp-1">
                              {tx.stageTitle}
                            </div>
                            <span className="inline-block px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)] mt-1">
                              {tx.type}
                            </span>
                          </td>

                          {/* Col 2: Date & Ref */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                              {tx.date}
                            </div>
                            <div className="text-[10px] font-mono text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5">
                              {tx.reference}
                            </div>
                          </td>

                          {/* Col 3: Amount */}
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <div className="font-black text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                              {formatNaira(tx.amount)}
                            </div>
                          </td>

                          {/* Col 4: Status Badge */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            {tx.status === "Received by Builder" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-600,#248246)] shrink-0" />
                                <span>Received</span>
                              </span>
                            )}

                            {tx.status === "Sent – Builder to Confirm" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse shrink-0" />
                                <span>Sent ({tx.daysRemaining}d to confirm)</span>
                              </span>
                            )}

                            {tx.status === "Deposited on Vantaged" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--vt-color-indigo-50,#F0EFFB)] text-[var(--vt-color-indigo-700,#362680)] border border-[var(--vt-color-indigo-200,#D5D2EF)]">
                                <span>In Escrow</span>
                              </span>
                            )}

                            {tx.status === "Issue Reported" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                <span>Issue Reported</span>
                              </span>
                            )}
                          </td>

                          {/* Col 5: View Details */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectedTx(tx);
                              }}
                              className="h-8 px-3 rounded-md bg-white hover:bg-[var(--vt-color-orange-500,#EF5F18)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-white text-xs font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
                            >
                              Details & Receipt →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Ledger Footer */}
              <div className="p-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]/40 flex items-center justify-between text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                <span>Showing {filteredTransactions.length} of {transactions.length} payments</span>
                <span className="font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">Click any payment to see full bank code, builder & inspection sign-off</span>
              </div>
            </div>

            {/* ── Breakdown by Project Section ── */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  Breakdown by Project
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  See the original price, extra work added, money paid, and what is remaining for each building site
                </p>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]/70">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                      <th className="py-3 px-3.5">Building Site</th>
                      <th className="py-3 px-3.5">Builder</th>
                      <th className="py-3 px-3.5 text-right">Starting Price</th>
                      <th className="py-3 px-3.5 text-right">Added Work</th>
                      <th className="py-3 px-3.5 text-right">Total Price</th>
                      <th className="py-3 px-3.5 text-right">Money Paid</th>
                      <th className="py-3 px-3.5 text-right">In Escrow</th>
                      <th className="py-3 px-3.5 text-right">Final Hold (5%)</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
                    {projectSummaries.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/50">
                        <td className="py-3.5 px-3.5 font-bold text-[var(--vt-color-indigo-900,#261A66)]">{p.title}</td>
                        <td className="py-3.5 px-3.5 font-medium text-[var(--vt-color-neutral-600,#5E5A7D)]">{p.contractor}</td>
                        <td className="py-3.5 px-3.5 text-right font-semibold">{formatNaira(p.originalBudget)}</td>
                        <td className="py-3.5 px-3.5 text-right font-semibold text-[var(--vt-color-orange-600,#D84C0B)]">
                          {p.approvedVariations > 0 ? `+${formatNaira(p.approvedVariations)}` : "—"}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-black text-[var(--vt-color-indigo-900,#261A66)]">
                          {formatNaira(p.currentContractValue)}
                        </td>
                        <td className="py-3.5 px-3.5 text-right">
                          <div className="font-bold text-[var(--vt-color-green-700,#1F6B3E)]">{formatNaira(p.disbursedAmount)}</div>
                          <div className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">{p.percentDisbursed}% paid</div>
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                          {p.inEscrowAmount > 0 ? formatNaira(p.inEscrowAmount) : "—"}
                        </td>
                        <td className="py-3.5 px-3.5 text-right font-medium text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          {formatNaira(p.retainageAmount)}
                        </td>
                        <td className="py-3.5 px-3.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                              p.health === "Going Well"
                                ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)]"
                                : p.health === "Payment Coming Up"
                                ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)]"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {p.health}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </main>

      {/* ── SIMPLE PAYMENT DETAILS & RECEIPT MODAL ── */}
      {inspectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">{inspectedTx.reference}</h2>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-mono mt-0.5">
                  Bank Reference Code: {inspectedTx.bankSessionId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedTx(null)}
                className="w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 flex flex-col gap-4.5 text-xs max-h-[85vh] overflow-y-auto">
              {/* Amount Box */}
              <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Amount Paid</span>
                  <div className="text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    {formatNaira(inspectedTx.amount)}
                  </div>
                  <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    ₦{inspectedTx.amount.toLocaleString("en-NG")} Naira
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold ${
                      inspectedTx.status === "Received by Builder"
                        ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#17512F)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                        : inspectedTx.status === "Deposited on Vantaged"
                        ? "bg-[var(--vt-color-indigo-50,#F0EFFB)] text-[var(--vt-color-indigo-700,#362680)] border border-[var(--vt-color-indigo-200,#D5D2EF)]"
                        : "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-800,#8F320D)] border border-[var(--vt-color-orange-200,#FDCAA9)]"
                    }`}
                  >
                    <span>●</span>
                    <span>{inspectedTx.status}</span>
                  </span>
                  <p className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-1">{inspectedTx.date}</p>
                </div>
              </div>

              {/* 3-Day Builder Confirmation Timer */}
              {inspectedTx.status === "Sent – Builder to Confirm" && (
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[var(--vt-color-orange-800,#8F320D)]">
                    <span>⏳ 3-Day Builder Confirmation Clock</span>
                    <span>{inspectedTx.daysRemaining} Days Left</span>
                  </div>
                  <p className="text-[11px] text-[var(--vt-color-orange-700,#B33C08)] leading-relaxed">
                    You have sent this money to the builder. The builder has 3 days to click 'Confirm' on their phone to verify it reached their bank account. If they don't confirm in 3 days, our Vantaged team calls them immediately to verify.
                  </p>
                  <div className="w-full h-1.5 rounded-full bg-[var(--vt-color-orange-200,#FDCAA9)] overflow-hidden mt-1">
                    <div style={{ width: "33%" }} className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full" />
                  </div>
                </div>
              )}

              {/* Plain-English Payment Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Building Project</span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">{inspectedTx.projectTitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Builder / Contractor</span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">{inspectedTx.contractorName}</p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Work Completed</span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">{inspectedTx.stageTitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase">Payment Method</span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">{inspectedTx.paymentMethod}</p>
                </div>
              </div>

              {/* Engineer Inspection Sign-off */}
              {inspectedTx.verifiedBy && (
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)]/60 border border-[var(--vt-color-green-200,#A3D9B1)]/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-[var(--vt-color-green-500,#2E9E57)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[var(--vt-color-green-800,#17512F)] block">
                        Inspected & Approved on the Building Site
                      </span>
                      <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">{inspectedTx.verifiedBy}</p>
                      <p className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">{inspectedTx.verifiedRole}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] shrink-0">
                    Quality Passed
                  </span>
                </div>
              )}

              {/* Notes */}
              {inspectedTx.notes && (
                <div>
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1">
                    Why this money was paid
                  </span>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]">
                    {inspectedTx.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 font-sans shrink-0">
              <button
                type="button"
                onClick={() => setInspectedTx(null)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs font-sans"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(inspectedTx.bankSessionId);
                    setCopiedBankCode(true);
                    setTimeout(() => setCopiedBankCode(false), 2000);
                  }}
                  className="h-9 px-3.5 rounded-md bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs font-sans"
                >
                  {copiedBankCode ? (
                    <span className="text-green-600 font-bold">✓ Copied Code!</span>
                  ) : (
                    <span>Copy Bank Code</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsReceiptDownloading(true);
                    openPrintStatementWindow([inspectedTx], {
                      projectFilter: inspectedTx.projectTitle,
                      timePeriod: "all",
                      typeFilter: "all",
                      statusFilter: "all",
                      format: "pdf",
                    });
                    setTimeout(() => setIsReceiptDownloading(false), 2000);
                  }}
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs font-sans flex items-center gap-1.5"
                >
                  {isReceiptDownloading ? (
                    <>
                      <span className="text-white font-bold">✓ Opening Statement...</span>
                    </>
                  ) : (
                    <span>Download Receipt (PDF)</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DEPOSIT FUNDS MODAL (Clean, Plain-Language Escrow Top-Up) ── */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
          >
            {/* Modal Header */}
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-black text-white">Deposit Funds for Your Building</h2>
                <p className="text-[11px] text-[var(--vt-color-indigo-200,#D5D2EF)] mt-0.5">
                  Money is held safely in escrow. The builder only gets paid after your engineer inspects the site and gives approval.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDepositModalOpen(false);
                  setDepositStep("form");
                }}
                className="w-8 h-8 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-3"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: STEP 1 - Form */}
            {depositStep === "form" && (
              <div className="p-5 sm:p-6 flex flex-col gap-4.5 text-xs max-h-[72vh] overflow-y-auto">
                {/* 1. Select Building Project */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] block mb-1.5">
                    Which building are you funding?
                  </label>
                  <VantagedSelect
                    value={selectedBuildingForDeposit}
                    onChange={(val) => setSelectedBuildingForDeposit(val)}
                    className="w-full h-10 px-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]"
                    options={projectSummaries.map((p) => ({
                      value: p.title,
                      label: `${p.title} (${p.contractor})`,
                    }))}
                  />
                </div>

                {/* 2. Enter Deposit Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                      How much do you want to deposit?
                    </label>
                    <span className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">In Nigerian Naira (₦)</span>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-black text-[var(--vt-color-neutral-400,#A3A0B8)]">₦</span>
                    <input
                      type="text"
                      value={depositAmountInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setDepositAmountInput(val);
                      }}
                      placeholder="25,000,000"
                      className="w-full h-11 pl-8 pr-3 text-base font-black text-[var(--vt-color-indigo-900,#261A66)] bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] rounded-md focus:outline-hidden focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:ring-1 focus:ring-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>

                  {/* Quick Amount Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {[5000000, 10000000, 25000000, 50000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmountInput(amt.toString())}
                        className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold border transition-all cursor-pointer ${
                          depositAmountInput === amt.toString()
                            ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-300,#FBA674)]"
                            : "bg-white text-[var(--vt-color-neutral-600,#5E5A7D)] border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-400,#A3A0B8)]"
                        }`}
                      >
                        +{formatNaira(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Choose Payment Method */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] block mb-1.5">
                    How do you want to pay?
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDepositMethod("bank_transfer")}
                      className={`p-3 rounded-md border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        depositMethod === "bank_transfer"
                          ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/60 border-[var(--vt-color-orange-400,#FA8747)] ring-1 ring-[var(--vt-color-orange-400,#FA8747)]"
                          : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">Bank Transfer</span>
                      </div>
                      <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">Instant NIBSS bank wire</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDepositMethod("card")}
                      className={`p-3 rounded-md border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        depositMethod === "card"
                          ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/60 border-[var(--vt-color-orange-400,#FA8747)] ring-1 ring-[var(--vt-color-orange-400,#FA8747)]"
                          : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">Debit / Credit Card</span>
                      </div>
                      <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">Visa, Mastercard, Verve</span>
                    </button>
                  </div>
                </div>

                {/* 4. Payment Method Details Box */}
                {depositMethod === "bank_transfer" ? (
                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-3">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                      Your Dedicated Virtual Account
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] block">Bank Name</span>
                        <span className="font-black text-[var(--vt-color-indigo-900,#261A66)]">Zenith Bank Plc</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] block">Account Name</span>
                        <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate block">
                          Vantaged Escrow / Robinson
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">Account Number</span>
                        <span className="text-base font-black font-mono tracking-wider text-[var(--vt-color-indigo-900,#261A66)]">
                          9024 118 492
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyAccount("9024118492")}
                        className="h-8 px-3 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        {copiedDepositAccount ? (
                          <>
                            <span className="text-green-600 font-extrabold">✓</span>
                            <span className="text-green-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] leading-relaxed">
                      Make a transfer from your banking app. Your Vantaged escrow balance will update automatically in 1–2 minutes.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2.5">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                      Instant Card Payment
                    </span>
                    <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                      Pay directly with your Nigerian ATM card or international card (Mastercard, Visa, American Express). Payments are processed securely via Paystack with 256-bit encryption.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Modal Body: STEP - Confirming Spinner */}
            {depositStep === "confirming" && (
              <div className="p-10 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full border-3 border-[var(--vt-color-orange-500,#EF5F18)] border-t-transparent animate-spin" />
                <h3 className="font-extrabold text-base text-[var(--vt-color-indigo-900,#261A66)] mt-2">
                  Confirming Deposit...
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-xs">
                  Verifying transaction with bank network and securing funds in your project escrow vault.
                </p>
              </div>
            )}

            {/* Modal Body: STEP 2 - Success Screen */}
            {depositStep === "success" && lastDepositReceipt && (
              <div className="p-6 sm:p-8 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--vt-color-green-500,#2E9E57)] text-white flex items-center justify-center text-2xl font-black shadow-md animate-in zoom-in-75 duration-200">
                  ✓
                </div>

                <div>
                  <h3 className="font-black text-xl text-[var(--vt-color-indigo-900,#261A66)]">
                    Deposit Successful!
                  </h3>
                  <div className="text-2xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
                    {formatNaira(lastDepositReceipt.amount)}
                  </div>
                  <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] max-w-sm mt-1.5 leading-relaxed">
                    Your funds are now safely locked in escrow for <strong>{lastDepositReceipt.projectName}</strong>. Your builder has been notified that funding for upcoming work is secured.
                  </p>
                </div>

                <div className="w-full p-3.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-left flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Transaction Reference:</span>
                    <span className="font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)]">{lastDepositReceipt.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Protection Status:</span>
                    <span className="font-bold text-[var(--vt-color-green-700,#1F6B3E)]">Protected in Bank Escrow</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Release Rule:</span>
                    <span className="font-medium text-[var(--vt-color-indigo-900,#261A66)]">Only upon site engineer inspection</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDepositModalOpen(false);
                      setDepositStep("form");
                      const historyEl = document.getElementById("payment-history-section");
                      if (historyEl) {
                        historyEl.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className="flex-1 h-10 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    View in Payment History
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDepositModalOpen(false);
                      setDepositStep("form");
                    }}
                    className="px-4 h-10 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions Footer (Only on form step) */}
            {depositStep === "form" && (
              <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-3 font-sans shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleExecuteDeposit}
                  className="h-9 px-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  {depositMethod === "bank_transfer" ? (
                    <>
                      <span>I Have Completed The Transfer</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Pay {formatNaira(parseInt(depositAmountInput || "25000000", 10))} Now</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ── DOWNLOAD PAYMENT SUMMARY FILTER MODAL ── */}
      <DownloadPaymentSummaryModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        transactions={transactions}
        projectSummaries={projectSummaries}
      />
    </div>
  );
}
