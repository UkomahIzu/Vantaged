"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarNav } from "../components/SidebarNav";
import { HeaderBar } from "../components/HeaderBar";
import { ProjectFolderCard, ProjectItem } from "../components/ProjectFolderCard";
import { DraggableChatWindow } from "../components/DraggableChatWindow";

export const ACTIVE_PROJECTS: ProjectItem[] = [
  {
    id: "proj-lekki",
    jobId: "JOB-4821",
    title: "Lekki Phase 1 Luxury Villa",
    category: "Residential",
    location: "Plot 14, Admiralty Way, Lekki",
    specs: "4-Bedroom Detached + Penthouse",
    status: "In progress",
    milestonesCount: 14,
    milestonesTotal: 18,
    progressPercent: 82,
    escrowAmount: "₦145.0M",
    contractor: {
      name: "Julius B. Consortium",
      rating: "4.8 ★",
      assignedRep: "Engr. Chidi O.",
    },
    currentScope: "1st Floor Slab Casting & Rebar Ties",
    stageSubtitle: "Stage 3: First floor suspended slab",
    snippetLines: [
      "1st floor slab rebar tied",
      "C30 slump test: 110mm",
      "Cube specimens logged",
    ],
    lastUpdated: "Today, 11:42 AM",
  },
  {
    id: "proj-enclave",
    jobId: "JOB-3914",
    title: "The Enclave Waterfront Resort",
    category: "Waterfront",
    location: "Epe Waterfront Corridor, Lagos",
    specs: "Boutique Eco-Resort & Spa Villa",
    status: "In progress",
    milestonesCount: 9,
    milestonesTotal: 20,
    progressPercent: 45,
    escrowAmount: "₦82.5M",
    contractor: {
      name: "Crane & Stone Structural",
      rating: "4.9 ★",
      assignedRep: "Engr. Folake Ade",
    },
    currentScope: "Deep Foundation Piling Cages",
    stageSubtitle: "Stage 2: Piling & deep foundation",
    snippetLines: [
      "24 piles driven on site",
      "Marine concrete poured",
      "Sonic probe certified",
    ],
    lastUpdated: "Yesterday, 16:30",
  },
  {
    id: "proj-guzape",
    jobId: "JOB-5102",
    title: "Guzape Hills Residence",
    category: "Residential",
    location: "Guzape District, Asokoro Ext., Abuja",
    specs: "6-Bedroom Contemporary Mansion",
    status: "In progress",
    milestonesCount: 18,
    milestonesTotal: 28,
    progressPercent: 64,
    escrowAmount: "₦210.0M",
    contractor: {
      name: "SolidGround Engineering",
      rating: "4.8 ★",
      assignedRep: "Arc. Bello K.",
    },
    currentScope: "Galvanized Roof Truss Assembly",
    stageSubtitle: "Stage 4: Roof truss & parapet",
    snippetLines: [
      "Galvanized trusses fixed",
      "Parapet concrete casted",
      "Deflection test passed",
    ],
    lastUpdated: "Oct 08, 09:15",
  },
  {
    id: "proj-eko",
    jobId: "JOB-6205",
    title: "Eko Atlantic Sky Tower",
    category: "Commercial",
    location: "Marina District, Eko Atlantic City",
    specs: "14-Storey Mixed-Use Commercial",
    status: "In progress",
    milestonesCount: 7,
    milestonesTotal: 24,
    progressPercent: 30,
    escrowAmount: "₦450.0M",
    contractor: {
      name: "Cappa & D'Alberto",
      rating: "4.9 ★",
      assignedRep: "Engr. Tunde Coker",
    },
    currentScope: "Level 4 Core Slip-Forming",
    stageSubtitle: "Stage 4: Core slip-forming",
    snippetLines: [
      "Level 4 slip-form active",
      "Cables tensioned",
      "Jacks pressure checked",
    ],
    lastUpdated: "Oct 06, 14:00",
  },
  {
    id: "proj-banana",
    jobId: "JOB-7311",
    title: "Banana Island Horizon Penthouse",
    category: "Residential",
    location: "Zone C, Banana Island, Ikoyi",
    specs: "Ultra-Luxury Triplex Penthouse",
    status: "In progress",
    milestonesCount: 22,
    milestonesTotal: 25,
    progressPercent: 90,
    escrowAmount: "₦320.0M",
    contractor: {
      name: "Hitech Construction",
      rating: "4.9 ★",
      assignedRep: "Engr. Amina Lawal",
    },
    currentScope: "Italian Marble Tiling & BMS Wiring",
    stageSubtitle: "Stage 5: Interior finish & BMS",
    snippetLines: [
      "Italian marble delivered",
      "BMS automation wired",
      "Ceiling framing done",
    ],
    lastUpdated: "Oct 04, 11:20",
  },
  {
    id: "proj-vi",
    jobId: "JOB-8140",
    title: "Victoria Island Commercial Plaza",
    category: "Commercial",
    location: "Adeola Odeku St, Victoria Island",
    specs: "Premium Office & Retail Complex",
    status: "In progress",
    milestonesCount: 3,
    milestonesTotal: 16,
    progressPercent: 18,
    escrowAmount: "₦95.0M",
    contractor: {
      name: "Costain West Africa",
      rating: "4.7 ★",
      assignedRep: "Engr. Emeka Obi",
    },
    currentScope: "Subgrade Earthworks Compaction",
    stageSubtitle: "Stage 1: Perimeter sheet piling",
    snippetLines: [
      "Sheet piling perimeter set",
      "Compaction at 98% MDD",
      "Dewatering pumps active",
    ],
    lastUpdated: "Oct 01, 08:45",
  },
];

