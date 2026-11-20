"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconContractors,
  IconSearch,
  IconShield,
  IconCheckCircle,
  IconExternalLink,
  IconUsers,
} from "../../components/AdminIcons";
import {
  ContractorRecord,
  INITIAL_CONTRACTORS,
} from "../../data/contractorsData";

export default function ContractorsDirectoryPage() {
  const [contractors, setContractors] = useState<ContractorRecord[]>(INITIAL_CONTRACTORS);
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedContractor, setSelectedContractor] = useState<ContractorRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync with live contractors API and URL search params on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("search");
      if (query) setSearchTerm(query);
    }

    fetch("/api/contractors")
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && Array.isArray(resData.data)) {
          setContractors(resData.data);
        }
      })
      .catch((err) => console.warn("Using default contractors:", err));
  }, []);

  const handleToggleSuspend = async (contractor: ContractorRecord) => {
    const nextStatus = contractor.status === "SUSPENDED" ? "VERIFIED" : "SUSPENDED";
    const updatedContractors = contractors.map((c) =>
      c.id === contractor.id ? { ...c, status: nextStatus as any } : c
    );
    setContractors(updatedContractors);
    if (selectedContractor && selectedContractor.id === contractor.id) {
      setSelectedContractor({ ...selectedContractor, status: nextStatus as any });
    }

    try {
      await fetch("/api/contractors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contractor.id, status: nextStatus }),
      });

      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: nextStatus === "SUSPENDED" ? "CONTRACTOR_SUSPENDED" : "CONTRACTOR_REINSTATED",
          actionLabel: nextStatus === "SUSPENDED" ? "Contractor Account Suspended" : "Contractor Account Reinstated",
          target: `${contractor.name} (${contractor.rcNumber})`,
          details: `Administrative status change to ${nextStatus}.`,
          level: nextStatus === "SUSPENDED" ? "WARNING" : "SUCCESS",
        }),
      });

      showToast(`${contractor.name} has been ${nextStatus === "SUSPENDED" ? "suspended" : "reinstated"}!`);
    } catch {
      showToast("Updated contractor status.");
    }
  };

  // Filter logic: directory contains verified firms filtered by subscription tier
  const filtered = contractors.filter((c) => {
    let matchesPlan = true;
    if (planFilter === "PRIME") matchesPlan = c.plan === "Prime Consortium";
    else if (planFilter === "VERIFIED_PLAN") matchesPlan = c.plan === "Verified Builder";
    else if (planFilter === "STARTER") matchesPlan = c.plan === "Starter Builder";

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.rcNumber.toLowerCase().includes(term) ||
      c.director.toLowerCase().includes(term) ||
      c.state.toLowerCase().includes(term) ||
      c.badges.some((b) => b.toLowerCase().includes(term));

    return matchesPlan && matchesSearch;
  });

  // KPI Counts across platform tiers
  const countPrime = contractors.filter((c) => c.plan === "Prime Consortium").length;
  const countVerifiedPlan = contractors.filter((c) => c.plan === "Verified Builder").length;
  const countStarter = contractors.filter((c) => c.plan === "Starter Builder").length;

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col gap-5 sm:gap-6 w-full select-none font-sans"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <IconContractors className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] font-bold">
              Directory & Tiers
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--vt-color-indigo-900,#261A66)]">
            Contractor Directory
          </h1>
          <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-600,#5E5A7D)]">
            Manage accredited construction firms, regulatory licenses, tier quotas, and active project capacity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {toastMessage && (
            <div className="animate-in fade-in slide-in-from-top-1 px-3 py-1.5 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold shadow-2xs flex items-center gap-1.5">
              <span>✓</span>
              <span>{toastMessage}</span>
            </div>
          )}
          <Link
            href="/verifications"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)]"
          >
            <span>Open Verification Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/25 font-bold">2</span>
          </Link>
          <a
            href="http://localhost:3000/contractor/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2.5 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] transition-all shadow-2xs"
          >
            <span>Terminal</span>
            <IconExternalLink className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)]" />
          </a>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        <div
          onClick={() => setPlanFilter("ALL")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            planFilter === "ALL"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
            Total Accredited Firms
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {contractors.length.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setPlanFilter("PRIME")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            planFilter === "PRIME"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-indigo-700,#43379A)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-indigo-600,#4F46E5)]" />
            Prime Consortiums
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {countPrime.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setPlanFilter("VERIFIED_PLAN")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            planFilter === "VERIFIED_PLAN"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
            Verified Builders
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] mt-1">
            {countVerifiedPlan.toString().padStart(2, "0")}
          </div>
        </div>

        <div
          onClick={() => setPlanFilter("STARTER")}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs ${
            planFilter === "STARTER"
              ? "border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-500,#EF5F18)]/15"
              : "border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
          }`}
        >
          <div className="text-[11px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-neutral-400,#A3A0B8)]" />
            Starter Builders
          </div>
          <div className="text-2xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1">
            {countStarter.toString().padStart(2, "0")}
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white p-3.5 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--vt-color-neutral-400,#A3A0B8)]">
            <IconSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, RC number, director, or state..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs sm:text-sm text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] focus:border-[var(--vt-color-orange-500,#EF5F18)] focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: `All Firms (${contractors.length})` },
            { id: "PRIME", label: `Prime Consortium (${countPrime})` },
            { id: "VERIFIED_PLAN", label: `Verified Builder (${countVerifiedPlan})` },
            { id: "STARTER", label: `Starter Builder (${countStarter})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPlanFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer ${
                planFilter === tab.id
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs"
                  : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table with Zero Horizontal Scroll */}
      <div className="w-full bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
        <table className="w-full table-fixed text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="border-b border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 text-[11px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              <th className="py-3 px-3 sm:px-4 w-[28%]">Company & Legal Entity</th>
              <th className="py-3 px-3 sm:px-4 w-[20%]">Managing Director</th>
              <th className="py-3 px-3 sm:px-4 w-[18%]">Subscription Tier & Capacity</th>
              <th className="py-3 px-3 sm:px-4 w-[16%]">Accreditations</th>
              <th className="py-3 px-3 sm:px-4 w-[18%] text-right whitespace-nowrap">Projects</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  <svg className="w-10 h-10 mx-auto mb-2.5 text-[var(--vt-color-neutral-300,#CBC8DA)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">No contractors found</p>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">Try clearing your filters or search keywords.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPlanFilter("ALL");
                      setSearchTerm("");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--vt-color-orange-500,#EF5F18)] hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedContractor(item)}
                  className={`group hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/50 transition-colors cursor-pointer ${
                    selectedContractor?.id === item.id ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/80" : ""
                  }`}
                >
                  {/* Company & Legal Entity */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] font-bold text-xs flex items-center justify-center border border-[var(--vt-color-indigo-100,#EAE8F9)] shrink-0">
                        {item.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors truncate">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[var(--vt-color-neutral-500,#7C7894)] truncate">
                          <span>{item.rcNumber}</span>
                          <span>·</span>
                          <span>{item.state}</span>
                          <span>·</span>
                          <span className="truncate">{item.category.split("&")[0].trim()}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Managing Director */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">{item.director}</div>
                    <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate">{item.directorRole}</div>
                  </td>

                  {/* Subscription Tier & Capacity */}
                  <td className="py-3 px-3 sm:px-4 min-w-0">
                    <div className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] truncate">{item.plan}</div>
                    <div className="text-[11px] font-mono font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5 truncate">
                      Slots: {item.activeSlots}
                    </div>
                  </td>

                  {/* Verified Accreditations */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.badges.map((b, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#134427)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Projects Action Button */}
                  <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <Link
                      href={`/contractors/${item.id}/projects`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-600,#D84C0B)] hover:text-white border border-[var(--vt-color-orange-200,#FDCAA9)] hover:border-[var(--vt-color-orange-500,#EF5F18)] text-xs font-bold transition-all shadow-2xs group/btn cursor-pointer whitespace-nowrap flex-nowrap shrink-0"
                    >
                      <IconUsers className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap shrink-0">Projects ({item.slotsUsed})</span>
                      <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/btn:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Contractor Profile Drawer / Modal */}
      {selectedContractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-start justify-between gap-4 bg-[var(--vt-color-neutral-50,#F7F7FA)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] text-white font-extrabold text-base flex items-center justify-center shadow-sm shrink-0">
                  {selectedContractor.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                      {selectedContractor.rcNumber}
                    </span>
                    <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">·</span>
                    <span className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">{selectedContractor.state}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
                    {selectedContractor.name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContractor(null)}
                className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-[var(--vt-color-text-default,#261A66)]">
              {/* Status & Plan Banner */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                    Current Platform Tier
                  </div>
                  <div className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {selectedContractor.plan}
                  </div>
                  <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Active build slots: <span className="font-bold text-[var(--vt-color-orange-600,#D84C0B)]">{selectedContractor.activeSlots}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedContractor.status === "SUSPENDED" ? (
                    <button
                      type="button"
                      onClick={() => handleToggleSuspend(selectedContractor)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      SUSPENDED · Reinstate
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                        Vantaged Verified Partner
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleSuspend(selectedContractor)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Temporarily freeze bidding and escrow operations for this contractor"
                      >
                        Suspend
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Executive Director */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Managing Director
                  </h3>
                  <div className="space-y-1.5">
                    <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedContractor.director}
                    </div>
                    <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                      {selectedContractor.directorRole}
                    </div>
                    <div className="text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)] pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      {selectedContractor.directorEmail}
                    </div>
                    <div className="text-xs font-mono text-[var(--vt-color-neutral-500,#7C7894)]">
                      {selectedContractor.directorPhone}
                    </div>
                  </div>
                </div>

                {/* Settlement Banking */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Escrow Settlement Banking
                  </h3>
                  <div className="space-y-1.5">
                    <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedContractor.bankName}
                    </div>
                    <div className="font-mono text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                      {selectedContractor.accountNumber}
                    </div>
                    <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] truncate pt-1 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      {selectedContractor.accountName}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <span>✓ NUBAN Corporate Matched</span>
                    </div>
                  </div>
                </div>

                {/* Office & Category */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Corporate Office
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedContractor.officeAddress}
                    </div>
                    <div className="text-[var(--vt-color-neutral-500,#7C7894)]">
                      {selectedContractor.state} · Tax ID: {selectedContractor.tin}
                    </div>
                    <div className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] pt-1">
                      Category: {selectedContractor.category}
                    </div>
                  </div>
                </div>

                {/* Regulatory Badges */}
                <div className="p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white">
                  <h3 className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-[11px] uppercase tracking-wider font-mono mb-2.5">
                    Verified Badges
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedContractor.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-800,#134427)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-green-500,#2E9E57)]" />
                        {b}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Enrolled since {selectedContractor.joinedDate}
                  </div>
                </div>
              </div>

              {/* Active Projects Portfolio Card */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-orange-200,#FDCAA9)] bg-[var(--vt-color-orange-50,#FFF4EE)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-2">
                    <IconUsers className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" />
                    <span>Active Projects Portfolio ({selectedContractor.slotsUsed} Ongoing)</span>
                  </div>
                  <div className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">
                    Inspect all contracted construction sites, stage evidence, milestones, and escrow vaults for {selectedContractor.name}.
                  </div>
                </div>

                <Link
                  href={`/contractors/${selectedContractor.id}/projects`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] shrink-0 cursor-pointer whitespace-nowrap flex-nowrap"
                >
                  <span className="whitespace-nowrap">Open Projects List</span>
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              {/* Enterprise Access Shortcut */}
              <div className="p-4 rounded-xl border border-[var(--vt-color-green-200,#A3D9B1)] bg-[var(--vt-color-green-50,#E9F6EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-[var(--vt-color-green-800,#134427)]">
                    Contractor Terminal Access
                  </div>
                  <div className="text-xs text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                    Authorized login route for {selectedContractor.name}:
                  </div>
                  <div className="font-mono text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold mt-1">
                    http://localhost:3000/contractor/login
                  </div>
                </div>

                <a
                  href="http://localhost:3000/contractor/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[var(--vt-color-green-700,#1F6B3E)] hover:bg-[var(--vt-color-green-800,#134427)] text-white text-xs font-bold transition-all shadow-2xs self-start sm:self-center"
                >
                  <span>Open Terminal</span>
                  <IconExternalLink className="w-3.5 h-3.5 text-white" />
                </a>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedContractor(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] transition-all"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/contractors/${selectedContractor.id}/projects`}
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-nowrap shrink-0"
                >
                  <IconUsers className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">View Projects ({selectedContractor.slotsUsed})</span>
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
                <Link
                  href="/subscriptions"
                  className="h-9 px-3.5 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Quota</span>
                </Link>
                <Link
                  href="/verifications"
                  className="h-9 px-3.5 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-700,#443E63)] text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>Verification</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
