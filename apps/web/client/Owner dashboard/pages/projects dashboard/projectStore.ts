"use client";

import { ProjectItem } from "../../components/ProjectFolderCard";
import { getIsDemoMode } from "../../hooks/useDemoMode";
import { getOwnerCapacity } from "../../hooks/useOwnerSubscription";
import {
  broadcastPortalSync,
  ensureProjectConversation,
  initializeFreshProjectWorkspace,
  pushCompanyLiveNotification,
} from "../../../../shared/vantagedSyncBridge";
import { getOwnerScopedKey, getOwnerSession } from "../../../../shared/vantagedAuth";

export const STORAGE_KEY_ACTIVE = "vantaged_active_projects";
export const STORAGE_KEY_PLANS = "vantaged_proposed_plans";
export const STORAGE_KEY_HISTORY = "vantaged_contract_history";
export const STORAGE_KEY_BRIEFS = "vantaged_project_briefs";

export interface ProposedPlanStageItem {
  order: number;
  title: string;
  evidence: string;
  weightPercent?: number;
}

export interface ProposedPlanPayload {
  planId: string;
  presetName: string;
  category: string;
  typicalDuration: string;
  description: string;
  proposedBudget: string;
  companyName: string;
  directorName?: string;
  sentAt?: string;
  stages: ProposedPlanStageItem[];
}

export interface ProjectBrief {
  id: string;
  companyId: string;
  companyName: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerIdentifier?: string;
  title: string;
  category: string;
  estimatedBudget: string;
  location: string;
  status: "Under Contractor Review" | "Drafting Milestone Plan" | "Proposal Ready" | "Plan Accepted & Active" | "Revisions Requested";
  dateSubmitted: string;
  description: string;
  planId?: string;
  proposedBudget?: string;
  milestonesCount?: number;
  contractorNotes?: string;
  contractorResponseDate?: string;
  proposedPlan?: ProposedPlanPayload;
}

export const INITIAL_BRIEFS: ProjectBrief[] = [
  {
    id: "brf-1",
    companyId: "comp-solidground",
    companyName: "SolidGround Engineering",
    title: "5-Bedroom Luxury Smart Duplex in Guzape",
    category: "Residential",
    estimatedBudget: "₦180.0M - ₦220.0M",
    location: "Guzape District, Abuja",
    status: "Proposal Ready",
    dateSubmitted: "Oct 08, 2026",
    description: "Full architectural execution including cantilever suspended slab, concealed rooftop chiller ducting, and private swimming pool foundation.",
    planId: "prop-guzape-plan",
    proposedBudget: "₦210.0M Proposed",
    milestonesCount: 8,
    contractorNotes: "We have reviewed your architectural brief for Guzape Residence and structured an 8-stage milestone plan with 10% mobilization and 5% defect retention.",
    contractorResponseDate: "Oct 12, 2026",
  },
  {
    id: "brf-2",
    companyId: "comp-crane",
    companyName: "Crane & Stone Structural",
    title: "Marine Piling for Private Boat Jetty",
    category: "Waterfront",
    estimatedBudget: "₦65.0M - ₦80.0M",
    location: "Lekki Phase 1 Waterfront, Lagos",
    status: "Revisions Requested",
    dateSubmitted: "Oct 10, 2026",
    description: "16 marine grade concrete driven piles into bedrock refusal depth with corrosion-resistant sheet reinforcement.",
    planId: "prop-enclave-plan",
    proposedBudget: "₦188.5M Proposed",
    milestonesCount: 7,
    contractorNotes: "Contractor is revising Stage 2 piling timelines per owner feedback sent on Oct 11.",
    contractorResponseDate: "Yesterday",
  },
  {
    id: "brf-3",
    companyId: "comp-julius",
    companyName: "Julius B. Consortium",
    title: "Lekki Phase 1 Luxury Villa - Turnkey Construction",
    category: "Residential",
    estimatedBudget: "₦220.0M - ₦250.0M",
    location: "Plot 14, Admiralty Way, Lekki",
    status: "Proposal Ready",
    dateSubmitted: "Jan 12, 2026",
    description: "Turnkey residential villa construction with 4 en-suite bedrooms, penthouse terrace, and private infinity pool.",
    planId: "prop-lekki-plan",
    proposedBudget: "₦245.0M Proposed",
    milestonesCount: 6,
    contractorNotes: "Milestone plan drafted for 6 construction stages matching your turnkey specifications. Ready for your review and contract agreement.",
    contractorResponseDate: "Jan 15, 2026",
  },
];

