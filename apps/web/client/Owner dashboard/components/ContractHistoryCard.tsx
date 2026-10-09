"use client";

import React, { useState } from "react";

interface CompletedContract {
  id: string;
  contractNumber: string;
  title: string;
  location: string;
  type: string;
  contractor: string;
  clientRep: string;
  totalValue: string;
  milestonesCompleted: number;
  totalMilestones: number;
  completedDate: string;
  status: "Completed & Closed" | "Audited & Archived";
}

const pastContracts: CompletedContract[] = [
  {
    id: "cnt-1",
    contractNumber: "VTD-2025-081",
    title: "Ikoyi Waterfront Luxury Penthouse & Terrace",
    location: "Banana Island Rd, Ikoyi, Lagos",
    type: "Residential High-End",
    contractor: "Julius B. Consortium",
    clientRep: "Engr. Gbenga A.",
    totalValue: "₦84,500,000",
    milestonesCompleted: 10,
    totalMilestones: 10,
    completedDate: "Aug 2025",
    status: "Completed & Closed",
  },
  {
    id: "cnt-2",
    contractNumber: "VTD-2025-034",
    title: "Victoria Island Commercial Tech Hub",
    location: "Ahmadu Bello Way, Victoria Island",
    type: "4-Floor Office Complex",
    contractor: "Crane & Stone Structural",
    clientRep: "Arch. Fatima B.",
    totalValue: "₦165,000,000",
    milestonesCompleted: 8,
    totalMilestones: 8,
    completedDate: "Feb 2025",
    status: "Completed & Closed",
  },
  {
    id: "cnt-3",
    contractNumber: "VTD-2024-119",
    title: "Chevron Lekki Residential Estate — Phase 1",
    location: "Chevron Drive, Lekki, Lagos",
    type: "6 Semi-Detached Duplexes",
    contractor: "Apex Build Nigeria Ltd",
    clientRep: "Engr. Chidi O.",
    totalValue: "₦210,000,000",
    milestonesCompleted: 12,
    totalMilestones: 12,
    completedDate: "Nov 2024",
    status: "Completed & Closed",
  },
  {
    id: "cnt-4",
    contractNumber: "VTD-2024-052",
    title: "Epe Agro-Logistics Cold Storage Facility",
    location: "Epe Expressway, Lagos",
    type: "Industrial Portal Frame",
    contractor: "Prime Terra Infrastructure",
    clientRep: "Engr. Kalu M.",
    totalValue: "₦42,000,000",
    milestonesCompleted: 6,
    totalMilestones: 6,
    completedDate: "Jun 2024",
    status: "Audited & Archived",
  },
];

export function ContractHistoryCard() {
  const [filter, setFilter] = useState<"all" | "residential" | "commercial">("all");

  const filteredContracts = pastContracts.filter((c) => {
    if (filter === "residential") return c.type.toLowerCase().includes("residential");
    if (filter === "commercial") return !c.type.toLowerCase().includes("residential");
    return true;
  });

  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.05)] flex flex-col justify-between font-sans select-none min-h-[360px]">
      {/* 1. Header Bar: Title, Count Badge, and Category Filter Pills */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                  Contract History
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] text-[11px] font-bold">
                  {pastContracts.length} Completed
                </span>
              </div>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                Past construction projects completed and audited through Vantaged escrow
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[var(--vt-color-neutral-50,#F7F7FA)] p-1 rounded-md border border-[var(--vt-color-neutral-200,#E2E0EC)]">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-2xs font-bold"
                  : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("residential")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                filter === "residential"
                  ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-2xs font-bold"
                  : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Residential
            </button>
            <button
              type="button"
              onClick={() => setFilter("commercial")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                filter === "commercial"
                  ? "bg-white text-[var(--vt-color-indigo-900,#261A66)] shadow-2xs font-bold"
                  : "text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        {/* 2. Construction Contracts List */}
        <div className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="py-3 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 px-2 rounded-lg transition-colors"
            >
              {/* Left Column: Project Title, Location, and Contractor Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] bg-[var(--vt-color-orange-50,#FFF4EE)] px-1.5 py-0.5 rounded border border-[var(--vt-color-orange-200,#FDCAA9)]">
                    {contract.contractNumber}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate">
                    {contract.title}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  <span>{contract.location}</span>
                  <span>•</span>
                  <span>
                    Contractor: <strong className="text-[var(--vt-color-indigo-900,#261A66)] font-semibold">{contract.contractor}</strong>
                  </span>
                  <span>•</span>
                  <span>Rep: {contract.clientRep}</span>
                </div>
              </div>

              {/* Right Column: Milestones, Amount Disbursed, and Status Badge */}
              <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0">
                {/* Milestones pill */}
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] block">
                    {contract.milestonesCompleted}/{contract.totalMilestones} Milestones
                  </span>
                  <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    {contract.completedDate}
                  </span>
                </div>

                {/* Total Value */}
                <div className="text-right min-w-[95px]">
                  <span className="text-sm sm:text-base font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] block leading-tight">
                    {contract.totalValue}
                  </span>
                  <span className="text-[9px] font-semibold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase tracking-wider">
                    Disbursed
                  </span>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] text-[11px] font-bold border border-[var(--vt-color-green-200,#A3D9B1)]">
                  <svg className="w-3 h-3 text-[var(--vt-color-green-500,#2E9E57)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Closed</span>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  title="View completion certificate"
                  className="h-8 px-2.5 rounded-md bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <svg className="w-3 h-3 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                  <span>Audit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Summary Strip */}
      <div className="mt-4 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
        <div className="flex items-center gap-3">
          <span>
            Total Historical Escrow Disbursed: <strong className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">₦501,500,000</strong>
          </span>
          <span className="hidden sm:inline text-[var(--vt-color-neutral-300,#CBC8DA)]">•</span>
          <span className="hidden sm:inline text-[var(--vt-color-green-700,#1F6B3E)] font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            100% Verified Milestone Compliance
          </span>
        </div>

        <button
          type="button"
          className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Download All Statements</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
