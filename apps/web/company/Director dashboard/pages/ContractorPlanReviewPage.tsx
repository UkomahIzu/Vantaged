"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DirectorSidebarNav } from "../components/DirectorSidebarNav";
import { DirectorHeaderBar } from "../components/DirectorHeaderBar";
import { VantagedSelect } from "../../../client/Owner dashboard/components/VantagedSelect";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCamera,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconClose,
  IconLock,
  IconMapPin,
  IconMaximize,
  IconPlus,
  IconPrinter,
  IconReceipt,
  IconSend,
  IconShieldCheck,
} from "../../../client/Owner dashboard/pages/projects dashboard/ProjectIcons";
import { useScrollRestoration } from "../../../client/Owner dashboard/hooks/useScrollRestoration";
import { ProposalNegotiationChat } from "../../../shared/ProposalNegotiationChat";
import {
  broadcastPortalSync,
  pushOwnerLiveNotification,
  SHARED_SYNC_EVENT,
} from "../../../shared/vantagedSyncBridge";
import {
  getContractorSession,
  getOwnerScopedKey,
} from "../../../shared/vantagedAuth";
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
  buildProposedPlanItemFromBrief,
  cacheDynamicPlanRecord,
  parseBudgetToNaira,
  ProjectBrief,
  STORAGE_KEY_BRIEFS,
  STORAGE_KEY_PLANS,
} from "../../../client/Owner dashboard/pages/projects dashboard/projectStore";

interface ContractorPlanReviewPageProps {
  requestId?: string;
}

