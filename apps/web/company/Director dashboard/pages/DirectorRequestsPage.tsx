"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import {
  ProjectFolderCard,
  ProjectItem,
} from "../../../client/Owner dashboard/components/ProjectFolderCard";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import {
  DEMO_DIRECTOR_PROJECT_REQUESTS,
  DirectorProjectRequestItem,
} from "../data/directorData";
import {
  BUILT_IN_PLATFORM_PRESETS,
  StageItem,
  StagePreset,
} from "../data/stagePresetsData";
import { readLocalData, writeLocalData } from "../utils/localPersistence";
import { SHARED_SYNC_EVENT } from "../../../shared/vantagedSyncBridge";

const DEFAULT_NEW_PRESET_STAGES: StageItem[] = [
  {
    order: 1,
    title: "Site Mobilization & Substructure",
    evidence: "Survey benchmarks, excavation log, blinding concrete & rebar photos",
  },
  {
    order: 2,
    title: "Superstructure Frame & Masonry",
    evidence: "Column formwork, lintel beams, concrete cube test certificates",
  },
  {
    order: 3,
    title: "Roofing, MEP Rough-in & Plastering",
    evidence: "Roof watertightness check, plumbing pressure test, wall screeding",
  },
  {
    order: 4,
    title: "Architectural Finishes & Handover",
    evidence: "Tiling inspection, fixtures check, client snagging signoff",
  },
];

function mapCategoryToFolderCategory(
  category: DirectorProjectRequestItem["category"]
): ProjectItem["category"] {
  if (category === "Marine & Waterfront") return "Waterfront";
  if (category === "Commercial" || category === "Industrial") return "Commercial";
  return "Residential";
}

function toRequestFolderItem(
  req: DirectorProjectRequestItem,
  sentPreset?: { preset: StagePreset; proposedBudget: string }
): ProjectItem {
  const isPlan = req.status === "Proposal Ready";
  return {
    id: req.id,
    jobId: req.requestCode,
    title: req.title,
    category: mapCategoryToFolderCategory(req.category),
    location: req.location,
    specs: req.category,
    status: isPlan ? "Inspection pending" : "Inspection pending",
    milestonesCount: 0,
    milestonesTotal: 0,
    progressPercent: isPlan ? 100 : req.status === "Drafting Milestone Plan" ? 50 : 15,
    escrowAmount: isPlan && sentPreset ? sentPreset.proposedBudget : req.estimatedBudget,
    contractor: {
      name: req.ownerName,
      rating: req.ownerVerified ? "Verified NIN Owner" : "Owner",
      assignedRep: "Director Review",
    },
    currentScope: req.description,
    stageSubtitle: isPlan
      ? `Awaiting Owner's Approval · ${sentPreset ? sentPreset.preset.stagesCount : 7} Stages`
      : `${req.status} · ${req.dateSubmitted}`,
    snippetLines: isPlan
      ? [
          `Awaiting Owner's Approval`,
          `Preset: ${sentPreset ? sentPreset.preset.name.split("(")[0].trim() : "Standard Milestone Plan"}`,
          `Client: ${req.ownerName} · ${req.location}`,
        ]
      : [
          `From: ${req.ownerName}`,
          `${req.category} · ${req.location}`,
          req.description,
        ],
    lastUpdated: req.dateSubmitted,
  };
}