export const CONTRACT_HISTORY: ProjectItem[] = [
  {
    id: "hist-ikoyi",
    jobId: "JOB-3104",
    title: "Ikoyi Waterfront Luxury Penthouse",
    category: "Residential",
    location: "Ikoyi, Lagos",
    specs: "Penthouse & Terrace Suite",
    status: "Final sign-off",
    milestonesCount: 12,
    milestonesTotal: 12,
    progressPercent: 100,
    escrowAmount: "₦84.5M",
    contractor: {
      name: "Julius B. Consortium",
      rating: "4.9 ★",
      assignedRep: "Engr. Chidi O.",
    },
    currentScope: "Completed Handover & Defect Closure",
    stageSubtitle: "Completed & handed over",
    snippetLines: [
      "Terrace waterproofing done",
      "Final snagging cleared",
      "Escrow tranche released",
    ],
    lastUpdated: "Aug 2025",
  },
  {
    id: "hist-vi-tech",
    jobId: "JOB-2911",
    title: "Victoria Island Commercial Tech Hub",
    category: "Commercial",
    location: "Victoria Island, Lagos",
    specs: "5-Storey Corporate Headquarters",
    status: "Final sign-off",
    milestonesCount: 16,
    milestonesTotal: 16,
    progressPercent: 100,
    escrowAmount: "₦165.0M",
    contractor: {
      name: "Crane & Stone Structural",
      rating: "4.9 ★",
      assignedRep: "Engr. Folake Ade",
    },
    currentScope: "Full Commissioning & Handover",
    stageSubtitle: "Completed & handed over",
    snippetLines: [
      "HVAC & fiber certified",
      "Occupancy permit signed",
      "Handover completed",
    ],
    lastUpdated: "Feb 2025",
  },
  {
    id: "hist-chevron",
    jobId: "JOB-2680",
    title: "Chevron Lekki Residential Estate",
    category: "Residential",
    location: "Lekki, Lagos",
    specs: "Phase 1 Infrastructure & 8 Units",
    status: "Final sign-off",
    milestonesCount: 24,
    milestonesTotal: 24,
    progressPercent: 100,
    escrowAmount: "₦210.0M",
    contractor: {
      name: "Apex Build Nigeria Ltd",
      rating: "4.8 ★",
      assignedRep: "Arc. Bello K.",
    },
    currentScope: "Road Drainage & Building Handover",
    stageSubtitle: "Completed & handed over",
    snippetLines: [
      "Road drainage complete",
      "Full sign-off issued",
      "Retainage closed",
    ],
    lastUpdated: "Nov 2024",
  },
  {
    id: "hist-epe-cold",
    jobId: "JOB-2419",
    title: "Epe Agro Cold Storage Facility",
    category: "Commercial",
    location: "Epe, Lagos",
    specs: "Industrial Cold Storage Facility",
    status: "Final sign-off",
    milestonesCount: 8,
    milestonesTotal: 8,
    progressPercent: 100,
    escrowAmount: "₦42.0M",
    contractor: {
      name: "Prime Terra Infrastructure",
      rating: "4.7 ★",
      assignedRep: "Engr. Tunde Coker",
    },
    currentScope: "Substation & Refrigeration Handover",
    stageSubtitle: "Completed & handed over",
    snippetLines: [
      "Insulated panels fitted",
      "Substation energized",
      "Final audit passed",
    ],
    lastUpdated: "Jun 2024",
  },
  {
    id: "hist-maitama",
    jobId: "JOB-2105",
    title: "Maitama Diplomatic Villa",
    category: "Residential",
    location: "Maitama District, Abuja",
    specs: "Diplomatic Residence & Perimeter",
    status: "Final sign-off",
    milestonesCount: 20,
    milestonesTotal: 20,
    progressPercent: 100,
    escrowAmount: "₦195.0M",
    contractor: {
      name: "SolidGround Engineering",
      rating: "4.9 ★",
      assignedRep: "Arc. Bello K.",
    },
    currentScope: "Perimeter & Structural Commissioning",
    stageSubtitle: "Completed & handed over",
    snippetLines: [
      "Perimeter security wall",
      "Landscape completed",
      "Warranty certificate logged",
    ],
    lastUpdated: "Nov 2023",
  },
  {
    id: "hist-asokoro",
    jobId: "JOB-1940",
    title: "Asokoro Medical Center",
    category: "Commercial",
    location: "Asokoro District, Abuja",
    specs: "Specialist Clinical Center",
    status: "Final sign-off",
    milestonesCount: 14,
    milestonesTotal: 14,
    progressPercent: 100,
    escrowAmount: "₦130.0M",
    contractor: {
      name: "Hitech Construction",
      rating: "4.8 ★",
      assignedRep: "Engr. Amina Lawal",
    },
    currentScope: "Medical Cleanrooms Certification",
    stageSubtitle: "Completed & handed over",
    snippetLines: [
      "Cleanroom flooring set",
      "Lead shielding tested",
      "Final milestone paid",
    ],
    lastUpdated: "May 2023",
  },
];

