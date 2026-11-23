"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import {
  ProjectFolderCard,
  ProjectItem,
} from "../../../client/Owner dashboard/components/ProjectFolderCard";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { useContractorUser } from "../hooks/useContractorUser";
import { readLocalData } from "../utils/localPersistence";
import {
  CompanySentOwnerRequest,
  pushOwnerLiveNotification,
  readCompanySentRequests,
  saveCompanySentRequests,
} from "../../../shared/vantagedSyncBridge";
import {
  DEMO_DIRECTOR_ACTIVE_FOLDER_PROJECTS,
  DEMO_DIRECTOR_HISTORY_FOLDER_PROJECTS,
  DEMO_DIRECTOR_PROJECTS,
} from "../data/directorData";

const DEFAULT_PLAN_MAP: Record<string, { name: string; slots: number }> = {
  "contractor-starter": { name: "Starter Contractor", slots: 1 },
  "contractor-verified": { name: "Verified Builder", slots: 3 },
  "contractor-prime": { name: "Prime Consortium", slots: 8 },
};

function normalizePlanId(raw: string): string {
  if (raw === "starter" || raw === "contractor-starter") return "contractor-starter";
  if (raw === "enterprise" || raw === "contractor-prime") return "contractor-prime";
  return "contractor-verified";
}

const STORAGE_KEY_ACCEPTED_PROJECTS = "vantaged_company_accepted_projects";