export const INITIAL_ACTIVE_PROJECTS: ProjectItem[] = [
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
    currentScope: "1st Floor Concrete Slab & Supporting Pillars",
    stageSubtitle: "Stage 3: First floor concrete decking",
    snippetLines: [
      "Steel reinforcement bars tied",
      "Concrete mix quality checked",
      "Strength test samples collected",
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
    currentScope: "Deep Foundation Concrete Pillars",
    stageSubtitle: "Stage 2: Deep foundation pillars",
    snippetLines: [
      "24 foundation pillars installed",
      "Water-resistant concrete poured",
      "Pillar strength test passed",
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
    currentScope: "Steel Roof Framework",
    stageSubtitle: "Stage 4: Roof framing & edge walls",
    snippetLines: [
      "Strong steel trusses installed",
      "Roof edge concrete casted",
      "Weight & strength check passed",
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
    currentScope: "Level 4 Concrete Walls",
    stageSubtitle: "Stage 4: Central elevator walls",
    snippetLines: [
      "Level 4 wall pouring active",
      "Floor support cables tightened",
      "Lifting pressure checked",
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
    currentScope: "Italian Marble Flooring & Smart Home Wiring",
    stageSubtitle: "Stage 5: Interior finishes & smart wiring",
    snippetLines: [
      "Italian marble delivered",
      "Smart home cabling installed",
      "Ceiling framing completed",
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
    currentScope: "Ground Leveling & Soil Compaction",
    stageSubtitle: "Stage 1: Site boundary & ground work",
    snippetLines: [
      "Ground support walls set",
      "Heavy soil rolling verified",
      "Water drainage pumps active",
    ],
    lastUpdated: "Oct 01, 08:45",
  },
];

export const INITIAL_CONTRACT_HISTORY: ProjectItem[] = [
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

export const INITIAL_PROPOSED_PLANS: ProjectItem[] = [
  {
    id: "prop-lekki-plan",
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
    briefId: "brf-3",
    briefTitle: "Lekki Phase 1 Luxury Villa - Turnkey Construction",
    originatingBriefSubmittedDate: "Jan 12, 2026",
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
    id: "prop-guzape-plan",
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
    briefId: "brf-1",
    briefTitle: "5-Bedroom Luxury Smart Duplex in Guzape",
    originatingBriefSubmittedDate: "Oct 08, 2026",
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
    id: "prop-enclave-plan",
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
    briefId: "brf-2",
    briefTitle: "Marine Piling for Private Boat Jetty",
    originatingBriefSubmittedDate: "Oct 10, 2026",
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

/**
 * Retrieve active projects, automatically moving any project that has finished
 * (progress >= 100% or all stages approved) into Contract History.
 */
export function getActiveProjects(): ProjectItem[] {
  if (typeof window === "undefined") {
    return INITIAL_ACTIVE_PROJECTS.filter((p) => p.progressPercent < 100);
  }

  // 1. If Demo Mode is OFF: Clean empty state for new user!
  const isDemo = getIsDemoMode();
  if (!isDemo) {
    try {
      const savedReal = localStorage.getItem(getOwnerScopedKey(STORAGE_KEY_ACTIVE));
      if (savedReal) {
        const parsed = JSON.parse(savedReal);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (p: ProjectItem) =>
              p.progressPercent < 100 &&
              p.status !== "Final sign-off" &&
              p.status !== "Completed"
          );
        }
      }
    } catch {}
    return [];
  }

  // 2. Demo Mode is ON:
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
    let list: ProjectItem[] = saved ? JSON.parse(saved) : INITIAL_ACTIVE_PROJECTS;
    if (!Array.isArray(list) || list.length === 0) list = INITIAL_ACTIVE_PROJECTS;

    const finished: ProjectItem[] = [];
    const active: ProjectItem[] = [];

    for (const p of list) {
      let is100 = p.progressPercent >= 100 || p.status === "Final sign-off" || p.status === "Completed";

      // Also check if stages in localStorage are all approved
      try {
        const savedStages = localStorage.getItem(`vantaged_stages_${p.id}`);
        if (savedStages) {
          const parsed = JSON.parse(savedStages);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((s: any) => s.status === "Approved")) {
            is100 = true;
          }
        }
      } catch {}

      if (is100) {
        finished.push({
          ...p,
          progressPercent: 100,
          status: "Final sign-off",
          stageSubtitle: "Completed & handed over",
          currentScope: "Completed Handover & Defect Closure",
          milestonesCount: p.milestonesTotal || p.milestonesCount,
        });
      } else {
        active.push(p);
      }
    }

    if (finished.length > 0) {
      // Move finished projects to contract history
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      let historyList: ProjectItem[] = savedHistory ? JSON.parse(savedHistory) : INITIAL_CONTRACT_HISTORY;
      for (const f of finished) {
        if (!historyList.some((h) => h.id === f.id)) {
          historyList = [f, ...historyList];
        }
      }
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyList));
      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(active));
    }

    // Enforce owner tier capacity:
    // If on Starter tier (Private Owner - 1 slot), only allow 1 project!
    const capacity = getOwnerCapacity();
    return active.slice(0, Math.max(1, capacity.totalSlots));
  } catch {
    const capacity = getOwnerCapacity();
    return INITIAL_ACTIVE_PROJECTS.filter((p) => p.progressPercent < 100).slice(0, Math.max(1, capacity.totalSlots));
  }
}

