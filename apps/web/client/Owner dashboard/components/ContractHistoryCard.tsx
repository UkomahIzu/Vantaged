"use client";

import React from "react";

interface CompletedContract {
  id: string;
  title: string;
  location: string;
  contractor: string;
  totalValue: string;
  completedDate: string;
}

const pastContracts: CompletedContract[] = [
  {
    id: "cnt-1",
    title: "Ikoyi Waterfront Luxury Penthouse & Terrace",
    location: "Ikoyi, Lagos",
    contractor: "Julius B. Consortium",
    totalValue: "₦84,500,000",
    completedDate: "Aug 2025",
  },
  {
    id: "cnt-2",
    title: "Victoria Island Commercial Tech Hub",
    location: "Victoria Island, Lagos",
    contractor: "Crane & Stone Structural",
    totalValue: "₦165,000,000",
    completedDate: "Feb 2025",
  },
  {
    id: "cnt-3",
    title: "Chevron Lekki Residential Estate — Phase 1",
    location: "Lekki, Lagos",
    contractor: "Apex Build Nigeria Ltd",
    totalValue: "₦210,000,000",
    completedDate: "Nov 2024",
  },
  {
    id: "cnt-4",
    title: "Epe Agro-Logistics Cold Storage Facility",
    location: "Epe, Lagos",
    contractor: "Prime Terra Infrastructure",
    totalValue: "₦42,000,000",
    completedDate: "Jun 2024",
  },
];

export function ContractHistoryCard() {
  const displayedContracts = pastContracts.slice(0, 4);

  return (
    <div className="bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(38,26,102,0.05)] flex flex-col justify-between font-sans select-none min-h-[360px]">
      {/* 1. Header Bar: Title (without completed count badge) */}
      <div className="shrink-0 mb-3">
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
            <h2 className="text-base sm:text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Contract History
            </h2>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Past construction projects completed and audited through Vantaged escrow
            </p>
          </div>
        </div>
      </div>

      {/* 2. Construction Contracts List: Shows most recent 4, does NOT scroll */}
      <div className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
        {displayedContracts.map((contract) => (
          <div
            key={contract.id}
            className="py-3 sm:py-3.5 flex items-center justify-between gap-4 group hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 px-2 rounded-lg transition-colors"
          >
            {/* Left: Project Title & Contractor */}
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate">
                {contract.title}
              </h3>
              <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">
                <span className="font-medium text-[var(--vt-color-neutral-600,#5E5A7D)]">{contract.contractor}</span>
                <span className="mx-1.5 text-[var(--vt-color-neutral-300,#CBC8DA)]">·</span>
                <span>{contract.location}</span>
              </p>
            </div>

            {/* Right: Total Value & Date */}
            <div className="text-right shrink-0">
              <span className="text-xs sm:text-sm font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] block leading-tight">
                {contract.totalValue}
              </span>
              <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)] mt-0.5 block">
                {contract.completedDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Summary Strip: Disbursed amount on left, Orange Previous Projects button on right */}
      <div className="shrink-0 mt-3 pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between gap-3 text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
        <span>
          Total Historical Escrow Disbursed: <strong className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">₦501,500,000</strong>
        </span>

        <button
          type="button"
          className="h-8 px-3 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] active:bg-[var(--vt-color-orange-700,#B33C08)] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5 font-sans"
        >
          <span>See all</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
