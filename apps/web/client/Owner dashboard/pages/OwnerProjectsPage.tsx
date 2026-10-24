"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { ProjectFolderCard, ProjectItem } from "../components/ProjectFolderCard";
import { DraggableChatWindow } from "../components/DraggableChatWindow";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { VantagedSelect } from "../components/VantagedSelect";

import {
  INITIAL_ACTIVE_PROJECTS as ACTIVE_PROJECTS,
  INITIAL_CONTRACT_HISTORY as CONTRACT_HISTORY,
  INITIAL_PROPOSED_PLANS as PROPOSED_PLANS,
  getActiveProjects,
  getContractHistory,
  getProposedPlans,
} from "./projects dashboard/projectStore";

export { ACTIVE_PROJECTS, CONTRACT_HISTORY, PROPOSED_PLANS };

export function OwnerProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const searchParam = searchParams?.get("search");
  const scrollRef = useScrollRestoration<HTMLElement>("owner_projects");

  // 3-Way View Switch State: 'active' | 'plans' | 'history'
  const [viewMode, setViewMode] = useState<"active" | "plans" | "history">("active");

  useEffect(() => {
    if (tabParam === "history" || tabParam === "plans" || tabParam === "active") {
      setViewMode(tabParam);
    }
  }, [tabParam]);

  // Selected project ID for interactive click-on folder transition
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Enhanced Filter & Sort state
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterContractor, setFilterContractor] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "progress-desc" | "progress-asc" | "budget-desc" | "budget-asc" | "name-asc">("recent");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Synchronized lists for Active Projects, Plan & Contract, and Contract History
  const [activeProjects, setActiveProjects] = useState<ProjectItem[]>(() => getActiveProjects());
  const [proposedPlans, setProposedPlans] = useState<ProjectItem[]>(() => getProposedPlans());
  const [contractHistory, setContractHistory] = useState<ProjectItem[]>(() => getContractHistory());

  useEffect(() => {
    const syncAll = () => {
      setActiveProjects(getActiveProjects());
      setProposedPlans(getProposedPlans());
      setContractHistory(getContractHistory());
    };

    syncAll();
    window.addEventListener("vantaged_storage_update", syncAll);
    window.addEventListener("storage", syncAll);
    return () => {
      window.removeEventListener("vantaged_storage_update", syncAll);
      window.removeEventListener("storage", syncAll);
    };
  }, []);

  // Active list based on 3-way switch
  const currentList =
    viewMode === "active"
      ? activeProjects
      : viewMode === "plans"
      ? proposedPlans
      : contractHistory;

  // Dynamically derived unique contractor names for the current list
  const availableContractors = useMemo(() => {
    return Array.from(new Set(currentList.map((p) => p.contractor.name))).sort();
  }, [currentList]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setFilterCategory("all");
    setFilterContractor("all");
    setFilterStage("all");
    setSortBy("recent");
  };

  // Switch between Active, Plans, and History
  const handleViewModeChange = (mode: "active" | "plans" | "history") => {
    setViewMode(mode);
    setSelectedProjectId(null); // reset selected card
    setFilterContractor("all"); // reset contractor filter since lists differ
    setFilterStage("all");
  };

  // Filtered & Sorted Projects
  const filteredAndSortedProjects = useMemo(() => {
    let list = [...currentList];

    // 0. Filter Search Query if present in URL
    if (searchParam) {
      const q = searchParam.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.contractor.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // 1. Filter Category
    if (filterCategory !== "all") {
      list = list.filter((p) => p.category.toLowerCase() === filterCategory.toLowerCase());
    }

    // 2. Filter Contractor
    if (filterContractor !== "all") {
      list = list.filter((p) => p.contractor.name === filterContractor);
    }

    // 3. Filter Stage (for active projects)
    if (filterStage !== "all") {
      if (filterStage === "early") {
        list = list.filter((p) => p.progressPercent < 30);
      } else if (filterStage === "mid") {
        list = list.filter((p) => p.progressPercent >= 30 && p.progressPercent <= 70);
      } else if (filterStage === "finishing") {
        list = list.filter((p) => p.progressPercent > 70);
      }
    }

    // 4. Sort
    list.sort((a, b) => {
      if (sortBy === "progress-desc") return b.progressPercent - a.progressPercent;
      if (sortBy === "progress-asc") return a.progressPercent - b.progressPercent;
      if (sortBy === "budget-desc" || sortBy === "budget-asc") {
        const valA = parseFloat(a.escrowAmount.replace(/[^0-9.]/g, ""));
        const valB = parseFloat(b.escrowAmount.replace(/[^0-9.]/g, ""));
        return sortBy === "budget-desc" ? valB - valA : valA - valB;
      }
      if (sortBy === "name-asc") {
        return a.title.localeCompare(b.title);
      }
      return 0; // default order ('recent')
    });

    return list;
  }, [currentList, filterCategory, filterContractor, filterStage, sortBy]);

  // Active filter count (excluding default values)
  const activeFilterCount =
    (filterCategory !== "all" ? 1 : 0) +
    (filterContractor !== "all" ? 1 : 0) +
    (filterStage !== "all" ? 1 : 0) +
    (sortBy !== "recent" ? 1 : 0);

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Decorative vector background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path
            d="M-100 200 C 300 100, 600 450, 1500 100"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M-50 750 C 400 650, 800 850, 1550 650"
            stroke="var(--vt-color-neutral-300,#CBC8DA)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="1380" cy="550" r="4" fill="var(--vt-color-orange-500,#EF5F18)" fillOpacity="0.6" />
        </svg>
      </div>

      {/* ── Left Sidebar Navigation (Kept untouched) ── */}
      <SidebarNav currentActiveItem="projects" />

      {/* ── Main Workspace ── */}
      <main
        ref={scrollRef}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5"
      >
        {/* Top Header Navigation Bar with Left Slot Back Arrow (Aligned with Search bar; hidden on dashboard) */}
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

        {/* ── Title & Right Controls (Title on left; 3-Way Switch & Filter on right) ── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          {/* Large Title: Dynamic based on 3-way switch with stable dimensions */}
          <div className="min-w-0">
            <h1
              style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
              className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight whitespace-nowrap"
            >
              {viewMode === "active"
                ? "Active Projects"
                : viewMode === "plans"
                ? "Plan & Contract"
                : "Contract History"}
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate sm:whitespace-normal">
              {viewMode === "active"
                ? "Live building sites and ongoing milestone construction."
                : viewMode === "plans"
                ? "Milestone plans and payment terms awaiting your agreement."
                : "Finished projects and handed-over buildings."}
            </p>
          </div>

          {/* Right Group: 3-Way Switch (left of filter) + Add Building + Filter Button */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto flex-wrap sm:flex-nowrap">
            {/* 3-Way Segmented Switch: 'Active projects' | 'Plan & contract' | 'Contract history' */}
            <div className="h-9 p-0.5 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-lg flex items-center shadow-2xs shrink-0 font-sans">
              <button
                type="button"
                onClick={() => handleViewModeChange("active")}
                style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                className={`h-full px-3 sm:px-3.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  viewMode === "active"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Active projects</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    viewMode === "active"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                  }`}
                >
                  {activeProjects.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("plans")}
                style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                className={`h-full px-3 sm:px-3.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  viewMode === "plans"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Plan & contract</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    viewMode === "plans"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-orange-100,#FFE6D5)] text-[var(--vt-color-orange-800,#8F320D)]"
                  }`}
                >
                  {proposedPlans.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("history")}
                style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                className={`h-full px-3 sm:px-3.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  viewMode === "history"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Contract history</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    viewMode === "history"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                  }`}
                >
                  {contractHistory.length}
                </span>
              </button>
            </div>

            {/* Add Building Button -> Links to Find Companies Page to Send Brief / Request */}
            <Link
              href="/owner/find-companies"
              title="Find a verified construction company to start a new building project"
              style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
              className="h-9 px-3.5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Building</span>
            </Link>

            {/* Comprehensive Filter Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                className={`h-9 px-3.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  activeFilterCount > 0
                    ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-400,#F78241)] text-[var(--vt-color-orange-700,#B33C08)] font-bold shadow-xs"
                    : "bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${
                    activeFilterCount > 0
                      ? "text-[var(--vt-color-orange-600,#D84C0B)]"
                      : "text-[var(--vt-color-neutral-500,#7C7894)]"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Comprehensive Filter Modal / Popover */}
              {isFilterMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/5"
                    onClick={() => setIsFilterMenuOpen(false)}
                  />
                  <div
                    style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                    className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs flex flex-col gap-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        <h3 className="font-extrabold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                          Filter & Sort
                        </h3>
                      </div>
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] hover:underline cursor-pointer"
                        >
                          Reset all
                        </button>
                      )}
                    </div>

                    {/* 1. Category / Asset Type */}
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        Project Category
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: "all", label: "All Types" },
                          { id: "Residential", label: "Residential" },
                          { id: "Commercial", label: "Commercial" },
                          { id: "Waterfront", label: "Waterfront" },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFilterCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              filterCategory === cat.id
                                ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs font-bold"
                                : "bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#46425F)] border border-[var(--vt-color-border-default,#E2E0EC)]"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Contractor Select */}
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        Contractor / Partner
                      </span>
                      <VantagedSelect
                        value={filterContractor}
                        onChange={(val) => setFilterContractor(val)}
                        options={[
                          { value: "all", label: `All Contractors (${availableContractors.length})` },
                          ...availableContractors.map((c) => ({ value: c, label: c })),
                        ]}
                      />
                    </div>

                    {/* 3. Stage Progress (Only active projects) */}
                    {viewMode === "active" && (
                      <div className="flex flex-col gap-2">
                        <span className="font-bold text-[10.5px] uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          Construction Stage
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: "all", label: "All Stages" },
                            { id: "early", label: "Early (< 30%)" },
                            { id: "mid", label: "Mid-Stage (30-70%)" },
                            { id: "finishing", label: "Finishing (> 70%)" },
                          ].map((stg) => (
                            <button
                              key={stg.id}
                              type="button"
                              onClick={() => setFilterStage(stg.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                                filterStage === stg.id
                                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs font-bold"
                                  : "bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#46425F)] border border-[var(--vt-color-border-default,#E2E0EC)]"
                              }`}
                            >
                              {stg.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Sort By */}
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        Sort Order
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "recent", label: "Recently Updated" },
                          { id: "progress-desc", label: "Progress (High-Low)" },
                          { id: "budget-desc", label: "Budget (Highest)" },
                          { id: "name-asc", label: "Name (A to Z)" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSortBy(s.id as any)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer truncate ${
                              sortBy === s.id
                                ? "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-300,#FBA674)] font-bold"
                                : "bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#46425F)] border border-[var(--vt-color-border-default,#E2E0EC)]"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[var(--vt-color-neutral-500,#7C7894)]">
                        Showing <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{filteredAndSortedProjects.length}</strong> of {currentList.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsFilterMenuOpen(false)}
                        className="px-4 py-1.5 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-800,#352488)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Active Filters Pill Bar (Allows quick dismissal of any applied filter) ── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5 animate-in fade-in duration-150">
            <span className="text-[10.5px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase tracking-wider">
              Active:
            </span>

            {filterCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-semibold shadow-2xs">
                <span>Category: {filterCategory}</span>
                <button
                  type="button"
                  onClick={() => setFilterCategory("all")}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[var(--vt-color-orange-100,#FFE6D5)] flex items-center justify-center cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              </span>
            )}

            {filterContractor !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-semibold shadow-2xs">
                <span>Contractor: {filterContractor}</span>
                <button
                  type="button"
                  onClick={() => setFilterContractor("all")}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[var(--vt-color-orange-100,#FFE6D5)] flex items-center justify-center cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              </span>
            )}

            {filterStage !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-semibold shadow-2xs">
                <span>
                  Stage:{" "}
                  {filterStage === "early"
                    ? "Early (<30%)"
                    : filterStage === "mid"
                    ? "Mid-Stage (30-70%)"
                    : "Finishing (>70%)"}
                </span>
                <button
                  type="button"
                  onClick={() => setFilterStage("all")}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[var(--vt-color-orange-100,#FFE6D5)] flex items-center justify-center cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              </span>
            )}

            {sortBy !== "recent" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-semibold shadow-2xs">
                <span>
                  Sort:{" "}
                  {sortBy === "progress-desc"
                    ? "Progress (High-Low)"
                    : sortBy === "budget-desc"
                    ? "Budget (Highest)"
                    : "Name (A-Z)"}
                </span>
                <button
                  type="button"
                  onClick={() => setSortBy("recent")}
                  className="w-3.5 h-3.5 rounded-full hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-center cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:text-[var(--vt-color-orange-700,#B33C08)] hover:underline ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── 3x2 Folder Cards Grid: Interactive Click Transition + All Orange for Active, All White for Contract History ── */}
        <section className="w-full pb-8">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)]">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="10" y1="11" x2="14" y2="15" />
                  <line x1="14" y1="11" x2="10" y2="15" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                No projects match your filter criteria
              </h3>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm mt-1">
                Try selecting different categories, contractors, or stages to view projects.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
              {filteredAndSortedProjects.map((project) => (
                <ProjectFolderCard
                  key={project.id}
                  project={project}
                  variant={viewMode === "active" ? "orange" : "white"}
                  isSelected={selectedProjectId === project.id}
                  onSelect={(p) => {
                    setSelectedProjectId(p.id);
                    if (viewMode === "plans") {
                      router.push(`/owner/projects/${p.id}/plan`);
                    } else {
                      router.push(`/owner/projects/${p.id}`);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Floating Draggable WhatsApp Contractor Chat Window ── */}
      <DraggableChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        projectName={activeProjects[0]?.title || "Lekki Luxury Villa"}
      />
    </div>
  );
}