/**
 * Retrieve contract history projects. Every project is guaranteed to be 100% completed.
 */
export function getContractHistory(): ProjectItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  // Main empty-first state: return real saved contract history (empty for new users)
  if (!getIsDemoMode()) {
    try {
      const savedHistory = localStorage.getItem(getOwnerScopedKey(STORAGE_KEY_HISTORY));
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    let list: ProjectItem[] = saved ? JSON.parse(saved) : INITIAL_CONTRACT_HISTORY;
    if (!Array.isArray(list) || list.length === 0) list = INITIAL_CONTRACT_HISTORY;

    return list.map((p) => ({
      ...p,
      progressPercent: 100,
      status: "Final sign-off",
      stageSubtitle: "Completed & handed over",
      milestonesCount: p.milestonesTotal || p.milestonesCount,
    }));
  } catch {
    return INITIAL_CONTRACT_HISTORY;
  }
}

/**
 * Retrieve proposed plans awaiting agreement, filtering out any plan that has been accepted.
 */
export function getProposedPlans(): ProjectItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  // Main empty-first state: return real proposed plans (empty until a builder sends one)
  if (!getIsDemoMode()) {
    try {
      const saved = localStorage.getItem(getOwnerScopedKey(STORAGE_KEY_PLANS));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: ProjectItem) => {
            const status = localStorage.getItem(`vantaged_plan_status_${p.id}`);
            return status !== "ACCEPTED";
          });
        }
      }
    } catch {}
    return [];
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_PLANS);
    let list: ProjectItem[] = saved ? JSON.parse(saved) : INITIAL_PROPOSED_PLANS;
    if (!Array.isArray(list) || list.length === 0) list = INITIAL_PROPOSED_PLANS;

    return list.filter((p) => {
      const status = localStorage.getItem(`vantaged_plan_status_${p.id}`);
      return status !== "ACCEPTED";
    });
  } catch {
    return INITIAL_PROPOSED_PLANS;
  }
}

/**
 * Accept a proposed plan:
 * 1. Mark status as ACCEPTED.
 * 2. Remove plan from proposed plans.
 * 3. Add / activate the project in active projects.
 * 4. Dispatch storage update event.
 */
