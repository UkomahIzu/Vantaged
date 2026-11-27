"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DirectorHeaderBar } from "../../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../../client/Owner dashboard/components/VantagedSelect";
import { BUILT_IN_PLATFORM_PRESETS, StagePreset } from "../../data/stagePresetsData";
import { ContractorProjectSidebarNav } from "./ContractorProjectSidebarNav";
import { ContractorProjectBreadcrumb } from "./ContractorProjectBreadcrumb";
import { VantagedCheckbox } from "./VantagedCheckbox";
import {
  CONTRACTOR_STORAGE_EVENT,
  ContractorProjectStage,
  computeProjectMetrics,
  formatNairaCompact,
  loadProjectKey,
  saveProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import {
  SHARED_SYNC_EVENT,
  pushOwnerLiveNotification,
} from "../../../../shared/vantagedSyncBridge";

interface ContractorProjectStagesPageProps {
  projectId: string;
}

export function ContractorProjectStagesPage({ projectId }: ContractorProjectStagesPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`cproj_stages_${projectId}`);
  const project = useContractorProject(projectId);

  const [stages, setStages] = useState<ContractorProjectStage[]>(project.stages);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("order");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Submit stage for review modal
  const [submittingStage, setSubmittingStage] = useState<ContractorProjectStage | null>(null);
  const [confirmQualityCheck, setConfirmQualityCheck] = useState(false);

  // Apply Stage Preset modal
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [availablePresets, setAvailablePresets] = useState<StagePreset[]>(BUILT_IN_PLATFORM_PRESETS);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(BUILT_IN_PLATFORM_PRESETS[0]?.id || "");
  const [confirmReplacePlan, setConfirmReplacePlan] = useState(false);

  useEffect(() => {
    const sync = () => {
      setStages(loadProjectKey(projectId, "stages", project.stages));
    };
    sync();
    window.addEventListener(CONTRACTOR_STORAGE_EVENT, sync);
    window.addEventListener(SHARED_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONTRACTOR_STORAGE_EVENT, sync);
      window.removeEventListener(SHARED_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [projectId, project.stages]);

  // Fetch synced Company + Admin + Platform presets
  useEffect(() => {
    fetch("/api/presets")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.success) return;
        const companyCustom: StagePreset[] = Array.isArray(data.companyPresets)
          ? data.companyPresets.map((p: StagePreset) => ({
              ...p,
              source: "company" as const,
              isCustom: true,
            }))
          : [];
        const adminCustom: StagePreset[] = Array.isArray(data.adminCustomPresets)
          ? data.adminCustomPresets.map((p: StagePreset) => ({
              ...p,
              source: "admin" as const,
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
        if (combined.length > 0) {
          setAvailablePresets(combined);
          setSelectedPresetId(combined[0]!.id);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const persistStages = (next: ContractorProjectStage[]) => {
    setStages(next);
    saveProjectKey(projectId, "stages", next);
  };

  const metrics = computeProjectMetrics(stages);
  const totalBps = stages.reduce((acc, s) => acc + s.weightBps, 0);

  const filteredStages = useMemo(() => {
    let list = [...stages];
    if (filterStatus === "action") {
      list = list.filter((s) => s.status === "Fix Requested" || s.status === "Disputed" || s.status === "In Progress");
    } else if (filterStatus === "review") {
      list = list.filter((s) => s.status === "Ready for Review");
    } else if (filterStatus === "approved") {
      list = list.filter((s) => s.status === "Approved");
    } else if (filterStatus === "scheduled") {
      list = list.filter((s) => s.status === "Scheduled");
    }

    if (sortBy === "amount-desc") {
      list.sort((a, b) => b.trancheAmount - a.trancheAmount);
    } else if (sortBy === "weight-desc") {
      list.sort((a, b) => b.weightBps - a.weightBps);
    } else {
      list.sort((a, b) => a.order - b.order);
    }
    return list;
  }, [stages, filterStatus, sortBy]);

  const handleConfirmSubmitReview = () => {
    if (!submittingStage || !confirmQualityCheck) return;
    const next = stages.map((s) =>
      s.id === submittingStage.id
        ? {
            ...s,
            status: "Ready for Review" as const,
            submittedAt: "Just now",
          }
        : s
    );
    persistStages(next);
    pushOwnerLiveNotification({
      projectId,
      projectTitle: project.title,
      category: "site",
      title: `Stage Ready for Your Review: ${submittingStage.title}`,
      description: `Your contractor submitted "${submittingStage.title}" for inspection and sign-off on ${project.title}.`,
      linkUrl: `/owner/projects/${projectId}/stages/${submittingStage.id}`,
    });
    showToast(`Submitted "${submittingStage.title}" to owner for review.`);
    setSubmittingStage(null);
    setConfirmQualityCheck(false);
  };

  const handleApplyPreset = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = availablePresets.find((p) => p.id === selectedPresetId);
    if (!preset || !confirmReplacePlan) return;

    const count = preset.stages.length || 1;
    const baseBps = Math.floor(10000 / count);
    const remainderBps = 10000 - baseBps * count;

    const rebuilt: ContractorProjectStage[] = preset.stages.map((st, idx) => {
      const weightBps = baseBps + (idx === count - 1 ? remainderBps : 0);
      const checks = (st.evidence || "Upload geo-tagged site photo")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      return {
        id: `stg-preset-${idx + 1}`,
        order: idx + 1,
        title: `Stage ${idx + 1}: ${st.title}`,
        summary: st.evidence || `Applied from ${preset.name} preset template.`,
        weightBps,
        trancheAmount: Math.round((project.contractValue * weightBps) / 10000),
        status: idx === 0 ? "In Progress" : "Scheduled",
        dueDate: "Per agreed schedule",
        checklist: checks.map((item: string, cIdx: number) => ({
          id: `chk-${idx + 1}-${cIdx + 1}`,
          label: item.charAt(0).toUpperCase() + item.slice(1),
          requiredProof: "Geo-tagged photo or lab PDF",
          isCompleted: false,
        })),
        proofItems: [],
        comments: [],
      };
    });

    persistStages(rebuilt);
    setIsPresetModalOpen(false);
    setConfirmReplacePlan(false);
    showToast(`Applied "${preset.name}" stage plan (${rebuilt.length} stages).`);
  };

  const statusBadge = (status: ContractorProjectStage["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-[var(--vt-color-green-50,#E9F6EC)] text-[var(--vt-color-green-700,#1F6B3E)] border-[var(--vt-color-green-200,#A3D9B1)]";
      case "Ready for Review":
        return "bg-indigo-50 text-[var(--vt-color-indigo-900,#261A66)] border-indigo-200";
      case "Fix Requested":
        return "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-200,#FDCAA9)]";
      case "Disputed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "In Progress":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-500,#7C7894)] border-[var(--vt-color-border-default,#E2E0EC)]";
    }
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ContractorProjectSidebarNav projectId={project.id} activeTab="stages" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-8"
      >
        <DirectorHeaderBar
          leftSlot={
            <ContractorProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Stages & Proof"
            />
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Headline Banner */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Stage Execution &amp; Proof Submissions
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Complete site checklists, upload geo-tagged photos or lab reports, and mark each stage Ready for Review. Total split:{" "}
              <strong className="text-[var(--vt-color-indigo-900,#261A66)]">{(totalBps / 100).toFixed(0)}% of budget</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-right">
              <span className="text-[10px] font-bold text-[var(--vt-color-neutral-400,#A3A0B8)] uppercase block">
                Approved
              </span>
              <span className="text-sm font-black text-[var(--vt-color-green-700,#1F6B3E)]">
                {metrics.approvedCount} / {metrics.totalCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] text-right">
              <span className="text-[10px] font-bold text-[var(--vt-color-orange-700,#B33C08)] uppercase block">
                Verified
              </span>
              <span className="text-sm font-black text-[var(--vt-color-orange-600,#D84C0B)]">
                {metrics.verifiedPercent}%
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmReplacePlan(false);
                setIsPresetModalOpen(true);
              }}
              className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-800,#352488)] text-white text-xs font-bold cursor-pointer shadow-xs"
            >
              Load Stage Template
            </button>
          </div>
        </section>

        {/* Filter Pills + Sort Dropdown */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { id: "all", label: `All (${stages.length})` },
              {
                id: "action",
                label: `Needs Work (${stages.filter((s) => s.status === "Fix Requested" || s.status === "Disputed" || s.status === "In Progress").length})`,
              },
              {
                id: "review",
                label: `With Owner (${stages.filter((s) => s.status === "Ready for Review").length})`,
              },
              {
                id: "approved",
                label: `Approved (${stages.filter((s) => s.status === "Approved").length})`,
              },
              {
                id: "scheduled",
                label: `Upcoming (${stages.filter((s) => s.status === "Scheduled").length})`,
              },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setFilterStatus(pill.id)}
                className={`h-8 px-3 rounded-md font-bold transition-all cursor-pointer border ${
                  filterStatus === pill.id
                    ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                    : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-600,#5E5A7D)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-52">
            <VantagedSelect
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={[
                { value: "order", label: "Sort: Stage Order" },
                { value: "amount-desc", label: "Sort: Highest Payment" },
                { value: "weight-desc", label: "Sort: Largest Share" },
              ]}
            />
          </div>
        </section>

        {/* Stage Execution Cards */}
        <section className="space-y-4">
          {filteredStages.map((stage) => {
            const completedChecks = stage.checklist.filter((c) => c.isCompleted).length;
            const flaggedCount = stage.checklist.filter((c) => c.ownerFlagged).length;
            const prevIncomplete = stages.find(
              (s) => s.order < stage.order && s.status !== "Approved"
            );
            const isLocked = stage.status === "Scheduled" && Boolean(prevIncomplete);
            const canSubmit =
              !isLocked && (stage.status === "In Progress" || stage.status === "Fix Requested");

            return (
              <div
                key={stage.id}
                className={`bg-white rounded-2xl border shadow-2xs overflow-hidden transition-all ${
                  stage.status === "Fix Requested" || stage.status === "Disputed"
                    ? "border-[var(--vt-color-orange-300,#FBA674)]"
                    : "border-[var(--vt-color-border-default,#E2E0EC)]"
                }`}
              >
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                        {(stage.weightBps / 100).toFixed(0)}% of budget
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge(stage.status)}`}>
                        {stage.status}
                      </span>
                      {flaggedCount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {flaggedCount} fix item{flaggedCount > 1 ? "s" : ""} flagged
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      {stage.title}
                    </h2>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                      {stage.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-semibold text-[var(--vt-color-neutral-600,#5E5A7D)]">
                      <span>Checklist: {completedChecks}/{stage.checklist.length} done</span>
                      <span>Proof Files: {stage.proofItems.length}</span>
                      <span>Target Date: {stage.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 lg:border-l lg:border-[var(--vt-color-border-default,#E2E0EC)] lg:pl-5">
                    <div className="text-left sm:text-right mr-2">
                      <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                        Stage Payment
                      </span>
                      <span className="text-base font-black text-[var(--vt-color-indigo-900,#261A66)]">
                        {formatNairaCompact(stage.trancheAmount)}
                      </span>
                    </div>

                    <Link
                      href={`/contractor/projects/${project.id}/stages/${stage.id}`}
                      className="h-9 px-3.5 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:border-[var(--vt-color-orange-300,#FBA674)] text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold flex items-center justify-center transition-all"
                    >
                      {isLocked ? "View Details" : "Checklist & Proof"}
                    </Link>

                    {canSubmit && (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmQualityCheck(false);
                          setSubmittingStage(stage);
                        }}
                        className="h-9 px-3.5 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] cursor-pointer transition-all"
                      >
                        Submit for Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Submit Stage for Owner Review Modal */}
      {submittingStage && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSubmittingStage(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4"
          >
            <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Mark Stage Ready for Owner Review
            </h3>
            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              Submitting <strong>{submittingStage.title}</strong> notifies {project.client.name} to check your uploaded proof and release the{" "}
              <strong>{formatNairaCompact(submittingStage.trancheAmount)}</strong> stage payment.
            </p>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <VantagedCheckbox
                checked={confirmQualityCheck}
                onChange={setConfirmQualityCheck}
                label="I confirm all site work & proof photos for this stage are accurate"
                description="Incomplete proof may cause the owner to request a fix."
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setSubmittingStage(null)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!confirmQualityCheck}
                onClick={handleConfirmSubmitReview}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer"
              >
                Mark Ready for Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Stage Preset Modal */}
      {isPresetModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsPresetModalOpen(false)}
        >
          <form
            onSubmit={handleApplyPreset}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Load Building Plan from Template
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Automatically splits the total agreed price into clear stage percentages (100% total).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPresetModalOpen(false)}
                className="w-7 h-7 rounded-md bg-[var(--vt-color-neutral-100,#EFEEF5)] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1.5">
                Select Stage Template
              </label>
              <VantagedSelect
                value={selectedPresetId}
                onChange={(val) => setSelectedPresetId(val)}
                options={availablePresets.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.stages.length} stages)`,
                  sublabel: p.category,
                }))}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
              <VantagedCheckbox
                checked={confirmReplacePlan}
                onChange={setConfirmReplacePlan}
                label="Replace current stage list with selected template"
                description="Recalculates each stage payment based on your project budget."
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsPresetModalOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!confirmReplacePlan}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold cursor-pointer"
              >
                Apply Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