export const PROPOSED_PLANS: ProjectItem[] = [
  {
    id: "proj-lekki",
    jobId: "PROP-4821",
    title: "Lekki Phase 1 Luxury Villa",
    category: "Residential",
    location: "Plot 14, Admiralty Way, Lekki",
    specs: "4-Bedroom Detached House + Penthouse & Pool",
    status: "Inspection pending",
    milestonesCount: 0,
    milestonesTotal: 6,
    progressPercent: 0,
    escrowAmount: "₦245.0M Proposed",
    contractor: {
      name: "Julius B. Consortium",
      rating: "4.8 ★",
      assignedRep: "Engr. Babatunde Adeleke",
    },
    currentScope: "Proposed 6-Stage Construction Agreement",
    stageSubtitle: "Awaiting your review & agreement",
    snippetLines: [
      "10% Mobilisation deposit: ₦24.5M",
      "6 milestone stages (100% budget)",
      "5% Defect liability retention hold",
    ],
    lastUpdated: "Sent Jan 15, 2026",
  },
  {
    id: "proj-guzape",
    jobId: "PROP-5102",
    title: "Guzape Hills Residence",
    category: "Residential",
    location: "Guzape District, Asokoro Ext., Abuja",
    specs: "6-Bedroom Contemporary Mansion",
    status: "Inspection pending",
    milestonesCount: 0,
    milestonesTotal: 8,
    progressPercent: 0,
    escrowAmount: "₦210.0M Proposed",
    contractor: {
      name: "SolidGround Engineering",
      rating: "4.8 ★",
      assignedRep: "Arc. Bello K.",
    },
    currentScope: "8-Stage Structural & Finishing Plan",
    stageSubtitle: "Awaiting your review & agreement",
    snippetLines: [
      "10% Mobilisation deposit: ₦21.0M",
      "Checklist inspection criteria set",
      "5% Retention locked until handover",
    ],
    lastUpdated: "Sent Oct 12, 2026",
  },
  {
    id: "proj-enclave",
    jobId: "PROP-3914",
    title: "The Enclave Waterfront Resort",
    category: "Waterfront",
    location: "Epe Waterfront Corridor, Lagos",
    specs: "Boutique Eco-Resort & Spa Villa",
    status: "Substructure",
    milestonesCount: 0,
    milestonesTotal: 7,
    progressPercent: 0,
    escrowAmount: "₦188.5M Proposed",
    contractor: {
      name: "Crane & Stone Structural",
      rating: "4.9 ★",
      assignedRep: "Engr. Folake Ade",
    },
    currentScope: "Piling & Eco-Resort Phased Plan",
    stageSubtitle: "Changes requested by owner",
    snippetLines: [
      "Stage 2 timeline revised",
      "Piling spec adjustments sent",
      "Builder revising draft proposal",
    ],
    lastUpdated: "Revised Yesterday",
  },
];