export function acceptProposedPlan(planId: string, explicitBrief?: ProjectBrief | null): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`vantaged_plan_status_${planId}`, "ACCEPTED");

    // Resolve linked brief from explicitBrief, dynamic plan cache, or stored briefs
    let linkedBrief: ProjectBrief | undefined = explicitBrief || undefined;
    if (!linkedBrief) {
      try {
        const cached = localStorage.getItem(`vantaged_dynamic_plan_${planId}`);
        if (cached) linkedBrief = JSON.parse(cached);
      } catch {}
    }
    if (!linkedBrief) {
      linkedBrief = getBriefForPlan(planId);
    }

    // Remove from proposed plans (both owner-scoped and global)
    const scopedPlansKey = getOwnerScopedKey(STORAGE_KEY_PLANS);
    const savedScopedPlans = localStorage.getItem(scopedPlansKey);
    const savedGlobalPlans = localStorage.getItem(STORAGE_KEY_PLANS);
    const scopedList: ProjectItem[] = savedScopedPlans ? JSON.parse(savedScopedPlans) : [];
    const globalList: ProjectItem[] = savedGlobalPlans ? JSON.parse(savedGlobalPlans) : INITIAL_PROPOSED_PLANS;
    const planToAccept =
      scopedList.find((p) => p.id === planId) ||
      globalList.find((p) => p.id === planId) ||
      INITIAL_PROPOSED_PLANS.find((p) => p.id === planId) ||
      (linkedBrief ? buildProposedPlanItemFromBrief(linkedBrief) : undefined);
    localStorage.setItem(
      scopedPlansKey,
      JSON.stringify(scopedList.filter((p) => p.id !== planId))
    );
    localStorage.setItem(
      STORAGE_KEY_PLANS,
      JSON.stringify(globalList.filter((p) => p.id !== planId))
    );

    // Add to active projects
    const currentActive = getActiveProjects();
    const capacity = getOwnerCapacity();
    const targetId = planId.startsWith("prop-") ? planId.replace("prop-", "proj-").replace("-plan", "") : planId;
    const existingIndex = currentActive.findIndex((p) => p.id === targetId || p.id === planId);

    if (existingIndex < 0 && currentActive.length >= capacity.totalSlots) {
      alert(
        `Project Capacity Reached: Your ${capacity.tierName} subscription allows ${capacity.totalSlots} active project${
          capacity.totalSlots > 1 ? "s" : ""
        }. Please upgrade your tier in Settings to manage additional concurrent sites.`
      );
      return;
    }

    const ownerSession = getOwnerSession();
    const ownerDisplayName =
      linkedBrief?.ownerName || ownerSession?.fullName || "Property Owner";
    const companyDisplayName =
      linkedBrief?.companyName ||
      linkedBrief?.proposedPlan?.companyName ||
      planToAccept?.contractor?.name ||
      "Julius B. Consortium";
    const directorDisplayName =
      linkedBrief?.proposedPlan?.directorName ||
      planToAccept?.contractor?.assignedRep ||
      "Engr. Babatunde Adeleke";
    const cleanEscrowAmount = (
      linkedBrief?.proposedBudget ||
      linkedBrief?.proposedPlan?.proposedBudget ||
      planToAccept?.escrowAmount ||
      "₦145.0M"
    ).replace(" Proposed", "");
    const stagesTotal =
      linkedBrief?.proposedPlan?.stages?.length ||
      linkedBrief?.milestonesCount ||
      planToAccept?.milestonesTotal ||
      6;
    const jobCode = planToAccept?.jobId
      ? planToAccept.jobId.replace("PROP-", "JOB-")
      : `JOB-${Math.floor(1000 + Math.random() * 9000)}`;

    const activatedProject: ProjectItem = {
      id: targetId,
      jobId: jobCode,
      title: linkedBrief?.title || planToAccept?.title || "New Building Project",
      category: planToAccept?.category || "Residential",
      location: linkedBrief?.location || planToAccept?.location || "Plot 14, Admiralty Way, Lekki",
      specs:
        linkedBrief?.proposedPlan?.presetName ||
        planToAccept?.specs ||
        "Building Construction",
      status: "In progress",
      milestonesCount: 0,
      milestonesTotal: stagesTotal,
      progressPercent: 0,
      escrowAmount: cleanEscrowAmount,
      contractor: {
        name: companyDisplayName,
        rating: planToAccept?.contractor?.rating || "4.9 ★",
        assignedRep: directorDisplayName,
      },
      currentScope: linkedBrief?.proposedPlan?.stages?.[0]?.title
        ? `Stage 1: ${linkedBrief.proposedPlan.stages[0].title}`
        : "Stage 1: Site Mobilization & Setting Out",
      stageSubtitle: "Stage 1: Ready to begin (0% completed)",
      snippetLines: [
        "Plan locked — starting at 0%",
        `${stagesTotal} agreed milestone stages`,
        "Awaiting initial escrow deposit & Stage 1 proof",
      ],
      lastUpdated: "Today, Just now",
    };

    let updatedActive: ProjectItem[];
    if (existingIndex >= 0) {
      updatedActive = [...currentActive];
      updatedActive[existingIndex] = activatedProject;
    } else {
      updatedActive = [activatedProject, ...currentActive];
    }

    localStorage.setItem(getOwnerScopedKey(STORAGE_KEY_ACTIVE), JSON.stringify(updatedActive));
    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(updatedActive));

    // Also add the locked project to the Company's Active Projects (`vantaged_company_accepted_projects`)
    const companyActiveFolder: ProjectItem & {
      companyId?: string;
      companyName?: string;
      ownerId?: string;
      ownerName?: string;
      requestId?: string;
      planId?: string;
      proposedStages?: ProposedPlanStageItem[];
    } = {
      ...activatedProject,
      companyId: linkedBrief?.companyId,
      companyName: companyDisplayName,
      ownerId: linkedBrief?.ownerId || ownerSession?.userId,
      ownerName: ownerDisplayName,
      requestId: linkedBrief?.id,
      planId,
      proposedStages: linkedBrief?.proposedPlan?.stages,
      contractor: {
        name: ownerDisplayName,
        rating: "Client · Verified NIN",
        assignedRep: directorDisplayName,
      },
      snippetLines: [
        `Client: ${ownerDisplayName}`,
        `${activatedProject.location} · ${stagesTotal} Stages`,
        "Agreement locked · 10% Mobilization due",
      ],
    };

    try {
      const existingCompanyRaw = localStorage.getItem("vantaged_company_accepted_projects");
      const existingCompanyList: any[] = existingCompanyRaw ? JSON.parse(existingCompanyRaw) : [];
      const filteredCompanyList = Array.isArray(existingCompanyList)
        ? existingCompanyList.filter((p) => p?.id !== companyActiveFolder.id)
        : [];
      localStorage.setItem(
        "vantaged_company_accepted_projects",
        JSON.stringify([companyActiveFolder, ...filteredCompanyList])
      );
      window.dispatchEvent(new Event("vantaged_company_projects_update"));
    } catch {}

    // Cache dynamic plan under the activated projectId as well so contractor project dashboard can read custom stages
    if (linkedBrief) {
      try {
        localStorage.setItem(
          `vantaged_dynamic_plan_${targetId}`,
          JSON.stringify({ ...linkedBrief, status: "Plan Accepted & Active" })
        );
      } catch {}
    }

    // Remove or mark request as accepted in Company's local requests cache (`vantaged_director_requests`)
    try {
      const dirReqsRaw = localStorage.getItem("vantaged_director_requests");
      if (dirReqsRaw) {
        const dirReqs: any[] = JSON.parse(dirReqsRaw);
        if (Array.isArray(dirReqs)) {
          const cleanPlan = planId.replace(/^prop-/, "").replace(/-plan$/, "");
          const updatedDirReqs = dirReqs.filter((r) => {
            if (!r?.id) return false;
            if (linkedBrief?.id && r.id === linkedBrief.id) return false;
            const rClean = String(r.id).replace(/^prop-/, "").replace(/-plan$/, "");
            return r.id !== planId && rClean !== cleanPlan;
          });
          localStorage.setItem("vantaged_director_requests", JSON.stringify(updatedDirReqs));
        }
      }
    } catch {}

    // Initialize clean ZERO-STATE workspace for BOTH Owner & Company Project Dashboards
    initializeFreshProjectWorkspace({
      projectId: activatedProject.id,
      title: activatedProject.title,
      location: activatedProject.location,
      category: activatedProject.category,
      contractValue: parseBudgetToNaira(cleanEscrowAmount),
      ownerName: ownerDisplayName,
      ownerEmail: linkedBrief?.ownerEmail || ownerSession?.email,
      ownerPhone: ownerSession?.phone,
      ownerId: linkedBrief?.ownerId || ownerSession?.userId,
      companyId: linkedBrief?.companyId,
      companyName: companyDisplayName,
      directorName: directorDisplayName,
      typicalDuration: linkedBrief?.proposedPlan?.typicalDuration,
      stages: linkedBrief?.proposedPlan?.stages,
    });

    ensureProjectConversation({
      projectId: activatedProject.id,
      projectTitle: activatedProject.title,
      ownerName: ownerDisplayName,
      ownerId: linkedBrief?.ownerId || ownerSession?.userId,
      companyId: linkedBrief?.companyId,
      contractorName: directorDisplayName,
      contractorCompany: companyDisplayName,
    });

    // Notify the Building Company that the Owner accepted the Plan & Contract
    pushCompanyLiveNotification({
      targetCompanyId: linkedBrief?.companyId,
      category: "stage",
      projectTitle: activatedProject.title,
      title: `Plan Accepted & Contract Locked by ${ownerDisplayName}`,
      description: `${ownerDisplayName} accepted your ${stagesTotal}-stage building plan (${cleanEscrowAmount}) for "${activatedProject.title}". The project is now live in Active Projects.`,
      href: `/contractor/projects/${activatedProject.id}`,
    });

    // Also update any linked project brief status to "Plan Accepted & Active"
    try {
      const briefs = getProjectBriefs();
      const cleanPlan = planId.replace("prop-", "").replace("proj-", "").replace("-plan", "");
      let matchedBriefId: string | null = linkedBrief?.id || null;
      const updatedBriefs = briefs.map((b) => {
        const bClean = (b.planId || "").replace("prop-", "").replace("proj-", "").replace("-plan", "");
        if (
          b.planId === planId ||
          (bClean && bClean === cleanPlan) ||
          b.id === planToAccept?.briefId ||
          (linkedBrief?.id && b.id === linkedBrief.id)
        ) {
          matchedBriefId = b.id;
          return {
            ...b,
            status: "Plan Accepted & Active" as const,
          };
        }
        return b;
      });
      localStorage.setItem(getOwnerScopedKey(STORAGE_KEY_BRIEFS), JSON.stringify(updatedBriefs));
      localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(updatedBriefs));
      if (matchedBriefId || planId) {
        fetch("/api/project-requests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: matchedBriefId || planId,
            planId,
            upsert: true,
            status: "Plan Accepted & Active",
            projectId: activatedProject.id,
            appendMessage: {
              sender: "owner",
              senderName: ownerDisplayName,
              text: `[Plan Accepted & Locked] I have accepted the ${stagesTotal}-stage building plan (${cleanEscrowAmount}). The project is now active!`,
            },
          }),
        }).catch(() => {});
      }
      fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...companyActiveFolder,
          ownerId: linkedBrief?.ownerId || ownerSession?.userId,
          companyId: linkedBrief?.companyId,
          companyName: companyDisplayName,
        }),
      }).catch(() => {});
    } catch {}

    broadcastPortalSync();
  } catch (err) {
    console.error("Error accepting proposed plan:", err);
  }
}

