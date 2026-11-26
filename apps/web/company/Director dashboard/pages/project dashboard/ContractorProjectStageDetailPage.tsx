"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DirectorHeaderBar } from "../../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../../client/Owner dashboard/components/VantagedSelect";
import { useContractorUser } from "../../hooks/useContractorUser";
import { ContractorProjectSidebarNav } from "./ContractorProjectSidebarNav";
import { ContractorProjectBreadcrumb } from "./ContractorProjectBreadcrumb";
import { VantagedCheckbox } from "./VantagedCheckbox";
import {
  CONTRACTOR_STORAGE_EVENT,
  ContractorProjectStage,
  ContractorProofItem,
  formatNairaCompact,
  formatNairaFull,
  loadProjectKey,
  saveProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import { SHARED_SYNC_EVENT } from "../../../../shared/vantagedSyncBridge";

interface ContractorProjectStageDetailPageProps {
  projectId: string;
  stageId: string;
}

export function ContractorProjectStageDetailPage({
  projectId,
  stageId,
}: ContractorProjectStageDetailPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`cproj_stage_${projectId}_${stageId}`);
  const user = useContractorUser();
  const project = useContractorProject(projectId);

  const [stages, setStages] = useState<ContractorProjectStage[]>(project.stages);
  const [activeTab, setActiveTab] = useState<"checklist" | "proof" | "comments">("checklist");
  const [mediaFilter, setMediaFilter] = useState<"all" | "photo" | "video" | "lab_report">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Proof Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [proofType, setProofType] = useState<"photo" | "video" | "lab_report">("photo");
  const [proofTitle, setProofTitle] = useState("");
  const [proofCaption, setProofCaption] = useState("");
  const [proofChecklistId, setProofChecklistId] = useState("none");
  const [proofGps, setProofGps] = useState("6.4474° N, 3.4723° E");
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | undefined>(undefined);
  const [proofFileName, setProofFileName] = useState<string>("");
  const [autoCompleteChecklist, setAutoCompleteChecklist] = useState(true);

  // Add checklist item
  const [newCheckLabel, setNewCheckLabel] = useState("");

  // Comment input
  const [commentText, setCommentText] = useState("");

  // Mark Ready for Review modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [confirmReadyCheck, setConfirmReadyCheck] = useState(false);

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

  const stage = stages.find((s) => s.id === stageId) || stages[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const updateCurrentStage = (updater: (prev: ContractorProjectStage) => ContractorProjectStage) => {
    const next = stages.map((s) => (s.id === stage.id ? updater(s) : s));
    setStages(next);
    saveProjectKey(projectId, "stages", next);
  };

  const handleToggleChecklist = (itemId: string, checked: boolean) => {
    updateCurrentStage((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isCompleted: checked,
              ownerFlagged: checked ? false : item.ownerFlagged,
            }
          : item
      ),
    }));
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckLabel.trim()) return;
    updateCurrentStage((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        {
          id: `chk-${Date.now()}`,
          label: newCheckLabel.trim(),
          requiredProof: "Site photo or PDF",
          isCompleted: false,
        },
      ],
    }));
    setNewCheckLabel("");
    showToast("Checklist item added.");
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFileName(file.name);
    if (!proofTitle.trim()) {
      setProofTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProofPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setProofPreviewUrl(undefined);
    }
  };

  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle.trim()) return;

    const newProof: ContractorProofItem = {
      id: `prf-${Date.now()}`,
      type: proofType,
      title: proofTitle.trim(),
      caption: proofCaption.trim() || "Geo-tagged field proof uploaded by site team.",
      uploadedAt: "Just now",
      uploadedBy: user.fullName,
      gpsCoords: proofGps.trim() || "6.4474° N, 3.4723° E",
      checklistItemId: proofChecklistId !== "none" ? proofChecklistId : undefined,
      thumbnailUrl:
        proofPreviewUrl ||
        (proofType !== "lab_report"
          ? "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80"
          : undefined),
      fileSize: proofFileName ? `${proofFileName}` : proofType === "lab_report" ? "1.2 MB PDF" : undefined,
    };

    updateCurrentStage((prev) => ({
      ...prev,
      proofItems: [newProof, ...prev.proofItems],
      checklist:
        autoCompleteChecklist && proofChecklistId !== "none"
          ? prev.checklist.map((item) =>
              item.id === proofChecklistId
                ? { ...item, isCompleted: true, ownerFlagged: false }
                : item
            )
          : prev.checklist,
    }));

    setProofTitle("");
    setProofCaption("");
    setProofChecklistId("none");
    setProofPreviewUrl(undefined);
    setProofFileName("");
    setIsUploadOpen(false);
    setActiveTab("proof");
    showToast("Geo-tagged proof uploaded to stage.");
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    updateCurrentStage((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        {
          id: `cm-${Date.now()}`,
          authorName: user.fullName,
          authorRole: `${user.role} (Company)`,
          text: commentText.trim(),
          timestamp: "Just now",
          isCompany: true,
        },
      ],
    }));
    setCommentText("");
  };

  const handleMarkStageStatus = (status: ContractorProjectStage["status"]) => {
    updateCurrentStage((prev) => ({
      ...prev,
      status,
      ...(status === "Ready for Review" ? { submittedAt: "Just now" } : {}),
    }));
    setIsSubmitModalOpen(false);
    setConfirmReadyCheck(false);
    showToast(
      status === "Ready for Review"
        ? `Submitted "${stage.title}" for owner review.`
        : `Stage marked as ${status}.`
    );
  };

  const completedChecks = stage.checklist.filter((c) => c.isCompleted).length;
  const flaggedItems = stage.checklist.filter((c) => c.ownerFlagged);
  const previousIncompleteStage = stages.find(
    (s) => s.order < stage.order && s.status !== "Approved"
  );
  const isStageLocked = stage.status === "Scheduled" && Boolean(previousIncompleteStage);
  const filteredProof = stage.proofItems.filter((p) =>
    mediaFilter === "all" ? true : p.type === mediaFilter
  );

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
              subPageTitle={`Stage ${stage.order}`}
              subPageParentHref={`/contractor/projects/${project.id}/stages`}
            />
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Stage Locked Banner if previous stage is not finished */}
        {isStageLocked && previousIncompleteStage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-amber-900">
                Stage Locked — Finish Previous Stage First
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                You cannot start or upload proof for this stage until{" "}
                <strong>{previousIncompleteStage.title}</strong> is completed and approved.
              </p>
            </div>
            <Link
              href={`/contractor/projects/${project.id}/stages/${previousIncompleteStage.id}`}
              className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-800,#352488)] text-white text-xs font-bold flex items-center justify-center shrink-0"
            >
              Go to Stage {previousIncompleteStage.order} →
            </Link>
          </div>
        )}

        {/* Flagged Fix-List Alert */}
        {flaggedItems.length > 0 && (
          <div className="p-4 rounded-2xl bg-[var(--vt-color-orange-50,#FFF4EE)] border border-[var(--vt-color-orange-200,#FDCAA9)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-[var(--vt-color-orange-800,#8F320D)]">
                Owner Requested Fixes on {flaggedItems.length} Checklist Item{flaggedItems.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] mt-0.5">
                Upload fresh proof and check off the flagged items below, then resubmit this stage for review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer shrink-0 shadow-[0_2px_8px_rgba(239,95,24,0.28)]"
            >
              + Upload Fix Proof
            </button>
          </div>
        )}

        {/* Stage Header Card */}
        <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-[10.5px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                {(stage.weightBps / 100).toFixed(0)}% of budget
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                {stage.status}
              </span>
              <span className="text-[11px] font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                Due {stage.dueDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              {stage.title}
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">{stage.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] text-right mr-1">
              <span className="text-[10px] font-bold uppercase text-[var(--vt-color-neutral-400,#A3A0B8)] block">
                Stage Payment
              </span>
              <span className="text-sm font-black text-[var(--vt-color-indigo-900,#261A66)]">
                {formatNairaFull(stage.trancheAmount)}
              </span>
            </div>

            <button
              type="button"
              disabled={isStageLocked}
              onClick={() => setIsUploadOpen(true)}
              className="h-9 px-3.5 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-orange-50,#FFF4EE)] hover:border-[var(--vt-color-orange-300,#FBA674)] disabled:opacity-45 disabled:cursor-not-allowed text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] text-xs font-bold cursor-pointer transition-all"
            >
              + Upload Proof
            </button>

            {stage.status === "Scheduled" && (
              <button
                type="button"
                disabled={isStageLocked}
                onClick={() => {
                  if (isStageLocked) return;
                  handleMarkStageStatus("In Progress");
                }}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-800,#352488)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer"
              >
                {isStageLocked ? "Locked" : "Start Stage"}
              </button>
            )}

            {(stage.status === "In Progress" || stage.status === "Fix Requested") && (
              <button
                type="button"
                onClick={() => {
                  setConfirmReadyCheck(false);
                  setIsSubmitModalOpen(true);
                }}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] cursor-pointer"
              >
                {stage.status === "Fix Requested" ? "Resubmit for Review" : "Mark Ready for Review"}
              </button>
            )}
          </div>
        </section>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {[
            { id: "checklist", label: `Site Checklist (${completedChecks}/${stage.checklist.length})` },
            { id: "proof", label: `Proof & Lab Files (${stage.proofItems.length})` },
            { id: "comments", label: `Stage Comments (${stage.comments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as "checklist" | "proof" | "comments")}
              className={`h-9 px-4 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[var(--vt-color-orange-500,#EF5F18)] text-white border-[var(--vt-color-orange-500,#EF5F18)] shadow-2xs"
                  : "bg-white text-[var(--vt-color-neutral-600,#5E5A7D)] border-[var(--vt-color-border-default,#E2E0EC)] hover:text-[var(--vt-color-indigo-900,#261A66)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Interactive Design-Token Site Checklist */}
        {activeTab === "checklist" && (
          <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Stage Quality &amp; Verification Checklist
                </h2>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)]">
                  Check off completed items and attach matching geo-tagged proof before submitting to the owner.
                </p>
              </div>
              <span className="text-xs font-extrabold text-[var(--vt-color-orange-600,#D84C0B)]">
                {stage.checklist.length > 0
                  ? `${Math.round((completedChecks / stage.checklist.length) * 100)}% Complete`
                  : "0 Items"}
              </span>
            </div>

            <div className="space-y-3">
              {stage.checklist.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                    item.ownerFlagged
                      ? "bg-rose-50/70 border-rose-200"
                      : item.isCompleted
                      ? "bg-[var(--vt-color-green-50,#E9F6EC)]/40 border-[var(--vt-color-green-200,#A3D9B1)]/70"
                      : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <VantagedCheckbox
                      checked={item.isCompleted}
                      onChange={(checked) => handleToggleChecklist(item.id, checked)}
                      disabled={stage.status === "Approved" || isStageLocked}
                      label={
                        <span className={item.isCompleted ? "line-through opacity-75" : ""}>
                          {item.label}
                        </span>
                      }
                      description={`Required proof: ${item.requiredProof}`}
                    />
                    {item.ownerFlagged && item.ownerNote && (
                      <p className="ml-7 text-xs font-semibold text-rose-700 bg-white/80 border border-rose-200 rounded-lg px-2.5 py-1.5">
                        Owner Fix Note: {item.ownerNote}
                      </p>
                    )}
                  </div>

                  {stage.status !== "Approved" && !isStageLocked && (
                    <button
                      type="button"
                      onClick={() => {
                        setProofChecklistId(item.id);
                        setIsUploadOpen(true);
                      }}
                      className="h-8 px-3 rounded-md bg-white border border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-orange-400,#F78241)] text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-700,#B33C08)] shrink-0 cursor-pointer"
                    >
                      Attach Proof
                    </button>
                  )}
                </div>
              ))}
            </div>

            {stage.status !== "Approved" && !isStageLocked && (
              <form onSubmit={handleAddChecklistItem} className="pt-3 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={newCheckLabel}
                  onChange={(e) => setNewCheckLabel(e.target.value)}
                  placeholder="Add an internal site inspection check..."
                  className="flex-1 h-9 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
                <button
                  type="submit"
                  className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-800,#352488)] text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  + Add Check
                </button>
              </form>
            )}
          </section>
        )}

        {/* Tab 2: Proof Media & Lab Reports */}
        {activeTab === "proof" && (
          <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {(
                  [
                    { id: "all", label: `All (${stage.proofItems.length})` },
                    { id: "photo", label: `Photos (${stage.proofItems.filter((p) => p.type === "photo").length})` },
                    { id: "video", label: `Videos (${stage.proofItems.filter((p) => p.type === "video").length})` },
                    { id: "lab_report", label: `Lab Reports (${stage.proofItems.filter((p) => p.type === "lab_report").length})` },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMediaFilter(f.id)}
                    className={`h-8 px-3 rounded-lg font-bold cursor-pointer transition-all ${
                      mediaFilter === f.id
                        ? "bg-[var(--vt-color-indigo-900,#261A66)] text-white"
                        : "bg-[var(--vt-color-neutral-50,#F7F7FA)] text-[var(--vt-color-neutral-600,#5E5A7D)]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={isStageLocked}
                onClick={() => setIsUploadOpen(true)}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer"
              >
                + Upload New Proof
              </button>
            </div>

            {filteredProof.length === 0 ? (
              <div className="p-10 text-center rounded-xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)]">
                <p className="text-sm font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                  No proof files uploaded in this category yet
                </p>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                  Upload geo-tagged photos, walkthrough videos, or signed concrete lab reports for owner verification.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProof.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] overflow-hidden bg-white flex flex-col justify-between shadow-2xs"
                  >
                    {item.thumbnailUrl ? (
                      <div className="h-40 w-full bg-[var(--vt-color-neutral-100,#EFEEF5)] relative overflow-hidden">
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold uppercase">
                          {item.type === "video" ? "Video" : "Geo-Photo"}
                        </span>
                      </div>
                    ) : (
                      <div className="h-28 w-full bg-[var(--vt-color-indigo-50,#EEF0FF)] flex flex-col items-center justify-center gap-1 text-[var(--vt-color-indigo-900,#261A66)]">
                        <span className="px-2.5 py-0.5 rounded-md bg-white border border-[var(--vt-color-indigo-200,#C7C3E6)] text-[10px] font-bold uppercase">
                          Lab / Test Report PDF
                        </span>
                        {item.fileSize && <span className="text-[11px] font-semibold">{item.fileSize}</span>}
                      </div>
                    )}

                    <div className="p-3.5 space-y-1.5">
                      <h4 className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
                        {item.caption}
                      </p>
                      <div className="pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)] flex flex-col gap-0.5 text-[10px] text-[var(--vt-color-neutral-500,#7C7894)] font-medium">
                        <span>GPS: {item.gpsCoords}</span>
                        <span>
                          {item.uploadedBy} · {item.uploadedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Stage Comments */}
        {activeTab === "comments" && (
          <section className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-sm sm:text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Stage Review Discussion
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {stage.comments.length === 0 ? (
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] py-6 text-center">
                  No comments on this stage yet. Post an update for {project.client.name}.
                </p>
              ) : (
                stage.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border text-xs ${
                      c.isCompany
                        ? "bg-[var(--vt-color-orange-50,#FFF4EE)]/50 border-[var(--vt-color-orange-200,#FDCAA9)]"
                        : "bg-[var(--vt-color-neutral-50,#F7F7FA)] border-[var(--vt-color-border-default,#E2E0EC)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                        {c.authorName}{" "}
                        <span className="font-semibold text-[var(--vt-color-neutral-500,#7C7894)]">
                          · {c.authorRole}
                        </span>
                      </span>
                      <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">
                        {c.timestamp}
                      </span>
                    </div>
                    <p className="text-[var(--vt-color-neutral-700,#443E63)] leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendComment} className="flex gap-2.5 pt-2 border-t border-[var(--vt-color-neutral-100,#EFEEF5)]">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a site update or response to the owner..."
                className="flex-1 h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] text-xs outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white text-xs font-bold cursor-pointer"
              >
                Post Note
              </button>
            </form>
          </section>
        )}

        <div className="flex justify-between items-center text-xs pt-2">
          <Link
            href={`/contractor/projects/${project.id}/stages`}
            className="font-bold text-[var(--vt-color-indigo-900,#261A66)] hover:text-[var(--vt-color-orange-600,#D84C0B)]"
          >
            ← Back to All Stages
          </Link>
        </div>
      </main>

      {/* Upload Proof Modal */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsUploadOpen(false)}
        >
          <form
            onSubmit={handleUploadProof}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                  Upload Geo-Tagged Stage Proof
                </h3>
                <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                  Attach photos, site videos, or certified lab reports for {stage.title}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="w-7 h-7 rounded-lg bg-[var(--vt-color-neutral-100,#EFEEF5)] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Proof Type
                </label>
                <VantagedSelect
                  value={proofType}
                  onChange={(val) => setProofType(val as "photo" | "video" | "lab_report")}
                  options={[
                    { value: "photo", label: "Geo-Tagged Site Photo" },
                    { value: "video", label: "Site Walkthrough Video" },
                    { value: "lab_report", label: "Lab / Concrete Cube Report" },
                  ]}
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Link to Checklist Item
                </label>
                <VantagedSelect
                  value={proofChecklistId}
                  onChange={(val) => setProofChecklistId(val)}
                  options={[
                    { value: "none", label: "General Stage Proof" },
                    ...stage.checklist.map((c) => ({
                      value: c.id,
                      label: c.label,
                    })),
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Proof Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Slab 7-Day Curing Ponding Photo"
                value={proofTitle}
                onChange={(e) => setProofTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  Attach File (Optional Preview)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*,.pdf"
                  onChange={handleFilePick}
                  className="w-full text-[11px] file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--vt-color-orange-50,#FFF4EE)] file:text-[var(--vt-color-orange-700,#B33C08)] file:font-bold file:cursor-pointer"
                />
              </div>
              <div>
                <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                  GPS Coordinates
                </label>
                <input
                  type="text"
                  value={proofGps}
                  onChange={(e) => setProofGps(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Site Engineer Caption
              </label>
              <textarea
                rows={2}
                placeholder="Describe what was verified in this photo, video, or lab report..."
                value={proofCaption}
                onChange={(e) => setProofCaption(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
              />
            </div>

            {proofChecklistId !== "none" && (
              <VantagedCheckbox
                checked={autoCompleteChecklist}
                onChange={setAutoCompleteChecklist}
                label="Automatically mark the linked checklist item as completed"
              />
            )}

            <div className="flex justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold cursor-pointer"
              >
                Save Proof to Stage
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Submit for Review Modal */}
      {isSubmitModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsSubmitModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4"
          >
            <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Submit Stage for Owner Approval
            </h3>
            <p className="text-xs text-[var(--vt-color-neutral-600,#5E5A7D)] leading-relaxed">
              This notifies {project.client.name} that <strong>{stage.title}</strong> ({formatNairaCompact(stage.trancheAmount)}) is ready for inspection.
            </p>
            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <VantagedCheckbox
                checked={confirmReadyCheck}
                onChange={setConfirmReadyCheck}
                label="All site work, checklist items, and proof photos are ready for inspection"
              />
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white text-xs font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!confirmReadyCheck}
                onClick={() => handleMarkStageStatus("Ready for Review")}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold cursor-pointer"
              >
                Confirm &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
