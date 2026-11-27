"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCamera,
  IconCheck,
  IconCheckCircle,
  IconClose,
  IconMapPin,
  IconPlus,
  IconReceipt,
  IconSend,
  IconVideo,
} from "../../../client/Owner dashboard/pages/projects dashboard/ProjectIcons";
import { useDirectorDemoMode } from "../hooks/useDirectorDemoMode";
import { useContractorUser } from "../hooks/useContractorUser";
import { useContractorCapacity } from "../hooks/useContractorCapacity";
import { DEMO_DIRECTOR_PROJECTS } from "../data/directorData";
import {
  BUILT_IN_PLATFORM_PRESETS,
  StageItem,
  StagePreset,
} from "../data/stagePresetsData";
import {
  ContractorProjectStage,
  ContractorProofItem,
  getContractorProjectDetail,
  loadProjectKey,
  saveProjectKey,
} from "../pages/project dashboard/contractorProjectData";
import {
  getContractorSession,
  readScopedCompanyAcceptedProjects,
} from "../../../shared/vantagedAuth";
import {
  CompanySentOwnerRequest,
  pushOwnerLiveNotification,
  readCompanySentRequests,
  saveCompanySentRequests,
} from "../../../shared/vantagedSyncBridge";
import { AddTeamMemberModal } from "./AddTeamMemberModal";

export interface DirectorQuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  illustration: React.ReactNode;
}