export function OwnerProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const searchParam = searchParams?.get("search");

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

  // Active list based on 3-way switch
  const currentList =
    viewMode === "active"
      ? ACTIVE_PROJECTS
      : viewMode === "plans"
      ? PROPOSED_PLANS
      : CONTRACT_HISTORY;

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
      style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
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
        style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
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

        {/* ── Title & Right Controls (Title on left; 2-Way Switch & Filter on right) ── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          {/* Large Title: Dynamic based on 3-way switch */}
          <div>
            <h1
              style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
              className="text-2xl sm:text-3xl font-extrabold text-[var(--vt-color-indigo-900,#261A66)] tracking-tight"
            >
              {viewMode === "active"
                ? "Active Projects"
                : viewMode === "plans"
                ? "Plan & Contract Proposals"
                : "Contract History"}
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              {viewMode === "active"
                ? "Live building sites and ongoing milestone construction."
                : viewMode === "plans"
                ? "Building plans and milestone payment terms sent by builders awaiting your agreement."
                : "Finished projects and handed-over buildings."}
            </p>
          </div>

          {/* Right Group: 3-Way Switch (left of filter) + Filter Button */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* 3-Way Segmented Switch: 'Active projects' | 'Plan & contract' | 'Contract history' */}
            <div className="flex items-center p-1 bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-lg shadow-2xs">
              <button
                type="button"
                onClick={() => handleViewModeChange("active")}
                style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "active"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Active projects</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    viewMode === "active"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                  }`}
                >
                  {ACTIVE_PROJECTS.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("plans")}
                style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "plans"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Plan & contract</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    viewMode === "plans"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-orange-100,#FFE6D5)] text-[var(--vt-color-orange-800,#8F320D)]"
                  }`}
                >
                  {PROPOSED_PLANS.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("history")}
                style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "history"
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white shadow-xs"
                    : "text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]"
                }`}
              >
                <span>Contract history</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    viewMode === "history"
                      ? "bg-white/20 text-white"
                      : "bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                  }`}
                >
                  {CONTRACT_HISTORY.length}
                </span>
              </button>
            </div>

            {/* Comprehensive Filter Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
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
                    style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
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
                      <div className="relative">
                        <select
                          value={filterContractor}
                          onChange={(e) => setFilterContractor(e.target.value)}
                          style={{ fontFamily: "var(--vt-font-sans), 'Outfit', sans-serif" }}
                          className="w-full h-9 px-3 pr-8 rounded-lg bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] focus:outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] cursor-pointer appearance-none"
                        >
                          <option value="all">All Contractors ({availableContractors.length})</option>
                          {availableContractors.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--vt-color-neutral-400,#A3A0B8)]">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
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
        projectName={ACTIVE_PROJECTS[0].title}
      />
    </div>
  );
}
