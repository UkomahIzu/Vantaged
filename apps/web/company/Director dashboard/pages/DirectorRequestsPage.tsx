"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import {
  ProjectFolderCard,
  ProjectItem,
} from "../../../client/Owner dashboard/components/ProjectFolderCard";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCheckCircle,
  IconClose,
  IconMapPin,
  IconReceipt,
  IconShieldCheck,
} from "../../../client/Owner dashboard/pages/projects dashboard/ProjectIcons";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { useContractorCapacity } from "../hooks/useContractorCapacity";
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
import {
  broadcastPortalSync,
  pushOwnerLiveNotification,
  SHARED_SYNC_EVENT,
} from "../../../shared/vantagedSyncBridge";
import { getContractorSession, getOwnerScopedKey } from "../../../shared/vantagedAuth";
import { ProposalNegotiationChat } from "../../../shared/ProposalNegotiationChat";
import {
  buildProposedPlanItemFromBrief,
  cacheDynamicPlanRecord,
  ProjectBrief,
  STORAGE_KEY_BRIEFS,
  STORAGE_KEY_PLANS,
} from "../../../client/Owner dashboard/pages/projects dashboard/projectStore";

const DEMO_REQUEST_ID_SET = new Set([
  ...DEMO_DIRECTOR_PROJECT_REQUESTS.map((r) => r.id),
  "brf-1",
  "brf-2",
  "brf-3",
]);

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

function getMatchingPlanId(reqId: string, explicitPlanId?: string): string {
  if (explicitPlanId) return explicitPlanId;
  if (reqId === "brf-1") return "prop-guzape-plan";
  if (reqId === "brf-2") return "prop-enclave-plan";
  if (reqId === "brf-3") return "prop-lekki-plan";
  return `prop-${reqId}`;
}

