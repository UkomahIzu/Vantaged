"use client";

import { ProjectItem } from "../../components/ProjectFolderCard";

export const STORAGE_KEY_ACTIVE = "vantaged_active_projects";
export const STORAGE_KEY_PLANS = "vantaged_proposed_plans";
export const STORAGE_KEY_HISTORY = "vantaged_contract_history";
export const STORAGE_KEY_BRIEFS = "vantaged_project_briefs";

export interface ProjectBrief {
  id: string;
  companyId: string;
  companyName: string;
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

    return active;
  } catch {
    return INITIAL_ACTIVE_PROJECTS.filter((p) => p.progressPercent < 100);
  }
}

/**
 * Retrieve contract history projects. Every project is guaranteed to be 100% completed.
 */
export function getContractHistory(): ProjectItem[] {
  if (typeof window === "undefined") {
    return INITIAL_CONTRACT_HISTORY;
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
    return INITIAL_PROPOSED_PLANS;
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
export function acceptProposedPlan(planId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`vantaged_plan_status_${planId}`, "ACCEPTED");

    // Remove from proposed plans
    const savedPlans = localStorage.getItem(STORAGE_KEY_PLANS);
    const plansList: ProjectItem[] = savedPlans ? JSON.parse(savedPlans) : INITIAL_PROPOSED_PLANS;
    const planToAccept = plansList.find((p) => p.id === planId) || INITIAL_PROPOSED_PLANS.find((p) => p.id === planId);
    const remainingPlans = plansList.filter((p) => p.id !== planId);
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(remainingPlans));

    // Add to active projects
    const currentActive = getActiveProjects();
    const targetId = planId.startsWith("prop-") ? planId.replace("prop-", "proj-").replace("-plan", "") : planId;
    const existingIndex = currentActive.findIndex((p) => p.id === targetId || p.id === planId);

    const activatedProject: ProjectItem = {
      id: targetId,
      jobId: planToAccept?.jobId ? planToAccept.jobId.replace("PROP-", "JOB-") : `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      title: planToAccept?.title || "New Building Project",
      category: planToAccept?.category || "Residential",
      location: planToAccept?.location || "Plot 14, Admiralty Way, Lekki",
      specs: planToAccept?.specs || "Building Construction",
      status: "In progress",
      milestonesCount: 1,
      milestonesTotal: planToAccept?.milestonesTotal || 6,
      progressPercent: 10,
      escrowAmount: planToAccept?.escrowAmount ? planToAccept.escrowAmount.replace(" Proposed", "") : "₦145.0M",
      contractor: planToAccept?.contractor || {
        name: "Julius B. Consortium",
        rating: "4.8 ★",
        assignedRep: "Engr. Babatunde Adeleke",
      },
      currentScope: "Stage 1: Ground Breaking & Mobilization Setup",
      stageSubtitle: "Stage 1: Site mobilization & boundary setting",
      snippetLines: [
        "Plan locked and agreement sealed",
        "10% Mobilisation deposit active",
        "Site perimeter setup active",
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

    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(updatedActive));

    // Also update any linked project brief status to "Plan Accepted & Active"
    try {
      const briefs = getProjectBriefs();
      const cleanPlan = planId.replace("prop-", "").replace("proj-", "").replace("-plan", "");
      const updatedBriefs = briefs.map((b) => {
        const bClean = (b.planId || "").replace("prop-", "").replace("proj-", "").replace("-plan", "");
        if (b.planId === planId || (bClean && bClean === cleanPlan) || b.id === planToAccept?.briefId) {
          return {
            ...b,
            status: "Plan Accepted & Active" as const,
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(updatedBriefs));
    } catch {}

    window.dispatchEvent(new Event("vantaged_storage_update"));
  } catch (err) {
    console.error("Error accepting proposed plan:", err);
  }
}

/**
 * Retrieve all project briefs.
 */
export function getProjectBriefs(): ProjectBrief[] {
  if (typeof window === "undefined") {
    return INITIAL_BRIEFS;
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
    localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(updated));
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
    localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(updated));
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
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    }

    window.dispatchEvent(new Event("vantaged_storage_update"));
  } catch (err) {
    console.error("Error marking project completed:", err);
  }
}