/**
 * Retrieve all project briefs.
 */
export function getProjectBriefs(): ProjectBrief[] {
  if (typeof window === "undefined") {
    return [];
  }

  // Main empty-first state: return real briefs submitted by the owner (empty initially)
  if (!getIsDemoMode()) {
    try {
      const saved = localStorage.getItem(getOwnerScopedKey(STORAGE_KEY_BRIEFS));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_BRIEFS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return INITIAL_BRIEFS;
  } catch {
    return INITIAL_BRIEFS;
  }
}

/**
 * Save or update a project brief in localStorage.
 */
export function saveProjectBrief(brief: ProjectBrief): void {
  if (typeof window === "undefined") return;
  try {
    const list = getProjectBriefs();
    const existingIndex = list.findIndex((b) => b.id === brief.id);
    let updated: ProjectBrief[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = brief;
    } else {
      updated = [brief, ...list];
    }
    localStorage.setItem(getOwnerScopedKey(STORAGE_KEY_BRIEFS), JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(updated));
    fetch("/api/project-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...brief,
        direction: "owner_to_company",
      }),
    }).catch(() => {});
    window.dispatchEvent(new Event("vantaged_storage_update"));
  } catch (err) {
    console.error("Error saving project brief:", err);
  }
}

/**
 * Find a project brief by its unique ID.
 */