export function DirectorRequestsPage() {
  const router = useRouter();
  const scrollRef = useScrollRestoration<HTMLElement>("director_requests");
  const { isDemoMode } = useDirectorDemoMode();
  const capacity = useContractorCapacity();
  const [showSlotLimitModal, setShowSlotLimitModal] = useState(false);

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
  const [requestMetaById, setRequestMetaById] = useState<
    Record<
      string,
      {
        planId?: string;
        ownerId?: string;
        ownerEmail?: string;
        ownerIdentifier?: string;
        companyId?: string;
        companyName?: string;
      }
    >
  >({});

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

  // Merge Owner-submitted briefs from backend /api/project-requests AND shared vantaged_project_briefs
  useEffect(() => {
    const mergeBriefList = (ownerBriefs: any[]) => {
      if (!Array.isArray(ownerBriefs) || ownerBriefs.length === 0) return;
      const session = getContractorSession();
      const myCompany = session?.companyName?.trim().toLowerCase() || "";
      const myCompanyId = session?.userId || "";

      const matching = ownerBriefs.filter((b: any) => {
        if (!b?.id || DEMO_REQUEST_ID_SET.has(b.id)) return false;
        if (myCompanyId && b.companyId && b.companyId === myCompanyId) return true;
        if (myCompany && b.companyName) {
          return String(b.companyName).trim().toLowerCase() === myCompany;
        }
        return !myCompany;
      });

      if (matching.length === 0) return;

      // Preserve owner/plan metadata and any already-sent proposals from backend
      setRequestMetaById((prevMeta) => {
        const nextMeta = { ...prevMeta };
        for (const b of matching) {
          nextMeta[b.id] = {
            planId: getMatchingPlanId(b.id, b.planId || prevMeta[b.id]?.planId),
            ownerId: b.ownerId || prevMeta[b.id]?.ownerId,
            ownerEmail: b.ownerEmail || prevMeta[b.id]?.ownerEmail,
            ownerIdentifier: b.ownerIdentifier || prevMeta[b.id]?.ownerIdentifier,
            companyId: b.companyId || prevMeta[b.id]?.companyId,
            companyName: b.companyName || prevMeta[b.id]?.companyName,
          };
        }
        return nextMeta;
      });

      const restoredPresetDetails: Record<string, { preset: StagePreset; proposedBudget: string }> = {};
      const restoredPresetLabels: Record<string, string> = {};
      for (const b of matching) {
        if (b.proposedPlan && Array.isArray(b.proposedPlan.stages)) {
          const restoredPreset: StagePreset = {
            id: b.proposedPlan.planId || `preset_${b.id}`,
            name: b.proposedPlan.presetName || `${b.title} Milestone Plan`,
            category: b.proposedPlan.category || "Residential",
            typicalDuration: b.proposedPlan.typicalDuration || "Flexible Schedule",
            stagesCount: b.proposedPlan.stages.length,
            description: b.proposedPlan.description || "",
            stages: b.proposedPlan.stages,
          };
          restoredPresetDetails[b.id] = {
            preset: restoredPreset,
            proposedBudget: b.proposedBudget || b.proposedPlan.proposedBudget || b.estimatedBudget,
          };
          restoredPresetLabels[b.id] = `${restoredPreset.name.split("(")[0].trim()} (${restoredPreset.stages.length} stages)`;
        }
      }
      if (Object.keys(restoredPresetDetails).length > 0) {
        setSentPresetDetailsByRequest((prev) => ({ ...prev, ...restoredPresetDetails }));
        setSentPresetByRequest((prev) => ({ ...prev, ...restoredPresetLabels }));
      }

      setRequests((prev) => {
        const byId = new Map<string, DirectorProjectRequestItem>();
        for (const r of prev) byId.set(r.id, r);
        for (const b of matching) {
          // If the Owner already accepted the plan, remove it from Project Requests / Plan & Contract
          // and ensure it is present in Company Active Projects (`vantaged_company_accepted_projects`).
          if (b.status === "Plan Accepted & Active") {
            byId.delete(b.id);
            try {
              const planId = getMatchingPlanId(b.id, b.planId);
              const targetProjId = planId.startsWith("prop-")
                ? planId.replace("prop-", "proj-").replace("-plan", "")
                : planId;
              const rawAccepted = localStorage.getItem("vantaged_company_accepted_projects");
              const acceptedList: any[] = rawAccepted ? JSON.parse(rawAccepted) : [];
              if (!acceptedList.some((p) => p?.id === targetProjId)) {
                const stagesCount =
                  b.proposedPlan?.stages?.length || b.milestonesCount || 6;
                const cleanBudget = String(
                  b.proposedBudget ||
                    b.proposedPlan?.proposedBudget ||
                    b.estimatedBudget ||
                    "₦150.0M"
                ).replace(" Proposed", "");
                const newActiveProj = {
                  id: targetProjId,
                  jobId: `JOB-${String(b.id).replace(/[^0-9A-Za-z]/g, "").slice(-4).toUpperCase()}`,
                  title: b.title || "Owner Building Project",
                  category:
                    b.category === "Commercial" || b.category === "Industrial"
                      ? "Commercial"
                      : b.category === "Waterfront" || b.category === "Marine & Waterfront"
                      ? "Waterfront"
                      : "Residential",
                  location: b.location || "Lagos, Nigeria",
                  specs: b.proposedPlan?.presetName || `${stagesCount}-Stage Turnkey Plan`,
                  status: "In progress",
                  milestonesCount: 1,
                  milestonesTotal: stagesCount,
                  progressPercent: 10,
                  escrowAmount: cleanBudget,
                  companyId: b.companyId,
                  companyName: b.companyName,
                  ownerId: b.ownerId,
                  ownerName: b.ownerName || "Property Owner",
                  requestId: b.id,
                  planId,
                  proposedStages: b.proposedPlan?.stages,
                  contractor: {
                    name: b.ownerName || "Property Owner",
                    rating: "Client · Verified NIN",
                    assignedRep: b.proposedPlan?.directorName || "Project Director",
                  },
                  currentScope: "Stage 1: Ground Breaking & Mobilization Setup",
                  stageSubtitle: "Stage 1: Site mobilization & boundary setting",
                  snippetLines: [
                    `Client: ${b.ownerName || "Property Owner"}`,
                    `${b.location || "Lagos"} · ${stagesCount} Stages`,
                    "Agreement locked · 10% Mobilization due",
                  ],
                  lastUpdated: "Just now",
                };
                localStorage.setItem(
                  "vantaged_company_accepted_projects",
                  JSON.stringify([newActiveProj, ...acceptedList])
                );
                window.dispatchEvent(new Event("vantaged_company_projects_update"));
              }
            } catch {}
            continue;
          }

          const existing = byId.get(b.id);
          const mapped: DirectorProjectRequestItem = {
            id: b.id,
            requestCode: existing?.requestCode || String(b.id).toUpperCase().slice(0, 10),
            ownerName: b.ownerName || existing?.ownerName || "Property Owner",
            ownerVerified: true,
            title: b.title || existing?.title || "Owner Project Brief",
            category:
              b.category === "Commercial"
                ? "Commercial"
                : b.category === "Industrial"
                ? "Industrial"
                : b.category === "Waterfront" || b.category === "Marine & Waterfront"
                ? "Marine & Waterfront"
                : "Residential",
            estimatedBudget: b.estimatedBudget || existing?.estimatedBudget || "₦100M - ₦200M",
            location: b.location || existing?.location || "Lagos, Nigeria",
            description: b.description || existing?.description || "Project brief submitted by property owner.",
            dateSubmitted: b.dateSubmitted || existing?.dateSubmitted || "Just now",
            status:
              b.status === "Proposal Ready" || b.status === "Revisions Requested"
                ? "Proposal Ready"
                : b.status === "Drafting Milestone Plan"
                ? "Drafting Milestone Plan"
                : existing?.status || "Under Contractor Review",
          };
          byId.set(b.id, mapped);
        }
        const merged = Array.from(byId.values());
        writeLocalData("vantaged_director_requests", merged);
        return merged;
      });
    };

    const syncOwnerBriefs = async () => {
      if (typeof window === "undefined") return;
      try {
        const raw = localStorage.getItem("vantaged_project_briefs");
        if (raw) {
          mergeBriefList(JSON.parse(raw));
        }
      } catch {}

      try {
        const session = getContractorSession();
        const params = new URLSearchParams({ direction: "owner_to_company" });
        if (session?.userId) params.set("companyId", session.userId);
        if (session?.companyName) params.set("companyName", session.companyName);
        const res = await fetch(`/api/project-requests?${params.toString()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.data)) {
            mergeBriefList(json.data);
          }
        }
      } catch {}
    };

    syncOwnerBriefs();
    const poll = setInterval(syncOwnerBriefs, 6000);
    window.addEventListener(SHARED_SYNC_EVENT, syncOwnerBriefs);
    window.addEventListener("storage", syncOwnerBriefs);
    return () => {
      clearInterval(poll);
      window.removeEventListener(SHARED_SYNC_EVENT, syncOwnerBriefs);
      window.removeEventListener("storage", syncOwnerBriefs);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openProposalModal = (req: DirectorProjectRequestItem) => {
    if (!capacity.canAddProject && req.status !== "Proposal Ready") {
      setShowSlotLimitModal(true);
      return;
    }
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
    () =>
      isDemoMode
        ? requests
        : requests.filter((r) => !DEMO_REQUEST_ID_SET.has(r.id)),
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
    const targetReq = requests.find((item) => item.id === id);
    const next = requests.map((item) =>
      item.id === id ? { ...item, status: nextStatus } : item
    );
    setRequests(next);
    writeLocalData("vantaged_director_requests", next);
    setActiveRequest((prev) =>
      prev && prev.id === id ? { ...prev, status: nextStatus } : prev
    );

    // Persist status change to backend /api/project-requests & notify Owner
    const meta = requestMetaById[id] || {};
    const session = getContractorSession();
    const companyName = session?.companyName || meta.companyName || "Construction Company";

    if (!DEMO_REQUEST_ID_SET.has(id)) {
      fetch("/api/project-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: nextStatus,
          contractorResponseDate: "Just now",
        }),
      }).catch(() => {});

      // Also update local owner briefs cache for same-browser reactivity
      if (typeof window !== "undefined") {
        try {
          const briefKeys = Array.from(
            new Set([
              STORAGE_KEY_BRIEFS,
              getOwnerScopedKey(STORAGE_KEY_BRIEFS),
              ...(meta.ownerId ? [`${STORAGE_KEY_BRIEFS}__${meta.ownerId}`] : []),
            ])
          );
          for (const bk of briefKeys) {
            const raw = localStorage.getItem(bk);
            if (!raw) continue;
            const list: ProjectBrief[] = JSON.parse(raw);
            if (!Array.isArray(list)) continue;
            const updated = list.map((b) =>
              b.id === id
                ? { ...b, status: nextStatus as ProjectBrief["status"], contractorResponseDate: "Just now" }
                : b
            );
            localStorage.setItem(bk, JSON.stringify(updated));
          }
        } catch {}
      }

      if (targetReq && (nextStatus === "Declined" || nextStatus === "Drafting Milestone Plan")) {
        pushOwnerLiveNotification({
          targetOwnerId: meta.ownerId,
          targetOwnerIdentifier: meta.ownerIdentifier || meta.ownerEmail,
          category: "site",
          projectTitle: targetReq.title,
          title:
            nextStatus === "Declined"
              ? `Project Brief Declined by ${companyName}`
              : `${companyName} Started Drafting Your Milestone Plan`,
          description:
            nextStatus === "Declined"
              ? `${companyName} declined the brief for "${targetReq.title}". You can invite another verified company.`
              : `${companyName} is preparing your stage plan and budget proposal for "${targetReq.title}".`,
          linkUrl: "/owner/find-companies?tab=briefs",
        });
        broadcastPortalSync();
      }
    }

    if (nextStatus === "Declined") {
      showToast(`Declined project request "${targetReq?.title || id}" and notified owner.`);
      setActiveRequest(null);
    } else if (nextStatus === "Drafting Milestone Plan") {
      showToast(`Marked "${targetReq?.title || id}" as Drafting Milestone Plan.`);
    }
  };

  /**
   * Dispatch a proposed building plan & contract budget back to the Property Owner
   * so it appears in the Owner's Projects -> Plan & Contract tab and Find Companies -> My Briefs.
   */
  const dispatchPlanToOwner = (
    target: DirectorProjectRequestItem,
    preset: StagePreset,
    budgetInput: string
  ) => {
    const session = getContractorSession();
    const meta = requestMetaById[target.id] || {};
    const planId = getMatchingPlanId(target.id, meta.planId);
    const finalBudget = (budgetInput || target.estimatedBudget || "₦150,000,000").trim();
    const companyName = session?.companyName || meta.companyName || "Verified Construction Company";
    const directorName = session?.fullName || "Project Director";
    const presetLabel = `${preset.name.split("(")[0].trim()} (${preset.stages.length} stages)`;

    const nextLabels = { ...sentPresetByRequest, [target.id]: presetLabel };
    const nextDetails = {
      ...sentPresetDetailsByRequest,
      [target.id]: { preset, proposedBudget: finalBudget },
    };
    setSentPresetByRequest(nextLabels);
    setSentPresetDetailsByRequest(nextDetails);
    writeLocalData("vantaged_director_sent_preset_labels", nextLabels);
    writeLocalData("vantaged_director_sent_preset_details", nextDetails);
    updateRequestStatus(target.id, "Proposal Ready");

    const proposedPlan = {
      planId,
      presetName: preset.name,
      category: preset.category,
      typicalDuration: preset.typicalDuration,
      description: preset.description,
      proposedBudget: finalBudget,
      companyName,
      directorName,
      sentAt: "Just now",
      stages: preset.stages,
    };

    const contractorNotes = `Prepared ${preset.stages.length}-stage milestone plan ("${preset.name}") at ${finalBudget}. Ready for your review, price discussion, and contract sign-off.`;

    // 1. Persist to backend /api/project-requests so Owner receives it across any browser/session
    fetch("/api/project-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: target.id,
        planId,
        upsert: true,
        direction: "owner_to_company",
        companyId: session?.userId || meta.companyId || "comp-verified",
        companyName,
        directorName,
        ownerId: meta.ownerId,
        ownerName: target.ownerName,
        ownerEmail: meta.ownerEmail,
        ownerIdentifier: meta.ownerIdentifier || meta.ownerEmail,
        title: target.title,
        category: target.category,
        estimatedBudget: target.estimatedBudget,
        location: target.location,
        description: target.description,
        dateSubmitted: target.dateSubmitted,
        status: "Proposal Ready",
        proposedBudget: finalBudget,
        milestonesCount: preset.stages.length,
        contractorNotes,
        contractorResponseDate: "Just now",
        proposedPlan,
      }),
    }).catch(() => {});

    // 2. Sync into localStorage for instant same-browser Owner Portal updates
    if (typeof window !== "undefined") {
      try {
        const updatedBriefRecord: ProjectBrief = {
          id: target.id,
          companyId: session?.userId || meta.companyId || "comp-verified",
          companyName,
          ownerId: meta.ownerId,
          ownerName: target.ownerName,
          ownerEmail: meta.ownerEmail,
          ownerIdentifier: meta.ownerIdentifier || meta.ownerEmail,
          title: target.title,
          category: target.category,
          estimatedBudget: target.estimatedBudget,
          location: target.location,
          status: "Proposal Ready",
          dateSubmitted: target.dateSubmitted,
          description: target.description,
          planId,
          proposedBudget: finalBudget,
          milestonesCount: preset.stages.length,
          contractorNotes,
          contractorResponseDate: "Just now",
          proposedPlan,
        };

        cacheDynamicPlanRecord(updatedBriefRecord);

        // Update briefs list (global + current/target owner scoped)
        const briefKeys = Array.from(
          new Set([
            STORAGE_KEY_BRIEFS,
            getOwnerScopedKey(STORAGE_KEY_BRIEFS),
            ...(meta.ownerId ? [`${STORAGE_KEY_BRIEFS}__${meta.ownerId}`] : []),
          ])
        );
        for (const bk of briefKeys) {
          const raw = localStorage.getItem(bk);
          const list: ProjectBrief[] = raw ? JSON.parse(raw) : [];
          const idx = list.findIndex((b) => b.id === target.id);
          const nextBriefs =
            idx >= 0
              ? list.map((b, i) => (i === idx ? { ...b, ...updatedBriefRecord } : b))
              : [updatedBriefRecord, ...list];
          localStorage.setItem(bk, JSON.stringify(nextBriefs));
        }

        // Add folder to Owner's Plan & Contract list (global + owner scoped)
        const planFolderItem = buildProposedPlanItemFromBrief(updatedBriefRecord);
        const planKeys = Array.from(
          new Set([
            STORAGE_KEY_PLANS,
            getOwnerScopedKey(STORAGE_KEY_PLANS),
            ...(meta.ownerId ? [`${STORAGE_KEY_PLANS}__${meta.ownerId}`] : []),
          ])
        );
        for (const pk of planKeys) {
          const raw = localStorage.getItem(pk);
          const list: ProjectItem[] = raw ? JSON.parse(raw) : [];
          const idx = list.findIndex((p) => p.id === planId);
          const nextPlans =
            idx >= 0
              ? list.map((p, i) => (i === idx ? planFolderItem : p))
              : [planFolderItem, ...list];
          localStorage.setItem(pk, JSON.stringify(nextPlans));
        }

        // Reset plan status to PROPOSED if company edited & resent after revisions
        localStorage.setItem(`vantaged_plan_status_${planId}`, "PROPOSED");

        pushOwnerLiveNotification({
          targetOwnerId: meta.ownerId,
          targetOwnerIdentifier: meta.ownerIdentifier || meta.ownerEmail,
          category: "site",
          projectTitle: target.title,
          title: `Building Plan & Contract Sent by ${companyName}`,
          description: `${companyName} sent a ${preset.stages.length}-stage plan (${finalBudget}) for "${target.title}". Review it in Plan & Contract and discuss pricing.`,
          linkUrl: `/owner/projects/${planId}/plan`,
        });

        broadcastPortalSync();
      } catch {}
    }
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
              <IconArrowLeft className="w-4 h-4" />
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
              <Link
                href="/contractor/settings?tab=plan"
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                  !capacity.canAddProject
                    ? "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
                    : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-indigo-900,#261A66)] hover:border-[var(--vt-color-orange-300,#FBA674)]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    !capacity.canAddProject ? "bg-amber-500" : "bg-[var(--vt-color-green-500,#2E9E57)]"
                  }`}
                />
                <span>
                  Slots: {capacity.usedSlots}/{capacity.totalSlots}
                  {!capacity.canAddProject ? " · Full (Upgrade)" : ""}
                </span>
              </Link>
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
                        Showing <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{filteredRequests.length}</strong> of {currentTabList.length}
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
                  {viewMode === "plans"
                    ? "No Plans & Contracts Sent Yet"
                    : "No Incoming Project Requests Yet"}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--vt-color-neutral-500,#7C7894)] max-w-md mt-1.5 leading-relaxed">
                  {viewMode === "plans"
                    ? "Once you send a milestone stage preset and budget proposal for an owner's brief, it will appear here while awaiting their approval."
                    : "When property owners submit project briefs to your firm from Find Verified Builders, their request folders will appear here for review."}
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
                      if (viewMode === "plans" || req.status === "Proposal Ready") {
                        router.push(`/contractor/requests/${req.id}/plan`);
                      } else {
                        setActiveRequest(req);
                      }
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
            className="w-full max-w-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-[var(--vt-color-orange-300,#FBA674)] flex items-center justify-center shrink-0 mt-0.5">
                  <IconReceipt className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                      {activeRequest.requestCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white">
                      {activeRequest.status === "Proposal Ready"
                        ? "Awaiting Owner's Approval"
                        : activeRequest.status}
                    </span>
                    {activeRequest.ownerVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-green-500,#2E9E57)]/20 text-[var(--vt-color-green-300,#86EFAC)] border border-[var(--vt-color-green-400,#4ADE80)]/30">
                        <IconShieldCheck className="w-3 h-3" />
                        <span>Verified NIN Owner</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 truncate">
                    {activeRequest.title}
                  </h2>
                  <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] mt-0.5">
                    Submitted {activeRequest.dateSubmitted} by <strong className="text-white">{activeRequest.ownerName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveRequest(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors"
              >
                <IconClose className="w-4 h-4" />
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
                  </div>
                )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Category
                  </span>
                  <p className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] mt-1">
                    {activeRequest.category}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)] block">
                    Owner Estimated Budget
                  </span>
                  <p className="font-mono font-extrabold text-xs text-[var(--vt-color-orange-700,#B33C08)] mt-1">
                    {activeRequest.estimatedBudget}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Site Location
                  </span>
                  <p className="font-semibold text-xs text-[var(--vt-color-indigo-900,#261A66)] mt-1 inline-flex items-center gap-1">
                    <IconMapPin className="w-3.5 h-3.5 text-[var(--vt-color-orange-500,#EF5F18)] shrink-0" />
                    <span className="truncate">{activeRequest.location}</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                  Brief Scope Description
                </span>
                <p className="text-[var(--vt-color-neutral-700,#46425F)] leading-relaxed mt-1 whitespace-pre-line">
                  {activeRequest.description}
                </p>
              </div>

              {/* Compact Price & Plan Negotiation Chat Box (Company ↔ Owner) */}
              <ProposalNegotiationChat
                requestId={activeRequest.id}
                planId={getMatchingPlanId(
                  activeRequest.id,
                  requestMetaById[activeRequest.id]?.planId
                )}
                currentRole="company"
                currentUserName={
                  getContractorSession()?.fullName ||
                  getContractorSession()?.companyName ||
                  "Project Director"
                }
                counterpartyName={activeRequest.ownerName}
                projectTitle={activeRequest.title}
                ownerId={requestMetaById[activeRequest.id]?.ownerId}
                ownerEmail={
                  requestMetaById[activeRequest.id]?.ownerEmail ||
                  requestMetaById[activeRequest.id]?.ownerIdentifier
                }
                companyId={
                  getContractorSession()?.userId ||
                  requestMetaById[activeRequest.id]?.companyId
                }
                companyName={
                  getContractorSession()?.companyName ||
                  requestMetaById[activeRequest.id]?.companyName
                }
                compact
              />
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
                      className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Send Milestone Proposal</span>
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                {activeRequest.status === "Proposal Ready" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => openProposalModal(activeRequest)}
                      className="h-9 px-3.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold cursor-pointer transition-colors"
                    >
                      Edit Proposal
                    </button>
                    <Link
                      href={`/contractor/requests/${activeRequest.id}/plan`}
                      className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Open Full Plan &amp; Chat</span>
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
                        dispatchPlanToOwner(
                          proposalTarget,
                          activeSelectedPreset,
                          proposedBudget || proposalTarget.estimatedBudget
                        );
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
                  dispatchPlanToOwner(
                    proposalTarget,
                    createdPreset,
                    proposedBudget || proposalTarget.estimatedBudget
                  );
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

      {/* Project Slot Capacity Limit Reached Modal */}
      {showSlotLimitModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowSlotLimitModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden text-xs"
          >
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                  Slot Capacity Reached
                </span>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5">
                  All Paid Project Slots Are Active
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSlotLimitModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-amber-100 text-amber-900 flex items-center justify-center cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                Your company is currently using{" "}
                <strong className="text-[var(--vt-color-indigo-900,#261A66)]">
                  {capacity.usedSlots} of {capacity.totalSlots}
                </strong>{" "}
                paid project slot{capacity.totalSlots === 1 ? "" : "s"} on{" "}
                <strong className="text-[var(--vt-color-indigo-900,#261A66)]">
                  {capacity.planName}
                </strong>
                {capacity.extraSlots > 0
                  ? ` (+${capacity.extraSlots} extra slot${capacity.extraSlots === 1 ? "" : "s"})`
                  : ""}
                . Upgrade your subscription tier or purchase an extra project slot before sending a new milestone proposal.
              </p>
              <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between">
                <span className="font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                  Active Slots Used
                </span>
                <span className="font-extrabold text-[var(--vt-color-orange-700,#B33C08)] tabular-nums">
                  {capacity.usedSlots} / {capacity.totalSlots} Slots
                </span>
              </div>
            </div>
            <div className="px-6 py-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSlotLimitModal(false)}
                className="h-9 px-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Close
              </button>
              <Link
                href="/contractor/settings?tab=plan"
                className="h-9 px-4 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>Upgrade / Buy Slots</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[70] px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <IconCheckCircle className="w-4 h-4 text-[var(--vt-color-green-400,#4ADE80)]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