export const ALL_DIRECTOR_QUICK_ACTIONS: DirectorQuickActionItem[] = [
  {
    id: "create-project",
    title: "Send project request",
    subtitle: "Invite a property owner via email or phone",
    href: "/contractor/projects",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="10" y="12" width="34" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M18 22H36M18 29H32M18 36H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="44" cy="36" r="10" fill="var(--vt-color-orange-50,#FFF4EE)" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" />
        <path d="M44 31.5V40.5M39.5 36H48.5" stroke="var(--vt-color-orange-700,#B33C08)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "confirm-receipts",
    title: "Confirm payment receipts",
    subtitle: "Verify client transfers within 3-day window",
    href: "/contractor/transactions",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="8" y="14" width="38" height="26" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M8 22H46" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="29" width="14" height="4" rx="1.5" fill="var(--vt-color-neutral-200,#E2E0EC)" />
        <circle cx="45" cy="36" r="9" fill="var(--vt-color-green-50,#E9F6EC)" stroke="var(--vt-color-green-500,#2E9E57)" strokeWidth="2" />
        <path d="M41.5 36L44 38.5L48.5 33.5" stroke="var(--vt-color-green-700,#1F6B3E)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "submit-proof",
    title: "Submit stage proof",
    subtitle: "Upload geofenced photos, videos & checklist sign-offs",
    href: "/contractor/projects",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="10" y="16" width="36" height="26" rx="5" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <path d="M21 16L24 11H32L35 16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="28" cy="29" r="6.5" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
        <circle cx="45" cy="18" r="7" fill="var(--vt-color-orange-500,#EF5F18)" />
        <path d="M45 14.5V21.5M42 17.5L45 14.5L48 17.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "invite-staff",
    title: "Invite staff & crew",
    subtitle: "Create login email, password & role for team members",
    href: "/contractor/team",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <rect x="14" y="12" width="32" height="34" rx="4" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" />
        <circle cx="30" cy="24" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 38C21 33.8 25 31.5 30 31.5C35 31.5 39 33.8 39 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="45" cy="36" r="8" fill="var(--vt-color-orange-50,#FFF4EE)" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" />
        <path d="M45 32.5V39.5M41.5 36H48.5" stroke="var(--vt-color-orange-700,#B33C08)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "stage-presets",
    title: "Company stage presets",
    subtitle: "Customize stage templates & payment splits",
    href: "/contractor/presets",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <polygon points="32,10 52,20 32,30 12,20" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" fill="var(--vt-color-orange-50,#FFF4EE)" />
        <polyline points="12,28 32,38 52,28" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <polyline points="12,36 32,46 52,36" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "bank-details",
    title: "Corporate bank & KYC",
    subtitle: "Manage CAC-matched NUBAN & 48h safety lock",
    href: "/contractor/settings",
    illustration: (
      <svg className="h-12 w-16 text-[var(--vt-color-indigo-900,#261A66)]" viewBox="0 0 64 56" fill="none">
        <path d="M12 22L32 11L52 22H12Z" stroke="currentColor" strokeWidth="2" fill="#FFFFFF" strokeLinejoin="round" />
        <path d="M18 22V39M28 22V39M36 22V39M46 22V39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="39" width="44" height="6" rx="2" fill="var(--vt-color-orange-50,#FFF4EE)" stroke="var(--vt-color-orange-500,#EF5F18)" strokeWidth="2" />
      </svg>
    ),
  },
];

const STORAGE_KEY_QUICK_SLOTS = "vantaged_director_quick_slots";

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

interface ProofProjectCandidate {
  id: string;
  title: string;
  location: string;
  clientName: string;
  stages: ContractorProjectStage[];
  currentStage: ContractorProjectStage;
}

function resolveCurrentActiveStage(stages: ContractorProjectStage[]): ContractorProjectStage | null {
  if (!stages.length) return null;
  return (
    stages.find((s) => s.status === "Fix Requested") ||
    stages.find((s) => s.status === "Disputed") ||
    stages.find((s) => s.status === "In Progress") ||
    stages.find((s) => s.status === "Ready for Review") ||
    stages.find((s) => s.status === "Scheduled") ||
    stages[stages.length - 1] ||
    null
  );
}

function validateOwnerIdentifier(val: string): "email" | "phone" | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  if (isEmail) return "email";
  const digitsOnly = trimmed.replace(/[\s\-()+]/g, "");
  const isPhone = /^\d{7,15}$/.test(digitsOnly) && /^[+\d\s\-()]+$/.test(trimmed);
  if (isPhone) return "phone";
  return null;
}

export function DirectorQuickActions() {
  const router = useRouter();
  const { isDemoMode } = useDirectorDemoMode();
  const contractorUser = useContractorUser();
  const capacity = useContractorCapacity();
  const [mounted, setMounted] = useState(false);

  const [slots, setSlots] = useState<(string | null)[]>([
    "create-project",
    "submit-proof",
    "stage-presets",
    "invite-staff",
  ]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── Send Project Request Popup State ──
  const [isSendRequestOpen, setIsSendRequestOpen] = useState(false);
  const [ownerIdentifier, setOwnerIdentifier] = useState("");
  const [reqTitle, setReqTitle] = useState("");
  const [reqLocation, setReqLocation] = useState("");
  const [reqCategory, setReqCategory] = useState("Residential");
  const [reqBudget, setReqBudget] = useState("");
  const [reqNotes, setReqNotes] = useState("");
  const [reqError, setReqError] = useState<string | null>(null);

  // ── Invite Staff & Crew Popup State ──
  const [isInviteStaffOpen, setIsInviteStaffOpen] = useState(false);

  // ── Submit Stage Proof Popup State ──
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofProjects, setProofProjects] = useState<ProofProjectCandidate[]>([]);
  const [selectedProofProject, setSelectedProofProject] = useState<ProofProjectCandidate | null>(null);
  const [proofType, setProofType] = useState<ContractorProofItem["type"]>("photo");
  const [proofTitle, setProofTitle] = useState("");
  const [proofCaption, setProofCaption] = useState("");
  const [proofGps, setProofGps] = useState("");
  const [proofChecklistId, setProofChecklistId] = useState<string>("");
  const [markChecklistDone, setMarkChecklistDone] = useState(true);
  const [markReadyForReview, setMarkReadyForReview] = useState(false);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | undefined>(undefined);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Company Stage Presets Popup State ──
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);
  const [allPresets, setAllPresets] = useState<StagePreset[]>(BUILT_IN_PLATFORM_PRESETS);
  const [presetSearch, setPresetSearch] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    BUILT_IN_PLATFORM_PRESETS[0]?.id || "preset_duplex"
  );
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [newPresetForm, setNewPresetForm] = useState({
    name: "",
    category: "Residential" as StagePreset["category"],
    typicalDuration: "6 to 9 Months",
    description: "",
    stages: DEFAULT_NEW_PRESET_STAGES.map((s) => ({ ...s })),
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY_QUICK_SLOTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          const validated = parsed.map((id) =>
            id && ALL_DIRECTOR_QUICK_ACTIONS.some((a) => a.id === id) ? id : null
          );
          setSlots(validated);
        }
      } catch {
        // Ignore malformed cache
      }
    }
  }, []);

  const persistSlots = (nextSlots: (string | null)[]) => {
    setSlots(nextSlots);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_QUICK_SLOTS, JSON.stringify(nextSlots));
    }
  };

  const handleRemoveSlot = (index: number) => {
    const next = [...slots];
    next[index] = null;
    persistSlots(next);
  };

  const handleSelectAction = (actionId: string) => {
    if (activeSlotIndex !== null) {
      const next = [...slots];
      next[activeSlotIndex] = actionId;
      persistSlots(next);
    }
    setIsModalOpen(false);
    setActiveSlotIndex(null);
  };

  // ── Send Project Request Handler ──
  const identifierType = validateOwnerIdentifier(ownerIdentifier);

  const handleSendProjectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capacity.canAddProject) {
      setReqError(
        "All paid project slots are currently in use. Upgrade your plan or buy extra slots in Settings."
      );
      return;
    }
    const kind = validateOwnerIdentifier(ownerIdentifier);
    if (!kind) {
      setReqError(
        "Enter a valid owner email address or phone number to send this request."
      );
      return;
    }
    if (!reqTitle.trim() || !reqLocation.trim() || !reqBudget.trim()) {
      setReqError(
        "Please fill in the project title, site location, and estimated budget."
      );
      return;
    }

    const existing = readCompanySentRequests();
    const newReq: CompanySentOwnerRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      companyId: getContractorSession()?.userId,
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
    fetch("/api/project-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newReq, direction: "company_to_owner" }),
    }).catch(() => {});

    pushOwnerLiveNotification({
      targetOwnerIdentifier: newReq.ownerIdentifier,
      category: "site",
      projectTitle: newReq.title,
      title: `New Project Request from ${newReq.companyName}`,
      description: `${newReq.companyName} sent a project request for "${newReq.title}" (${newReq.budget}).`,
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
    showToast(`Sent project request "${newReq.title}" to ${newReq.ownerIdentifier}!`);
  };

  // ── Submit Stage Proof Handlers ──
  const openSubmitProofModal = () => {
    const liveAccepted = readScopedCompanyAcceptedProjects<any>();
    const demoAllowed = isDemoMode
      ? Math.max(0, capacity.totalSlots - liveAccepted.length)
      : 0;
    const demoSlice = isDemoMode ? DEMO_DIRECTOR_PROJECTS.slice(0, demoAllowed) : [];

    const combinedRaw: Array<{ id: string; title: string; location: string; clientName: string }> = [
      ...liveAccepted.map((p: any) => ({
        id: p.id,
        title: p.title || "Building Project",
        location: p.location || "Lagos, Nigeria",
        clientName: p.ownerName || p.contractor?.name || "Property Owner",
      })),
      ...demoSlice.map((p) => ({
        id: p.id,
        title: p.name,
        location: p.location,
        clientName: p.clientName,
      })),
    ];

    const candidates: ProofProjectCandidate[] = [];
    const seen = new Set<string>();
    for (const item of combinedRaw) {
      if (!item.id || seen.has(item.id)) continue;
      seen.add(item.id);
      const detail = getContractorProjectDetail(item.id, true);
      const stages = loadProjectKey<ContractorProjectStage[]>(item.id, "stages", detail.stages);
      const currentStage = resolveCurrentActiveStage(stages);
      if (currentStage) {
        candidates.push({
          id: item.id,
          title: item.title,
          location: item.location,
          clientName: item.clientName,
          stages,
          currentStage,
        });
      }
    }

    setProofProjects(candidates);
    setSelectedProofProject(null);
    setProofType("photo");
    setProofTitle("");
    setProofCaption("");
    setProofGps("");
    setProofChecklistId("");
    setMarkChecklistDone(true);
    setMarkReadyForReview(false);
    setUploadedPreviewUrl(undefined);
    setUploadedFileName("");
    setUploadedFileSize("");
    setIsProofModalOpen(true);
  };

  const handleSelectProjectForProof = (candidate: ProofProjectCandidate) => {
    setSelectedProofProject(candidate);
    setProofTitle("");
    setProofCaption("");
    setProofGps(candidate.location);
    setProofChecklistId(
      candidate.currentStage.checklist.find((c) => !c.isCompleted)?.id || ""
    );
    setMarkChecklistDone(true);
    setMarkReadyForReview(false);
    setUploadedPreviewUrl(undefined);
    setUploadedFileName("");
    setUploadedFileSize("");
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const kb = file.size / 1024;
    setUploadedFileSize(
      kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB`
    );
    if (!proofTitle.trim()) {
      setProofTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "));
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedPreviewUrl(undefined);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProofProject || !proofTitle.trim()) return;

    const targetStage = selectedProofProject.currentStage;
    const newProof: ContractorProofItem = {
      id: `prf-${Date.now()}`,
      type: proofType,
      title: proofTitle.trim(),
      caption:
        proofCaption.trim() ||
        `Field proof submitted for ${targetStage.title} (${selectedProofProject.title}).`,
      uploadedAt: "Just now",
      uploadedBy: `${contractorUser.fullName} (${contractorUser.role})`,
      gpsCoords: proofGps.trim() || selectedProofProject.location,
      checklistItemId: proofChecklistId || undefined,
      thumbnailUrl: uploadedPreviewUrl,
      fileSize:
        uploadedFileSize ||
        (proofType === "video"
          ? "14.2 MB"
          : proofType === "lab_report"
          ? "1.8 MB"
          : "2.4 MB"),
    };

    const nextStages: ContractorProjectStage[] = selectedProofProject.stages.map((st) => {
      if (st.id !== targetStage.id) return st;
      const nextChecklist =
        proofChecklistId && markChecklistDone
          ? st.checklist.map((c) =>
              c.id === proofChecklistId ? { ...c, isCompleted: true, ownerFlagged: false } : c
            )
          : st.checklist;
      const nextStatus = markReadyForReview
        ? "Ready for Review"
        : st.status === "Scheduled"
        ? "In Progress"
        : st.status;
      return {
        ...st,
        status: nextStatus,
        submittedAt: markReadyForReview ? "Just now" : st.submittedAt,
        checklist: nextChecklist,
        proofItems: [newProof, ...st.proofItems],
      };
    });

    saveProjectKey(selectedProofProject.id, "stages", nextStages);

    pushOwnerLiveNotification({
      projectId: selectedProofProject.id,
      projectTitle: selectedProofProject.title,
      category: "site",
      title: markReadyForReview
        ? `Stage Ready for Review: ${targetStage.title}`
        : `New Site Proof Uploaded: ${targetStage.title}`,
      description: `${contractorUser.companyName} uploaded "${newProof.title}" for ${targetStage.title}.`,
      linkUrl: `/owner/projects/${selectedProofProject.id}/stages/${targetStage.id}`,
    });

    const projectName = selectedProofProject.title;
    const stageName = targetStage.title;
    setIsProofModalOpen(false);
    setSelectedProofProject(null);
    showToast(`Proof uploaded to "${stageName}" on ${projectName} and synced live!`);
  };

  // ── Company Stage Presets Handlers ──
  const loadCompanyPresets = () => {
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

  const openPresetsModal = () => {
    loadCompanyPresets();
    setPresetSearch("");
    setIsCreatingPreset(false);
    setNewPresetForm({
      name: "",
      category: "Residential",
      typicalDuration: "6 to 9 Months",
      description: "",
      stages: DEFAULT_NEW_PRESET_STAGES.map((s) => ({ ...s })),
    });
    setIsPresetsModalOpen(true);
  };

  const filteredPresets = useMemo(() => {
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

  const handleCreatePresetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetForm.name.trim()) return;
    setIsSavingPreset(true);
    const normalizedStages: StageItem[] = newPresetForm.stages.map((stg, idx) => ({
      order: idx + 1,
      title: stg.title.trim() || `Stage ${idx + 1}`,
      evidence:
        stg.evidence.trim() ||
        "Site photos, inspection log, and quality certificates.",
    }));

    const createdPreset: StagePreset = {
      id: `preset_company_${Date.now()}`,
      name: newPresetForm.name.trim(),
      category: newPresetForm.category,
      typicalDuration: newPresetForm.typicalDuration.trim() || "Flexible Schedule",
      stagesCount: normalizedStages.length,
      description:
        newPresetForm.description.trim() ||
        `Custom company stage sequence created by ${contractorUser.companyName}.`,
      isCustom: true,
      source: "company",
      stages: normalizedStages,
    };

    try {
      await fetch("/api/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdPreset),
      });
    } catch {
      // Optimistically kept in list even if offline
    }

    setAllPresets((prev) => [createdPreset, ...prev]);
    setSelectedPresetId(createdPreset.id);
    setIsSavingPreset(false);
    setIsCreatingPreset(false);
    setNewPresetForm({
      name: "",
      category: "Residential",
      typicalDuration: "6 to 9 Months",
      description: "",
      stages: DEFAULT_NEW_PRESET_STAGES.map((s) => ({ ...s })),
    });
    showToast(
      `Saved company stage preset "${createdPreset.name}" (${normalizedStages.length} stages)!`
    );
  };

  const handleQuickActionClick = (action: DirectorQuickActionItem) => {
    if (action.id === "create-project") {
      setReqError(null);
      setIsSendRequestOpen(true);
      return;
    }
    if (action.id === "submit-proof") {
      openSubmitProofModal();
      return;
    }
    if (action.id === "stage-presets") {
      openPresetsModal();
      return;
    }
    if (action.id === "invite-staff") {
      setIsInviteStaffOpen(true);
      return;
    }
    router.push(action.href);
  };

  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 select-none font-sans"
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      >
        {slots.map((actionId, index) => {
          const action = actionId
            ? ALL_DIRECTOR_QUICK_ACTIONS.find((a) => a.id === actionId)
            : null;

          if (!action) {
            return (
              <div
                key={`empty-slot-${index}`}
                onClick={() => {
                  setActiveSlotIndex(index);
                  setIsModalOpen(true);
                }}
                className="w-full min-h-[150px] sm:min-h-[162px] h-[162px] bg-[var(--vt-color-orange-50,#FFF4EE)]/50 hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-dashed border-[var(--vt-color-orange-300,#FBA674)] hover:border-[var(--vt-color-orange-500,#EF5F18)] rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-md bg-[var(--vt-color-primary-default,#B33C08)] group-hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white flex items-center justify-center group-hover:scale-105 transition-all shadow-[0_4px_12px_rgba(179,60,8,0.28)]">
                  <IconPlus className="w-5 h-5" />
                </div>
                <span className="mt-2.5 text-xs font-bold text-[var(--vt-color-orange-700,#B33C08)] tracking-tight">
                  Add quick action
                </span>
              </div>
            );
          }

          return (
            <div
              key={`${action.id}-${index}`}
              onClick={() => handleQuickActionClick(action)}
              className="relative w-full min-h-[150px] sm:min-h-[162px] h-[162px] bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] rounded-xl p-4 sm:p-4.5 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-[0_4px_16px_rgba(38,26,102,0.04)] hover:shadow-[0_8px_24px_rgba(239,95,24,0.12)]"
            >
              <button
                type="button"
                title="Customize shortcut slot"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSlot(index);
                }}
                className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center text-[10px] font-bold transition-opacity cursor-pointer"
              >
                <IconClose className="w-3 h-3" />
              </button>

              <div className="mb-2.5 transition-transform duration-200 group-hover:scale-105">
                {action.illustration}
              </div>

              <h3 className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-700,#B33C08)] tracking-tight leading-snug">
                {action.title}
              </h3>
              <p className="mt-0.5 text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] line-clamp-2 leading-tight px-1">
                {action.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Invite Staff & Crew Modal (shared with Team & Crew page, portaled above navbar) */}
      <AddTeamMemberModal
        isOpen={isInviteStaffOpen}
        onClose={() => setIsInviteStaffOpen(false)}
        onCreated={(created) => {
          showToast(
            `Created login for ${created.name} (${created.email}) and added to Team & Crew!`
          );
        }}
      />

      {/* All remaining popups portaled to document.body so they sit cleanly IN FRONT of the navigation bar */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] shadow-[0_20px_50px_rgba(38,26,102,0.22)] overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                    Choose Quick Action
                  </h3>
                  <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                    Pin a Director, Site Manager, or Office Coordinator workflow
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-md hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center cursor-pointer"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                {ALL_DIRECTOR_QUICK_ACTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectAction(item.id)}
                    className="p-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/50 text-left flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <div className="shrink-0 scale-75">{item.illustration}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] line-clamp-2 mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── Send Project Request to Owner Popup (Portaled above navbar) ── */}
      {mounted &&
        isSendRequestOpen &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed inset-0 z-[120] bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none font-sans"
            onClick={() => setIsSendRequestOpen(false)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSendProjectRequest}
              className="w-full max-w-lg bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl overflow-hidden text-xs text-[var(--vt-color-text-default,#261A66)] animate-in zoom-in-95 duration-150"
            >
              <div className="px-6 py-4 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                    {contractorUser.companyName} · Slots {capacity.usedSlots}/{capacity.totalSlots}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    Send Project Request to Owner
                  </h3>
                  <p className="text-[11px] text-white/75 mt-0.5">
                    Deliver a building project invitation directly to the property owner&apos;s Vantaged inbox.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSendRequestOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
                {!capacity.canAddProject && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <p className="font-bold">
                        Project Slot Limit Reached ({capacity.usedSlots} / {capacity.totalSlots})
                      </p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Your <strong>{capacity.planName}</strong> plan has no open project slots left.
                      </p>
                    </div>
                    <Link
                      href="/contractor/settings?tab=plan"
                      onClick={() => setIsSendRequestOpen(false)}
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
                  disabled={!identifierType || !capacity.canAddProject}
                  className="h-9 px-4 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <IconSend className="w-3.5 h-3.5" />
                  <span>Send Project Request</span>
                </button>
              </div>
            </form>
          </div>,
          document.body
        )}

      {/* ── Submit Stage Proof Popup (Portaled above navbar) ── */}
      {mounted &&
        isProofModalOpen &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
            onClick={() => setIsProofModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-xs text-[var(--vt-color-text-default,#261A66)]"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                    {selectedProofProject
                      ? `STEP 2 OF 2 · ${selectedProofProject.title}`
                      : "STEP 1 OF 2 · FIELD EVIDENCE UPLOAD"}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white truncate mt-0.5">
                    {selectedProofProject
                      ? `Upload Proof to ${selectedProofProject.currentStage.title}`
                      : "Select Project to Submit Stage Proof"}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedProofProject && (
                    <button
                      type="button"
                      onClick={() => setSelectedProofProject(null)}
                      className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <IconArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Project</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsProofModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!selectedProofProject ? (
                /* Step 1: Project Selection List */
                <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                  {proofProjects.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center">
                        <IconCamera className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                          No Active Projects Available
                        </h4>
                        <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] max-w-sm mt-1 leading-relaxed">
                          Once an owner approves your building plan and a project becomes active, you can upload stage proof directly from here.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href="/contractor/requests"
                          onClick={() => setIsProofModalOpen(false)}
                          className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <span>View Project Requests</span>
                          <IconArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                        Pick an active construction site below. Proof will be attached directly to its current active stage and synced to the Property Owner.
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {proofProjects.map((prj) => {
                          const doneChecklist = prj.currentStage.checklist.filter(
                            (c) => c.isCompleted
                          ).length;
                          const totalChecklist = prj.currentStage.checklist.length;
                          return (
                            <button
                              key={prj.id}
                              type="button"
                              onClick={() => handleSelectProjectForProof(prj)}
                              className="w-full text-left p-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/50 transition-all cursor-pointer group flex items-center justify-between gap-4"
                            >
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-700,#B33C08)] truncate">
                                    {prj.title}
                                  </h4>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                      prj.currentStage.status === "Fix Requested" ||
                                      prj.currentStage.status === "Disputed"
                                        ? "bg-rose-50 text-rose-700 border-rose-200"
                                        : prj.currentStage.status === "Ready for Review"
                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                        : "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-200,#FDCAA9)]"
                                    }`}
                                  >
                                    {prj.currentStage.status}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                                  Current Stage: Stage {prj.currentStage.order} — {prj.currentStage.title}
                                </p>
                                <div className="flex items-center gap-3 text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] flex-wrap">
                                  <span className="inline-flex items-center gap-1">
                                    <IconMapPin className="w-3 h-3" />
                                    {prj.location}
                                  </span>
                                  <span>· Client: {prj.clientName}</span>
                                  <span>
                                    · {doneChecklist}/{totalChecklist} checklist items
                                  </span>
                                  <span>
                                    · {prj.currentStage.proofItems.length} proof uploaded
                                  </span>
                                </div>
                              </div>
                              <span className="h-8 px-3 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] group-hover:bg-[var(--vt-color-orange-500,#EF5F18)] group-hover:border-[var(--vt-color-orange-500,#EF5F18)] group-hover:text-white text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold flex items-center gap-1 shrink-0 transition-colors">
                                <span>Select</span>
                                <IconArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Step 2: Upload Proof Form for Selected Project's Current Stage */
                <form
                  onSubmit={handleSubmitProof}
                  className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-4"
                >
                  <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-700,#B33C08)]">
                        Target Milestone (Stage {selectedProofProject.currentStage.order} of{" "}
                        {selectedProofProject.stages.length})
                      </span>
                      <p className="text-xs sm:text-sm font-extrabold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                        {selectedProofProject.currentStage.title}
                      </p>
                    </div>
                    <Link
                      href={`/contractor/projects/${selectedProofProject.id}/stages/${selectedProofProject.currentStage.id}`}
                      onClick={() => setIsProofModalOpen(false)}
                      className="text-[11px] font-bold text-[var(--vt-color-orange-700,#B33C08)] hover:underline shrink-0"
                    >
                      Open Stage →
                    </Link>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Evidence Type
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(
                        [
                          { id: "photo", label: "Site Photo", icon: <IconCamera className="w-4 h-4" /> },
                          { id: "video", label: "Video Clip", icon: <IconVideo className="w-4 h-4" /> },
                          { id: "lab_report", label: "Lab / PDF Report", icon: <IconReceipt className="w-4 h-4" /> },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setProofType(opt.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            proofType === opt.id
                              ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-500,#EF5F18)] text-[var(--vt-color-orange-700,#B33C08)] ring-1 ring-[var(--vt-color-orange-400,#F78241)]"
                              : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-white"
                          }`}
                        >
                          {opt.icon}
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                      Attach Photo, Video, or PDF File
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={
                        proofType === "photo"
                          ? "image/*"
                          : proofType === "video"
                          ? "video/*"
                          : ".pdf,image/*"
                      }
                      onChange={handleProofFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 rounded-xl border-2 border-dashed border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)]/30 transition-all cursor-pointer flex items-center gap-4"
                    >
                      {uploadedPreviewUrl ? (
                        <img
                          src={uploadedPreviewUrl}
                          alt="Proof preview"
                          className="w-16 h-16 rounded-lg object-cover border border-[var(--vt-color-border-default,#E2E0EC)] shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-orange-600,#D84C0B)] flex items-center justify-center shrink-0">
                          <IconCamera className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] truncate">
                          {uploadedFileName || "Click to choose file from your device"}
                        </p>
                        <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                          {uploadedFileName
                            ? `${uploadedFileSize} · Ready to upload to ${selectedProofProject.currentStage.title}`
                            : proofType === "photo"
                            ? "JPG, PNG, or WEBP site inspection photo"
                            : proofType === "video"
                            ? "MP4 or MOV walkthrough video clip"
                            : "PDF concrete cube test, soil report, or structural sign-off"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                        Proof Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={proofTitle}
                        onChange={(e) => setProofTitle(e.target.value)}
                        placeholder="e.g. Foundation Rebar Spacing Check"
                        className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                        GPS / Site Location Tag
                      </label>
                      <input
                        type="text"
                        value={proofGps}
                        onChange={(e) => setProofGps(e.target.value)}
                        placeholder="e.g. 6.4474° N, 3.4723° E"
                        className="w-full h-9 px-3 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                      Inspector / Site Engineer Notes
                    </label>
                    <textarea
                      rows={2}
                      value={proofCaption}
                      onChange={(e) => setProofCaption(e.target.value)}
                      placeholder="Add measurements, concrete grade, materials used, or observations for the owner..."
                      className="w-full p-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
                    />
                  </div>

                  {selectedProofProject.currentStage.checklist.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-2.5">
                      <div>
                        <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                          Link to Stage Checklist Item (Optional)
                        </label>
                        <VantagedSelect
                          value={proofChecklistId}
                          onChange={(val) => setProofChecklistId(val)}
                          options={[
                            { value: "", label: "General stage proof (no specific checklist item)" },
                            ...selectedProofProject.currentStage.checklist.map((c) => ({
                              value: c.id,
                              label: `${c.isCompleted ? "✓ " : ""}${c.label}`,
                            })),
                          ]}
                        />
                      </div>
                      {proofChecklistId && (
                        <label className="flex items-center gap-2 text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={markChecklistDone}
                            onChange={(e) => setMarkChecklistDone(e.target.checked)}
                            className="accent-[var(--vt-color-orange-500,#EF5F18)] w-4 h-4 rounded"
                          />
                          <span>Mark linked checklist item as completed</span>
                        </label>
                      )}
                    </div>
                  )}

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)]/60 border border-[var(--vt-color-green-200,#A3D9B1)] text-xs font-semibold text-[var(--vt-color-green-800,#175230)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={markReadyForReview}
                      onChange={(e) => setMarkReadyForReview(e.target.checked)}
                      className="accent-[var(--vt-color-green-600,#248247)] w-4 h-4 rounded"
                    />
                    <span>
                      Also mark this stage as &ldquo;Ready for Review&rdquo; and notify the Property Owner
                    </span>
                  </label>

                  <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedProofProject(null)}
                      className="h-9 px-4 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={!proofTitle.trim()}
                      className="h-9 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                      <span>Upload Proof to Stage</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* ── Company Stage Presets Popup (Portaled above navbar) ── */}
      {mounted &&
        isPresetsModalOpen &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[var(--vt-color-indigo-950,#140B3B)]/55 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
            onClick={() => setIsPresetsModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`w-full ${
                isCreatingPreset ? "max-w-2xl" : "max-w-4xl"
              } bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-[var(--vt-color-text-default,#261A66)]`}
            >
              {/* Header */}
              {isCreatingPreset ? (
                <div className="px-6 py-4 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-between bg-[var(--vt-color-neutral-50,#F7F7FA)] shrink-0">
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      Create Company Stage Preset
                    </h3>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      Define a reusable construction milestone sequence and required proof for future client proposals.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPreset(false)}
                      className="h-8 px-3 rounded-lg bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer transition-colors"
                    >
                      ← Back to Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPresetsModalOpen(false)}
                      className="w-8 h-8 rounded-lg hover:bg-[var(--vt-color-neutral-200,#DDDCE6)] text-[var(--vt-color-neutral-500,#7C7894)] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <IconClose className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between gap-3 shrink-0">
                  <div className="min-w-0">
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                      {contractorUser.companyName} · {allPresets.length} Available Templates
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white truncate">
                      Company Stage Presets
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPreset(true)}
                      className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      <IconPlus className="w-3.5 h-3.5" />
                      <span>Create New Preset</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPresetsModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                    >
                      <IconClose className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {!isCreatingPreset ? (
                /* MODE 1: Browse Company & Platform Stage Presets */
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
                  {/* Left List */}
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
                        placeholder="Search stage presets..."
                        className="w-full h-10 pl-9 pr-8 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] focus:bg-white text-xs text-[var(--vt-color-indigo-900,#261A66)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                      />
                      {presetSearch && (
                        <button
                          type="button"
                          onClick={() => setPresetSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--vt-color-neutral-400,#A3A0B8)] hover:text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                        >
                          <IconClose className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {filteredPresets.map((p) => {
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
                              <span
                                className={`font-mono font-bold uppercase ${
                                  p.source === "company"
                                    ? "text-[var(--vt-color-orange-600,#D84C0B)]"
                                    : ""
                                }`}
                              >
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

                  {/* Right Preview */}
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

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
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
                        onClick={() => setIsPresetsModalOpen(false)}
                        className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                      >
                        Close
                      </button>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/contractor/presets"
                          onClick={() => setIsPresetsModalOpen(false)}
                          className="h-9 px-4 rounded-lg border border-[var(--vt-color-indigo-200,#D5D2EF)] bg-[var(--vt-color-indigo-50,#F4F3FC)] hover:bg-[var(--vt-color-indigo-100,#EAE7FA)] text-[var(--vt-color-indigo-900,#261A66)] text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <span>Full Presets Manager</span>
                          <IconArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setIsCreatingPreset(true)}
                          className="h-9 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <IconPlus className="w-3.5 h-3.5" />
                          <span>Add Preset</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODE 2: Interactive Stage Sequence Builder */
                <form
                  onSubmit={handleCreatePresetSubmit}
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
                      onClick={() => setIsCreatingPreset(false)}
                      className="h-9 px-4 rounded-xl bg-white hover:bg-[var(--vt-color-neutral-100,#ECEBF3)] text-[var(--vt-color-neutral-600,#5E5A7D)] text-xs font-semibold border border-[var(--vt-color-border-default,#E2E0EC)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingPreset || !newPresetForm.name.trim()}
                      className="h-9 px-5 rounded-xl bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                      <span>{isSavingPreset ? "Saving Preset..." : "Save Company Preset"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* Toast Feedback (Portaled above navbar) */}
      {mounted &&
        toastMessage &&
        createPortal(
          <div
            style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
            className="fixed bottom-6 right-6 z-[130] px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 select-none font-sans"
          >
            <IconCheckCircle className="w-4 h-4 text-[var(--vt-color-green-400,#4ADE80)]" />
            <span>{toastMessage}</span>
          </div>,
          document.body
        )}
    </>
  );
}
