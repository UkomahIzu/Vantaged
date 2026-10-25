"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ProjectSidebarNav } from "./ProjectSidebarNav";
import { HeaderBar } from "../../components/HeaderBar";
import { getProjectDetail, ProjectChangeRequestItem } from "./projectData";
import { ProjectBreadcrumb } from "./ProjectBreadcrumb";
import {
  IconCheck,
  IconClose,
  IconPlus,
  IconShieldCheck,
  IconPrinter,
  IconAlertTriangle,
  IconDownload,
} from "./ProjectIcons";
import { useScrollRestoration } from "../../hooks/useScrollRestoration";
import { VantagedSelect } from "../../components/VantagedSelect";

interface ProjectChangeRequestsPageProps {
  projectId?: string;
}

export function ProjectChangeRequestsPage({ projectId = "proj-lekki" }: ProjectChangeRequestsPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`proj_cr_${projectId}`);
  const project = getProjectDetail(projectId);
  const storageKey = `vantaged_cr_${projectId}`;

  // Persistent Change Requests State
  const [changeRequests, setChangeRequests] = useState<ProjectChangeRequestItem[]>(project.changeRequests);
  const [selectedCRId, setSelectedCRId] = useState<string>(project.changeRequests[0]?.id || "");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChangeRequests(parsed);
          setSelectedCRId((prev) => {
            if (prev && parsed.some((c: ProjectChangeRequestItem) => c.id === prev)) return prev;
            return parsed[0].id;
          });
        }
      }
    } catch {}
  }, [storageKey]);

  const [filterTab, setFilterTab] = useState<"all" | "pending" | "contractor" | "approved" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [requesterFilter, setRequesterFilter] = useState<"all" | "Owner" | "Contractor">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Approval Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Decline Modal State
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReasonInput, setDeclineReasonInput] = useState("");

  // VO Print / Document Modal State
  const [isVOPrintModalOpen, setIsVOPrintModalOpen] = useState(false);

  // New Request Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCRTitle, setNewCRTitle] = useState("");
  const [newCRAffectedStage, setNewCRAffectedStage] = useState(project.stages[0]?.title || "Stage 1: Ground Work");
  const [newCRReason, setNewCRReason] = useState("");
  const [newCRCost, setNewCRCost] = useState("3200000");
  const [newCRDays, setNewCRDays] = useState("3");
  const [newCRSuccess, setNewCRSuccess] = useState(false);

  const persistCR = (updated: ProjectChangeRequestItem[]) => {
    setChangeRequests(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event("vantaged_storage_update"));
      } catch {}
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const formatNaira = (val: number) => {
    if (val >= 1000000000) {
      return `₦${(val / 1000000000).toFixed(2)}B`;
    }
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  // Financial aggregates
  const originalContractValue = project.contractValue;
  const totalApproved = changeRequests
    .filter((c) => c.status === "Approved")
    .reduce((acc, c) => acc + c.costImpact, 0);
  const revisedContractValue = originalContractValue + totalApproved;
  const totalApprovedDays = changeRequests
    .filter((c) => c.status === "Approved")
    .reduce((acc, c) => acc + c.timeExtensionDays, 0);

  const pendingRequests = changeRequests.filter((c) => c.status === "Waiting for Your Approval");
  const contractorReviewRequests = changeRequests.filter((c) => c.status === "Awaiting Contractor Assessment");
  const approvedRequests = changeRequests.filter((c) => c.status === "Approved");
  const declinedRequests = changeRequests.filter((c) => c.status === "Declined");

  const displayedCRs = useMemo(() => {
    return changeRequests.filter((c) => {
      // 1. Status Filter Tab / Dropdown
      if (filterTab === "pending" && c.status !== "Waiting for Your Approval") return false;
      if (filterTab === "contractor" && c.status !== "Awaiting Contractor Assessment") return false;
      if (filterTab === "approved" && c.status !== "Approved") return false;
      if (filterTab === "declined" && c.status !== "Declined") return false;

      // 2. Stage Filter Dropdown
      if (stageFilter !== "all" && c.affectedStage !== stageFilter) return false;

      // 3. Requester Filter Dropdown
      if (requesterFilter !== "all" && c.requestedBy !== requesterFilter) return false;

      // 4. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = (c.title || "").toLowerCase().includes(query);
        const matchesCode = (c.requestCode || "").toLowerCase().includes(query);
        const matchesReason = (c.reason || "").toLowerCase().includes(query);
        const matchesRequester = (c.requesterName || "").toLowerCase().includes(query);
        const matchesStage = (c.affectedStage || "").toLowerCase().includes(query);
        if (!matchesTitle && !matchesCode && !matchesReason && !matchesRequester && !matchesStage) {
          return false;
        }
      }

      return true;
    });
  }, [changeRequests, filterTab, stageFilter, requesterFilter, searchQuery]);

  const selectedCR = displayedCRs.find((c) => c.id === selectedCRId) || displayedCRs[0] || null;

  // Confirm Approval
  const handleConfirmApprove = () => {
    if (!selectedCR) return;
    const next = changeRequests.map((c) => {
      if (c.id === selectedCR.id) {
        return {
          ...c,
          status: "Approved" as const,
          approvedDate: "Today, Just now",
          paymentFundingMethod: "Escrow Reserve Deposit",
        };
      }
      return c;
    });
    persistCR(next);
    setIsApproveModalOpen(false);
    setAgreeTerms(false);
    showToast(`Variation Order ${selectedCR.requestCode} authorized and added to contract ledger.`);
  };

  // Confirm Decline
  const handleConfirmDecline = () => {
    if (!selectedCR) return;
    const next = changeRequests.map((c) => {
      if (c.id === selectedCR.id) {
        return {
          ...c,
          status: "Declined" as const,
          declinedDate: "Today, Just now",
          declineReason: declineReasonInput.trim() || "Owner declined proposed variation.",
        };
      }
      return c;
    });
    persistCR(next);
    setIsDeclineModalOpen(false);
    setDeclineReasonInput("");
    showToast(`Variation Order ${selectedCR.requestCode} marked as declined.`);
  };

  // Simulate Contractor Assessment Received (Interactive flow demo)
  const handleSimulateContractorAssessment = (id: string) => {
    const next = changeRequests.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: "Waiting for Your Approval" as const,
          contractorAssessmentNote:
            "Contractor site team completed formal quantity surveying. Quotation finalized and submitted for owner approval.",
        };
      }
      return c;
    });
    persistCR(next);
    showToast("Contractor assessment and quotation received! Ready for your decision.");
  };

  // Create New Change Request
  const handleCreateCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCRTitle.trim() || !newCRReason.trim()) return;

    const rawCost = parseInt(newCRCost.replace(/[^0-9]/g, ""), 10) || 2500000;
    const rawDays = parseInt(newCRDays, 10) || 3;
    const codeNum = changeRequests.length + 1;

    const newCR: ProjectChangeRequestItem = {
      id: `cr-${Date.now()}`,
      requestCode: `VO-2026-00${codeNum}`,
      title: newCRTitle.trim(),
      requestedBy: "Owner",
      requesterName: "Dr. James Arinze (Owner)",
      date: "Today, Just now",
      costImpact: rawCost,
      timeExtensionDays: rawDays,
      status: "Awaiting Contractor Assessment",
      affectedStage: newCRAffectedStage,
      reason: newCRReason.trim(),
      breakdown: [
        { item: `${newCRTitle.trim()} - Materials & Freight`, cost: Math.round(rawCost * 0.65) },
        { item: "Specialist Site Installation & Technical Labor", cost: Math.round(rawCost * 0.35) },
      ],
    };

    const next = [newCR, ...changeRequests];
    persistCR(next);
    setSelectedCRId(newCR.id);
    setFilterTab("all");
    setSearchQuery("");
    setStageFilter("all");
    setRequesterFilter("all");
    setNewCRSuccess(true);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ProjectSidebarNav projectId={project.id} activeTab="change-requests" />

      <main ref={scrollRef} className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5">
        <HeaderBar
          leftSlot={
            <ProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Extra Work & Variation Orders"
            />
          }
        />

        {/* ── Toast Notification ── */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── Top Header Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Contract Variation Management
              </span>
              {pendingRequests.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[var(--vt-color-orange-500,#EF5F18)] text-white animate-pulse">
                  {pendingRequests.length} Awaiting Your Decision
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Extra Work & Variation Orders
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 max-w-xl">
              Legally binding adjustments to scope, costs, and timeline. All approved extra work updates the contract ledger and project milestone tranches.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setNewCRSuccess(false);
                setNewCRTitle("");
                setNewCRReason("");
                setIsNewModalOpen(true);
              }}
              className="h-10 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <IconPlus className="w-4 h-4" />
              <span>Propose Extra Work</span>
            </button>
          </div>
        </section>

        {/* ── Financial Ledger Cards ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
              Original Contract
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
              {formatNaira(originalContractValue)}
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              Baseline agreed sum
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
              Approved Variations
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5 block">
              +{formatNaira(totalApproved)}
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              {approvedRequests.length} variation orders locked
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
              Revised Total Contract
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5 block">
              {formatNaira(revisedContractValue)}
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              Current binding financial commitment
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
              Schedule Extension
            </span>
            <span className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
              +{totalApprovedDays} Days
            </span>
            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
              {pendingRequests.length} pending review
            </span>
          </div>
        </section>

        {/* ── Search & Filter Toolbar with VantagedSelect Dropdowns ── */}
        <section className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between font-sans">
          {/* Left: Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--vt-color-neutral-400,#A3A0B8)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search works by title, code, contractor, or stage..."
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-text-default,#261A66)] placeholder:text-[var(--vt-color-neutral-400,#A3A0B8)] focus:outline-none focus:bg-white focus:border-[var(--vt-color-indigo-900,#261A66)] transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-neutral-700,#443F66)] cursor-pointer"
                title="Clear search"
              >
                <IconClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Filter Dropdowns using VantagedSelect */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
            {/* Status Dropdown */}
            <VantagedSelect
              value={filterTab}
              onChange={(val) => setFilterTab(val as any)}
              containerClassName="w-full sm:w-auto min-w-[175px]"
              className="h-10 px-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
              options={[
                { value: "all", label: `All Statuses (${changeRequests.length})` },
                { value: "pending", label: `Awaiting Decision (${pendingRequests.length})` },
                { value: "contractor", label: `Contractor Review (${contractorReviewRequests.length})` },
                { value: "approved", label: `Approved (${approvedRequests.length})` },
                { value: "declined", label: `Declined (${declinedRequests.length})` },
              ]}
            />

            {/* Stage Dropdown */}
            <VantagedSelect
              value={stageFilter}
              onChange={(val) => setStageFilter(val)}
              containerClassName="w-full sm:w-auto min-w-[175px]"
              className="h-10 px-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
              options={[
                { value: "all", label: "All Project Stages" },
                ...project.stages.map((stg) => ({
                  value: stg.title,
                  label: stg.title,
                })),
              ]}
            />

            {/* Requester Dropdown */}
            <VantagedSelect
              value={requesterFilter}
              onChange={(val) => setRequesterFilter(val as any)}
              containerClassName="w-full sm:w-auto min-w-[145px]"
              className="h-10 px-3.5 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
              options={[
                { value: "all", label: "All Requesters" },
                { value: "Owner", label: "By Owner" },
                { value: "Contractor", label: "By Contractor" },
              ]}
            />

            {/* Reset Button */}
            {(searchQuery || stageFilter !== "all" || filterTab !== "all" || requesterFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStageFilter("all");
                  setFilterTab("all");
                  setRequesterFilter("all");
                }}
                className="h-10 px-3 rounded-xl text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-100,#FEDDC7)] border border-[var(--vt-color-orange-200,#FDCAA9)] transition-colors cursor-pointer whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </section>

        {/* ── Main Master-Detail Grid ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8">
          {/* Left Column: Requests Cards List */}
          <div className="flex flex-col gap-3">
            {displayedCRs.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] text-center text-xs text-[var(--vt-color-neutral-500,#7C7894)] flex flex-col items-center justify-center gap-2">
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] text-sm">
                  No requests match this filter
                </span>
                <p className="text-[11px] max-w-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Try adjusting your search query, status dropdown, or stage selection.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterTab("all");
                    setSearchQuery("");
                    setStageFilter("all");
                    setRequesterFilter("all");
                  }}
                  className="mt-1 px-3.5 py-2 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold hover:bg-[var(--vt-color-orange-100,#FEDDC7)] cursor-pointer transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              displayedCRs.map((cr) => {
                const isSelected = selectedCR?.id === cr.id;
                return (
                  <div
                    key={cr.id}
                    onClick={() => setSelectedCRId(cr.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col gap-2.5 ${
                      isSelected
                        ? "bg-white border-[var(--vt-color-orange-500,#EF5F18)] ring-2 ring-[var(--vt-color-orange-400,#FA8747)]/20 shadow-md"
                        : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)] bg-[var(--vt-color-neutral-100,#EFEEF5)] px-2 py-0.5 rounded-md">
                        {cr.requestCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cr.status === "Approved"
                            ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                            : cr.status === "Declined"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : cr.status === "Awaiting Contractor Assessment"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] animate-pulse"
                        }`}
                      >
                        {cr.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-[var(--vt-color-indigo-900,#261A66)] line-clamp-2 leading-snug">
                        {cr.title}
                      </h4>
                      {cr.affectedStage && (
                        <p className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)] font-medium mt-1 truncate">
                          {cr.affectedStage}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between text-[11px]">
                      <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-medium truncate max-w-[130px]">
                        From: {cr.requestedBy}
                      </span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-[var(--vt-color-orange-600,#D84C0B)]">+{formatNaira(cr.costImpact)}</span>
                        <span className="text-[var(--vt-color-neutral-300,#CBC8DA)]">•</span>
                        <span className="text-[var(--vt-color-neutral-500,#7C7894)]">+{cr.timeExtensionDays}d</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right 2 Columns: Selected Variation Order Dossier */}
          {selectedCR ? (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
              {/* Top Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[var(--vt-color-border-default,#E2E0EC)] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)] bg-[var(--vt-color-neutral-100,#EFEEF5)] px-2.5 py-0.5 rounded-md">
                      {selectedCR.requestCode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                        selectedCR.status === "Approved"
                          ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)]"
                          : selectedCR.status === "Declined"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : selectedCR.status === "Awaiting Contractor Assessment"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]"
                      }`}
                    >
                      {selectedCR.status}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    {selectedCR.title}
                  </h2>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                    Requested by <strong>{selectedCR.requesterName}</strong> • {selectedCR.date}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 bg-[var(--vt-color-neutral-50,#F7F7FA)] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-xl sm:text-2xl font-black text-[var(--vt-color-orange-600,#D84C0B)]">
                    +{formatNaira(selectedCR.costImpact)}
                  </span>
                  <span className="text-xs font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                    +{selectedCR.timeExtensionDays} Calendar Days Added
                  </span>
                </div>
              </div>

              {/* Four Metric Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Scope Category
                  </span>
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block truncate">
                    {selectedCR.affectedStage || "Project Site Work"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Initiated By
                  </span>
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block truncate">
                    {selectedCR.requestedBy === "Owner" ? "Owner Specification" : "Contractor Field Lead"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Funding Status
                  </span>
                  <span className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5 block truncate">
                    {selectedCR.status === "Approved" ? "Escrow Guaranteed" : "Pending Authorization"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Agreement Sheet
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsVOPrintModalOpen(true)}
                    className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5 block underline cursor-pointer text-left"
                  >
                    View VO Form →
                  </button>
                </div>
              </div>

              {/* Reason & Technical Justification */}
              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider mb-1.5">
                  Specification & Technical Justification:
                </h4>
                <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-700,#46425F)] leading-relaxed flex flex-col gap-2">
                  <p>{selectedCR.reason}</p>
                  {selectedCR.contractorAssessmentNote && (
                    <div className="p-2.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[11.5px] text-[var(--vt-color-indigo-900,#261A66)]">
                      <strong className="text-[var(--vt-color-orange-700,#B33C08)]">Site Engineer Note: </strong>
                      {selectedCR.contractorAssessmentNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Itemized Materials & Labor Schedule */}
              <div>
                <h4 className="text-xs font-bold text-[var(--vt-color-neutral-500,#7C7894)] uppercase tracking-wider mb-2">
                  Bill of Quantities & Itemized Breakdown:
                </h4>
                <div className="rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[var(--vt-color-neutral-50,#F7F7FA)] border-b border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                        <th className="py-2.5 px-3.5">Scope Item & Description</th>
                        <th className="py-2.5 px-3.5 text-right">Cost (₦)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
                      {(selectedCR.breakdown || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60">
                          <td className="py-2.5 px-3.5 font-medium text-[var(--vt-color-indigo-900,#261A66)]">
                            {item.item}
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                            {formatNaira(item.cost)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[var(--vt-color-neutral-50,#F7F7FA)] font-black border-t-2 border-[var(--vt-color-border-default,#E2E0EC)]">
                        <td className="py-2.5 px-3.5 text-[var(--vt-color-indigo-900,#261A66)]">Total Variation Cost</td>
                        <td className="py-2.5 px-3.5 text-right text-sm text-[var(--vt-color-orange-600,#D84C0B)]">
                          {formatNaira(selectedCR.costImpact)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Specific Action Cards */}
              {selectedCR.status === "Waiting for Your Approval" ? (
                <div className="p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
                  <div>
                    <span className="text-xs font-black text-[var(--vt-color-orange-950,#421202)] block">
                      Contractor Submitted for Your Decision
                    </span>
                    <span className="text-[11px] text-[var(--vt-color-orange-800,#8F320D)]">
                      Review the quote above. Approving will authorize the builder to procure materials and add +{selectedCR.timeExtensionDays} days to the schedule.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsDeclineModalOpen(true)}
                      className="h-9 px-3.5 rounded-md bg-white border border-rose-300 hover:bg-rose-50 text-xs font-bold text-rose-700 cursor-pointer transition-colors shadow-2xs"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsApproveModalOpen(true)}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-all inline-flex items-center gap-1.5"
                    >
                      <IconCheck className="w-4 h-4" />
                      <span>Approve Variation Order</span>
                    </button>
                  </div>
                </div>
              ) : selectedCR.status === "Awaiting Contractor Assessment" ? (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs">
                  <div>
                    <span className="font-black text-indigo-950 block">
                      Transmitted to Contractor for Pricing
                    </span>
                    <span className="text-[11px] text-indigo-700">
                      The site lead is calculating material quantities, subcontractor labor rates, and time impact.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSimulateContractorAssessment(selectedCR.id)}
                    className="h-9 px-4 rounded-md bg-indigo-700 hover:bg-indigo-800 text-white font-bold cursor-pointer transition-colors shadow-2xs self-start sm:self-auto shrink-0"
                  >
                    Simulate Contractor Quote Received →
                  </button>
                </div>
              ) : selectedCR.status === "Approved" ? (
                <div className="p-4 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--vt-color-green-900,#0F331E)] shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-green-600,#248246)] text-white flex items-center justify-center shrink-0">
                      <IconShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black block">
                        Variation Order Authorized & Binding
                      </span>
                      <span className="text-[11px] text-[var(--vt-color-green-800,#17512F)]">
                        Approved {selectedCR.approvedDate || "recently"}. Escrow guaranteed. Time extension added to project calendar.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVOPrintModalOpen(true)}
                    className="h-8 px-3 rounded-md bg-white border border-[var(--vt-color-green-300,#81C792)] hover:bg-[var(--vt-color-green-100,#D5F0DC)] text-xs font-bold text-[var(--vt-color-green-800,#17512F)] cursor-pointer shadow-2xs inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <IconPrinter className="w-3.5 h-3.5" />
                    <span>Print VO Form</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                  <span className="font-black block mb-0.5">Variation Order Declined</span>
                  <p className="text-[11.5px] leading-relaxed">
                    <strong>Reason recorded:</strong> {selectedCR.declineReason || "Owner declined this request without modification."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="lg:col-span-2 p-12 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-center text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Select a request from the list to view its complete variation order details.
            </div>
          )}
        </section>
      </main>

      {/* ── APPROVE VARIATION ORDER CONFIRMATION MODAL ── */}
      {isApproveModalOpen && selectedCR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    Authorize Variation Order
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Ref: {selectedCR.requestCode}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Variation Item</span>
                  <span className="text-[var(--vt-color-indigo-900,#261A66)] text-right truncate max-w-[200px]">
                    {selectedCR.title}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Additional Cost</span>
                  <span className="text-[var(--vt-color-orange-600,#D84C0B)] font-black text-sm">
                    +{formatNaira(selectedCR.costImpact)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[var(--vt-color-neutral-500,#7C7894)]">Schedule Impact</span>
                  <span className="text-[var(--vt-color-indigo-900,#261A66)]">
                    +{selectedCR.timeExtensionDays} Calendar Days
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold border-t border-[var(--vt-color-border-default,#E2E0EC)] pt-2 mt-1">
                  <span className="text-[var(--vt-color-indigo-900,#261A66)] font-extrabold">New Revised Project Total</span>
                  <span className="text-[var(--vt-color-green-700,#1F6B3E)] font-black text-sm">
                    {formatNaira(revisedContractValue + (selectedCR.status !== "Approved" ? selectedCR.costImpact : 0))}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Escrow Note:</strong> Upon approval, this sum is reserved in the contract variation register. Payment releases to the builder only after your client rep inspects and confirms the extra work.
              </div>

              <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[var(--vt-color-orange-500,#EF5F18)] focus:ring-[var(--vt-color-orange-500,#EF5F18)]"
                />
                <span className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  I authorize this variation order and acknowledge the adjusted completion dates.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsApproveModalOpen(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!agreeTerms}
                onClick={handleConfirmApprove}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer shadow-2xs transition-all inline-flex items-center gap-1.5"
              >
                <IconCheck className="w-4 h-4" />
                <span>Confirm & Authorize VO</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DECLINE VARIATION ORDER MODAL ── */}
      {isDeclineModalOpen && selectedCR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
              <div>
                <h3 className="text-base font-black text-rose-800">
                  Decline Variation Order
                </h3>
                <span className="text-[10px] font-mono font-bold text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Ref: {selectedCR.requestCode} • {selectedCR.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <label className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                Reason for Rejection / Comments to Builder
              </label>
              <textarea
                rows={3}
                required
                value={declineReasonInput}
                onChange={(e) => setDeclineReasonInput(e.target.value)}
                placeholder="E.g., Cost quote exceeds our budget ceiling; please proceed with original approved drawing specs."
                className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10.5px] text-[var(--vt-color-neutral-400,#A3A0B8)]">
                The contractor will be notified to halt this variation and continue with previously approved project drawings.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="h-9 px-4 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FORMAL VARIATION ORDER PRINT / VIEW MODAL ── */}
      {isVOPrintModalOpen && selectedCR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vt-color-orange-300,#FBA674)] font-bold">
                  Official Contract Variation Sheet
                </span>
                <h3 className="text-base font-black text-white">
                  Variation Order Form ({selectedCR.requestCode})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <IconPrinter className="w-3.5 h-3.5" />
                  <span>Print VO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVOPrintModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs font-sans">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Project Job Code
                  </span>
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
                    {project.jobId}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Site Location
                  </span>
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block truncate">
                    {project.location}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Contractor
                  </span>
                  <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block truncate">
                    {project.contractor.name}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10.5px] uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                  1. Scope Title & Narrative
                </span>
                <p className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] leading-relaxed font-medium">
                  <strong>{selectedCR.title}:</strong> {selectedCR.reason}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] uppercase font-bold text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                  2. Cost Schedule & Bill of Quantities
                </span>
                <div className="rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[var(--vt-color-neutral-50,#F7F7FA)] border-b border-[var(--vt-color-border-default,#E2E0EC)] text-[10px] font-bold uppercase text-[var(--vt-color-neutral-500,#7C7894)]">
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3 text-right">Sum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--vt-color-neutral-100,#EFEEF5)]">
                      {(selectedCR.breakdown || []).map((b, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 text-[var(--vt-color-indigo-900,#261A66)]">{b.item}</td>
                          <td className="py-2 px-3 text-right font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                            {formatNaira(b.cost)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[var(--vt-color-neutral-50,#F7F7FA)] font-black">
                        <td className="py-2 px-3">Total Variation Amount</td>
                        <td className="py-2 px-3 text-right text-[var(--vt-color-orange-600,#D84C0B)]">
                          +{formatNaira(selectedCR.costImpact)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Execution Sign-Off
                  </span>
                  <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
                    COREN Verified Site Telemetry Active
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Status
                  </span>
                  <span className="font-bold text-[var(--vt-color-green-700,#1F6B3E)]">
                    {selectedCR.status === "Approved" ? "Authorized & Sealed" : selectedCR.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end font-sans">
              <button
                type="button"
                onClick={() => setIsVOPrintModalOpen(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROPOSE EXTRA WORK MODAL ── */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4 font-sans">
            {!newCRSuccess ? (
              <form onSubmit={handleCreateCR} className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-3 border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div>
                    <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">Propose Extra Work</h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">{project.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="w-8 h-8 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-neutral-200,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                      What work or materials would you like to add? *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCRTitle}
                      onChange={(e) => setNewCRTitle(e.target.value)}
                      placeholder="e.g. Upgrade master bathroom to Italian Calacatta marble"
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                      Associated Construction Stage *
                    </label>
                    <VantagedSelect
                      value={newCRAffectedStage}
                      onChange={(val) => setNewCRAffectedStage(val)}
                      className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold"
                      options={[
                        ...project.stages.map((stg) => ({
                          value: stg.title,
                          label: stg.title,
                        })),
                        { value: "General Site & Finishes", label: "General Site & Finishes" },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                        Target Budget Ceiling (₦) *
                      </label>
                      <input
                        type="number"
                        min={50000}
                        step={50000}
                        required
                        value={newCRCost}
                        onChange={(e) => setNewCRCost(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                        Timeline Flexibility (Days)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={60}
                        required
                        value={newCRDays}
                        onChange={(e) => setNewCRDays(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] font-bold focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] block mb-1">
                      Specifications & Details *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newCRReason}
                      onChange={(e) => setNewCRReason(e.target.value)}
                      placeholder="Specify material grades, brand, thickness, or contractor installation details..."
                      className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
                  >
                    Transmit to Contractor
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-600,#248246)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center">
                  <IconCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                  Variation Order Transmitted
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                  Your proposed change has been transmitted to your project contractor for quantity surveying and pricing. You will be notified when their formal quotation is ready for your review.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNewCRSuccess(false);
                    setIsNewModalOpen(false);
                    setNewCRTitle("");
                    setNewCRReason("");
                  }}
                  className="mt-2 h-9 px-5 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-950,#191147)] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  View in Variation Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