export function ContractorPlanReviewPage({
  requestId = "req-guzape-04",
}: ContractorPlanReviewPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(
    `contractor_plan_review_${requestId}`
  );

  const [requests, setRequests] = useState<DirectorProjectRequestItem[]>(() =>
    readLocalData("vantaged_director_requests", DEMO_DIRECTOR_PROJECT_REQUESTS)
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
  const [remoteBrief, setRemoteBrief] = useState<ProjectBrief | null>(null);
  const [allPresets, setAllPresets] = useState<StagePreset[]>(
    BUILT_IN_PLATFORM_PRESETS
  );

  // Edit Proposal / Update Price & Stages Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [expandedStageOrder, setExpandedStageOrder] = useState<number | null>(
    null
  );
  const [editBudget, setEditBudget] = useState("");
  const [editPresetId, setEditPresetId] = useState("preset_duplex");
  const [editStages, setEditStages] = useState<StageItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  };

  useEffect(() => {
    fetch("/api/presets")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) return;
        const adminCustom: StagePreset[] = Array.isArray(data.adminCustomPresets)
          ? data.adminCustomPresets.map((p: StagePreset) => ({
              ...p,
              source: "admin" as const,
            }))
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
            ? {
                ...bp,
                ...overrides[bp.id],
                isModified: true,
                source: "platform" as const,
              }
            : { ...bp, source: "platform" as const }
        );
        setAllPresets([...companyCustom, ...adminCustom, ...mergedBuiltIn]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadRecord = async () => {
      if (typeof window !== "undefined") {
        setRequests(
          readLocalData(
            "vantaged_director_requests",
            DEMO_DIRECTOR_PROJECT_REQUESTS
          )
        );
        setSentPresetDetailsByRequest(
          readLocalData("vantaged_director_sent_preset_details", {
            "req-guzape-04": {
              preset: BUILT_IN_PLATFORM_PRESETS[0]!,
              proposedBudget: "₦195,000,000",
            },
          })
        );
        try {
          const cached =
            localStorage.getItem(`vantaged_dynamic_plan_prop-${requestId}`) ||
            localStorage.getItem(`vantaged_dynamic_plan_${requestId}`);
          if (cached) {
            setRemoteBrief(JSON.parse(cached));
          }
        } catch {}
      }

      try {
        const res = await fetch(
          `/api/project-requests?id=${encodeURIComponent(requestId)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const json = await res.json();
          const match: ProjectBrief | undefined = Array.isArray(json?.data)
            ? json.data[0]
            : undefined;
          if (match) {
            setRemoteBrief(match);
            cacheDynamicPlanRecord(match);
          }
        }
      } catch {}
    };

    loadRecord();
    const interval = setInterval(loadRecord, 5000);
    window.addEventListener(SHARED_SYNC_EVENT, loadRecord);
    window.addEventListener("storage", loadRecord);
    return () => {
      clearInterval(interval);
      window.removeEventListener(SHARED_SYNC_EVENT, loadRecord);
      window.removeEventListener("storage", loadRecord);
    };
  }, [requestId]);

  const localReq = useMemo(
    () =>
      requests.find((r) => r.id === requestId) ||
      DEMO_DIRECTOR_PROJECT_REQUESTS.find((r) => r.id === requestId) ||
      DEMO_DIRECTOR_PROJECT_REQUESTS[3]!,
    [requests, requestId]
  );

  const planId = useMemo(() => {
    if (remoteBrief?.planId) return remoteBrief.planId;
    if (requestId === "brf-1") return "prop-guzape-plan";
    if (requestId === "brf-2") return "prop-enclave-plan";
    if (requestId === "brf-3") return "prop-lekki-plan";
    return `prop-${requestId}`;
  }, [remoteBrief, requestId]);

  const resolvedPlan = useMemo(() => {
    const localSent = sentPresetDetailsByRequest[requestId];
    const remoteProposed = remoteBrief?.proposedPlan;

    const title = remoteBrief?.title || localReq.title;
    const ownerName = remoteBrief?.ownerName || localReq.ownerName || "Property Owner";
    const location = remoteBrief?.location || localReq.location;
    const category = remoteBrief?.category || localReq.category;
    const estimatedBudget = remoteBrief?.estimatedBudget || localReq.estimatedBudget;
    const description = remoteBrief?.description || localReq.description;
    const dateSubmitted = remoteBrief?.dateSubmitted || localReq.dateSubmitted;
    const requestCode =
      localReq.requestCode || String(requestId).toUpperCase().slice(0, 10);

    const proposedBudgetStr =
      remoteBrief?.proposedBudget ||
      remoteProposed?.proposedBudget ||
      localSent?.proposedBudget ||
      estimatedBudget ||
      "₦195,000,000";

    const contractValue = parseBudgetToNaira(proposedBudgetStr);

    const rawStages: Array<StageItem & { weightPercent?: number }> =
      remoteProposed?.stages && remoteProposed.stages.length > 0
        ? remoteProposed.stages.map((s: any, idx) => ({
            order: s.order || idx + 1,
            title: s.title,
            evidence: s.evidence,
            weightPercent: typeof s.weightPercent === "number" ? s.weightPercent : undefined,
          }))
        : localSent?.preset?.stages && localSent.preset.stages.length > 0
        ? localSent.preset.stages
        : BUILT_IN_PLATFORM_PRESETS[0]!.stages;

    const presetName =
      remoteProposed?.presetName ||
      localSent?.preset?.name ||
      "4-Bedroom Detached Duplex (7 stages)";

    const typicalDuration =
      remoteProposed?.typicalDuration ||
      localSent?.preset?.typicalDuration ||
      "6 to 9 Months";

    const count = rawStages.length || 1;
    const baseWeight = Math.floor(100 / count);
    const remainder = 100 - baseWeight * count;
    const hasCustomWeights =
      rawStages.every((s) => typeof s.weightPercent === "number" && s.weightPercent > 0) &&
      rawStages.reduce((acc, s) => acc + (s.weightPercent || 0), 0) === 100;

    const stagesWithWeights = rawStages.map((s, idx) => {
      const weightPercent = hasCustomWeights
        ? s.weightPercent!
        : idx === count - 1
        ? baseWeight + remainder
        : baseWeight;
      return {
        ...s,
        order: idx + 1,
        weightPercent,
        trancheAmount: Math.round((contractValue * weightPercent) / 100),
      };
    });

    const status =
      remoteBrief?.status === "Plan Accepted & Active"
        ? "ACCEPTED"
        : remoteBrief?.status === "Revisions Requested"
        ? "CHANGES_REQUESTED"
        : "PROPOSED";

    return {
      requestCode,
      title,
      ownerName,
      location,
      category,
      estimatedBudget,
      description,
      dateSubmitted,
      proposedBudgetStr,
      contractValue,
      presetName,
      typicalDuration,
      stages: stagesWithWeights,
      rawStages,
      status,
      contractorNotes:
        remoteBrief?.contractorNotes ||
        `Prepared ${rawStages.length}-stage milestone plan ("${presetName}") at ${proposedBudgetStr}. Ready for owner review, price discussion, and contract sign-off.`,
    };
  }, [localReq, remoteBrief, requestId, sentPresetDetailsByRequest]);

  const formatNaira = (val: number) => {
    if (val >= 1000000000) {
      return `₦${(val / 1000000000).toFixed(2)}B`;
    }
    if (val >= 1000000) {
      return `₦${(val / 1000000).toFixed(1)}M`;
    }
    return `₦${val.toLocaleString("en-NG")}`;
  };

  const depositAmount = resolvedPlan.contractValue * 0.1;
  const retentionAmount = resolvedPlan.contractValue * 0.05;
  const stageWeightsTotal = resolvedPlan.stages.reduce(
    (acc, s) => acc + s.weightPercent,
    0
  );

  const openEditProposalModal = () => {
    setEditBudget(resolvedPlan.proposedBudgetStr);
    const matchedPreset = allPresets.find(
      (p) => p.name === resolvedPlan.presetName
    );
    setEditPresetId(matchedPreset?.id || allPresets[0]?.id || "preset_duplex");
    setEditStages(
      resolvedPlan.stages.map((s) => ({
        order: s.order,
        title: s.title,
        evidence: s.evidence,
        weightPercent: s.weightPercent,
      }))
    );
    setIsEditModalOpen(true);
  };

  const handleSelectEditPreset = (presetId: string) => {
    setEditPresetId(presetId);
    const found = allPresets.find((p) => p.id === presetId);
    if (found) {
      const cnt = found.stages.length || 1;
      const base = Math.floor(100 / cnt);
      const rem = 100 - base * cnt;
      setEditStages(
        found.stages.map((s, idx) => ({
          ...s,
          weightPercent:
            typeof s.weightPercent === "number"
              ? s.weightPercent
              : idx === cnt - 1
              ? base + rem
              : base,
        }))
      );
    }
  };

  const handleAutoBalanceWeights = () => {
    setEditStages((prev) => {
      const cnt = prev.length || 1;
      const base = Math.floor(100 / cnt);
      const rem = 100 - base * cnt;
      return prev.map((s, idx) => ({
        ...s,
        weightPercent: idx === cnt - 1 ? base + rem : base,
      }));
    });
  };

  const editWeightsTotal = editStages.reduce(
    (sum, s) => sum + (Number(s.weightPercent) || 0),
    0
  );

  const handleSaveAndResendPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const session = getContractorSession();
    const companyName =
      session?.companyName ||
      remoteBrief?.companyName ||
      "Verified Construction Company";
    const directorName = session?.fullName || "Project Director";
    const finalBudget = (
      editBudget ||
      resolvedPlan.proposedBudgetStr ||
      "₦195,000,000"
    ).trim();

    const selectedPresetObj =
      allPresets.find((p) => p.id === editPresetId) ||
      BUILT_IN_PLATFORM_PRESETS[0]!;
    const normalizedStages: StageItem[] = editStages
      .filter((s) => s.title.trim())
      .map((s, idx) => ({
        order: idx + 1,
        title: s.title.trim(),
        evidence:
          s.evidence.trim() ||
          "Geofenced site photos, inspection checklist & lab certificate",
        ...(typeof s.weightPercent === "number" && s.weightPercent > 0
          ? { weightPercent: s.weightPercent }
          : {}),
      }));

    const finalStages =
      normalizedStages.length > 0 ? normalizedStages : selectedPresetObj.stages;

    const updatedPreset: StagePreset = {
      ...selectedPresetObj,
      stagesCount: finalStages.length,
      stages: finalStages,
    };

    const nextDetails = {
      ...sentPresetDetailsByRequest,
      [requestId]: { preset: updatedPreset, proposedBudget: finalBudget },
    };
    setSentPresetDetailsByRequest(nextDetails);
    writeLocalData("vantaged_director_sent_preset_details", nextDetails);

    const presetLabel = `${updatedPreset.name.split("(")[0].trim()} (${finalStages.length} stages)`;
    const existingLabels = readLocalData<Record<string, string>>(
      "vantaged_director_sent_preset_labels",
      {}
    );
    writeLocalData("vantaged_director_sent_preset_labels", {
      ...existingLabels,
      [requestId]: presetLabel,
    });

    const proposedPlan = {
      planId,
      presetName: updatedPreset.name,
      category: updatedPreset.category,
      typicalDuration: updatedPreset.typicalDuration,
      description: updatedPreset.description,
      proposedBudget: finalBudget,
      companyName,
      directorName,
      sentAt: "Updated just now",
      stages: finalStages,
    };

    const contractorNotes = `Updated ${finalStages.length}-stage milestone plan ("${updatedPreset.name}") at ${finalBudget} per our price & scope discussion.`;

    // 1. Update backend /api/project-requests and log an update note in the negotiation chat
    fetch("/api/project-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: requestId,
        planId,
        upsert: true,
        direction: "owner_to_company",
        companyId: session?.userId || remoteBrief?.companyId || "comp-verified",
        companyName,
        directorName,
        ownerId: remoteBrief?.ownerId,
        ownerName: resolvedPlan.ownerName,
        ownerEmail: remoteBrief?.ownerEmail,
        ownerIdentifier:
          remoteBrief?.ownerIdentifier || remoteBrief?.ownerEmail,
        title: resolvedPlan.title,
        category: resolvedPlan.category,
        estimatedBudget: resolvedPlan.estimatedBudget,
        location: resolvedPlan.location,
        description: resolvedPlan.description,
        dateSubmitted: resolvedPlan.dateSubmitted,
        status: "Proposal Ready",
        proposedBudget: finalBudget,
        milestonesCount: finalStages.length,
        contractorNotes,
        contractorResponseDate: "Updated just now",
        proposedPlan,
        appendMessage: {
          sender: "company",
          senderName: directorName,
          text: `[Updated Plan Sent] Contract price set to ${finalBudget} across ${finalStages.length} milestone stages.`,
        },
      }),
    }).catch(() => {});

    // 2. Sync localStorage for instant same-browser Owner Portal reflection
    if (typeof window !== "undefined") {
      try {
        const updatedBriefRecord: ProjectBrief = {
          id: requestId,
          companyId:
            session?.userId || remoteBrief?.companyId || "comp-verified",
          companyName,
          ownerId: remoteBrief?.ownerId,
          ownerName: resolvedPlan.ownerName,
          ownerEmail: remoteBrief?.ownerEmail,
          ownerIdentifier:
            remoteBrief?.ownerIdentifier || remoteBrief?.ownerEmail,
          title: resolvedPlan.title,
          category: resolvedPlan.category,
          estimatedBudget: resolvedPlan.estimatedBudget,
          location: resolvedPlan.location,
          status: "Proposal Ready",
          dateSubmitted: resolvedPlan.dateSubmitted,
          description: resolvedPlan.description,
          planId,
          proposedBudget: finalBudget,
          milestonesCount: finalStages.length,
          contractorNotes,
          contractorResponseDate: "Updated just now",
          proposedPlan,
        };

        setRemoteBrief(updatedBriefRecord);
        cacheDynamicPlanRecord(updatedBriefRecord);

        const briefKeys = Array.from(
          new Set([
            STORAGE_KEY_BRIEFS,
            getOwnerScopedKey(STORAGE_KEY_BRIEFS),
            ...(remoteBrief?.ownerId
              ? [`${STORAGE_KEY_BRIEFS}__${remoteBrief.ownerId}`]
              : []),
          ])
        );
        for (const bk of briefKeys) {
          const raw = localStorage.getItem(bk);
          const list: ProjectBrief[] = raw ? JSON.parse(raw) : [];
          const idx = list.findIndex((b) => b.id === requestId);
          const nextBriefs =
            idx >= 0
              ? list.map((b, i) =>
                  i === idx ? { ...b, ...updatedBriefRecord } : b
                )
              : [updatedBriefRecord, ...list];
          localStorage.setItem(bk, JSON.stringify(nextBriefs));
        }

        const planFolderItem =
          buildProposedPlanItemFromBrief(updatedBriefRecord);
        const planKeys = Array.from(
          new Set([
            STORAGE_KEY_PLANS,
            getOwnerScopedKey(STORAGE_KEY_PLANS),
            ...(remoteBrief?.ownerId
              ? [`${STORAGE_KEY_PLANS}__${remoteBrief.ownerId}`]
              : []),
          ])
        );
        for (const pk of planKeys) {
          const raw = localStorage.getItem(pk);
          const list = raw ? JSON.parse(raw) : [];
          const idx = list.findIndex((p: any) => p.id === planId);
          const nextPlans =
            idx >= 0
              ? list.map((p: any, i: number) =>
                  i === idx ? planFolderItem : p
                )
              : [planFolderItem, ...list];
          localStorage.setItem(pk, JSON.stringify(nextPlans));
        }

        localStorage.setItem(`vantaged_plan_status_${planId}`, "PROPOSED");

        pushOwnerLiveNotification({
          targetOwnerId: remoteBrief?.ownerId,
          targetOwnerIdentifier:
            remoteBrief?.ownerIdentifier || remoteBrief?.ownerEmail,
          category: "site",
          projectTitle: resolvedPlan.title,
          title: `Updated Building Plan & Price from ${companyName}`,
          description: `${companyName} updated the proposed contract price to ${finalBudget} (${finalStages.length} stages) for "${resolvedPlan.title}".`,
          linkUrl: `/owner/projects/${planId}/plan`,
        });

        broadcastPortalSync();
      } catch {}
    }

    setIsEditModalOpen(false);
    showToast(
      `Updated plan & contract price (${finalBudget}) sent to ${resolvedPlan.ownerName}!`
    );
  };

  const session = getContractorSession();
  const companyDisplayName =
    session?.companyName ||
    remoteBrief?.companyName ||
    "Verified Construction Company";
  const directorDisplayName = session?.fullName || "Project Director";

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <DirectorSidebarNav currentActiveItem="requests" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-5"
      >
        <DirectorHeaderBar
          leftSlot={
            <div className="flex items-center gap-2.5">
              <Link
                href="/contractor/requests"
                title="Back to Project Requests & Plans"
                className="w-8 h-8 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <IconArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-1.5 text-xs">
                <Link
                  href="/contractor/requests"
                  className="text-[var(--vt-color-neutral-500,#7C7894)] hover:text-[var(--vt-color-indigo-900,#261A66)] font-semibold transition-colors"
                >
                  Project Requests
                </Link>
                <span className="text-[var(--vt-color-neutral-300,#CBC8DA)] font-medium">
                  /
                </span>
                <span className="text-[var(--vt-color-neutral-500,#7C7894)] font-semibold">
                  Plan &amp; Contract
                </span>
                <span className="text-[var(--vt-color-neutral-300,#CBC8DA)] font-medium">
                  /
                </span>
                <span className="text-[var(--vt-color-indigo-900,#261A66)] font-bold truncate max-w-[220px]">
                  {resolvedPlan.title}
                </span>
              </div>
            </div>
          }
        />

        {/* ── Top Proposal Banner ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                Pre-Construction Agreement
              </span>
              <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                •
              </span>
              <span className="text-xs font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                Client: <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{resolvedPlan.ownerName}</strong>
              </span>
              <span className="text-xs text-[var(--vt-color-neutral-400,#A3A0B8)]">
                •
              </span>
              <span className="text-xs font-mono font-bold text-[var(--vt-color-orange-600,#D84C0B)]">
                {resolvedPlan.requestCode}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Sent Building Plan &amp; Price Negotiation
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 max-w-2xl leading-relaxed">
              Discuss contract pricing, mobilization deposit, and milestone deliverables directly with{" "}
              <strong>{resolvedPlan.ownerName}</strong> below. You can update the contract price or adjust stages at any time before the owner locks the agreement.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => window.print()}
              className="h-10 px-3.5 rounded-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <IconPrinter className="w-3.5 h-3.5" />
              <span>Print Plan</span>
            </button>

            {resolvedPlan.status !== "ACCEPTED" && (
              <button
                type="button"
                onClick={openEditProposalModal}
                className="h-10 px-4 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <IconReceipt className="w-4 h-4" />
                <span>Update Price &amp; Stages</span>
              </button>
            )}
          </div>
        </section>

        {/* ── Status Banner ── */}
        {resolvedPlan.status === "ACCEPTED" ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--vt-color-green-900,#0F331E)] shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-green-600,#248246)] text-white flex items-center justify-center shrink-0 shadow-xs">
                <IconCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-sm text-[var(--vt-color-green-950,#061F10)] block">
                  Owner Accepted Plan &amp; Agreement Locked (Version 1.0)
                </span>
                <span className="text-[11.5px] text-[var(--vt-color-green-800,#17512F)]">
                  {resolvedPlan.ownerName} accepted your milestone plan. This build is now live in your{" "}
                  <strong>Active Projects</strong> portfolio.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Link
                href="/contractor/projects"
                className="h-9 px-4 rounded-lg bg-[var(--vt-color-green-600,#248246)] hover:bg-[var(--vt-color-green-700,#1F6B3E)] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5"
              >
                <span>Open Active Projects</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : resolvedPlan.status === "CHANGES_REQUESTED" ? (
          <div className="p-4 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--vt-color-orange-900,#722306)]">
            <div className="flex items-center gap-2.5">
              <IconAlertTriangle className="w-5 h-5 text-[var(--vt-color-orange-600,#D84C0B)] shrink-0" />
              <span>
                <strong>Owner Requested Revisions:</strong> {resolvedPlan.ownerName} left feedback in the negotiation chat below. Review their comments and click{" "}
                <strong>Update Price &amp; Stages</strong> to send an updated proposal.
              </span>
            </div>
            <button
              type="button"
              onClick={openEditProposalModal}
              className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shrink-0 cursor-pointer"
            >
              Revise Plan Now
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] text-white flex items-center justify-center shrink-0">
                <IconShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] block">
                  Milestone Proposal Dispatched by {companyDisplayName}
                </span>
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  Preset: {resolvedPlan.presetName} • Director: {directorDisplayName}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                Owner Status
              </span>
              <span className="font-bold text-[var(--vt-color-orange-700,#B33C08)]">
                Awaiting {resolvedPlan.ownerName}&apos;s Sign-Off
              </span>
            </div>
          </div>
        )}

        {/* ── Owner's Originating Project Brief Card ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 shadow-2xs flex flex-col gap-3.5 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--vt-color-neutral-100,#EFEEF5)] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center shrink-0 shadow-2xs">
                <IconReceipt className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                    Owner&apos;s Originating Project Brief
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                    Ref: {resolvedPlan.requestCode}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Submitted {resolvedPlan.dateSubmitted} by {resolvedPlan.ownerName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsBriefModalOpen(true)}
              className="h-8 px-3 rounded-lg bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] transition-colors self-start sm:self-auto cursor-pointer shadow-2xs font-sans inline-flex items-center gap-1.5"
            >
              <span>View Full Owner Brief</span>
              <IconMaximize className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                Owner&apos;s Estimated Budget
              </span>
              <span className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block">
                {resolvedPlan.estimatedBudget}
              </span>
              <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
                Your proposed quote:{" "}
                <strong className="text-[var(--vt-color-orange-600,#D84C0B)]">
                  {formatNaira(resolvedPlan.contractValue)}
                </strong>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                Project Title &amp; Site Location
              </span>
              <span className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] mt-0.5 block truncate">
                {resolvedPlan.title}
              </span>
              <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 inline-flex items-center gap-1">
                <IconMapPin className="w-3 h-3 text-[var(--vt-color-orange-500,#EF5F18)]" />
                <span>
                  {resolvedPlan.category} • {resolvedPlan.location}
                </span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                Owner Requested Scope
              </span>
              <span className="text-[11.5px] text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5 line-clamp-2 block leading-relaxed">
                {resolvedPlan.description}
              </span>
            </div>
          </div>
        </section>

        {/* ── Key Contract Numbers ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Proposed Contract Price
              </span>
              <span className="w-7 h-7 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-600,#D84C0B)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex items-center justify-center">
                <IconReceipt className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                {formatNaira(resolvedPlan.contractValue)}
              </div>
              <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
                100% of proposed contract value
              </span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Mobilisation Deposit (10%)
              </span>
              <span className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center">
                <IconClock className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                {formatNaira(depositAmount)}
              </div>
              <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
                Disbursed upon plan acceptance
              </span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Total Stages &amp; Weights
              </span>
              <span className="w-7 h-7 rounded-lg bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border border-[var(--vt-color-green-200,#A3D9B1)] flex items-center justify-center">
                <IconCheckCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-green-700,#1F6B3E)]">
                {resolvedPlan.stages.length} Stages ({stageWeightsTotal}%)
              </div>
              <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
                {resolvedPlan.typicalDuration} estimated schedule
              </span>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
                Retention Holdback (5%)
              </span>
              <span className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] text-[var(--vt-color-indigo-900,#261A66)] flex items-center justify-center">
                <IconLock className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)]">
                {formatNaira(retentionAmount)}
              </div>
              <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5 block">
                Released at final handover
              </span>
            </div>
          </div>
        </section>

        {/* ── Live Price & Plan Discussion Box (Company ↔ Owner) ── */}
        <section>
          <ProposalNegotiationChat
            requestId={requestId}
            planId={planId}
            currentRole="company"
            currentUserName={directorDisplayName}
            counterpartyName={resolvedPlan.ownerName}
            projectTitle={resolvedPlan.title}
            ownerId={remoteBrief?.ownerId}
            ownerEmail={remoteBrief?.ownerEmail || remoteBrief?.ownerIdentifier}
            companyId={session?.userId || remoteBrief?.companyId}
            companyName={companyDisplayName}
          />
        </section>

        {/* ── Sent Stages & Tranche Breakdown Table ── */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden flex flex-col pb-6">
          <div className="p-5 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                Sent Milestone Stages &amp; Payment Tranches
              </h3>
              <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                This exact stage breakdown is visible to {resolvedPlan.ownerName} on their Plan &amp; Contract review page.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-[var(--vt-color-green-700,#1F6B3E)] bg-[var(--vt-color-green-50,#E9F6EC)] px-3 py-1 rounded-full border border-[var(--vt-color-green-200,#A3D9B1)]">
                Total Weight: {stageWeightsTotal}%
              </span>
              {resolvedPlan.status !== "ACCEPTED" && (
                <button
                  type="button"
                  onClick={openEditProposalModal}
                  className="h-8 px-3 rounded-lg bg-[var(--vt-color-orange-50,#FFF4EE)] hover:bg-[var(--vt-color-orange-100,#FFE6D5)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit Stages / Price
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[780px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                  <th className="py-3 px-4">Stage # &amp; Title</th>
                  <th className="py-3 px-4 text-center">Weight</th>
                  <th className="py-3 px-4 text-right">Tranche Amount</th>
                  <th className="py-3 px-4">Schedule Window</th>
                  <th className="py-3 px-4">Required Evidence</th>
                  <th className="py-3 px-4">Proof Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vt-color-border-default,#E2E0EC)]/70">
                {resolvedPlan.stages.map((stg) => {
                  const isExpanded = expandedStageOrder === stg.order;
                  return (
                    <React.Fragment key={stg.order}>
                      <tr
                        onClick={() =>
                          setExpandedStageOrder(isExpanded ? null : stg.order)
                        }
                        className="hover:bg-[var(--vt-color-neutral-50,#F7F7FA)]/60 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-md bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] font-bold text-xs flex items-center justify-center text-[var(--vt-color-orange-700,#B33C08)] shrink-0 mt-0.5">
                              {stg.order}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)] group-hover:text-[var(--vt-color-orange-600,#D84C0B)] transition-colors block">
                                {stg.title}
                              </span>
                              <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] line-clamp-1 max-w-sm mt-0.5">
                                {stg.evidence}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-xs text-[var(--vt-color-indigo-900,#261A66)]">
                          {stg.weightPercent}%
                        </td>

                        <td className="py-3.5 px-4 text-right font-black text-sm text-[var(--vt-color-indigo-900,#261A66)]">
                          {formatNaira(stg.trancheAmount)}
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <span>Stage {stg.order}</span>
                          <span className="text-[var(--vt-color-neutral-400,#A3A0B8)] mx-1">
                            →
                          </span>
                          <span>{resolvedPlan.typicalDuration}</span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px]">
                          <span className="font-bold text-[var(--vt-color-indigo-900,#261A66)] flex items-center gap-1">
                            <span>Inspection deliverables</span>
                            <span className="text-[10px] text-[var(--vt-color-orange-600,#D84C0B)] font-medium">
                              {isExpanded ? "(Hide)" : "(View)"}
                            </span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                          <span className="inline-flex items-center gap-1 text-[var(--vt-color-green-700,#1F6B3E)] font-bold">
                            <IconCamera className="w-3.5 h-3.5" />
                            <span>Min 3 GPS Photos</span>
                          </span>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[var(--vt-color-neutral-50,#F7F7FA)]/80 animate-in fade-in duration-150">
                          <td colSpan={6} className="py-3.5 px-6">
                            <div className="flex flex-col gap-1.5">
                              <span className="font-bold text-[11px] text-[var(--vt-color-indigo-900,#261A66)] uppercase tracking-wider">
                                Stage {stg.order} Verification Deliverables:
                              </span>
                              <div className="p-3 rounded-xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs text-[var(--vt-color-neutral-700,#484564)] font-medium">
                                {stg.evidence}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ── UPDATE CONTRACT PRICE & STAGES MODAL ── */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans"
          >
            <div className="px-6 py-4 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between gap-3">
              <div>
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--vt-color-orange-300,#FBA674)]">
                  {resolvedPlan.requestCode} • Client: {resolvedPlan.ownerName}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Update Contract Price &amp; Milestone Stages
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveAndResendPlan}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                    Updated Contract Price (₦) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    placeholder="e.g. ₦185,000,000"
                    className="w-full h-10 px-3.5 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] focus:bg-white text-sm font-mono font-extrabold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                  />
                  <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1 block">
                    Owner requested: {resolvedPlan.estimatedBudget}
                  </span>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)] mb-1">
                    Load Stage Preset Template
                  </label>
                  <VantagedSelect
                    value={editPresetId}
                    onChange={(val) => handleSelectEditPreset(val)}
                    options={allPresets.map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--vt-color-border-default,#E2E0EC)]">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h4 className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      Milestone Stages ({editStages.length} Stages)
                    </h4>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                      Customize stage titles or required verification evidence before sending to {resolvedPlan.ownerName}.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-md text-[10.5px] font-mono font-bold border ${
                        editWeightsTotal === 100
                          ? "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      Weight Total: {editWeightsTotal}%
                    </span>
                    {editWeightsTotal !== 100 && (
                      <button
                        type="button"
                        onClick={handleAutoBalanceWeights}
                        className="h-8 px-2.5 rounded-lg border border-[var(--vt-color-orange-300,#FBA674)] bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] text-[11px] font-bold cursor-pointer"
                      >
                        Auto-balance 100%
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setEditStages((prev) => [
                          ...prev,
                          {
                            order: prev.length + 1,
                            title: "",
                            evidence: "",
                            weightPercent: 0,
                          },
                        ])
                      }
                      className="h-8 px-3 rounded-lg bg-[var(--vt-color-neutral-100,#ECEBF3)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)] text-xs font-bold transition-colors border border-[var(--vt-color-border-default,#E2E0EC)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <IconPlus className="w-3.5 h-3.5" />
                      <span>Add Stage</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {editStages.map((stg, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                          <span className="w-5 h-5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] text-white text-[10px] font-extrabold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          Stage {idx + 1}
                        </span>
                        {editStages.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditStages((prev) =>
                                prev
                                  .filter((_, i) => i !== idx)
                                  .map((item, i) => ({
                                    ...item,
                                    order: i + 1,
                                  }))
                              )
                            }
                            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input
                          type="text"
                          required
                          value={stg.title}
                          onChange={(e) =>
                            setEditStages((prev) =>
                              prev.map((item, i) =>
                                i === idx
                                  ? { ...item, title: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Stage title"
                          className="sm:col-span-5 h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                        <input
                          type="text"
                          value={stg.evidence}
                          onChange={(e) =>
                            setEditStages((prev) =>
                              prev.map((item, i) =>
                                i === idx
                                  ? { ...item, evidence: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Required inspection proof"
                          className="sm:col-span-5 h-8 px-2.5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs text-[var(--vt-color-neutral-700,#443E63)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                        />
                        <div className="sm:col-span-2 relative">
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={stg.weightPercent ?? ""}
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                              setEditStages((prev) =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, weightPercent: val } : item
                                )
                              );
                            }}
                            placeholder="%"
                            title="Stage payment weight (%)"
                            className="w-full h-8 pl-2 pr-5 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-mono font-bold text-[var(--vt-color-indigo-900,#261A66)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] pointer-events-none">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-lg bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <IconSend className="w-3.5 h-3.5" />
                  <span>Send Updated Plan to Owner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FULL OWNER BRIEF MODAL ── */}
      {isBriefModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsBriefModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-[var(--vt-color-border-default,#E2E0EC)] rounded-2xl shadow-2xl overflow-hidden font-sans flex flex-col"
          >
            <div className="p-5 bg-[var(--vt-color-indigo-900,#261A66)] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white truncate max-w-sm">
                  {resolvedPlan.title}
                </h3>
                <p className="text-xs text-[var(--vt-color-indigo-200,#D5D2EF)] font-medium mt-0.5">
                  Ref: {resolvedPlan.requestCode} • Submitted{" "}
                  {resolvedPlan.dateSubmitted}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBriefModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs font-sans max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Owner Estimated Budget
                  </span>
                  <p className="text-sm font-extrabold text-[var(--vt-color-orange-600,#D84C0B)] mt-0.5">
                    {resolvedPlan.estimatedBudget}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                    Your Proposed Price
                  </span>
                  <p className="text-sm font-extrabold text-[var(--vt-color-green-700,#1F6B3E)] mt-0.5">
                    {formatNaira(resolvedPlan.contractValue)}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1">
                  Property Owner
                </span>
                <p className="text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  {resolvedPlan.ownerName}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1">
                  Site Location
                </span>
                <p className="text-xs font-semibold text-[var(--vt-color-indigo-900,#261A66)]">
                  {resolvedPlan.location}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] block mb-1">
                  Owner Scope Description
                </span>
                <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed bg-[var(--vt-color-neutral-50,#F7F7FA)] p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)]">
                  {resolvedPlan.description}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex items-center justify-end font-sans">
              <button
                type="button"
                onClick={() => setIsBriefModalOpen(false)}
                className="h-9 px-4 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] hover:bg-[var(--vt-color-neutral-50,#F7F7FA)] cursor-pointer"
              >
                Close
              </button>
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