export function getBriefById(id: string): ProjectBrief | undefined {
  const list = getProjectBriefs();
  return list.find((b) => b.id === id);
}

/**
 * Find the brief linked to a given proposed plan ID.
 */
export function getBriefForPlan(planId: string): ProjectBrief | undefined {
  const list = getProjectBriefs();
  const direct = list.find((b) => b.planId === planId);
  if (direct) return direct;

  const clean = planId.replace("prop-", "").replace("proj-", "").replace("-plan", "");
  return list.find((b) => {
    if (!b.planId) return false;
    const bClean = b.planId.replace("prop-", "").replace("proj-", "").replace("-plan", "");
    return clean === bClean;
  });
}

/**
 * Update the status of a project brief.
 */
export function updateBriefStatus(briefId: string, status: ProjectBrief["status"]): void {
  if (typeof window === "undefined") return;
  try {
    const list = getProjectBriefs();
    const updated = list.map((b) => (b.id === briefId ? { ...b, status } : b));
    localStorage.setItem(getOwnerScopedKey(STORAGE_KEY_BRIEFS), JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(updated));
    fetch("/api/project-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: briefId, status }),
    }).catch(() => {});
    window.dispatchEvent(new Event("vantaged_storage_update"));
  } catch (err) {
    console.error("Error updating brief status:", err);
  }
}

/**
 * Move a completed project from active projects to contract history.
 */
