"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DirectorHeaderBar } from "../../components/DirectorHeaderBar";
import { useScrollRestoration } from "../../../../client/Owner dashboard/hooks/useScrollRestoration";
import { VantagedSelect } from "../../../../client/Owner dashboard/components/VantagedSelect";
import { useContractorUser } from "../../hooks/useContractorUser";
import { ContractorProjectSidebarNav } from "./ContractorProjectSidebarNav";
import { ContractorProjectBreadcrumb } from "./ContractorProjectBreadcrumb";
import { VantagedCheckbox } from "./VantagedCheckbox";
import {
  CONTRACTOR_STORAGE_EVENT,
  ContractorProjectIssue,
  formatNairaFull,
  loadProjectKey,
  saveProjectKey,
} from "./contractorProjectData";
import { useContractorProject } from "./useContractorProject";
import {
  SHARED_SYNC_EVENT,
  syncContractorIssueUpdateToOwner,
} from "../../../../shared/vantagedSyncBridge";

interface ContractorProjectDisputesPageProps {
  projectId: string;
}

export function ContractorProjectDisputesPage({ projectId }: ContractorProjectDisputesPageProps) {
  const scrollRef = useScrollRestoration<HTMLElement>(`cproj_disputes_${projectId}`);
  const user = useContractorUser();
  const project = useContractorProject(projectId);

  const [issues, setIssues] = useState<ContractorProjectIssue[]>(project.issues);
  const [selectedId, setSelectedId] = useState<string>(project.issues[0]?.id || "");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cure Plan Modal
  const [isCureModalOpen, setIsCureModalOpen] = useState(false);
  const [cureMethod, setCureMethod] = useState("");
  const [cureDays, setCureDays] = useState("4");
  const [confirmCureBinding, setConfirmCureBinding] = useState(false);

  // Counter-Evidence / Fix Proof Modal
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceType, setEvidenceType] = useState("Geo-Tagged Site Photo Proof");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [evidenceFileName, setEvidenceFileName] = useState("");
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const sync = () => {
      const loaded = loadProjectKey(projectId, "issues", project.issues);
      setIssues(loaded);
      setSelectedId((prev) => (prev && loaded.some((i) => i.id === prev) ? prev : loaded[0]?.id || ""));
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
  }, [projectId, project.issues]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const filteredIssues = useMemo(() => {
    if (kindFilter === "all") return issues;
    return issues.filter((i) => i.kind === kindFilter);
  }, [issues, kindFilter]);

  const selectedIssue =
    filteredIssues.find((i) => i.id === selectedId) || filteredIssues[0] || null;

  const getSeverityMaxDays = (sev: ContractorProjectIssue["severity"]) =>
    sev === "Minor Snag" ? 7 : sev === "Critical Structural" ? 28 : 14;

  const totalHeldEscrow = useMemo(
    () => issues.filter((i) => i.status !== "Resolved").reduce((sum, i) => sum + (i.heldAmount || 0), 0),
    [issues]
  );

  const totalPenalties = useMemo(
    () =>
      issues
        .filter((i) => i.status !== "Resolved")
        .reduce(
          (sum, i) =>
            sum +
            (i.overdueDays || 0) * (i.dailyDelayFineRate ?? 35000) +
            (i.backchargeAmount || 0),
          0
        ),
    [issues]
  );

  const activeEscalations = useMemo(
    () => issues.filter((i) => i.status !== "Resolved" && i.kind === "Formal Dispute").length,
    [issues]
  );

  const updateIssue = (id: string, updater: (prev: ContractorProjectIssue) => ContractorProjectIssue) => {
    const next = issues.map((item) => (item.id === id ? updater(item) : item));
    setIssues(next);
    saveProjectKey(projectId, "issues", next);
  };

  const handleSubmitCurePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !cureMethod.trim() || !confirmCureBinding) return;

    const maxDays = getSeverityMaxDays(selectedIssue.severity);
    const days = Math.max(1, Math.min(maxDays, parseInt(cureDays, 10) || 4));
    updateIssue(selectedIssue.id, (prev) => ({
      ...prev,
      status: "Cure Plan Submitted",
      responseWindowHours: 0,
      deadlineLabel: `Fix Plan Submitted · ${days}d repair window`,
      curePlan: {
        methodStatement: cureMethod.trim(),
        proposedDays: days,
        submittedAt: "Just now",
      },
      timeline: [
        ...prev.timeline,
        {
          id: `tl-${Date.now()}`,
          actor: `${user.fullName} (Contractor)`,
          action: `Submitted rectification cure plan (${days} days)`,
          time: "Just now",
        },
      ],
    }));

    setCureMethod("");
    setConfirmCureBinding(false);
    setIsCureModalOpen(false);
    syncContractorIssueUpdateToOwner({
      projectId,
      issueCode: selectedIssue.code,
      issueTitle: selectedIssue.title,
      stageTitle: selectedIssue.stageTitle,
      eventType: "FIX_PLAN_SUBMITTED",
      methodStatement: cureMethod.trim(),
      proposedDays: days,
      actorName: user.fullName,
    });
    showToast("Fix plan submitted to owner and 48h timer stopped.");
  };

  const handleEvidenceFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEvidenceFileName(file.name);
    if (!evidenceTitle.trim()) {
      setEvidenceTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setEvidencePreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setEvidencePreviewUrl(undefined);
    }
  };

  const handleUploadEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !evidenceTitle.trim()) return;

    updateIssue(selectedIssue.id, (prev) => ({
      ...prev,
      status: prev.status === "Action Required" ? "Under Review" : prev.status,
      counterEvidence: [
        {
          id: `ev-${Date.now()}`,
          title: evidenceTitle.trim(),
          fileType: evidenceType,
          fileName: evidenceFileName || undefined,
          previewUrl: evidencePreviewUrl,
          uploadedAt: "Just now",
          note: evidenceNote.trim() || "Submitted as verification proof.",
        },
        ...prev.counterEvidence,
      ],
      timeline: [
        ...prev.timeline,
        {
          id: `tl-${Date.now()}`,
          actor: `${user.fullName} (Contractor)`,
          action: `Uploaded verification proof: ${evidenceTitle.trim()}`,
          time: "Just now",
        },
      ],
    }));

    setEvidenceTitle("");
    setEvidenceNote("");
    setEvidenceFileName("");
    setEvidencePreviewUrl(undefined);
    setIsEvidenceModalOpen(false);
    syncContractorIssueUpdateToOwner({
      projectId,
      issueCode: selectedIssue.code,
      issueTitle: selectedIssue.title,
      stageTitle: selectedIssue.stageTitle,
      eventType: "PROOF_UPLOADED",
      proofTitle: evidenceTitle.trim(),
      actorName: user.fullName,
    });
    showToast("Verification proof uploaded.");
  };

  const handleMarkFixedForReinspection = () => {
    if (!selectedIssue) return;
    updateIssue(selectedIssue.id, (prev) => ({
      ...prev,
      status: "Under Review",
      timeline: [
        ...prev.timeline,
        {
          id: `tl-${Date.now()}`,
          actor: `${user.fullName} (Contractor)`,
          action: "Marked punch item fixed and requested owner re-inspection",
          time: "Just now",
        },
      ],
    }));
    syncContractorIssueUpdateToOwner({
      projectId,
      issueCode: selectedIssue.code,
      issueTitle: selectedIssue.title,
      stageTitle: selectedIssue.stageTitle,
      eventType: "RECHECK_REQUESTED",
      actorName: user.fullName,
    });
    showToast("Marked fixed and notified owner for re-inspection.");
  };

  return (
    <div
      style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
      className="flex flex-col md:flex-row h-screen w-screen max-w-full max-h-full overflow-hidden bg-[var(--vt-color-background-subtle,#F7F7FA)] text-[var(--vt-color-text-default,#261A66)] select-none relative font-sans"
    >
      <ContractorProjectSidebarNav projectId={project.id} activeTab="disputes" />

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 h-full max-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col gap-5 pb-24 md:pb-8"
      >
        <DirectorHeaderBar
          leftSlot={
            <ContractorProjectBreadcrumb
              projectId={project.id}
              projectTitle={project.title}
              currentPageTitle="Fixes & Disputes"
            />
          }
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[var(--vt-color-indigo-900,#261A66)] text-white text-xs font-bold shadow-xl">
            ✓ {toastMessage}
          </div>
        )}

        {/* Header */}
        <section className="shrink-0 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--vt-color-indigo-900,#261A66)] tracking-tight">
              Owner Fix Requests &amp; Disputes
            </h1>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Respond within 48 hours with your fix plan and estimated completion days, then upload verification proof to release held payments.
            </p>
          </div>
          <div className="w-full sm:w-52 shrink-0">
            <VantagedSelect
              value={kindFilter}
              onChange={setKindFilter}
              options={[
                { value: "all", label: `All Items (${issues.length})` },
                { value: "Fix Request", label: "Fix Requests Only" },
                { value: "Formal Dispute", label: "Formal Disputes Only" },
              ]}
            />
          </div>
        </section>

        {/* 3-Card Dispute Summary Strip */}
        <section className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-neutral-400,#A3A0B8)]">
              Money Frozen in Escrow
            </span>
            <p className="text-xl font-black text-[var(--vt-color-indigo-900,#261A66)] mt-1">
              {formatNairaFull(totalHeldEscrow)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              Released once fix or dispute is cleared
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--vt-color-orange-600,#D84C0B)]">
              Response &amp; Repair Limits
            </span>
            <p className="text-xl font-black text-[var(--vt-color-orange-600,#D84C0B)] mt-1">
              48-Hour Reply Window
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              {activeEscalations} active dispute{activeEscalations === 1 ? "" : "s"} · Max 7 / 14 / 28 days to fix by severity
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs">
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-rose-700">
              Overdue Fines &amp; Backcharges
            </span>
            <p className={`text-xl font-black mt-1 ${totalPenalties > 0 ? "text-rose-700" : "text-[var(--vt-color-green-700,#1F6B3E)]"}`}>
              {formatNairaFull(totalPenalties)}
            </p>
            <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
              ₦35,000/day late fee if repair deadline is missed
            </p>
          </div>
        </section>

        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] p-12 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-700,#1F6B3E)] font-black text-lg flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              No Open Fix Requests or Disputes
            </h3>
            <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
              All inspections and milestones on {project.title} are clear.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left List */}
            <div className="lg:col-span-4 space-y-3">
              {filteredIssues.map((item) => {
                const isSelected = selectedIssue?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-2 border-[var(--vt-color-orange-500,#EF5F18)] shadow-sm"
                        : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] hover:border-[var(--vt-color-neutral-300,#CBC8DA)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10.5px] font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {item.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.kind === "Formal Dispute"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border-[var(--vt-color-orange-200,#FDCAA9)]"
                        }`}
                      >
                        {item.kind}
                      </span>
                    </div>
                    <h3 className="text-xs font-extrabold text-[var(--vt-color-indigo-900,#261A66)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-1">
                      {item.status} · {item.deadlineLabel}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Detail Dossier */}
            {selectedIssue && (
              <div className="lg:col-span-8 bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 bg-gradient-to-r from-[var(--vt-color-neutral-50,#F7F7FA)] via-white to-[var(--vt-color-orange-50,#FFF4EE)]/30 border-b border-[var(--vt-color-border-default,#E2E0EC)] flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-[var(--vt-color-neutral-500,#7C7894)]">
                        {selectedIssue.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[var(--vt-color-orange-50,#FFF4EE)] text-[var(--vt-color-orange-700,#B33C08)] border border-[var(--vt-color-orange-200,#FDCAA9)]">
                        {selectedIssue.status}
                      </span>
                      <span className="text-[11px] font-bold text-rose-700">
                        {selectedIssue.deadlineLabel}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      {selectedIssue.title}
                    </h2>
                    <p className="text-xs text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                      {selectedIssue.stageTitle} · Raised by {selectedIssue.raisedBy}
                    </p>
                  </div>

                  {selectedIssue.heldAmount > 0 && (
                    <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase text-rose-700 block">
                        Held in Escrow
                      </span>
                      <span className="text-sm font-black text-rose-800">
                        {formatNairaFull(selectedIssue.heldAmount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-5 text-xs">
                  {/* 3-Tier Escalation Ladder */}
                  {(() => {
                    const activeTier =
                      selectedIssue.escalationTier ||
                      (selectedIssue.kind === "Formal Dispute"
                        ? "Tier 2: Independent Inspection"
                        : "Tier 1: Direct Fix");
                    const maxAllowedDays =
                      selectedIssue.severityMaxAllowedDays || getSeverityMaxDays(selectedIssue.severity);
                    const overdue = selectedIssue.overdueDays || 0;
                    const dailyRate = selectedIssue.dailyDelayFineRate ?? 35000;
                    const accruedFine = overdue * dailyRate;
                    const backcharge = selectedIssue.backchargeAmount || 0;

                    return (
                      <>
                        <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)] space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)]">
                              Dispute Escalation Stage
                            </span>
                            <span className="text-[11px] font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                              {selectedIssue.severity} · Max {maxAllowedDays} days allowed
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {(
                              [
                                "Tier 1: Direct Fix",
                                "Tier 2: Independent Inspection",
                                "Tier 3: Formal Arbitration",
                              ] as const
                            ).map((tier) => {
                              const current = activeTier === tier;
                              return (
                                <div
                                  key={tier}
                                  className={`px-3 py-2 rounded-lg border text-[11px] font-bold ${
                                    current
                                      ? "bg-[var(--vt-color-orange-50,#FFF4EE)] border-[var(--vt-color-orange-400,#F78241)] text-[var(--vt-color-orange-700,#B33C08)]"
                                      : "bg-white border-[var(--vt-color-border-default,#E2E0EC)] text-[var(--vt-color-neutral-500,#7C7894)]"
                                  }`}
                                >
                                  {tier}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[var(--vt-color-neutral-600,#5E5A7D)]">
                            {selectedIssue.curePlan ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-700,#1F6B3E)] font-bold">
                                ✓ Fix Plan Submitted — 48h Reply Timer Stopped ({selectedIssue.curePlan.proposedDays}d repair window active)
                              </span>
                            ) : (
                              <span>
                                48-Hour Reply Window: {selectedIssue.responseWindowHours ?? 42}h remaining to send fix plan
                              </span>
                            )}
                            <span className={`font-bold ${overdue > 0 || backcharge > 0 ? "text-rose-700" : "text-[var(--vt-color-green-700,#1F6B3E)]"}`}>
                              {overdue > 0
                                ? `Overdue ${overdue}d · Fine: ${formatNairaFull(accruedFine)}`
                                : `On Schedule · Late fee: ${formatNairaFull(dailyRate)}/day`}
                            </span>
                          </div>
                          {backcharge > 0 && (
                            <p className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5">
                              Replacement Worker Deduction: {formatNairaFull(backcharge)} {selectedIssue.backchargeNote ? `— ${selectedIssue.backchargeNote}` : "deducted from stage payout."}
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}

                  <div className="p-4 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vt-color-neutral-500,#7C7894)] block mb-1">
                      Owner / Rep Issue Summary
                    </span>
                    <p className="text-[var(--vt-color-indigo-900,#261A66)] leading-relaxed font-medium">
                      {selectedIssue.ownerDescription}
                    </p>
                  </div>

                  {/* Submitted Fix Plan */}
                  {selectedIssue.curePlan && (
                    <div className="p-4 rounded-xl bg-[var(--vt-color-green-50,#E9F6EC)]/60 border border-[var(--vt-color-green-200,#A3D9B1)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-extrabold uppercase text-[var(--vt-color-green-700,#1F6B3E)]">
                          ✓ Submitted Fix Plan ({selectedIssue.curePlan.proposedDays} Days)
                        </span>
                        <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)]">
                          {selectedIssue.curePlan.submittedAt}
                        </span>
                      </div>
                      <p className="text-[var(--vt-color-indigo-900,#261A66)] leading-relaxed">
                        {selectedIssue.curePlan.methodStatement}
                      </p>
                    </div>
                  )}

                  {/* Supporting Proof Files */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                        Supporting Proof ({selectedIssue.counterEvidence.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEvidenceModalOpen(true)}
                        className="text-xs font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline cursor-pointer"
                      >
                        + Upload Proof
                      </button>
                    </div>
                    {selectedIssue.counterEvidence.length === 0 ? (
                      <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] p-3 rounded-xl border border-dashed border-[var(--vt-color-border-default,#E2E0EC)]">
                        No counter-evidence files uploaded yet. Attach lab reports, site photos, or engineer sign-offs.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedIssue.counterEvidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-white flex items-start justify-between gap-3"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              {ev.previewUrl && (
                                <a
                                  href={ev.previewUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={ev.fileName || ev.title}
                                  title="Click to open / download evidence"
                                  className="shrink-0 group relative block"
                                >
                                  <img
                                    src={ev.previewUrl}
                                    alt={ev.title}
                                    className="w-14 h-14 rounded-lg object-cover border border-[var(--vt-color-border-default,#E2E0EC)] group-hover:opacity-85 transition-opacity"
                                  />
                                </a>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">{ev.title}</p>
                                <p className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)] mt-0.5">
                                  {ev.fileType}
                                  {ev.fileName ? ` · ${ev.fileName}` : ""} · {ev.note}
                                </p>
                                {ev.previewUrl && (
                                  <a
                                    href={ev.previewUrl}
                                    download={ev.fileName || `${ev.title}.png`}
                                    className="inline-block mt-1 text-[10.5px] font-bold text-[var(--vt-color-orange-600,#D84C0B)] hover:underline"
                                  >
                                    Download / View File →
                                  </a>
                                )}
                              </div>
                            </div>
                            <span className="text-[10.5px] text-[var(--vt-color-neutral-500,#7C7894)] shrink-0">
                              {ev.uploadedAt}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
                      Resolution Activity Log
                    </h3>
                    <div className="space-y-2">
                      {selectedIssue.timeline.map((ev) => (
                        <div key={ev.id} className="flex items-start gap-2.5 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-[var(--vt-color-orange-500,#EF5F18)] mt-1.5 shrink-0" />
                          <div>
                            <p className="font-bold text-[var(--vt-color-indigo-900,#261A66)]">
                              {ev.actor}: <span className="font-normal text-[var(--vt-color-neutral-600,#5E5A7D)]">{ev.action}</span>
                            </p>
                            <span className="text-[10px] text-[var(--vt-color-neutral-400,#A3A0B8)]">{ev.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 sm:px-6 py-4 bg-[var(--vt-color-neutral-50,#F7F7FA)] border-t border-[var(--vt-color-border-default,#E2E0EC)] flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEvidenceModalOpen(true)}
                    className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white hover:bg-[var(--vt-color-neutral-100,#EFEEF5)] text-xs font-bold text-[var(--vt-color-indigo-900,#261A66)] cursor-pointer"
                  >
                    Upload Proof
                  </button>
                  {selectedIssue.curePlan ? (
                    <span className="h-9 px-3.5 rounded-md bg-[var(--vt-color-green-50,#E9F6EC)] border border-[var(--vt-color-green-200,#A3D9B1)] text-[var(--vt-color-green-700,#1F6B3E)] text-xs font-bold inline-flex items-center">
                      ✓ Fix Plan Submitted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmCureBinding(false);
                        setIsCureModalOpen(true);
                      }}
                      className="h-9 px-4 rounded-md bg-[var(--vt-color-indigo-900,#261A66)] hover:bg-[var(--vt-color-indigo-800,#352488)] text-white text-xs font-bold cursor-pointer"
                    >
                      Send Fix Plan
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={
                      selectedIssue.status === "Under Review" ||
                      selectedIssue.status === "Resolved"
                    }
                    onClick={handleMarkFixedForReinspection}
                    className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold shadow-[0_2px_8px_rgba(239,95,24,0.28)] cursor-pointer"
                  >
                    {selectedIssue.status === "Resolved"
                      ? "Resolved ✓"
                      : selectedIssue.status === "Under Review"
                      ? "Awaiting Owner Re-Check"
                      : "Request Re-Check"}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Cure Plan Modal */}
      {isCureModalOpen && selectedIssue && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsCureModalOpen(false)}
        >
          <form
            onSubmit={handleSubmitCurePlan}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Submit Repair Cure Plan
            </h3>
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Repair Method Statement *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe exact engineering steps, materials, and verification checks to resolve this issue..."
                value={cureMethod}
                onChange={(e) => setCureMethod(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Estimated Completion Time (Days) *
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  required
                  min={1}
                  max={getSeverityMaxDays(selectedIssue.severity)}
                  value={cureDays}
                  onChange={(e) => setCureDays(e.target.value)}
                  placeholder={`1 - ${getSeverityMaxDays(selectedIssue.severity)}`}
                  className="w-28 h-9 px-3 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-mono font-bold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
                />
                <span className="text-[11px] text-[var(--vt-color-neutral-500,#7C7894)]">
                  calendar days (max {getSeverityMaxDays(selectedIssue.severity)} days for {selectedIssue.severity})
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--vt-color-neutral-50,#F7F7FA)] border border-[var(--vt-color-border-default,#E2E0EC)]">
              <VantagedCheckbox
                checked={confirmCureBinding}
                onChange={setConfirmCureBinding}
                label="I commit to completing this rectification at zero extra cost to the owner"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCureModalOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!confirmCureBinding}
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold cursor-pointer"
              >
                Send Fix Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Counter-Evidence Modal */}
      {isEvidenceModalOpen && selectedIssue && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsEvidenceModalOpen(false)}
        >
          <form
            onSubmit={handleUploadEvidence}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl border border-[var(--vt-color-border-default,#E2E0EC)] shadow-2xl p-6 space-y-4 text-xs"
          >
            <h3 className="text-base font-extrabold text-[var(--vt-color-indigo-900,#261A66)]">
              Upload Verification Proof
            </h3>
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Document Type
              </label>
              <VantagedSelect
                value={evidenceType}
                onChange={setEvidenceType}
                options={[
                  "Geo-Tagged Site Photo Proof",
                  "Lab Cube Crush Report (PDF)",
                  "Site Walkthrough Video",
                  "Engineer Sign-Off",
                ]}
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Attach Photo, Video, or PDF *
              </label>
              <input
                type="file"
                required
                accept="image/*,video/*,.pdf"
                onChange={handleEvidenceFilePick}
                className="w-full text-[11px] file:mr-2.5 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[var(--vt-color-orange-50,#FFF4EE)] file:text-[var(--vt-color-orange-700,#B33C08)] file:font-bold file:cursor-pointer"
              />
              {evidencePreviewUrl && (
                <img
                  src={evidencePreviewUrl}
                  alt="Preview"
                  className="mt-2 h-24 w-full object-cover rounded-lg border border-[var(--vt-color-border-default,#E2E0EC)]"
                />
              )}
              {evidenceFileName && !evidencePreviewUrl && (
                <p className="mt-1.5 text-[11px] font-semibold text-[var(--vt-color-green-700,#1F6B3E)]">
                  ✓ Attached: {evidenceFileName}
                </p>
              )}
            </div>
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Proof Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 28-Day Concrete Cube Report — Column C4"
                value={evidenceTitle}
                onChange={(e) => setEvidenceTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] font-semibold outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)]"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--vt-color-indigo-900,#261A66)] mb-1">
                Technical Note
              </label>
              <textarea
                rows={3}
                placeholder="Explain how this document verifies compliance..."
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--vt-color-border-default,#E2E0EC)] bg-[var(--vt-color-neutral-50,#F7F7FA)] outline-none focus:border-[var(--vt-color-orange-500,#EF5F18)] resize-none"
              />
            </div>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(false)}
                className="h-9 px-4 rounded-md border border-[var(--vt-color-border-default,#E2E0EC)] bg-white font-bold text-[var(--vt-color-neutral-600,#5E5A7D)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-md bg-[var(--vt-color-orange-500,#EF5F18)] hover:bg-[var(--vt-color-orange-600,#D84C0B)] text-white font-bold cursor-pointer"
              >
                Upload Proof
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