export function DirectorProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const searchParam = searchParams?.get("search");
  const scrollRef = useScrollRestoration<HTMLElement>("director_projects");

  const [viewMode, setViewMode] = useState<"active" | "history">("active");
  const [acceptedProjects, setAcceptedProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    if (tabParam === "history" || tabParam === "active") {
      setViewMode(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const syncAccepted = () => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem(STORAGE_KEY_ACCEPTED_PROJECTS);
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) setAcceptedProjects(parsed);
      } catch {
        setAcceptedProjects([]);
      }
    };
    syncAccepted();
    window.addEventListener("vantaged_company_projects_update", syncAccepted);
    window.addEventListener("storage", syncAccepted);
    return () => {
      window.removeEventListener("vantaged_company_projects_update", syncAccepted);
      window.removeEventListener("storage", syncAccepted);
    };
  }, []);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [inspectProject, setInspectProject] = useState<ProjectItem | null>(null);
  const [isSendRequestOpen, setIsSendRequestOpen] = useState(false);
  const [ownerIdentifier, setOwnerIdentifier] = useState("");
  const [reqTitle, setReqTitle] = useState("");
  const [reqLocation, setReqLocation] = useState("");
  const [reqCategory, setReqCategory] = useState("Residential");
  const [reqBudget, setReqBudget] = useState("");
  const [reqNotes, setReqNotes] = useState("");
  const [reqError, setReqError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "recent" | "progress-desc" | "progress-asc" | "budget-desc" | "budget-asc" | "name-asc"
  >("recent");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const { isDemoMode } = useDirectorDemoMode();
  const contractorUser = useContractorUser();

  const activeProjects = useMemo(
    () =>
      isDemoMode
        ? [...acceptedProjects, ...DEMO_DIRECTOR_ACTIVE_FOLDER_PROJECTS]
        : acceptedProjects,
    [isDemoMode, acceptedProjects]
  );
  const contractHistory = useMemo(
    () => (isDemoMode ? DEMO_DIRECTOR_HISTORY_FOLDER_PROJECTS : []),
    [isDemoMode]
  );

  const currentList = viewMode === "active" ? activeProjects : contractHistory;

  const availableClients = useMemo(() => {
    return Array.from(new Set(currentList.map((p) => p.contractor.name))).sort();
  }, [currentList]);

  const handleResetFilters = () => {
    setFilterCategory("all");
    setFilterClient("all");
    setFilterStage("all");
    setSortBy("recent");
  };

  const handleViewModeChange = (mode: "active" | "history") => {
    setViewMode(mode);
    setSelectedProjectId(null);
    setFilterClient("all");
    setFilterStage("all");
  };

  const filteredAndSortedProjects = useMemo(() => {
    let list = [...currentList];

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

    if (filterCategory !== "all") {
      list = list.filter((p) => p.category.toLowerCase() === filterCategory.toLowerCase());
    }

    if (filterClient !== "all") {
      list = list.filter((p) => p.contractor.name === filterClient);
    }

    if (filterStage !== "all") {
      if (filterStage === "early") {
        list = list.filter((p) => p.progressPercent < 30);
      } else if (filterStage === "mid") {
        list = list.filter((p) => p.progressPercent >= 30 && p.progressPercent <= 70);
      } else if (filterStage === "finishing") {
        list = list.filter((p) => p.progressPercent > 70);
      }
    }

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
      return 0;
    });

    return list;
  }, [currentList, searchParam, filterCategory, filterClient, filterStage, sortBy]);

  const activeFilterCount =
    (filterCategory !== "all" ? 1 : 0) +
    (filterClient !== "all" ? 1 : 0) +
    (filterStage !== "all" ? 1 : 0) +
    (sortBy !== "recent" ? 1 : 0);

  const [planMap, setPlanMap] = useState<Record<string, { name: string; slots: number }>>(DEFAULT_PLAN_MAP);
  const [planId, setPlanId] = useState<string>(() =>
    normalizePlanId(readLocalData("vantaged_director_plan_id", "contractor-verified"))
  );
  const [extraSlotsCount, setExtraSlotsCount] = useState<number>(() =>
    readLocalData("vantaged_director_extra_slots", 0)
  );

  useEffect(() => {
    const syncCapacity = () => {
      setPlanId(normalizePlanId(readLocalData("vantaged_director_plan_id", "contractor-verified")));
      setExtraSlotsCount(Math.max(0, Number(readLocalData("vantaged_director_extra_slots", 0)) || 0));
    };
    syncCapacity();
    window.addEventListener("storage", syncCapacity);
    window.addEventListener("focus", syncCapacity);
    return () => {
      window.removeEventListener("storage", syncCapacity);
      window.removeEventListener("focus", syncCapacity);
    };
  }, []);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const tiers = data?.roles?.contractor?.tiers;
        if (!Array.isArray(tiers)) return;
        const next: Record<string, { name: string; slots: number }> = { ...DEFAULT_PLAN_MAP };
        for (const t of tiers) {
          if (t?.id && typeof t.capacitySlots === "number") {
            next[t.id] = { name: t.name || t.id, slots: t.capacitySlots };
          }
        }
        setPlanMap(next);
      })
      .catch(() => {});
  }, []);

  const activePlanInfo = planMap[planId] ?? DEFAULT_PLAN_MAP["contractor-verified"];
  const totalCompanySlots = activePlanInfo.slots + extraSlotsCount;
  const canAddProject = activeProjects.length < totalCompanySlots;

  const inspectMeta = useMemo(() => {
    if (!inspectProject) return null;
    return DEMO_DIRECTOR_PROJECTS.find((p) => p.id === inspectProject.id) ?? null;
  }, [inspectProject]);

  const validateOwnerIdentifier = (val: string): "email" | "phone" | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (isEmail) return "email";
    const digitsOnly = trimmed.replace(/[\s\-()+]/g, "");
    const isPhone = /^\d{7,15}$/.test(digitsOnly) && /^[+\d\s\-()]+$/.test(trimmed);
    if (isPhone) return "phone";
    return null;
  };

  const identifierType = validateOwnerIdentifier(ownerIdentifier);

  const handleSendProjectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddProject) {
      setReqError("All project slots are currently in use. Upgrade your plan or buy extra slots in Settings.");
      return;
    }
    const kind = validateOwnerIdentifier(ownerIdentifier);
    if (!kind) {
      setReqError("Enter a valid owner email address or phone number to send this request.");
      return;
    }
    if (!reqTitle.trim() || !reqLocation.trim() || !reqBudget.trim()) {
      setReqError("Please fill in the project title, site location, and estimated budget.");
      return;
    }

    const existing = readCompanySentRequests();
    const newReq: CompanySentOwnerRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      companyName: contractorUser.companyName,
      directorName: contractorUser.fullName,
      ownerIdentifier: ownerIdentifier.trim(),
      identifierType: kind,
      title: reqTitle.trim(),
      location: reqLocation.trim(),
      category: reqCategory,
      budget: reqBudget.trim(),
      notes: reqNotes.trim(),
      status: "Pending Owner Review",
      emailNoticeSent: true,
      sentAt: new Date().toISOString(),
    };
    saveCompanySentRequests([newReq, ...existing]);

    pushOwnerLiveNotification({
      category: "site",
      projectTitle: newReq.title,
      title: `New Project Request from ${newReq.companyName}`,
      description: `${newReq.companyName} sent a project request for "${newReq.title}" (${newReq.budget}). Vantaged also sent an email alert to ${newReq.ownerIdentifier}.`,
      linkUrl: "/owner/find-companies?tab=incoming",
    });

    setOwnerIdentifier("");
    setReqTitle("");
    setReqLocation("");
    setReqCategory("Residential");
    setReqBudget("");
    setReqNotes("");
    setReqError(null);
    setIsSendRequestOpen(false);
    setToastMessage(
      `Vantaged sent an email alert to ${newReq.ownerIdentifier} and added the request to their dashboard.`
    );
    setTimeout(() => setToastMessage(null), 4200);
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] flex flex-col md:flex-row font-sans text-[var(--vt-color-text-default,#261A66)] select-none relative"
    >
      {/* Decorative vector background lines matching Owner Projects */}
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

      {/* Left Sidebar Navigation */}
      <DirectorSidebarNav currentActiveItem="projects" />

      {/* Main Workspace */}
      <main
        ref={scrollRef}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 pb-24 md:pb-5"
      >
        {/* Top Header Navigation Bar with Back Arrow */}
        <DirectorHeaderBar
          leftSlot={
            <Link
              href="/contractor/dashboard"
              title="Back to Dashboard"
              className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
          }
        />

        {/* Title & Right Controls (3-Way Switch + CTA + Filter) */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
                className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight whitespace-nowrap"
              >
                {viewMode === "active" ? "Active Projects" : "Contract History"}
              </h1>
              {viewMode === "active" && (
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                    !canAddProject
                      ? "bg-amber-50 border-amber-200 text-amber-800"
                      : "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-700,#B33C08)]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      !canAddProject ? "bg-amber-500" : "bg-[var(--vt-color-orange-500,#EF5F18)]"
                    }`}
                  />
                  <span>
                    Capacity: {activeProjects.length} / {totalCompanySlots} Slots ({activePlanInfo.name}
                    {extraSlotsCount > 0 ? ` + ${extraSlotsCount} Extra` : ""})
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 truncate sm:whitespace-normal">
              {viewMode === "active"
                ? "Live construction sites, verified progress, and milestone execution."
                : "Completed builds and handed-over contracts."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap sm:flex-nowrap w-full sm:w-auto">
            {/* 2-Way Segmented Switch */}
            <div className="h-9 p-0.5 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-lg flex items-center shadow-2xs shrink-0 font-sans max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => handleViewModeChange("active")}
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
                onClick={() => handleViewModeChange("history")}
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

            {/* Send Project Request CTA */}
            <button
              type="button"
              onClick={() => {
                setReqError(null);
                setIsSendRequestOpen(true);
              }}
              className="h-9 px-3.5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Send Project Request</span>
            </button>

            {/* Filter Button & Popover */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
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

              {isFilterMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/5"
                    onClick={() => setIsFilterMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--vt-color-orange-500,#EF5F18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        <h3 className="font-extrabold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                          Filter &amp; Sort
                        </h3>
                      </div>
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
                        >
                          Reset all
                        </button>
                      )}
                    </div>

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

                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        Client / Owner
                      </span>
                      <VantagedSelect
                        value={filterClient}
                        onChange={(val) => setFilterClient(val)}
                        options={[
                          { value: "all", label: `All Clients (${availableClients.length})` },
                          ...availableClients.map((c) => ({ value: c, label: c })),
                        ]}
                      />
                    </div>

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

                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        Sort Order
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "recent", label: "Recently Updated" },
                          { id: "progress-desc", label: "Progress (High-Low)" },
                          { id: "budget-desc", label: "Contract Value (High)" },
                          { id: "name-asc", label: "Name (A to Z)" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSortBy(s.id as typeof sortBy)}
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

        {/* Active Filters Pill Bar */}
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
            {filterClient !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-orange-700,#B33C08)] text-xs font-semibold shadow-2xs">
                <span>Client: {filterClient}</span>
                <button
                  type="button"
                  onClick={() => setFilterClient("all")}
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
                    ? "Contract Value (High)"
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
              className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Folder Cards Grid */}
        <section className="w-full pb-8">
          {filteredAndSortedProjects.length === 0 ? (
            activeFilterCount > 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  No projects match your filter criteria
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm mt-1">
                  Try selecting different categories, clients, or stages to view projects.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="w-full py-16 sm:py-20 flex flex-col items-center justify-center text-center bg-white border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 sm:p-12 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="7" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  {viewMode === "active"
                    ? "No Active Building Projects Yet"
                    : "No Past Completed Contracts"}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-1.5 leading-relaxed">
                  {viewMode === "active"
                    ? "Your company does not have any active construction sites yet. Review incoming client requests or prepare a milestone plan to begin."
                    : "Completed buildings and handed-over contracts with structural warranties will be archived here."}
                </p>
                {viewMode === "active" && (
                  <div className="mt-5 flex items-center gap-3">
                    <Link
                      href="/contractor/requests"
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,95,24,0.3)] flex items-center gap-1.5"
                    >
                      <span>View Project Requests</span>
                    </Link>
                  </div>
                )}
              </div>
            )
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
                    router.push(`/contractor/projects/${p.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Project Quick-Inspect Modal when clicking a folder */}
      {inspectProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setInspectProject(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <div className="min-w-0">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
                  {inspectProject.jobId} · {inspectProject.category}
                </span>
                <h3 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  {inspectProject.title}
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                  {inspectProject.location} · {inspectProject.specs}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectProject(null)}
                className="w-8 h-8 rounded-lg text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="text-[10.5px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Client / Owner
                </span>
                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  {inspectProject.contractor.name}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="text-[10.5px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Contract Value
                </span>
                <p className="font-mono font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  {inspectProject.escrowAmount}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  {inspectProject.currentScope}
                </span>
                <span className="font-mono font-extrabold text-[var(--vt-color-orange-700,#B33C08)]">
                  {inspectProject.progressPercent}% Verified
                  {inspectMeta ? ` · ${inspectMeta.reportedPercent}% Reported` : ""}
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[var(--vt-color-orange-200,#FDCAA9)]">
                <div
                  className="h-full bg-[var(--vt-color-orange-500,#EF5F18)] rounded-full"
                  style={{ width: `${inspectProject.progressPercent}%` }}
                />
              </div>
              {inspectMeta?.delayFlag && (
                <p className="text-[11px] font-bold text-rose-700 mt-2">
                  ⚠ {inspectMeta.delayFlag}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setInspectProject(null)}
                className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/contractor/transactions"
                onClick={() => setInspectProject(null)}
                className="h-9 px-4 rounded-lg bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-800,#352488)] text-white text-xs font-bold flex items-center justify-center"
              >
                View Escrow &amp; Receipts
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
          ✓ {toastMessage}
        </div>
      )}

      {/* Send Project Request to Owner Modal */}
      {isSendRequestOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSendProjectRequest}
            className="w-full max-w-lg bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl overflow-hidden text-xs"
          >
            <div className="px-6 py-4 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/30 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Send Project Request to Owner
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Vantaged will notify the owner via their email/phone and deliver this request to their dashboard inbox &amp; in-app notifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSendRequestOpen(false)}
                className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] font-bold flex items-center justify-center cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!canAddProject && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <p className="font-bold">Project Slot Limit Reached ({activeProjects.length} / {totalCompanySlots})</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Your <strong>{activePlanInfo.name}</strong> plan{extraSlotsCount > 0 ? ` (+${extraSlotsCount} extra slot${extraSlotsCount > 1 ? "s" : ""})` : ""} has no free project slots left.
                    </p>
                  </div>
                  <Link
                    href="/contractor/settings"
                    className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                  >
                    Upgrade / Buy Slots
                  </Link>
                </div>
              )}

              {reqError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                  {reqError}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                    Owner Email or Phone Number *
                  </label>
                  {identifierType && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-700,#1F6B3E)] text-[10px] font-bold">
                      ✓ Valid {identifierType === "email" ? "Email ID" : "Phone Number"}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. adebayo@example.com or +234 803 123 4567"
                  value={ownerIdentifier}
                  onChange={(e) => {
                    setOwnerIdentifier(e.target.value);
                    if (reqError) setReqError(null);
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                  Only an owner matching this email or phone number will receive this request.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki 4-Bedroom Duplex"
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Category
                  </label>
                  <VantagedSelect
                    value={reqCategory}
                    onChange={(val) => setReqCategory(val)}
                    options={["Residential", "Commercial", "Renovation", "Infrastructure"]}
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Site Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    value={reqLocation}
                    onChange={(e) => setReqLocation(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                    Estimated Budget *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₦85,000,000"
                    value={reqBudget}
                    onChange={(e) => setReqBudget(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Scope / Note to Owner
                </label>
                <textarea
                  rows={3}
                  placeholder="Share proposed scope, timeline, or next steps for the property owner..."
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsSendRequestOpen(false)}
                className="h-9 px-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!identifierType || !canAddProject}
                className="h-9 px-4 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Send Project Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