export function markProjectAsCompleted(projectId: string): void {
  if (typeof window === "undefined") return;
  try {
    const currentActive = getActiveProjects();
    const proj = currentActive.find((p) => p.id === projectId);
    const remainingActive = currentActive.filter((p) => p.id !== projectId);
    localStorage.setItem(getOwnerScopedKey(STORAGE_KEY_ACTIVE), JSON.stringify(remainingActive));
    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(remainingActive));

    const currentHistory = getContractHistory();
    const completedProject: ProjectItem = proj
      ? {
          ...proj,
          progressPercent: 100,
          status: "Final sign-off",
          stageSubtitle: "Completed & handed over",
          currentScope: "Completed Handover & Defect Closure",
          milestonesCount: proj.milestonesTotal || proj.milestonesCount,
          lastUpdated: "Completed",
        }
      : {
          id: projectId,
          jobId: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
          title: "Completed Project",
          category: "Residential",
          location: "Lagos, Nigeria",
          specs: "Commissioned Handover",
          status: "Final sign-off",
          milestonesCount: 12,
          milestonesTotal: 12,
          progressPercent: 100,
          escrowAmount: "₦145.0M",
          contractor: {
            name: "Julius B. Consortium",
            rating: "4.9 ★",
            assignedRep: "Engr. Chidi O.",
          },
          currentScope: "Completed Handover & Defect Closure",
          stageSubtitle: "Completed & handed over",
          snippetLines: [
            "All milestones passed",
            "Final snagging cleared",
            "Escrow disbursed to builder",
          ],
          lastUpdated: "Completed",
        };

    if (!currentHistory.some((h) => h.id === projectId)) {
      const updatedHistory = [completedProject, ...currentHistory];
      localStorage.setItem(getOwnerScopedKey(STORAGE_KEY_HISTORY), JSON.stringify(updatedHistory));
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    }

    window.dispatchEvent(new Event("vantaged_storage_update"));
  } catch (err) {
    console.error("Error marking project completed:", err);
  }
}

/**
 * Parse a Nigerian Naira budget string (e.g. "₦195,000,000", "₦210.5M", "₦100M - ₦250M") into numeric Naira.
 */
export function parseBudgetToNaira(raw?: string): number {
  if (!raw) return 150000000;
  const firstSegment = String(raw).split("-")[0] || raw;
  const upper = firstSegment.toUpperCase();
  const numMatch = upper.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!numMatch) return 150000000;
  const base = parseFloat(numMatch[1]);
  if (isNaN(base) || base <= 0) return 150000000;
  if (upper.includes("B")) return Math.round(base * 1000000000);
  if (upper.includes("M")) return Math.round(base * 1000000);
  if (upper.includes("K")) return Math.round(base * 1000);
  return Math.round(base);
}

/**
 * Build a Plan & Contract folder item from a ProjectBrief whose company sent a milestone plan.
 */
export function buildProposedPlanItemFromBrief(brief: ProjectBrief): ProjectItem {
  const planId = brief.planId || `prop-${brief.id}`;
  const stages = brief.proposedPlan?.stages || [];
  const stagesCount = stages.length || brief.milestonesCount || 6;
  const budgetLabel = brief.proposedBudget || brief.proposedPlan?.proposedBudget || brief.estimatedBudget || "₦150.0M";
  const category: ProjectItem["category"] =
    brief.category === "Commercial" || brief.category === "Industrial"
      ? "Commercial"
      : brief.category === "Waterfront" || brief.category === "Marine & Waterfront"
      ? "Waterfront"
      : "Residential";

  return {
    id: planId,
    jobId: `PROP-${String(brief.id).replace(/[^0-9A-Za-z]/g, "").slice(-4).toUpperCase()}`,
    title: brief.title,
    category,
    location: brief.location || "Lagos, Nigeria",
    specs: brief.proposedPlan?.presetName || `${stagesCount}-Stage Turnkey Plan`,
    status: "Inspection pending",
    milestonesCount: 0,
    milestonesTotal: stagesCount,
    progressPercent: 100,
    escrowAmount: budgetLabel.includes("Proposed") ? budgetLabel : `${budgetLabel} Proposed`,
    contractor: {
      name: brief.companyName || brief.proposedPlan?.companyName || "Verified Builder",
      rating: "4.9 ★",
      assignedRep: brief.proposedPlan?.directorName || "Project Director",
    },
    currentScope:
      brief.status === "Revisions Requested"
        ? "Revisions requested — discussing terms with builder"
        : "Proposed building plan ready for your review & agreement",
    stageSubtitle: `${stagesCount} Stages · ${brief.proposedPlan?.typicalDuration || "10% Mobilization"}`,
    snippetLines: [
      brief.status === "Revisions Requested" ? "Revisions Requested" : "Awaiting Owner Agreement",
      `${stagesCount} milestone stages proposed`,
      brief.proposedPlan?.presetName || "5% defect retention included",
    ],
    lastUpdated: brief.contractorResponseDate || brief.dateSubmitted || "Just now",
    briefId: brief.id,
  };
}

/**
 * Cache dynamic plan payload in localStorage so ProjectPlanReviewPage can display it immediately.
 */
export function cacheDynamicPlanRecord(brief: ProjectBrief): void {
  if (typeof window === "undefined") return;
  const planId = brief.planId || `prop-${brief.id}`;
  try {
    localStorage.setItem(`vantaged_dynamic_plan_${planId}`, JSON.stringify(brief));
  } catch {}
}