export function DirectorRequestsPage() {
  const scrollRef = useScrollRestoration<HTMLElement>("director_requests");
  const { isDemoMode } = useDirectorDemoMode();

  const [viewMode, setViewMode] = useState<"requests" | "plans">("requests");
  const [requests, setRequests] = useState<DirectorProjectRequestItem[]>(() =>
    readLocalData("vantaged_director_requests", DEMO_DIRECTOR_PROJECT_REQUESTS)
  );
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<DirectorProjectRequestItem | null>(null);
  const [sentPresetByRequest, setSentPresetByRequest] = useState<Record<string, string>>(() =>
    readLocalData("vantaged_director_sent_preset_labels", {
      "req-guzape-04": "4-Bedroom Detached Duplex (7 stages)",
    })
  );
  const [sentPresetDetailsByRequest, setSentPresetDetailsByRequest] = useState<
    Record<string, { preset: StagePreset; proposedBudget: string }>
  >(() =>
    readLocalData("vantaged_director_sent_preset_details", {
      "req-guzape-04": {
        preset: BUILT_IN_PLATFORM_PRESETS[0]!,
        proposedBudget: "₦195,000,000",
      },
    })
  );

  // Milestone Proposal Popup State (Select Preset OR Create New Preset & Send)
  const [proposalTarget, setProposalTarget] = useState<DirectorProjectRequestItem | null>(null);
  const [allPresets, setAllPresets] = useState<StagePreset[]>(BUILT_IN_PLATFORM_PRESETS);
  const [presetSearch, setPresetSearch] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset_duplex");
  const [isCreatingNewPreset, setIsCreatingNewPreset] = useState(false);
  const [proposedBudget, setProposedBudget] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newPresetForm, setNewPresetForm] = useState({
    name: "",
    category: "Residential" as StagePreset["category"],
    typicalDuration: "",
    description: "",
    stages: DEFAULT_NEW_PRESET_STAGES.map((s) => ({ ...s })),
  });

  const loadAllPresets = () => {
    fetch("/api/presets")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) return;
        const adminCustom: StagePreset[] = Array.isArray(data.adminCustomPresets)
          ? data.adminCustomPresets.map((p: StagePreset) => ({ ...p, source: "admin" as const }))
          : [];
        const companyCustom: StagePreset[] = Array.isArray(data.companyPresets)
          ? data.companyPresets.map((p: StagePreset) => ({
              ...p,
              source: "company" as const,
              isCustom: true,
            }))
          : [];
        const overrides =
          data.adminOverrides && typeof data.adminOverrides === "object"
            ? data.adminOverrides
            : {};
        const mergedBuiltIn = BUILT_IN_PLATFORM_PRESETS.map((bp) =>
          overrides[bp.id]
            ? { ...bp, ...overrides[bp.id], isModified: true, source: "platform" as const }
            : { ...bp, source: "platform" as const }
        );
        const combined = [...companyCustom, ...adminCustom, ...mergedBuiltIn];
        setAllPresets(combined);
        if (combined.length > 0 && !combined.some((p) => p.id === selectedPresetId)) {
          setSelectedPresetId(combined[0]!.id);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadAllPresets();
  }, []);

  // Merge Owner-submitted briefs from shared vantaged_project_briefs into Company Requests
  useEffect(() => {
    const syncOwnerBriefs = () => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem("vantaged_project_briefs");
        if (!raw) return;
        const ownerBriefs = JSON.parse(raw);
        if (!Array.isArray(ownerBriefs)) return;

        setRequests((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          const mappedNew: DirectorProjectRequestItem[] = ownerBriefs
            .filter((b: any) => b?.id && !existingIds.has(b.id))
            .map((b: any) => ({
              id: b.id,
              requestCode: String(b.id).toUpperCase().slice(0, 10),
              ownerName: "Dr. James Arinze (Owner)",
              ownerVerified: true,
              title: b.title || "Owner Project Brief",
              category:
                b.category === "Commercial"
                  ? "Commercial"
                  : b.category === "Industrial"
                  ? "Industrial"
                  : b.category === "Waterfront"
                  ? "Marine & Waterfront"
                  : "Residential",
              estimatedBudget: b.estimatedBudget || "₦100M - ₦200M",
              location: b.location || "Lagos, Nigeria",
              description: b.description || "Project brief submitted by property owner.",
              dateSubmitted: b.dateSubmitted || "Just now",
              status:
                b.status === "Proposal Ready"
                  ? "Proposal Ready"
                  : b.status === "Drafting Milestone Plan"
                  ? "Drafting Milestone Plan"
                  : "Under Contractor Review",
            }));
          if (mappedNew.length === 0) return prev;
          const merged = [...mappedNew, ...prev];
          writeLocalData("vantaged_director_requests", merged);
          return merged;
        });
      } catch {}
    };

    syncOwnerBriefs();
    window.addEventListener(SHARED_SYNC_EVENT, syncOwnerBriefs);
    window.addEventListener("storage", syncOwnerBriefs);
    return () => {
      window.removeEventListener(SHARED_SYNC_EVENT, syncOwnerBriefs);
      window.removeEventListener("storage", syncOwnerBriefs);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openProposalModal = (req: DirectorProjectRequestItem) => {
    loadAllPresets();
    setProposalTarget(req);
    setProposedBudget(req.estimatedBudget);
    setPresetSearch("");
    setIsCreatingNewPreset(false);
    setNewPresetForm({
      name: `${req.title} Milestone Plan`,
      category:
        req.category === "Commercial"
          ? "Commercial"
          : req.category === "Industrial"
          ? "Industrial"
          : "Residential",
      typicalDuration: "6 to 9 Months",
      description: "",
      stages: DEFAULT_NEW_PRESET_STAGES.map((s) => ({ ...s })),
    });
  };

  const filteredModalPresets = useMemo(() => {
    const q = presetSearch.trim().toLowerCase();
    if (!q) return allPresets;
    return allPresets.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [allPresets, presetSearch]);

  const activeSelectedPreset =
    allPresets.find((p) => p.id === selectedPresetId) || allPresets[0] || null;

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterOwner, setFilterOwner] = useState<string>("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const visiblePool = useMemo(
    () => (isDemoMode ? requests : []),
    [isDemoMode, requests]
  );

  const incomingRequests = useMemo(
    () => visiblePool.filter((r) => r.status !== "Proposal Ready"),
    [visiblePool]
  );

  const planContracts = useMemo(
    () => visiblePool.filter((r) => r.status === "Proposal Ready"),
    [visiblePool]
  );

  const pendingCount = useMemo(
    () =>
      incomingRequests.filter(
        (r) =>
          r.status === "Under Contractor Review" ||
          r.status === "Drafting Milestone Plan"
      ).length,
    [incomingRequests]
  );

  const currentTabList = viewMode === "requests" ? incomingRequests : planContracts;

  const availableOwners = useMemo(
    () => Array.from(new Set(currentTabList.map((r) => r.ownerName))).sort(),
    [currentTabList]
  );

  const filteredRequests = useMemo(() => {
    let list = [...currentTabList];

    if (filterCategory !== "all") {
      list = list.filter((r) => r.category === filterCategory);
    }

    if (filterOwner !== "all") {
      list = list.filter((r) => r.ownerName === filterOwner);
    }

    return list;
  }, [currentTabList, filterCategory, filterOwner]);

  const activeFilterCount =
    (filterCategory !== "all" ? 1 : 0) + (filterOwner !== "all" ? 1 : 0);

  const handleResetFilters = () => {
    setFilterCategory("all");
    setFilterOwner("all");
  };

  const updateRequestStatus = (
    id: string,
    nextStatus: DirectorProjectRequestItem["status"]
  ) => {
    const next = requests.map((item) =>
      item.id === id ? { ...item, status: nextStatus } : item
    );
    setRequests(next);
    writeLocalData("vantaged_director_requests", next);
    setActiveRequest((prev) =>
      prev && prev.id === id ? { ...prev, status: nextStatus } : prev
    );
  };

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

      {/* Left Sidebar Navigation */}
      <DirectorSidebarNav currentActiveItem="requests" />

      {/* Main Workspace */}
      <main
        ref={scrollRef}
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 pb-24 md:pb-5"
      >
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

        {/* Title & Controls */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight whitespace-nowrap">
                {viewMode === "requests" ? "Project Requests" : "Plan & Contract"}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-700,#B33C08)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)]" />
                {viewMode === "requests"
                  ? `${pendingCount} Awaiting Review`
                  : `${planContracts.length} Awaiting Owner's Approval`}
              </span>
            </div>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              {viewMode === "requests"
                ? "Incoming project briefs submitted by property owners. Click any folder to inspect the owner's full request."
                : "Sent milestone stage presets and contract budgets awaiting the owner's approval before moving to Active Projects."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap sm:flex-nowrap w-full sm:w-auto">
            {/* 2-Way Segmented Switch: Project Requests vs Plan & Contract */}
            <div className="h-9 p-0.5 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-lg flex items-center shadow-2xs shrink-0 font-sans max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setViewMode("requests");
                  setSelectedRequestId(null);
                }}
                className={`h-full px-3 sm:px-3.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  viewMode === "requests"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Project requests</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    viewMode === "requests"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-orange-100,#FFE6D5)] text-[var(--vt-color-orange-800,#8F320D)]"
                  }`}
                >
                  {incomingRequests.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("plans");
                  setSelectedRequestId(null);
                }}
                className={`h-full px-3 sm:px-3.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  viewMode === "plans"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Plan &amp; contract</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    viewMode === "plans"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                  }`}
                >
                  {planContracts.length}
                </span>
              </button>
            </div>

            {/* Filter Popover Button */}
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
                      <h3 className="font-extrabold text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                        Filter Requests
                      </h3>
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
                          "all",
                          "Residential",
                          "Commercial",
                          "Industrial",
                          "Marine & Waterfront",
                          "Architecture & Design",
                        ].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              filterCategory === cat
                                ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-2xs font-bold"
                                : "bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-700,#46425F)] border border-[var(--vt-color-border-default,#E2E0EC)]"
                            }`}
                          >
                            {cat === "all" ? "All Categories" : cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-[10.5px] uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                        Owner / Client
                      </span>
                      <VantagedSelect
                        value={filterOwner}
                        onChange={(val) => setFilterOwner(val)}
                        options={[
                          { value: "all", label: `All Owners (${availableOwners.length})` },
                          ...availableOwners.map((o) => ({ value: o, label: o })),
                        ]}
                      />
                    </div>

                    <div className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[var(--vt-color-neutral-500,#7C7894)]">
                        Showing <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{filteredRequests.length}</strong> of {visiblePool.length}
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

        {/* Folder Cards Grid */}
        <section className="w-full pb-8">
          {filteredRequests.length === 0 ? (
            activeFilterCount > 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  No project requests match your filter criteria
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm mt-1">
                  Try clearing category or owner filters to view all incoming briefs.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="w-full py-16 sm:py-20 flex flex-col items-center justify-center text-center bg-white border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl p-8 sm:p-12 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center mb-4 border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  No Incoming Project Requests Yet
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-1.5 leading-relaxed">
                  When property owners submit project briefs to your firm from Find Verified Builders, their request folders will appear here for review.
                </p>
                <div className="mt-5">
                  <Link
                    href="/contractor/projects"
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Go to Projects</span>
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
              {filteredRequests.map((req) => {
                const folderVariant =
                  req.status === "Under Contractor Review" ||
                  req.status === "Drafting Milestone Plan"
                    ? "orange"
                    : "white";
                return (
                  <ProjectFolderCard
                    key={req.id}
                    project={toRequestFolderItem(req, sentPresetDetailsByRequest[req.id])}
                    variant={folderVariant}
                    isSelected={selectedRequestId === req.id}
                    hideProgress
                    onSelect={() => {
                      setSelectedRequestId(req.id);
                      setActiveRequest(req);
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Owner Project Request Details Modal (matches Owner Brief Form fields 1:1) */}
      {activeRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveRequest(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                    {activeRequest.requestCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white">
                    {activeRequest.status === "Proposal Ready"
                      ? "Awaiting Owner's Approval"
                      : activeRequest.status}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  {activeRequest.status === "Proposal Ready"
                    ? "Plan & Contract"
                    : "Owner Project Request"}
                </h2>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] mt-0.5">
                  Submitted {activeRequest.dateSubmitted} by {activeRequest.ownerName}
                  {activeRequest.ownerVerified ? " · Verified NIN" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Body: 1:1 Owner Request Form Fields + Sent Stage Preset when in Plan & Contract */}
            <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              {activeRequest.status === "Proposal Ready" &&
                sentPresetDetailsByRequest[activeRequest.id] && (
                  <div className="p-4 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] space-y-3">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] animate-pulse" />
                          Sent Stage Preset · Awaiting Owner&apos;s Approval
                        </span>
                        <h3 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                          {sentPresetDetailsByRequest[activeRequest.id]!.preset.name}
                        </h3>
                        <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          {sentPresetDetailsByRequest[activeRequest.id]!.preset.category} ·{" "}
                          {sentPresetDetailsByRequest[activeRequest.id]!.preset.typicalDuration} ·{" "}
                          {sentPresetDetailsByRequest[activeRequest.id]!.preset.stages.length} Stages
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[var(--vt-color-orange-200,#FDCAA9)] font-mono font-extrabold text-[var(--vt-color-orange-700,#B33C08)]">
                        {sentPresetDetailsByRequest[activeRequest.id]!.proposedBudget}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {sentPresetDetailsByRequest[activeRequest.id]!.preset.stages.map(
                        (stg) => (
                          <div
                            key={stg.order}
                            className="p-2.5 rounded-xl bg-white border border-[var(--vt-color-orange-200,#FDCAA9)]/70 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                              {stg.order}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                                {stg.title}
                              </p>
                              <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                                {stg.evidence}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Project Title
                </span>
                <p className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  {activeRequest.title}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                    Category
                  </span>
                  <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                    {activeRequest.category}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                    Estimated Budget
                  </span>
                  <p className="font-mono font-extrabold text-[var(--vt-color-orange-700,#B33C08)] mt-0.5">
                    {activeRequest.estimatedBudget}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Site Location
                </span>
                <p className="font-semibold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  {activeRequest.location}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Brief Scope Description
                </span>
                <p className="text-[var(--vt-color-neutral-700,#46425F)] leading-relaxed mt-1 whitespace-pre-line">
                  {activeRequest.description}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                {activeRequest.status !== "Declined" &&
                  activeRequest.status !== "Proposal Ready" && (
                    <button
                      type="button"
                      onClick={() => updateRequestStatus(activeRequest.id, "Declined")}
                      className="h-9 px-3.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Decline Request
                    </button>
                  )}
              </div>

              <div className="flex items-center gap-2">
                {activeRequest.status === "Under Contractor Review" && (
                  <button
                    type="button"
                    onClick={() =>
                      updateRequestStatus(activeRequest.id, "Drafting Milestone Plan")
                    }
                    className="h-9 px-4 rounded-lg border border-[var(--vt-color-indigo-200,#D5D2EF)] bg-white hover:bg-[var(--vt-color-indigo-50,#F4F3FC)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold cursor-pointer transition-colors"
                  >
                    Start Drafting Plan
                  </button>
                )}

                {activeRequest.status !== "Proposal Ready" &&
                  activeRequest.status !== "Declined" && (
                    <button
                      type="button"
                      onClick={() => openProposalModal(activeRequest)}
                      className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
                    >
                      Send Milestone Proposal →
                    </button>
                  )}

                {activeRequest.status === "Proposal Ready" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {sentPresetByRequest[activeRequest.id] && (
                      <span className="text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] px-2.5 py-1 rounded-lg">
                        Plan: {sentPresetByRequest[activeRequest.id]}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => openProposalModal(activeRequest)}
                      className="h-9 px-3.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold cursor-pointer transition-colors"
                    >
                      Edit Proposal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Milestone Proposal Modal (All Presets + Create New Preset & Send) */}
      {proposalTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setProposalTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${
              isCreatingNewPreset ? "max-w-2xl" : "max-w-4xl"
            } bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150`}
          >
            {/* Header */}
            {isCreatingNewPreset ? (
              <div className="px-6 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between bg-[var(--vt-color-neutral-50,#F7F7FA)] shrink-0">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    Create Company Stage Preset
                  </h3>
                  <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                    Build a milestone sequence for &ldquo;{proposalTarget.title}&rdquo; and send it to {proposalTarget.ownerName}.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewPreset(false)}
                    className="h-8 px-3 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer transition-colors"
                  >
                    ← Back to Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setProposalTarget(null)}
                    className="w-8 h-8 rounded-lg hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                    {proposalTarget.requestCode} · {proposalTarget.ownerName}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                    Select Milestone Preset for &ldquo;{proposalTarget.title}&rdquo;
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewPreset(true)}
                    className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    + Create New Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => setProposalTarget(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {!isCreatingNewPreset ? (
              /* MODE 1: Browse All Presets (Platform + Admin + Company) & Send */
              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
                {/* Preset List */}
                <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[var(--vt-color-border-default,#E2E0EC)] p-4 flex flex-col gap-3 overflow-y-auto max-h-[38vh] md:max-h-full">
                  <div className="relative shrink-0">
                    <svg
                      className="w-4 h-4 text-[var(--vt-color-neutral-400,#A3A0B8)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      placeholder="Search all presets..."
                      className="w-full h-10 pl-9 pr-8 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] focus:bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                    />
                    {presetSearch && (
                      <button
                        type="button"
                        onClick={() => setPresetSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {filteredModalPresets.map((p) => {
                      const isSel = activeSelectedPreset?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPresetId(p.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isSel
                              ? "border-[var(--vt-color-orange-500,#EF5F18)] bg-[var(--vt-color-orange-50,#FFF4EE)]/60 ring-1 ring-[var(--vt-color-orange-400,#F78241)]"
                              : "border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] line-clamp-1">
                              {p.name.split("(")[0]}
                            </span>
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--vt-color-orange-100,#FFE6D5)] text-[var(--vt-color-orange-800,#8F320D)]">
                              {p.stagesCount} Stages
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1 text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">
                            <span>{p.category}</span>
                            <span className="font-mono font-bold uppercase">
                              {p.source === "company"
                                ? "Company"
                                : p.source === "admin"
                                ? "Admin"
                                : "Platform"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Preset Preview + Send */}
                <div className="md:col-span-7 p-5 flex flex-col justify-between overflow-y-auto gap-4">
                  {activeSelectedPreset ? (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)]">
                          {activeSelectedPreset.category} · {activeSelectedPreset.typicalDuration}
                        </span>
                        <h4 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-1.5">
                          {activeSelectedPreset.name}
                        </h4>
                        <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">
                          {activeSelectedPreset.description}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                          Proposed Contract Budget
                        </label>
                        <input
                          type="text"
                          value={proposedBudget}
                          onChange={(e) => setProposedBudget(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {activeSelectedPreset.stages.map((s) => (
                          <div
                            key={s.order}
                            className="p-2.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-start gap-2.5 text-xs"
                          >
                            <span className="w-5 h-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                              {s.order}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                                {s.title}
                              </p>
                              <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                                {s.evidence}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setProposalTarget(null)}
                      className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!activeSelectedPreset}
                      onClick={() => {
                        if (!activeSelectedPreset) return;
                        const nextLabels = {
                          ...sentPresetByRequest,
                          [proposalTarget.id]: `${activeSelectedPreset.name.split("(")[0].trim()} (${activeSelectedPreset.stages.length} stages)`,
                        };
                        const nextDetails = {
                          ...sentPresetDetailsByRequest,
                          [proposalTarget.id]: {
                            preset: activeSelectedPreset,
                            proposedBudget: proposedBudget || proposalTarget.estimatedBudget,
                          },
                        };
                        setSentPresetByRequest(nextLabels);
                        setSentPresetDetailsByRequest(nextDetails);
                        writeLocalData("vantaged_director_sent_preset_labels", nextLabels);
                        writeLocalData("vantaged_director_sent_preset_details", nextDetails);
                        updateRequestStatus(proposalTarget.id, "Proposal Ready");
                        showToast(
                          `Sent "${activeSelectedPreset.name.split("(")[0].trim()}" to ${proposalTarget.ownerName}!`
                        );
                        setProposalTarget(null);
                        setActiveRequest(null);
                        setViewMode("plans");
                      }}
                      className="h-9 px-5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Send Selected Preset to Owner →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* MODE 2: Create a New Company Preset & Send Immediately */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPresetForm.name.trim()) return;
                  const normalizedStages: StageItem[] = newPresetForm.stages.map(
                    (stg, idx) => ({
                      order: idx + 1,
                      title: stg.title.trim() || `Stage ${idx + 1}`,
                      evidence:
                        stg.evidence.trim() ||
                        "Site photos, inspection log, and quality certificates.",
                    })
                  );
                  const createdPreset: StagePreset = {
                    id: `preset_company_${Date.now()}`,
                    name: newPresetForm.name.trim(),
                    category: newPresetForm.category,
                    typicalDuration:
                      newPresetForm.typicalDuration.trim() || "Flexible Schedule",
                    stagesCount: normalizedStages.length,
                    description:
                      newPresetForm.description.trim() ||
                      `Custom milestone plan prepared for ${proposalTarget.title}.`,
                    isCustom: true,
                    source: "company",
                    stages: normalizedStages,
                  };

                  fetch("/api/presets", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(createdPreset),
                  }).catch(() => {});

                  setAllPresets((prev) => [createdPreset, ...prev]);
                  const nextLabels = {
                    ...sentPresetByRequest,
                    [proposalTarget.id]: `${createdPreset.name} (${createdPreset.stages.length} stages)`,
                  };
                  const nextDetails = {
                    ...sentPresetDetailsByRequest,
                    [proposalTarget.id]: {
                      preset: createdPreset,
                      proposedBudget: proposedBudget || proposalTarget.estimatedBudget,
                    },
                  };
                  setSentPresetByRequest(nextLabels);
                  setSentPresetDetailsByRequest(nextDetails);
                  writeLocalData("vantaged_director_sent_preset_labels", nextLabels);
                  writeLocalData("vantaged_director_sent_preset_details", nextDetails);
                  updateRequestStatus(proposalTarget.id, "Proposal Ready");
                  showToast(
                    `Created "${createdPreset.name}" and sent to ${proposalTarget.ownerName}!`
                  );
                  setProposalTarget(null);
                  setActiveRequest(null);
                  setViewMode("plans");
                }}
                className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                      Preset Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPresetForm.name}
                      onChange={(e) =>
                        setNewPresetForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. 5-Bedroom Luxury Penthouse with Automation"
                      className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                      Typology Category
                    </label>
                    <VantagedSelect
                      value={newPresetForm.category}
                      onChange={(val) =>
                        setNewPresetForm((prev) => ({
                          ...prev,
                          category: val as StagePreset["category"],
                        }))
                      }
                      options={[
                        { value: "Residential", label: "Residential" },
                        { value: "Commercial", label: "Commercial" },
                        { value: "Infrastructure", label: "Civil & Infrastructure" },
                        { value: "Industrial", label: "Industrial" },
                        { value: "Specialized", label: "Specialized" },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={newPresetForm.typicalDuration}
                      onChange={(e) =>
                        setNewPresetForm((prev) => ({
                          ...prev,
                          typicalDuration: e.target.value,
                        }))
                      }
                      placeholder="e.g. 8 to 12 Months"
                      className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                      Template Description
                    </label>
                    <textarea
                      rows={2}
                      value={newPresetForm.description}
                      onChange={(e) =>
                        setNewPresetForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief description of when this milestone template is recommended..."
                      className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs resize-none"
                    />
                  </div>
                </div>

                {/* Dynamic Stage Sequence Builder matching Stage Presets Page */}
                <div className="pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        Milestone Stages Sequence ({newPresetForm.stages.length} Stages)
                      </h4>
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                        Add, arrange, or specify required proof for each inspection milestone.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNewPresetForm((prev) => ({
                          ...prev,
                          stages: [
                            ...prev.stages,
                            { order: prev.stages.length + 1, title: "", evidence: "" },
                          ],
                        }))
                      }
                      className="h-7 px-3 rounded-lg bg-[var(--vt-color-neutral-100,#ECEBF3)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold transition-colors border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center gap-1 cursor-pointer"
                    >
                      + Add Stage
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newPresetForm.stages.map((stg, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-2 relative"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                              Stage {idx + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() =>
                                setNewPresetForm((prev) => {
                                  if (idx === 0) return prev;
                                  const next = [...prev.stages];
                                  const tmp = next[idx]!;
                                  next[idx] = next[idx - 1]!;
                                  next[idx - 1] = tmp;
                                  return {
                                    ...prev,
                                    stages: next.map((item, i) => ({ ...item, order: i + 1 })),
                                  };
                                })
                              }
                              className="w-6 h-6 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === newPresetForm.stages.length - 1}
                              onClick={() =>
                                setNewPresetForm((prev) => {
                                  if (idx >= prev.stages.length - 1) return prev;
                                  const next = [...prev.stages];
                                  const tmp = next[idx]!;
                                  next[idx] = next[idx + 1]!;
                                  next[idx + 1] = tmp;
                                  return {
                                    ...prev,
                                    stages: next.map((item, i) => ({ ...item, order: i + 1 })),
                                  };
                                })
                              }
                              className="w-6 h-6 rounded border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                            >
                              ↓
                            </button>
                            {newPresetForm.stages.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setNewPresetForm((prev) => ({
                                    ...prev,
                                    stages: prev.stages
                                      .filter((_, i) => i !== idx)
                                      .map((item, i) => ({ ...item, order: i + 1 })),
                                  }))
                                }
                                className="text-[11px] text-rose-700 hover:underline cursor-pointer ml-1"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="Stage Title (e.g. Substructure Raft)"
                            value={stg.title}
                            onChange={(e) =>
                              setNewPresetForm((prev) => ({
                                ...prev,
                                stages: prev.stages.map((item, i) =>
                                  i === idx ? { ...item, title: e.target.value } : item
                                ),
                              }))
                            }
                            className="w-full h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                          />
                          <input
                            type="text"
                            placeholder="Required Evidence (e.g. Cube tests, photos)"
                            value={stg.evidence}
                            onChange={(e) =>
                              setNewPresetForm((prev) => ({
                                ...prev,
                                stages: prev.stages.map((item, i) =>
                                  i === idx ? { ...item, evidence: e.target.value } : item
                                ),
                              }))
                            }
                            className="w-full h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-neutral-700,#443E63)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewPreset(false)}
                    className="h-9 px-4 rounded-xl bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] text-xs font-semibold border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
                  >
                    Create Preset &amp; Send to Owner →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[70] px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          ✓ {toastMessage}
        </div>
      )}
    </div>
  );
}