/**
 * Fetch Owner-submitted briefs & Company-sent plans from `/api/project-requests`
 * and synchronize them into the Owner's `My Briefs` and `Projects -> Plan & Contract` lists.
 */
export async function syncRemoteOwnerPlansAndBriefs(): Promise<{
  briefs: ProjectBrief[];
  plans: ProjectItem[];
}> {
  if (typeof window === "undefined") {
    return { briefs: [], plans: [] };
  }

  try {
    const session = getOwnerSession();
    const params = new URLSearchParams({ direction: "owner_to_company" });
    if (session?.userId) params.set("ownerId", session.userId);
    if (session?.email) params.set("ownerIdentifier", session.email);

    const res = await fetch(`/api/project-requests?${params.toString()}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const remoteRecords: ProjectBrief[] = Array.isArray(json?.data) ? json.data : [];

      if (remoteRecords.length > 0) {
        // Merge remote briefs into scoped & global brief storage
        const scopedBriefKey = getOwnerScopedKey(STORAGE_KEY_BRIEFS);
        const existingScopedRaw = localStorage.getItem(scopedBriefKey);
        const existingScoped: ProjectBrief[] = existingScopedRaw ? JSON.parse(existingScopedRaw) : [];

        const briefMap = new Map<string, ProjectBrief>();
        for (const b of existingScoped) {
          if (b?.id) briefMap.set(b.id, b);
        }
        for (const r of remoteRecords) {
          if (!r?.id) continue;
          const prev = briefMap.get(r.id);
          briefMap.set(r.id, { ...(prev || ({} as ProjectBrief)), ...r });
          if (r.planId || r.proposedPlan) {
            cacheDynamicPlanRecord({ ...(prev || ({} as ProjectBrief)), ...r });
          }
        }
        const mergedBriefs = Array.from(briefMap.values());
        localStorage.setItem(scopedBriefKey, JSON.stringify(mergedBriefs));

        // Also update global briefs list preserving demo entries if present
        const globalRaw = localStorage.getItem(STORAGE_KEY_BRIEFS);
        const globalList: ProjectBrief[] = globalRaw ? JSON.parse(globalRaw) : [];
        const gMap = new Map<string, ProjectBrief>();
        for (const b of globalList) if (b?.id) gMap.set(b.id, b);
        for (const r of mergedBriefs) gMap.set(r.id, r);
        localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(Array.from(gMap.values())));

        // Sync any "Proposal Ready" or "Revisions Requested" briefs into Proposed Plans (Plan & Contract)
        const scopedPlansKey = getOwnerScopedKey(STORAGE_KEY_PLANS);
        const existingPlansRaw = localStorage.getItem(scopedPlansKey);
        const existingPlans: ProjectItem[] = existingPlansRaw ? JSON.parse(existingPlansRaw) : [];
        const planMap = new Map<string, ProjectItem>();
        for (const p of existingPlans) {
          if (p?.id) planMap.set(p.id, p);
        }

        for (const brief of mergedBriefs) {
          const pid = brief.planId || `prop-${brief.id}`;
          if (brief.status === "Proposal Ready" || brief.status === "Revisions Requested") {
            const localStatus = localStorage.getItem(`vantaged_plan_status_${pid}`);
            if (localStatus !== "ACCEPTED") {
              planMap.set(pid, buildProposedPlanItemFromBrief(brief));
            }
          } else if (brief.status === "Plan Accepted & Active") {
            planMap.delete(pid);
          }
        }

        const mergedPlans = Array.from(planMap.values());
        localStorage.setItem(scopedPlansKey, JSON.stringify(mergedPlans));

        // Also mirror into global plans list when demo mode is active
        if (getIsDemoMode()) {
          const gPlansRaw = localStorage.getItem(STORAGE_KEY_PLANS);
          const gPlans: ProjectItem[] = gPlansRaw ? JSON.parse(gPlansRaw) : INITIAL_PROPOSED_PLANS;
          const gpMap = new Map<string, ProjectItem>();
          for (const p of gPlans) if (p?.id) gpMap.set(p.id, p);
          for (const p of mergedPlans) gpMap.set(p.id, p);
          localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(Array.from(gpMap.values())));
        }

        window.dispatchEvent(new Event("vantaged_storage_update"));
      }
    }
  } catch (err) {
    console.error("[projectStore] syncRemoteOwnerPlansAndBriefs error:", err);
  }

  return {
    briefs: getProjectBriefs(),
    plans: getProposedPlans(),
  };
}
